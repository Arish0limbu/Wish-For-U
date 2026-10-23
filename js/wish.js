document.addEventListener('DOMContentLoaded', function () {
    const saveButtons = Array.from(document.querySelectorAll('.wish-save'));
    const savedCount = document.getElementById('saved-wishes');

    function updateCount() {
        const total = saveButtons.filter(function (button) { return button.getAttribute('aria-pressed') === 'true'; }).length;
        savedCount.textContent = total + (total === 1 ? ' wish saved' : ' wishes saved');
    }

    saveButtons.forEach(function (button) {
        button.addEventListener('click', function () {
            const saved = button.getAttribute('aria-pressed') === 'true';
            button.setAttribute('aria-pressed', String(!saved));
            button.textContent = saved ? '♡' : '♥';
            button.setAttribute('aria-label', (saved ? 'Save' : 'Unsave') + ' wish ' + button.closest('.wish-card').querySelector('.wish-number').textContent);
            updateCount();
        });
    });
});
