// Music player functionality
class MusicPlayer {
    constructor() {
        this.playlist = [
            'music/music1.mp3',
            'music/music2.mp3',
            'music/music3.mp3',
            'music/music4.mp3',
            'music/music5.mp3',
            'music/music6.mp3',
            'music/music7.mp3',
            'music/music8.mp3',
            'music/music9.mp3',
            'music/music10.mp3'
        ];
        this.currentTrack = 0;
        this.audio = new Audio();
        this.isPlaying = false;
    }
    
    play() {
        if (!this.isPlaying) {
            this.audio.src = this.playlist[this.currentTrack];
            this.audio.play();
            this.isPlaying = true;
        }
    }
    
    pause() {
        if (this.isPlaying) {
            this.audio.pause();
            this.isPlaying = false;
        }
    }
    
    next() {
        this.currentTrack = (this.currentTrack + 1) % this.playlist.length;
        if (this.isPlaying) {
            this.audio.src = this.playlist[this.currentTrack];
            this.audio.play();
        }
    }
    
    previous() {
        this.currentTrack = (this.currentTrack - 1 + this.playlist.length) % this.playlist.length;
        if (this.isPlaying) {
            this.audio.src = this.playlist[this.currentTrack];
            this.audio.play();
        }
    }
}

// Initialize music player if needed
// const player = new MusicPlayer();
