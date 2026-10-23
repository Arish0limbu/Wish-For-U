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
        // Show success state on PIN dots
        pinDots.forEach(dot => {
            dot.classList.add('success');
        });

        // Hide keypad and show success message
        const keypad = document.querySelector('.keypad');
        const instruction = document.querySelector('.instruction');
        const subtitle = document.querySelector('.subtitle');
        const footerText = document.querySelector('.footer-text');
        const successMessage = document.querySelector('.success-message');
        const heartLockIcon = document.querySelector('.heart-lock-icon');
        const lockScreen = document.querySelector('.lock-screen');

        keypad.style.opacity = '0';
        keypad.style.transition = 'opacity 0.5s ease';
        instruction.style.opacity = '0';
        instruction.style.transition = 'opacity 0.5s ease';
        subtitle.style.opacity = '0';
        subtitle.style.transition = 'opacity 0.5s ease';
        footerText.style.opacity = '0';
        footerText.style.transition = 'opacity 0.5s ease';

        setTimeout(() => {
            successMessage.classList.add('show');
            heartLockIcon.classList.add('unlocked');
        }, 300);

        // Create floating hearts
        createFloatingHearts();

        // Fade out screen and redirect
        setTimeout(() => {
            lockScreen.classList.add('unlocking');
        }, 800);

        setTimeout(() => {
            window.location.href = 'home.html';
        }, 1800);
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

        setTimeout(() => {
            removeErrorState();
        }, 1500);
    }

    function removeErrorState() {
        pinDots.forEach(dot => {
            dot.classList.remove('error');
            dot.classList.remove('success');
        });
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
