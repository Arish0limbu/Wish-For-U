// Home page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    console.log('Home page loaded');

    // Card click functionality
    const cards = document.querySelectorAll('.card');
    cards.forEach((card, index) => {
        card.addEventListener('click', function() {
            const titles = ['Wish', 'Memories', 'Music', 'Gallery'];
            const title = this.querySelector('.card-title').textContent;

            if (title === 'Wish') {
                window.location.href = 'wish.html';
            } else if (title === 'Memories') {
                window.location.href = 'memory.html';
            } else if (title === 'Music') {
                // Music functionality - could open a music modal
                console.log('Music clicked');
            } else if (title === 'Gallery') {
                // Gallery functionality - could open a gallery modal
                console.log('Gallery clicked');
            }
        });
    });

    // Hero button functionality
    const heroButton = document.querySelector('.hero-button');
    if (heroButton) {
        heroButton.addEventListener('click', function() {
            // Scroll to cards section
            const cardsSection = document.querySelector('.cards-section');
            if (cardsSection) {
                cardsSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    // Music player functionality
    const playBtn = document.querySelector('.play-btn');
    let isPlaying = false;

    if (playBtn) {
        playBtn.addEventListener('click', function() {
            isPlaying = !isPlaying;
            if (isPlaying) {
                this.textContent = '⏸️';
                // Start music playback logic here
            } else {
                this.textContent = '▶️';
                // Pause music playback logic here
            }
        });
    }

    // Add smooth scroll behavior
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
});
