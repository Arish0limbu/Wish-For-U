document.addEventListener('DOMContentLoaded', function () {
    const envelope = document.getElementById('letter-envelope');
    const openButton = document.getElementById('open-letter');
    const closeButton = document.getElementById('close-letter');
    const letter = document.getElementById('love-letter');
    const prompt = document.getElementById('letter-prompt');

    function openLetter() {
        envelope.classList.add('is-open');
        letter.hidden = false;
        letter.setAttribute('aria-hidden', 'false');
        openButton.setAttribute('aria-expanded', 'true');
        prompt.textContent = 'A little note, written just for you';
        window.setTimeout(function () { letter.scrollIntoView({ behavior: 'smooth', block: 'center' }); }, 100);
    }

    function closeLetter() {
        envelope.classList.remove('is-open');
        letter.hidden = true;
        letter.setAttribute('aria-hidden', 'true');
        openButton.setAttribute('aria-expanded', 'false');
        prompt.textContent = 'Tap the little heart to open your letter';
        openButton.focus();
    }

    openButton.addEventListener('click', openLetter);
    closeButton.addEventListener('click', closeLetter);
});
