// Maintain active speed state
let targetSpeed = 1.0;
let autoApply = true;

// Load settings from storage
chrome.storage.local.get(['targetSpeed', 'autoApply'], (result) => {
  if (result.targetSpeed !== undefined) {
    targetSpeed = parseFloat(result.targetSpeed);
  }
  if (result.autoApply !== undefined) {
    autoApply = !!result.autoApply;
  }
  if (autoApply) {
    applySpeedToVideo();
  }
});

// Sync changes in real-time from storage
chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName === 'local') {
    if (changes.targetSpeed) {
      targetSpeed = parseFloat(changes.targetSpeed.newValue);
      applySpeedToVideo();
    }
    if (changes.autoApply) {
      autoApply = !!changes.autoApply.newValue;
      if (autoApply) {
        applySpeedToVideo();
      }
    }
  }
});

// Apply playback speed using document.querySelector('video')
function applySpeedToVideo() {
  try {
    const video = document.querySelector('video');
    if (video && !isNaN(targetSpeed) && targetSpeed > 0) {
      video.playbackRate = targetSpeed;
    }
  } catch (e) {
    console.error('YouTube Speed Customizer: Error setting video.playbackRate', e);
  }
}

// Listen to signals from the extension popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'GET_CURRENT_SPEED') {
    const video = document.querySelector('video');
    sendResponse({
      currentSpeed: video ? video.playbackRate : null,
      targetSpeed: targetSpeed,
      autoApply: autoApply
    });
  } else if (message.type === 'SET_SPEED') {
    const newSpeed = parseFloat(message.speed);
    if (!isNaN(newSpeed) && newSpeed > 0) {
      targetSpeed = newSpeed;
      applySpeedToVideo();
      chrome.storage.local.set({ targetSpeed: newSpeed });
    }
    sendResponse({ success: true, appliedSpeed: targetSpeed });
  }
  return true; // Keep channel open
});

// Re-enforce speed on video events if autoApply is enabled
document.addEventListener('play', (event) => {
  if (event.target.tagName === 'VIDEO' && autoApply) {
    applySpeedToVideo();
  }
}, true);

document.addEventListener('ratechange', (event) => {
  if (event.target.tagName === 'VIDEO' && autoApply) {
    // If YouTube's player UI changes the speed, override it if auto-apply is on
    applySpeedToVideo();
  }
}, true);

// Fast periodic check interval to enforce the playbackRate
setInterval(() => {
  if (autoApply) {
    applySpeedToVideo();
  }
}, 500);
