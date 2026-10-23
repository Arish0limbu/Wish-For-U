document.addEventListener('DOMContentLoaded', function () {
    const menuToggle = document.querySelector('.menu-toggle');
    const menu = document.getElementById('site-menu');

    function closeMenu() {
        if (!menuToggle || !menu) return;
        menu.hidden = true;
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.setAttribute('aria-label', 'Open navigation');
    }

    if (menuToggle && menu) {
        menuToggle.addEventListener('click', function () {
            const open = menuToggle.getAttribute('aria-expanded') === 'true';
            menu.hidden = open;
            menuToggle.setAttribute('aria-expanded', String(!open));
            menuToggle.setAttribute('aria-label', open ? 'Open navigation' : 'Close navigation');
        });
        menu.addEventListener('click', function (event) {
            if (event.target.closest('a')) closeMenu();
        });
        document.addEventListener('click', function (event) {
            if (!menu.hidden && !menu.contains(event.target) && !menuToggle.contains(event.target)) closeMenu();
        });
        document.addEventListener('keydown', function (event) {
            if (event.key === 'Escape') closeMenu();
        });
    }

    const tracks = [
        { title: 'Photograph — Ed Sheeran', file: 'Ed Sheeran - Photograph (Lyrics).mp3' },
        { title: 'Fijeko Kesh — Ekdev Limbu', file: 'Ekdev Limbu - Fijeko Kesh.mp3' },
        { title: 'Bardali — Sushant KC ft. Indrakala Rai', file: 'Sushant KC - Bardali ft. Indrakala Rai (Official Music Video).mp3' },
        { title: 'Timi Sangai — Apurva Tamang', file: 'Timi Sangai - Apurva Tamang _ Official MV _.mp3' },
        { title: 'Timro Pratiksa — Shallum Lama', file: 'Timro Pratiksa - Shallum Lama [To Mini][Official Video].mp3' },
        { title: 'Kasari — Yabesh Thapa', file: 'Yabesh Thapa - Kasari _ कसरी.mp3' }
    ];
    const musicStateKey = 'wishForU.musicState';
    let savedState = null;
    try { savedState = JSON.parse(localStorage.getItem(musicStateKey) || 'null'); } catch (error) { /* Storage may be disabled. */ }

    const player = document.createElement('aside');
    player.className = 'floating-music';
    player.setAttribute('aria-label', 'Birthday music controls');
    player.innerHTML = '<div class="floating-music-heading"><span class="floating-music-note" aria-hidden="true">♫</span><div class="floating-music-track"><span class="floating-music-label">Now playing</span><strong id="floating-track-title"></strong></div></div>' +
        '<input class="floating-music-seek" id="floating-seek" type="range" min="0" max="100" value="0" aria-label="Song progress">' +
        '<div class="floating-music-bottom"><div class="floating-music-controls"><button type="button" id="floating-previous" aria-label="Previous song">|‹</button><button class="floating-music-play" type="button" id="floating-play" aria-label="Play"><span aria-hidden="true">▶</span></button><button type="button" id="floating-next" aria-label="Next song">›|</button></div><span class="floating-music-time" id="floating-time">0:00</span></div>';
    const audio = document.createElement('audio');
    audio.preload = 'metadata';
    player.append(audio);
    document.body.append(player);
    document.body.classList.add('has-floating-music');

    const title = player.querySelector('#floating-track-title');
    const playButton = player.querySelector('#floating-play');
    const seek = player.querySelector('#floating-seek');
    const timeLabel = player.querySelector('#floating-time');
    let currentTrack = savedState && Number.isInteger(savedState.trackIndex) ? savedState.trackIndex % tracks.length : 0;
    let isRepeating = Boolean(savedState && savedState.repeat);
    let pendingTime = savedState && Number.isFinite(savedState.currentTime) ? Math.max(0, savedState.currentTime) : 0;

    function readLatestState() {
        try { return JSON.parse(localStorage.getItem(musicStateKey) || 'null') || {}; }
        catch (error) { return {}; }
    }
    function saveState(playing) {
        const latest = readLatestState();
        try {
            localStorage.setItem(musicStateKey, JSON.stringify({
                trackIndex: currentTrack,
                currentTime: Number.isFinite(audio.currentTime) ? audio.currentTime : 0,
                playing: typeof playing === 'boolean' ? playing : !audio.paused,
                shuffle: Boolean(latest.shuffle),
                repeat: isRepeating
            }));
        } catch (error) { /* Storage may be disabled. */ }
    }
    function formatTime(seconds) {
        if (!Number.isFinite(seconds) || seconds < 0) return '0:00';
        return Math.floor(seconds / 60) + ':' + Math.floor(seconds % 60).toString().padStart(2, '0');
    }
    function updatePlayButton(playing) {
        playButton.setAttribute('aria-label', playing ? 'Pause' : 'Play');
        playButton.querySelector('span').textContent = playing ? 'Ⅱ' : '▶';
    }
    function playAudio() {
        const result = audio.play();
        if (result && typeof result.catch === 'function') {
            result.catch(function () { updatePlayButton(false); saveState(false); });
        }
    }
    function setTrack(index, shouldPlay, restoreTime) {
        currentTrack = (index + tracks.length) % tracks.length;
        pendingTime = Number.isFinite(restoreTime) ? Math.max(0, restoreTime) : 0;
        title.textContent = tracks[currentTrack].title;
        timeLabel.textContent = '0:00';
        seek.value = '0';
        audio.src = 'music/' + encodeURIComponent(tracks[currentTrack].file);
        audio.loop = isRepeating;
        audio.load();
        if (shouldPlay) playAudio();
    }
    function nextTrack(shouldPlay) {
        const latest = readLatestState();
        let next = currentTrack + 1;
        if (latest.shuffle && tracks.length > 1) {
            do { next = Math.floor(Math.random() * tracks.length); } while (next === currentTrack);
        }
        setTrack(next, typeof shouldPlay === 'boolean' ? shouldPlay : !audio.paused);
    }
    function previousTrack() {
        if (audio.currentTime > 3) { audio.currentTime = 0; return; }
        setTrack(currentTrack - 1, !audio.paused);
    }

    player.querySelector('#floating-previous').addEventListener('click', previousTrack);
    player.querySelector('#floating-next').addEventListener('click', function () { nextTrack(); });
    playButton.addEventListener('click', function () {
        if (audio.paused) playAudio();
        else audio.pause();
    });
    seek.addEventListener('input', function () {
        if (!Number.isFinite(audio.duration) || audio.duration <= 0) return;
        audio.currentTime = Number(seek.value) / 100 * audio.duration;
    });
    audio.addEventListener('play', function () { updatePlayButton(true); saveState(true); });
    audio.addEventListener('pause', function () { updatePlayButton(false); saveState(false); });
    audio.addEventListener('loadedmetadata', function () {
        if (pendingTime > 0 && pendingTime < audio.duration) audio.currentTime = pendingTime;
        pendingTime = 0;
    });
    audio.addEventListener('timeupdate', function () {
        timeLabel.textContent = formatTime(audio.currentTime);
        if (Number.isFinite(audio.duration) && audio.duration > 0) seek.value = String(audio.currentTime / audio.duration * 100);
    });
    audio.addEventListener('ended', function () { nextTrack(true); });
    audio.addEventListener('error', function () { title.textContent = 'Song unavailable'; updatePlayButton(false); });
    window.addEventListener('pagehide', function () { saveState(); });

    setTrack(currentTrack, Boolean(savedState && savedState.playing), pendingTime);
});
