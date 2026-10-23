document.addEventListener('DOMContentLoaded', function () {
    const herPhotos = [
        '1762152940423.jpg', 'IMG_20231025_142706.jpg', 'IMG_20240105_042024.jpg', 'IMG_20240617_150114.jpg',
        'IMG_20250727_195434.jpg', 'IMG_20250830_114855.jpg', 'IMG_20251028_223910.jpg', 'IMG-20240610-WA0006.jpg',
        'IMG-20251027-WA0007.jpg', 'Messenger_creation_497535565702143.jpeg', 'received_3334225633313265.jpeg',
        'Screenshot_2025-11-19-22-55-52-980_com.whatsapp.jpg', 'Snapchat-1691040329.jpg'
    ];
    const usPhotos = [
        'IMG_20250217_060210.jpg', 'IMG_20250311_153100.jpg', 'IMG_20250402_215557.jpg', 'IMG_20250424_210033.jpg',
        'IMG_20250527_165106.jpg', 'IMG_20250830_160907.jpg', 'IMG-20240617-WA0002.jpg', 'IMG-20241203-WA0001.jpg',
        'IMG-20241203-WA0009.jpg', 'IMG-20241203-WA0011.jpg', 'IMG-20251023-WA0011.jpg', 'Snapchat-2102383121.jpg'
    ];
    const herCaptions = ['A little moment of you', 'A smile to keep', 'One of your lovely days', 'A favorite frame', 'Just being you', 'A moment in your own light'];
    const usCaptions = ['A memory we share', 'Together in a favorite frame', 'One for the scrapbook', 'A little moment for us', 'A day worth keeping', 'A photo to come back to'];
    const photos = [];
    herPhotos.forEach(function (file, index) { photos.push({ src: 'images/herpic/' + file, group: 'her', caption: herCaptions[index % herCaptions.length], alt: 'A photo from the personal album' }); });
    usPhotos.forEach(function (file, index) { photos.push({ src: 'images/ourpic/' + file, group: 'us', caption: usCaptions[index % usCaptions.length], alt: 'A photo of the two of you together' }); });

    const grid = document.getElementById('memory-grid');
    const count = document.getElementById('gallery-count');
    const filterButtons = Array.from(document.querySelectorAll('.filter-chip'));
    const dialog = document.getElementById('photo-lightbox');
    const lightboxImage = document.getElementById('lightbox-image');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const slideCount = document.getElementById('slide-count');
    const slideshowToggle = document.getElementById('slideshow-toggle');
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let visiblePhotos = photos.slice();
    let activeIndex = 0;
    let slideIndex = 0;
    let isAutoplaying = !prefersReducedMotion;

    function updateSlideshow(animate) {
        grid.style.transition = animate && !prefersReducedMotion ? 'transform .72s cubic-bezier(.22,.72,.2,1)' : 'none';
        grid.style.transform = 'translate3d(-' + (slideIndex * 100) + '%, 0, 0)';
        Array.from(grid.children).forEach(function (slide, index) {
            slide.setAttribute('aria-label', 'Photo ' + (index + 1) + ' of ' + visiblePhotos.length + ': ' + visiblePhotos[index].caption);
            slide.setAttribute('aria-current', String(index === slideIndex));
        });
        slideCount.textContent = String(slideIndex + 1).padStart(2, '0') + ' / ' + String(visiblePhotos.length).padStart(2, '0');
        const upcoming = grid.children[(slideIndex + 1) % visiblePhotos.length];
        const upcomingImage = upcoming && upcoming.querySelector('img');
        if (upcomingImage) upcomingImage.loading = 'eager';
    }

    function moveSlide(step) {
        if (visiblePhotos.length < 2) return;
        slideIndex = (slideIndex + step + visiblePhotos.length) % visiblePhotos.length;
        updateSlideshow(true);
    }

    function setAutoplay(playing) {
        isAutoplaying = playing;
        slideshowToggle.setAttribute('aria-pressed', String(playing));
        slideshowToggle.setAttribute('aria-label', playing ? 'Pause slideshow' : 'Play slideshow');
        slideshowToggle.querySelector('span').textContent = playing ? 'Ⅱ' : '▶';
    }

    function renderGrid(filter) {
        visiblePhotos = filter === 'all' ? photos.slice() : photos.filter(function (photo) { return photo.group === filter; });
        grid.replaceChildren();
        visiblePhotos.forEach(function (photo, index) {
            const button = document.createElement('button');
            button.type = 'button';
            button.className = 'memory-card';
            button.setAttribute('aria-roledescription', 'slide');
            button.setAttribute('aria-label', 'Open photo ' + (index + 1) + ': ' + photo.caption);
            const image = document.createElement('img');
            image.src = photo.src;
            image.alt = photo.alt;
            image.loading = index < 2 ? 'eager' : 'lazy';
            image.decoding = 'async';
            const caption = document.createElement('div');
            caption.className = 'memory-caption';
            const title = document.createElement('span');
            title.textContent = photo.caption;
            const marker = document.createElement('span');
            marker.textContent = photo.group === 'her' ? 'YOU' : 'US';
            caption.append(title, marker);
            button.append(image, caption);
            button.addEventListener('click', function () { openPhoto(index); });
            grid.append(button);
        });
        count.textContent = visiblePhotos.length + (visiblePhotos.length === 1 ? ' photo' : ' photos');
        slideIndex = 0;
        updateSlideshow(false);
    }

    function showCurrentPhoto() {
        const photo = visiblePhotos[activeIndex];
        if (!photo) return;
        lightboxImage.src = photo.src;
        lightboxImage.alt = photo.alt;
        lightboxCaption.textContent = photo.caption + (photo.group === 'her' ? ' · just you' : ' · together');
    }
    function openPhoto(index) { activeIndex = index; slideIndex = index; updateSlideshow(false); showCurrentPhoto(); if (!dialog.open) dialog.showModal(); }
    function movePhoto(step) { activeIndex = (activeIndex + step + visiblePhotos.length) % visiblePhotos.length; slideIndex = activeIndex; updateSlideshow(true); showCurrentPhoto(); }

    filterButtons.forEach(function (button) {
        button.addEventListener('click', function () {
            filterButtons.forEach(function (chip) { chip.classList.remove('is-active'); chip.setAttribute('aria-pressed', 'false'); });
            button.classList.add('is-active');
            button.setAttribute('aria-pressed', 'true');
            renderGrid(button.dataset.filter);
        });
    });
    document.getElementById('lightbox-close').addEventListener('click', function () { dialog.close(); });
    document.getElementById('lightbox-prev').addEventListener('click', function () { movePhoto(-1); });
    document.getElementById('lightbox-next').addEventListener('click', function () { movePhoto(1); });
    document.getElementById('gallery-previous').addEventListener('click', function () { moveSlide(-1); });
    document.getElementById('gallery-next').addEventListener('click', function () { moveSlide(1); });
    slideshowToggle.addEventListener('click', function () { setAutoplay(!isAutoplaying); });
    dialog.addEventListener('click', function (event) { if (event.target === dialog) dialog.close(); });
    document.addEventListener('keydown', function (event) { if (!dialog.open) return; if (event.key === 'ArrowLeft') movePhoto(-1); if (event.key === 'ArrowRight') movePhoto(1); });
    renderGrid('all');
    setAutoplay(!prefersReducedMotion);
    window.setInterval(function () {
        if (isAutoplaying && !document.hidden && !dialog.open) moveSlide(1);
    }, 3000);
});
