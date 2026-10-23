document.addEventListener('DOMContentLoaded', function () {
    const button = document.getElementById('surprise-btn');
    const content = document.getElementById('surprise-content');
    const stage = document.querySelector('.surprise-stage');
    const confetti = document.getElementById('surprise-confetti');
    const reset = document.getElementById('reset-surprise');
    const video = document.getElementById('surprise-video-player');
    const videoUrl = 'https://www.youtube-nocookie.com/embed/jQMCRwKOgZM?autoplay=1&rel=0';
    let backgroundAudio = document.getElementById('birthday-audio');
    try {
        backgroundAudio = window.parent.document.getElementById('birthday-audio') || backgroundAudio;
    } catch (error) { /* The parent page may not be same-origin. */ }
    let resumeMusicAfterSurprise = false;
    let musicPositionBeforeSurprise = 0;

    function pauseBackgroundMusic() {
        if (!backgroundAudio) return;
        resumeMusicAfterSurprise = !backgroundAudio.paused;
        musicPositionBeforeSurprise = backgroundAudio.currentTime;
        if (resumeMusicAfterSurprise) backgroundAudio.pause();
    }

    function resumeBackgroundMusic() {
        if (!backgroundAudio || !resumeMusicAfterSurprise) return;
        if (backgroundAudio.paused && Number.isFinite(musicPositionBeforeSurprise)) {
            backgroundAudio.currentTime = musicPositionBeforeSurprise;
        }
        const playResult = backgroundAudio.play();
        if (playResult && typeof playResult.catch === 'function') playResult.catch(function () {});
        resumeMusicAfterSurprise = false;
    }

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
        pauseBackgroundMusic();
        content.hidden = false;
        video.src = videoUrl;
        stage.classList.add('is-open');
        button.setAttribute('aria-expanded', 'true');
        button.hidden = true;
        makeHearts();
        window.setTimeout(function () { content.scrollIntoView({ behavior: 'smooth', block: 'center' }); }, 120);
    });

    reset.addEventListener('click', function () {
        content.hidden = true;
        video.src = 'about:blank';
        resumeBackgroundMusic();
        stage.classList.remove('is-open');
        button.hidden = false;
        button.setAttribute('aria-expanded', 'false');
        button.focus();
    });

    window.addEventListener('pagehide', resumeBackgroundMusic);
});
