// Keep track of active speed configuration
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
    applySpeedToAll();
  }
});

// Listen for storage changes to sync options in real-time
chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName === 'local') {
    if (changes.targetSpeed) {
      targetSpeed = parseFloat(changes.targetSpeed.newValue);
      applySpeedToAll();
    }
    if (changes.autoApply) {
      autoApply = !!changes.autoApply.newValue;
      if (autoApply) {
        applySpeedToAll();
      }
    }
  }
});

// Set playback speed on a video element safely
function setVideoSpeed(video, speed) {
  if (!video || isNaN(speed) || speed <= 0) return;
  // Only update if there is a noticeable difference to prevent redundant triggers
  if (Math.abs(video.playbackRate - speed) > 0.01) {
    try {
      video.playbackRate = speed;
    } catch (e) {
      console.warn('YouTube Speed Customizer: Failed to set playback rate', e);
    }
  }
}

// Find all video elements on the page and apply the target speed
function applySpeedToAll() {
  const videos = document.querySelectorAll('video');
  videos.forEach(video => {
    setVideoSpeed(video, targetSpeed);
  });
}

// Handle messaging from popup
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
      applySpeedToAll();
      // Also save to storage
      chrome.storage.local.set({ targetSpeed: newSpeed });
    }
    sendResponse({ success: true, appliedSpeed: targetSpeed });
  }
  return true; // Keep message channel open for async response
});

// Use event delegation in capturing phase to catch events on any video elements (present or future)
document.addEventListener('play', (event) => {
  if (event.target.tagName === 'VIDEO' && autoApply) {
    setVideoSpeed(event.target, targetSpeed);
  }
}, true);

document.addEventListener('ratechange', (event) => {
  if (event.target.tagName === 'VIDEO' && autoApply) {
    // If the rate was changed externally (e.g., by YouTube resetting it), enforce our speed
    setVideoSpeed(event.target, targetSpeed);
  }
}, true);

// A fallback interval to handle complex SPA updates or players that reset playbackRate silently
setInterval(() => {
  if (autoApply) {
    applySpeedToAll();
  }
}, 1000);
