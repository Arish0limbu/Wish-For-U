// Memory page specific JavaScript
document.addEventListener('DOMContentLoaded', function() {
    console.log('Memory page loaded');
    
    const memoryItems = document.querySelectorAll('.memory-item');
    memoryItems.forEach(item => {
        item.addEventListener('click', function() {
            const img = this.querySelector('img');
            if (img.requestFullscreen) {
                img.requestFullscreen();
            }
        });
    });
});
