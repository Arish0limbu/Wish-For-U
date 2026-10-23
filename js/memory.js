document.addEventListener('DOMContentLoaded', function () {
    const pairs = [
        { you: 'IMG-20240617-WA0002.jpg', us: 'IMG-20241203-WA0009.jpg', youCaption: 'Hami le saath bitayeko sano pal', usCaption: 'Hamro arko mitho samjhana', title: 'From one shared moment to another', text: 'Yi dui tasbir bich hami le saath bitayeka anek sano sano pal haru jodiyeka chhan.' },
        { you: 'IMG-20241203-WA0001.jpg', us: 'IMG-20241203-WA0011.jpg', youCaption: 'Sangai bitayeko pal', usCaption: 'Sadhai samjhana rahane din', title: 'Two frames, one story', text: 'Hami le saath bitayeka samayaka dui mitho samjhanaharu.' },
        { you: 'IMG_20250217_060210.jpg', us: 'IMG_20250311_153100.jpg', youCaption: 'Sangai bitayeko manparne pal', usCaption: 'Hamro arko sano yatra', title: 'A little closer', text: 'Harek tasbirle hamro kathako euta sano ansh bokeko chha.' },
        { you: 'IMG_20250402_215557.jpg', us: 'IMG_20250424_210033.jpg', youCaption: 'Hami le saath lekheko adhyay', usCaption: 'Sambhalera rakhne samjhana', title: 'One moment finds another', text: 'Faraka dinharu, bichma bitayeka palharule jodiyeka chhan.' },
        { you: 'IMG_20250527_165106.jpg', us: 'IMG_20250830_160907.jpg', youCaption: 'Feri herna man lagne tasbir', usCaption: 'Hami le banaudai gareko arko samjhana', title: 'A favorite kind of connection', text: 'Hami le saath banaudai gareko kathaka dui mitho jhalak.' },
        { you: 'IMG-20251023-WA0011.jpg', us: 'Snapchat-2102383121.jpg', youCaption: 'Hami le saath baadeko muskan', usCaption: 'Samjhanama rakhne euta pal', title: 'The story keeps going', text: 'Sabai bhanda mitho samjhana hami le saath banaune palharu nai hun.' }
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
            youCaption.lang = 'ne-Latn';
            usCaption.lang = 'ne-Latn';
            description.lang = 'ne-Latn';
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
