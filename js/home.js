document.addEventListener('DOMContentLoaded', function () {
    const tracks = [
        { title: 'Photograph — Ed Sheeran', file: 'Ed Sheeran - Photograph (Lyrics).mp3' },
        { title: 'Fijeko Kesh — Ekdev Limbu', file: 'Ekdev Limbu - Fijeko Kesh.mp3' },
        { title: 'Bardali — Sushant KC ft. Indrakala Rai', file: 'Sushant KC - Bardali ft. Indrakala Rai (Official Music Video).mp3' },
        { title: 'Timi Sangai — Apurva Tamang', file: 'Timi Sangai - Apurva Tamang _ Official MV _.mp3' },
        { title: 'Timro Pratiksa — Shallum Lama', file: 'Timro Pratiksa - Shallum Lama [To Mini][Official Video].mp3' },
        { title: 'Kasari — Yabesh Thapa', file: 'Yabesh Thapa - Kasari _ कसरी.mp3' }
    ];
    const musicStateKey = 'wishForU.musicState';

    function readMusicState() {
        try { return JSON.parse(localStorage.getItem(musicStateKey) || 'null'); }
        catch (error) { return null; }
    }
    function saveMusicState() {
        try {
            localStorage.setItem(musicStateKey, JSON.stringify({
                trackIndex: currentTrack,
                currentTime: Number.isFinite(audio.currentTime) ? audio.currentTime : 0,
                playing: !audio.paused,
                shuffle: isShuffling,
                repeat: isRepeating
            }));
        } catch (error) { /* Storage may be disabled. */ }
    }
    const savedState = readMusicState();
    let startFromUnlock = false;
    try {
        startFromUnlock = sessionStorage.getItem('wishForU.startMusicOnHome') === 'true';
        sessionStorage.removeItem('wishForU.startMusicOnHome');
    } catch (error) { /* Storage may be disabled. */ }

    const audio = document.getElementById('birthday-audio');
    const playButton = document.getElementById('play-button');
    const previousButton = document.getElementById('previous-button');
    const nextButton = document.getElementById('next-button');
    const shuffleButton = document.getElementById('shuffle-button');
    const repeatButton = document.getElementById('repeat-button');
    const seekBar = document.getElementById('seek-bar');
    const currentTime = document.getElementById('current-time');
    const duration = document.getElementById('duration');
    const trackName = document.getElementById('track-name');
    const menuToggle = document.querySelector('.menu-toggle');
    const menu = document.getElementById('site-menu');

    let currentTrack = savedState && Number.isInteger(savedState.trackIndex) ? savedState.trackIndex % tracks.length : 0;
    let isShuffling = Boolean(savedState && savedState.shuffle);
    let isRepeating = Boolean(savedState && savedState.repeat);
    let pendingRestoreTime = savedState && Number.isFinite(savedState.currentTime) ? Math.max(0, savedState.currentTime) : 0;
    let lastSavedAt = 0;

    function formatTime(seconds) {
        if (!Number.isFinite(seconds) || seconds < 0) return '0:00';
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60).toString().padStart(2, '0');
        return minutes + ':' + remainingSeconds;
    }

    function setTrack(index, shouldPlay, startTime) {
        currentTrack = (index + tracks.length) % tracks.length;
        const track = tracks[currentTrack];
        pendingRestoreTime = Number.isFinite(startTime) ? Math.max(0, startTime) : 0;
        audio.src = 'music/' + encodeURIComponent(track.file);
        audio.load();
        trackName.textContent = track.title;
        currentTime.textContent = '0:00';
        duration.textContent = '0:00';
        seekBar.value = '0';
        seekBar.style.setProperty('--progress', '0%');
        if (shouldPlay) playAudio();
    }

    function setPlaying(playing) {
        playButton.setAttribute('aria-label', playing ? 'Pause' : 'Play');
        playButton.innerHTML = playing
            ? '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 5h4v14H7zM15 5h4v14h-4z"/></svg>'
            : '<svg class="play-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="m8 5 12 7-12 7V5Z"/></svg>';
    }

    function playAudio() {
        const result = audio.play();
        if (result && typeof result.catch === 'function') {
            result.catch(function () { setPlaying(false); saveMusicState(); });
        }
    }

    function moveToNextTrack(shouldPlay) {
        let nextIndex;
        if (isShuffling && tracks.length > 1) {
            do { nextIndex = Math.floor(Math.random() * tracks.length); }
            while (nextIndex === currentTrack);
        } else {
            nextIndex = currentTrack + 1;
        }
        if (typeof shouldPlay !== 'boolean') shouldPlay = !audio.paused;
        setTrack(nextIndex, shouldPlay);
    }

    playButton.addEventListener('click', function () {
        if (audio.paused) playAudio();
        else audio.pause();
    });

    previousButton.addEventListener('click', function () {
        if (audio.currentTime > 3) {
            audio.currentTime = 0;
            return;
        }
        setTrack(currentTrack - 1, !audio.paused);
    });

    nextButton.addEventListener('click', moveToNextTrack);

    shuffleButton.addEventListener('click', function () {
        isShuffling = !isShuffling;
        shuffleButton.setAttribute('aria-pressed', String(isShuffling));
        shuffleButton.setAttribute('aria-label', isShuffling ? 'Shuffle on' : 'Shuffle off');
        saveMusicState();
    });

    repeatButton.addEventListener('click', function () {
        isRepeating = !isRepeating;
        audio.loop = isRepeating;
        repeatButton.setAttribute('aria-pressed', String(isRepeating));
        repeatButton.setAttribute('aria-label', isRepeating ? 'Repeat song on' : 'Repeat off');
        saveMusicState();
    });

    seekBar.addEventListener('input', function () {
        if (!Number.isFinite(audio.duration) || audio.duration <= 0) return;
        const ratio = Number(seekBar.value) / 100;
        audio.currentTime = ratio * audio.duration;
        seekBar.style.setProperty('--progress', seekBar.value + '%');
    });

    audio.addEventListener('play', function () { setPlaying(true); saveMusicState(); });
    audio.addEventListener('pause', function () { setPlaying(false); saveMusicState(); });
    audio.addEventListener('loadedmetadata', function () {
        duration.textContent = formatTime(audio.duration);
        if (pendingRestoreTime > 0 && pendingRestoreTime < audio.duration) {
            audio.currentTime = pendingRestoreTime;
            pendingRestoreTime = 0;
        }
    });
    audio.addEventListener('timeupdate', function () {
        currentTime.textContent = formatTime(audio.currentTime);
        if (Number.isFinite(audio.duration) && audio.duration > 0) {
            const progress = (audio.currentTime / audio.duration) * 100;
            seekBar.value = String(progress);
            seekBar.style.setProperty('--progress', progress + '%');
        }
        if (Date.now() - lastSavedAt > 4000) {
            lastSavedAt = Date.now();
            saveMusicState();
        }
    });
    audio.addEventListener('ended', function () { moveToNextTrack(true); });

    if (menuToggle && menu) {
        menuToggle.addEventListener('click', function () {
            const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
            menuToggle.setAttribute('aria-expanded', String(!isOpen));
            menuToggle.setAttribute('aria-label', isOpen ? 'Open navigation' : 'Close navigation');
            menu.hidden = isOpen;
        });
        menu.addEventListener('click', function (event) {
            if (event.target.closest('a')) {
                menu.hidden = true;
                menuToggle.setAttribute('aria-expanded', 'false');
                menuToggle.setAttribute('aria-label', 'Open navigation');
            }
        });
        document.addEventListener('click', function (event) {
            if (!menu.hidden && !menu.contains(event.target) && !menuToggle.contains(event.target)) {
                menu.hidden = true;
                menuToggle.setAttribute('aria-expanded', 'false');
                menuToggle.setAttribute('aria-label', 'Open navigation');
            }
        });
    }

    const initialTrack = currentTrack;
    const initialPosition = pendingRestoreTime;
    setTrack(initialTrack, false, initialPosition);
    audio.loop = isRepeating;
    shuffleButton.setAttribute('aria-pressed', String(isShuffling));
    repeatButton.setAttribute('aria-pressed', String(isRepeating));
    if (startFromUnlock || !savedState || savedState.playing) playAudio();
    window.addEventListener('pagehide', saveMusicState);
});
