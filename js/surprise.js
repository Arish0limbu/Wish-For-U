// Surprise page specific JavaScript
document.addEventListener('DOMContentLoaded', function() {
    console.log('Surprise page loaded');
    
    const surpriseBtn = document.getElementById('surprise-btn');
    const surpriseContent = document.getElementById('surprise-content');
    
    if (surpriseBtn && surpriseContent) {
        surpriseBtn.addEventListener('click', function() {
            surpriseContent.classList.remove('hidden');
            surpriseBtn.style.display = 'none';
        });
    }
});
