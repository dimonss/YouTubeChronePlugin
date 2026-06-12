document.addEventListener('DOMContentLoaded', async () => {
  const speedNum = document.getElementById('speed-num');
  const speedSlider = document.getElementById('speed-slider');
  const customSpeedInput = document.getElementById('custom-speed-input');
  const applyCustomBtn = document.getElementById('apply-custom-btn');
  const autoApplyToggle = document.getElementById('auto-apply-toggle');
  const presetBtns = document.querySelectorAll('.preset-btn');
  
  const activeView = document.getElementById('active-view');
  const inactiveView = document.getElementById('inactive-view');
  
  let activeTab = null;
  
  // Get the active tab in current window
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    activeTab = tab;
  } catch (e) {
    console.error('YouTube Speed Customizer: Error querying active tab', e);
  }
  
  // Check if current tab is YouTube
  const isYouTube = activeTab && activeTab.url && (
    activeTab.url.includes('youtube.com') || 
    activeTab.url.includes('youtu.be')
  );
  
  if (!isYouTube) {
    activeView.classList.add('hidden');
    inactiveView.classList.remove('hidden');
    return;
  }
  
  // Display active speed adjustment controls
  activeView.classList.remove('hidden');
  inactiveView.classList.add('hidden');
  
  // Load default saved configs
  let { targetSpeed = 1.0, autoApply = true } = await chrome.storage.local.get(['targetSpeed', 'autoApply']);
  
  // Helper to ensure content script is injected and active
  async function syncWithContentScript() {
    try {
      const response = await chrome.tabs.sendMessage(activeTab.id, { type: 'GET_CURRENT_SPEED' });
      return response;
    } catch (e) {
      console.log('YouTube Speed Customizer: Content script not responding. Attempting programmatic injection...');
      try {
        await chrome.scripting.executeScript({
          target: { tabId: activeTab.id },
          files: ['content.js']
        });
        // Brief pause to allow content.js to initialize
        await new Promise(resolve => setTimeout(resolve, 150));
        const response = await chrome.tabs.sendMessage(activeTab.id, { type: 'GET_CURRENT_SPEED' });
        return response;
      } catch (injectError) {
        console.error('YouTube Speed Customizer: Programmatic injection failed', injectError);
      }
    }
    return null;
  }

  // Initial UI Setup
  updateUI(targetSpeed);
  autoApplyToggle.checked = autoApply;
  
  // Attempt to sync state with the video currently loaded in the page
  const response = await syncWithContentScript();
  if (response) {
    const actualSpeed = response.currentSpeed !== null ? response.currentSpeed : response.targetSpeed;
    updateUI(actualSpeed);
    autoApplyToggle.checked = !!response.autoApply;
    chrome.storage.local.set({ 
      targetSpeed: actualSpeed,
      autoApply: !!response.autoApply
    });
  }
  
  // Update all elements in the popup layout based on speed selection
  function updateUI(speed) {
    const speedVal = parseFloat(speed);
    speedNum.textContent = speedVal.toFixed(2);
    
    // Adjust slider position (clamped to slider min/max bounds)
    const sliderMin = parseFloat(speedSlider.min);
    const sliderMax = parseFloat(speedSlider.max);
    if (speedVal >= sliderMin && speedVal <= sliderMax) {
      speedSlider.value = speedVal;
    } else if (speedVal > sliderMax) {
      speedSlider.value = sliderMax;
    } else {
      speedSlider.value = sliderMin;
    }
    
    // Set text input field value
    customSpeedInput.value = speedVal;
    
    // Highlight matching preset button
    presetBtns.forEach(btn => {
      const btnSpeed = parseFloat(btn.dataset.speed);
      if (Math.abs(btnSpeed - speedVal) < 0.01) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }
  
  // Core speed adjustment trigger
  async function changeSpeed(newSpeed) {
    const speed = parseFloat(newSpeed);
    if (isNaN(speed) || speed <= 0) return;
    
    updateUI(speed);
    
    // Save selection to local storage
    await chrome.storage.local.set({ targetSpeed: speed });
    
    // Push updates directly to the YouTube page content script
    try {
      await chrome.tabs.sendMessage(activeTab.id, { type: 'SET_SPEED', speed: speed });
    } catch (e) {
      console.log('YouTube Speed Customizer: Message failed. Attempting re-injection...');
      const response = await syncWithContentScript();
      if (response) {
        try {
          await chrome.tabs.sendMessage(activeTab.id, { type: 'SET_SPEED', speed: speed });
        } catch (retryError) {
          console.error('YouTube Speed Customizer: Retry message failed', retryError);
        }
      }
    }
  }
  
  // Event Listeners
  speedSlider.addEventListener('input', (e) => {
    changeSpeed(e.target.value);
  });
  
  presetBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      changeSpeed(btn.dataset.speed);
    });
  });
  
  applyCustomBtn.addEventListener('click', () => {
    let speed = parseFloat(customSpeedInput.value);
    if (!isNaN(speed)) {
      speed = Math.max(0.05, Math.min(16.0, speed));
      changeSpeed(speed);
    }
  });
  
  customSpeedInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      let speed = parseFloat(customSpeedInput.value);
      if (!isNaN(speed)) {
        speed = Math.max(0.05, Math.min(16.0, speed));
        changeSpeed(speed);
      }
    }
  });
  
  autoApplyToggle.addEventListener('change', async (e) => {
    const checked = e.target.checked;
    await chrome.storage.local.set({ autoApply: checked });
  });
});
