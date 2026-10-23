document.addEventListener('DOMContentLoaded', function () {
    const moments = [
        { date: 'June 17, 2024', title: 'A little moment to keep', text: 'The kind of photo that finds its way back into a favorite memory.', image: 'IMG-20240617-WA0002.jpg' },
        { date: 'December 3, 2024', title: 'One for the scrapbook', text: 'A small page in a story that keeps getting sweeter.', image: 'IMG-20241203-WA0009.jpg' },
        { date: 'February 17, 2025', title: 'Side by side', text: 'Even the simplest moments feel special when they are ours.', image: 'IMG_20250217_060210.jpg' },
        { date: 'March 11, 2025', title: 'A day worth remembering', text: 'A favorite frame from all the little things we share.', image: 'IMG_20250311_153100.jpg' },
        { date: 'April 24, 2025', title: 'Together in a favorite frame', text: 'A memory to hold close and smile about later.', image: 'IMG_20250424_210033.jpg' },
        { date: 'August 30, 2025', title: 'Another shared chapter', text: 'Here is to the moments that keep becoming stories.', image: 'IMG_20250830_160907.jpg' },
        { date: 'October 23, 2025', title: 'A little reason to smile', text: 'One more photo to remind us of a good day together.', image: 'IMG-20251023-WA0011.jpg' }
    ];
    const list = document.getElementById('story-list');

    moments.forEach(function (moment, index) {
        const item = document.createElement('li');
        item.className = 'story-entry';
        const card = document.createElement('article');
        card.className = 'story-card';
        const image = document.createElement('img');
        image.src = 'images/ourpic/' + moment.image;
        image.alt = 'A shared photo memory from ' + moment.date;
        image.loading = index < 2 ? 'eager' : 'lazy';
        image.decoding = 'async';
        const copy = document.createElement('div');
        copy.className = 'story-copy';
        const date = document.createElement('p');
        date.className = 'story-date';
        date.textContent = moment.date;
        const title = document.createElement('h2');
        title.textContent = moment.title;
        const text = document.createElement('p');
        text.textContent = moment.text;
        copy.append(date, title, text);
        card.append(image, copy);
        item.append(card);
        list.append(item);
    });

    const entries = Array.from(document.querySelectorAll('.story-entry'));
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver(function (changes) {
            changes.forEach(function (change) {
                if (change.isIntersecting) {
                    change.target.classList.add('is-visible');
                    observer.unobserve(change.target);
                }
            });
        }, { threshold: 0.12 });
        entries.forEach(function (entry) { observer.observe(entry); });
    } else {
        entries.forEach(function (entry) { entry.classList.add('is-visible'); });
    }
});
