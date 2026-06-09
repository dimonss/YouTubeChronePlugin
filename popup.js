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
  
  // Initial UI Setup
  updateUI(targetSpeed);
  autoApplyToggle.checked = autoApply;
  
  // Attempt to sync state with the video currently loaded in the page
  try {
    const response = await chrome.tabs.sendMessage(activeTab.id, { type: 'GET_CURRENT_SPEED' });
    if (response) {
      const actualSpeed = response.currentSpeed !== null ? response.currentSpeed : response.targetSpeed;
      updateUI(actualSpeed);
      autoApplyToggle.checked = !!response.autoApply;
      // Sync local storage state
      chrome.storage.local.set({ 
        targetSpeed: actualSpeed,
        autoApply: !!response.autoApply
      });
    }
  } catch (e) {
    console.log('YouTube Speed Customizer: Content script is not active or video is not loaded yet. Using storage cache.', e);
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
      console.log('YouTube Speed Customizer: Active tab content script communication failed.', e);
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
