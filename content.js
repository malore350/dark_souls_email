let lastEmailSentTime = 0;
const COOLDOWN_PERIOD = 5000; // 5 seconds cooldown

function createDarkSoulsOverlay() {
  const currentTime = Date.now();
  
  // Check if enough time has passed since the last email
  if (currentTime - lastEmailSentTime < COOLDOWN_PERIOD) {
    return;
  }
  
  lastEmailSentTime = currentTime;
  
  // Remove any existing overlays first
  const existingOverlay = document.querySelector('.dark-souls-overlay');
  if (existingOverlay) {
    existingOverlay.remove();
  }
  
  const overlay = document.createElement('div');
  overlay.className = 'dark-souls-overlay';
  
  const text = document.createElement('div');
  text.className = 'dark-souls-text';
  text.textContent = 'EMAIL SENT';
  
  overlay.appendChild(text);
  document.body.appendChild(overlay);
  
  // Force a reflow before showing the overlay
  overlay.offsetHeight;
  
  overlay.style.display = 'block';
  
  setTimeout(() => {
    overlay.classList.add('fade-out');
    setTimeout(() => {
      overlay.remove();
    }, 2000); // Wait for fade-out animation to complete
  }, 3000);
}

// Function to check if a node is a Gmail success message
function isGmailSuccessMessage(node) {
  return node.nodeType === 1 && 
         node.innerText && 
         node.innerText.includes('Message sent') &&
         (node.classList.contains('bAq') || // Gmail's notification class
          node.closest('[role="alert"]')); // Gmail's alert role
}

// Enhanced mutation observer
const observer = new MutationObserver((mutations) => {
  for (const mutation of mutations) {
    // Check removed nodes to clean up any existing notifications
    if (mutation.removedNodes) {
      for (const node of mutation.removedNodes) {
        if (node.classList && node.classList.contains('dark-souls-overlay')) {
          return; // Skip if we're just removing our own overlay
        }
      }
    }
    
    // Check added nodes for Gmail notifications
    if (mutation.addedNodes) {
      for (const node of mutation.addedNodes) {
        if (isGmailSuccessMessage(node)) {
          createDarkSoulsOverlay();
          return; // Exit after first detection
        }
      }
    }
  }
});

// Start observing with more specific targeting
observer.observe(document.body, {
  childList: true,
  subtree: true,
  attributes: true,
  attributeFilter: ['class', 'role']
});