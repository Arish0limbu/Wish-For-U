// Wish page specific JavaScript
document.addEventListener('DOMContentLoaded', function() {
    console.log('Wish page loaded');
    
    const wishCards = document.querySelectorAll('.wish-card');
    wishCards.forEach(card => {
        card.addEventListener('click', function() {
            this.style.transform = 'scale(1.1)';
            setTimeout(() => {
                this.style.transform = '';
            }, 300);
        });
    });
});
