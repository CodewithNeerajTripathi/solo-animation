// Shared Audio Manager - Works across all pages
// This script handles background music that persists across page navigation

(function() {
  'use strict';
  
  // Get music state from localStorage (default: false = muted)
  let isMusicMuted = localStorage.getItem('musicMuted') === 'true';
  
  // Create background music instance immediately (not waiting for DOM)
  let backgroundMusic = new Audio("./audio/Main-version.wav");
  backgroundMusic.loop = true;
  backgroundMusic.volume = 0.3; // 30% volume
  
  // Initialize background music (already created above)
  function setupBackgroundMusic() {
    return backgroundMusic;
  }
  
  // Play click sound effect
  function playClickSound() {
    try {
      const clickSound = new Audio("./audio/Collect Star.mp3");
      clickSound.volume = 0.7; // 70% volume for click sound
      clickSound.play().catch(err => {
        console.log("Click sound play failed:", err);
      });
    } catch (err) {
      console.log("Error creating click sound:", err);
    }
  }
  
  // Toggle music on/off
  function toggleMusic(e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    const musicBtn = document.getElementById('audio') || document.getElementById('musi');
    
    // Play click sound effect when button is clicked
    playClickSound();
    
    isMusicMuted = !isMusicMuted;
    
    // Save state to localStorage
    localStorage.setItem('musicMuted', isMusicMuted.toString());
    
    if (isMusicMuted) {
      backgroundMusic.pause();
      if (musicBtn) musicBtn.style.opacity = "0.5"; // Visual feedback - muted
    } else {
      // User clicked to play - this is a user interaction, so play should work
      const playPromise = backgroundMusic.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            // Successfully started playing
            if (musicBtn) musicBtn.style.opacity = "1"; // Visual feedback - playing
          })
          .catch(err => {
            console.log("Audio play failed:", err);
            // Revert state if play failed
            isMusicMuted = true;
            localStorage.setItem('musicMuted', 'true');
            if (musicBtn) musicBtn.style.opacity = "0.5";
          });
      } else {
        if (musicBtn) musicBtn.style.opacity = "1"; // Visual feedback - playing
      }
    }
  }
  
  // Initialize when DOM is ready
  function initAudioManager() {
    // Try to find music button - try multiple times if not found immediately
    function findAndSetupMusicButton(retries = 5) {
      const musicBtn = document.getElementById('audio') || document.getElementById('musi');
      
      if (!musicBtn) {
        if (retries > 0) {
          // Retry after a short delay
          setTimeout(() => findAndSetupMusicButton(retries - 1), 100);
          return;
        }
        console.log("Music button not found on this page");
        // Still expose the manager for other scripts
        return;
      }
      
      // Setup music (already created, but ensure it's ready)
      setupBackgroundMusic();
      
      // Restore visual state based on saved preference
      if (isMusicMuted) {
        musicBtn.style.opacity = "0.5";
      } else {
        musicBtn.style.opacity = "1";
        
        // Try to play if not muted (after user interaction)
        document.addEventListener('click', function startMusic() {
          if (backgroundMusic && backgroundMusic.paused && !isMusicMuted) {
            backgroundMusic.play().catch(err => console.log("Background music play failed:", err));
          }
          document.removeEventListener('click', startMusic); // Remove after first click
        }, { once: true });
      }
      
      // Check if listener already attached (avoid duplicates)
      if (!musicBtn.hasAttribute('data-audio-listener-attached')) {
        // Mark as attached
        musicBtn.setAttribute('data-audio-listener-attached', 'true');
        
        // Add click listener to music button - use capture phase to ensure it fires
        musicBtn.addEventListener('click', toggleMusic, true);
        
        // Also make sure the button is clickable
        musicBtn.style.cursor = 'pointer';
        musicBtn.style.pointerEvents = 'auto';
      }
      
      // Also try to resume if music was playing before (for page navigation)
      if (!isMusicMuted && backgroundMusic && backgroundMusic.paused) {
        // Wait for any user interaction to resume
        document.addEventListener('click', function resumeMusic() {
          if (backgroundMusic && backgroundMusic.paused && !isMusicMuted) {
            backgroundMusic.play().catch(err => console.log("Resume music failed:", err));
          }
          document.removeEventListener('click', resumeMusic);
        }, { once: true });
      }
    }
    
    // Start finding the button
    findAndSetupMusicButton();
  }
  
  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAudioManager);
  } else {
    // DOM already loaded, but wait a tiny bit to ensure all elements are ready
    setTimeout(initAudioManager, 50);
  }
  
  // Setup click sound for other buttons (like home button and info buttons)
  function setupHomeButtonSound() {
    const homeBtn = document.getElementById('home');
    if (homeBtn && !homeBtn.hasAttribute('data-click-sound-attached')) {
      homeBtn.setAttribute('data-click-sound-attached', 'true');
      homeBtn.addEventListener('click', function(e) {
        playClickSound();
      }, true);
    }
  }
  
  // Setup click sound for info buttons
  function setupInfoButtonsSound() {
    const infoButtons = document.querySelectorAll('.info-btn');
    infoButtons.forEach(btn => {
      if (btn && !btn.hasAttribute('data-click-sound-attached')) {
        btn.setAttribute('data-click-sound-attached', 'true');
        btn.addEventListener('click', function(e) {
          playClickSound();
        }, true);
      }
    });
  }
  
  // Setup click sound for close popup button
  function setupCloseButtonSound() {
    const closeBtn = document.getElementById('close-popup');
    if (closeBtn && !closeBtn.hasAttribute('data-click-sound-attached')) {
      closeBtn.setAttribute('data-click-sound-attached', 'true');
      closeBtn.addEventListener('click', function(e) {
        playClickSound();
      }, true);
    }
  }
  
  // Initialize home button sound when DOM is ready
  function initHomeButtonSound() {
    // Try to find home button - try multiple times if not found immediately
    function findHomeButton(retries = 5) {
      const homeBtn = document.getElementById('home');
      if (!homeBtn) {
        if (retries > 0) {
          setTimeout(() => findHomeButton(retries - 1), 100);
          return;
        }
        return;
      }
      setupHomeButtonSound();
    }
    findHomeButton();
  }
  
  // Initialize info buttons sound when DOM is ready
  function initInfoButtonsSound() {
    // Try to find info buttons - try multiple times if not found immediately
    function findInfoButtons(retries = 5) {
      const infoButtons = document.querySelectorAll('.info-btn');
      if (!infoButtons || infoButtons.length === 0) {
        if (retries > 0) {
          setTimeout(() => findInfoButtons(retries - 1), 100);
          return;
        }
        return;
      }
      setupInfoButtonsSound();
    }
    findInfoButtons();
  }
  
  // Initialize close button sound when DOM is ready
  function initCloseButtonSound() {
    // Try to find close button - try multiple times if not found immediately
    function findCloseButton(retries = 5) {
      const closeBtn = document.getElementById('close-popup');
      if (!closeBtn) {
        if (retries > 0) {
          setTimeout(() => findCloseButton(retries - 1), 100);
          return;
        }
        return;
      }
      setupCloseButtonSound();
    }
    findCloseButton();
  }
  
  // Expose for external use if needed
  window.audioManager = {
    toggle: toggleMusic,
    getState: () => !isMusicMuted,
    getMusic: () => backgroundMusic,
    playClickSound: playClickSound // Expose for other scripts to use
  };
  
  // Also setup home button, info buttons, and close button sound
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initHomeButtonSound();
      initInfoButtonsSound();
      initCloseButtonSound();
    });
  } else {
    setTimeout(() => {
      initHomeButtonSound();
      initInfoButtonsSound();
      initCloseButtonSound();
    }, 50);
  }
})();

