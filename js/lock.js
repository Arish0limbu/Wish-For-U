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
            // Correct PIN - redirect to home.html
            setTimeout(() => {
                window.location.href = 'home.html';
            }, 500);
        } else {
            // Wrong PIN - show error
            showErrorState();
            setTimeout(() => {
                clearPin();
            }, 1500);
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
