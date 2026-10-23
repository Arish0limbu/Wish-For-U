// Love letter page specific JavaScript
document.addEventListener('DOMContentLoaded', function() {
    console.log('Love letter page loaded');
    
    const letter = document.querySelector('.letter');
    if (letter) {
        letter.style.animation = 'fadeIn 1s ease';
    }
});
