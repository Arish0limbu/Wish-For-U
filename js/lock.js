// Lock screen PIN logic
const CORRECT_PIN = '4545';
let currentPin = '';

document.addEventListener('DOMContentLoaded', function() {
    const keys = document.querySelectorAll('.key');
    const pinDots = document.querySelectorAll('.pin-dot');

    keys.forEach(key => {
        key.addEventListener('click', function() {
            const number = this.getAttribute('data-number');
            const action = this.getAttribute('data-action');

            if (number) {
                addDigit(number);
            } else if (action === 'clear') {
                clearPin();
            } else if (action === 'backspace') {
                removeDigit();
            }
        });
    });

    function addDigit(digit) {
        if (currentPin.length < 4) {
            currentPin += digit;
            updatePinDisplay();

            if (currentPin.length === 4) {
                checkPin();
            }
        }
    }

    function removeDigit() {
        if (currentPin.length > 0) {
            currentPin = currentPin.slice(0, -1);
            updatePinDisplay();
        }
    }

    function clearPin() {
        currentPin = '';
        updatePinDisplay();
        removeErrorState();
        hideHint();
    }

    function updatePinDisplay() {
        pinDots.forEach((dot, index) => {
            if (index < currentPin.length) {
                dot.classList.add('filled');
            } else {
                dot.classList.remove('filled');
            }
        });
    }

    function checkPin() {
        if (currentPin === CORRECT_PIN) {
            // Correct PIN - show success animation
            showSuccessAnimation();
        } else {
            // Wrong PIN - show error
            showErrorState();
            setTimeout(() => {
                clearPin();
            }, 1500);
        }
    }

    function showSuccessAnimation() {
        try { sessionStorage.setItem('wishForU.startMusicOnHome', 'true'); } catch (error) { /* Storage may be disabled. */ }
        // Hide everything and show "CORRECT" message
        const keypad = document.querySelector('.keypad');
        const instruction = document.querySelector('.instruction');
        const subtitle = document.querySelector('.subtitle');
        const footerText = document.querySelector('.footer-text');
        const hintMessage = document.querySelector('.hint-message');
        const pinDisplay = document.querySelector('.pin-display');
        const successMessage = document.querySelector('.success-message');
        const heartLockIcon = document.querySelector('.heart-lock-icon');
        const lockScreen = document.querySelector('.lock-screen');

        // Hide all elements
        keypad.style.opacity = '0';
        keypad.style.transition = 'opacity 0.2s ease';
        instruction.style.opacity = '0';
        instruction.style.transition = 'opacity 0.2s ease';
        subtitle.style.opacity = '0';
        subtitle.style.transition = 'opacity 0.2s ease';
        footerText.style.opacity = '0';
        footerText.style.transition = 'opacity 0.2s ease';
        hintMessage.style.opacity = '0';
        hintMessage.style.transition = 'opacity 0.2s ease';
        pinDisplay.style.opacity = '0';
        pinDisplay.style.transition = 'opacity 0.2s ease';

        // Show "CORRECT" message immediately
        setTimeout(() => {
            successMessage.classList.add('show');
        }, 100);

        // Create floating hearts
        createFloatingHearts();

        // Fade out screen and redirect
        setTimeout(() => {
            lockScreen.classList.add('unlocking');
        }, 400);

        setTimeout(() => {
            window.location.href = 'site.html';
        }, 800);
    }

    function createFloatingHearts() {
        const floatingHeartsContainer = document.querySelector('.floating-hearts');
        const heartCount = 15;

        for (let i = 0; i < heartCount; i++) {
            setTimeout(() => {
                const heart = document.createElement('div');
                heart.classList.add('floating-heart');
                heart.style.left = Math.random() * 100 + '%';
                heart.style.animationDuration = (1.5 + Math.random() * 1.5) + 's';
                heart.style.animationDelay = (Math.random() * 0.5) + 's';
                floatingHeartsContainer.appendChild(heart);

                // Remove heart after animation
                setTimeout(() => {
                    heart.remove();
                }, 3000);
            }, i * 100);
        }
    }

    function showErrorState() {
        pinDots.forEach(dot => {
            dot.classList.add('error');
        });

        // Show hint message
        const hintMessage = document.querySelector('.hint-message');
        hintMessage.classList.add('show');

        setTimeout(() => {
            removeErrorState();
            hintMessage.classList.remove('show');
        }, 5000);
    }

    function removeErrorState() {
        pinDots.forEach(dot => {
            dot.classList.remove('error');
            dot.classList.remove('success');
        });
    }

    function hideHint() {
        const hintMessage = document.querySelector('.hint-message');
        hintMessage.classList.remove('show');
    }

    // Add keyboard support
    document.addEventListener('keydown', function(e) {
        if (e.key >= '0' && e.key <= '9') {
            addDigit(e.key);
        } else if (e.key === 'Backspace') {
            removeDigit();
        } else if (e.key === 'Escape') {
            clearPin();
        } else if (e.key === 'Enter') {
            if (currentPin.length === 4) {
                checkPin();
            }
        }
    });
});
