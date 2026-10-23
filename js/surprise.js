document.addEventListener('DOMContentLoaded', function () {
    const button = document.getElementById('surprise-btn');
    const content = document.getElementById('surprise-content');
    const stage = document.querySelector('.surprise-stage');
    const confetti = document.getElementById('surprise-confetti');
    const reset = document.getElementById('reset-surprise');

    function makeHearts() {
        confetti.replaceChildren();
        for (let index = 0; index < 18; index += 1) {
            const heart = document.createElement('span');
            heart.className = 'confetti-heart';
            heart.textContent = index % 3 === 0 ? '♥' : '♡';
            heart.style.left = (4 + Math.random() * 92) + '%';
            heart.style.animationDelay = (Math.random() * .5) + 's';
            heart.style.fontSize = (.7 + Math.random() * .8) + 'rem';
            confetti.append(heart);
        }
        window.setTimeout(function () { confetti.replaceChildren(); }, 2200);
    }

    button.addEventListener('click', function () {
        content.hidden = false;
        stage.classList.add('is-open');
        button.setAttribute('aria-expanded', 'true');
        button.hidden = true;
        makeHearts();
        window.setTimeout(function () { content.scrollIntoView({ behavior: 'smooth', block: 'center' }); }, 120);
    });

    reset.addEventListener('click', function () {
        content.hidden = true;
        stage.classList.remove('is-open');
        button.hidden = false;
        button.setAttribute('aria-expanded', 'false');
        button.focus();
    });
});
