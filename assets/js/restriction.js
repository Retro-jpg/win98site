const DESKTOP_WIDTH_THRESHOLD = 1024; // pixels
const DESKTOP_HEIGHT_THRESHOLD = 600; // pixels

// Create an audio element for the error sound
const errorSound = new Audio('error-sound.mp3');
errorSound.preload = 'auto'; // Preload the sound

function checkAndApplyRestrictions() {
    const mainContent = document.getElementById('main-content');
    const restrictionPopup = document.getElementById('restriction-popup');
    const pageOverlay = document.getElementById('page-overlay');

    if (!mainContent || !restrictionPopup || !pageOverlay) {
        console.error("Required elements for restriction logic are missing.");
        return;
    }

    const isSufficientWidth = window.innerWidth >= DESKTOP_WIDTH_THRESHOLD;
    const isSufficientHeight = window.innerHeight >= DESKTOP_HEIGHT_THRESHOLD;

    if (isSufficientWidth && isSufficientHeight) {
        mainContent.style.display = 'block';
        restrictionPopup.style.display = 'none';
        pageOverlay.style.display = 'none';
    } else {
        // Only play sound if the popup was previously hidden
        if (restrictionPopup.style.display === 'none' || restrictionPopup.style.display === '') {
            errorSound.play().catch(e => console.error("Error playing sound:", e));
        }
        mainContent.style.display = 'block';
        restrictionPopup.style.display = 'block';
        pageOverlay.style.display = 'block';

        // Update message with current dimensions for debugging or user info (optional)
        const messageElement = document.getElementById('restriction-message-text');
        if (messageElement) {
            let message = "To view this site, you must be on a desktop computer with a sufficiently large browser window.";
            // This part could be enhanced to show current vs required if needed, but the static message is fine.
            // For example: ` Current: ${window.innerWidth}x${window.innerHeight}px.`
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Initial check
    checkAndApplyRestrictions();

    // Listen for changes
    window.addEventListener('resize', checkAndApplyRestrictions);

    const okButton = document.getElementById('restriction-ok-button');
    if (okButton) {
        okButton.addEventListener('click', () => {
            // Re-check restrictions when OK is clicked.
            // This is helpful if the user resized the window while the popup was already visible.
            checkAndApplyRestrictions();
        });
    }
});
