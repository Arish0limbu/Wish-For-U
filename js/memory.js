document.addEventListener('DOMContentLoaded', function () {
    const pairs = [
        { you: 'IMG-20240617-WA0002.jpg', us: 'IMG-20241203-WA0009.jpg', youCaption: 'A little moment we shared', usCaption: 'Another memory of us', title: 'From one shared moment to another', text: 'Two photos of us, connected by all the little moments in between.' },
        { you: 'IMG-20241203-WA0001.jpg', us: 'IMG-20241203-WA0011.jpg', youCaption: 'Side by side', usCaption: 'A day to remember', title: 'Two frames, one story', text: 'A pair of memories from the time we have spent together.' },
        { you: 'IMG_20250217_060210.jpg', us: 'IMG_20250311_153100.jpg', youCaption: 'A favorite moment together', usCaption: 'Another little adventure', title: 'A little closer', text: 'Every photo holds a small piece of our story.' },
        { you: 'IMG_20250402_215557.jpg', us: 'IMG_20250424_210033.jpg', youCaption: 'One shared chapter', usCaption: 'A memory to keep', title: 'One moment finds another', text: 'Different days, tied together by all the moments between them.' },
        { you: 'IMG_20250527_165106.jpg', us: 'IMG_20250830_160907.jpg', youCaption: 'A photo to come back to', usCaption: 'Us making another memory', title: 'A favorite kind of connection', text: 'Two snapshots from the story we keep making together.' },
        { you: 'IMG-20251023-WA0011.jpg', us: 'Snapchat-2102383121.jpg', youCaption: 'A smile we shared', usCaption: 'One for the scrapbook', title: 'The story keeps going', text: 'A reminder that the best memories are the ones we make together.' }
    ];

    const stage = document.getElementById('memory-pair');
    const youImage = document.getElementById('memory-you-image');
    const usImage = document.getElementById('memory-us-image');
    const youCaption = document.getElementById('memory-you-caption');
    const usCaption = document.getElementById('memory-us-caption');
    const title = document.getElementById('pair-title');
    const description = document.getElementById('pair-description');
    const counter = document.getElementById('pair-counter');
    const dots = document.getElementById('pair-dots');
    const playButton = document.getElementById('pair-play');
    let current = 0;
    let transitionTimer;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let playing = !prefersReducedMotion;
    let timer;

    function showPair(index, animate) {
        current = (index + pairs.length) % pairs.length;
        const pair = pairs[current];
        if (animate) {
            stage.classList.add('is-changing');
            window.clearTimeout(transitionTimer);
            transitionTimer = window.setTimeout(updatePair, 260);
        } else {
            updatePair();
        }

        function updatePair() {
            youImage.src = 'images/ourpic/' + pair.you;
            usImage.src = 'images/ourpic/' + pair.us;
            youCaption.textContent = pair.youCaption;
            usCaption.textContent = pair.usCaption;
            title.textContent = pair.title;
            description.textContent = pair.text;
            counter.innerHTML = String(current + 1).padStart(2, '0') + ' <span>/ ' + String(pairs.length).padStart(2, '0') + '</span>';
            Array.from(dots.children).forEach(function (dot, dotIndex) {
                dot.setAttribute('aria-current', String(dotIndex === current));
            });
            stage.classList.remove('is-changing');
        }
    }

    function nextPair() { showPair(current + 1, true); }
    function setPlaying(nextState) {
        playing = nextState;
        playButton.setAttribute('aria-pressed', String(playing));
        playButton.setAttribute('aria-label', playing ? 'Pause memory animation' : 'Play memory animation');
        playButton.querySelector('span').textContent = playing ? 'Ⅱ' : '▶';
        window.clearInterval(timer);
        if (playing) timer = window.setInterval(nextPair, 5200);
    }

    pairs.forEach(function (_, index) {
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.className = 'pair-dot';
        dot.setAttribute('aria-label', 'Show memory pair ' + (index + 1));
        dot.setAttribute('aria-current', String(index === 0));
        dot.addEventListener('click', function () { showPair(index, true); });
        dots.append(dot);
    });

    document.getElementById('pair-previous').addEventListener('click', function () { showPair(current - 1, true); });
    document.getElementById('pair-next').addEventListener('click', nextPair);
    playButton.addEventListener('click', function () { setPlaying(!playing); });
    showPair(0, false);
    setPlaying(playing);
});
