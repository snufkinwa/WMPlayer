// audioPlayer.js
export class musicPlayer {
    constructor(audioElementId) {
        this.audioElement = document.getElementById(audioElementId);
        this.songInfoElement = document.getElementById('songInfo');
        this.tracks = [];
        this.currentTrackIndex = 0;
        this.initialized = false;

        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.audioSource = this.audioContext.createMediaElementSource(this.audioElement);
        this.analyser = this.audioContext.createAnalyser();
        this.analyser.fftSize = 256;
        const bufferLength = this.analyser.frequencyBinCount;
        this.dataArray = new Uint8Array(bufferLength);

        this.audioSource.connect(this.analyser);
        this.analyser.connect(this.audioContext.destination);
        this.initialized = true;

        this.audioElement.addEventListener('ended', () => {
            this.nextTrack();
        });

        console.log("Music player initialized");
    }

    resumeAudioContext() {
        if (this.audioContext.state === 'suspended') {
            this.audioContext.resume().then(() => {
                console.log("AudioContext resumed");
            }).catch((error) => {
                console.error("Failed to resume AudioContext", error);
            });
        }
    }

    loadTracks(tracks) {
        this.tracks = tracks;
        if (tracks.length > 0) {
            this.updateSongInfo(this.tracks[0]);
            console.log("Tracks loaded");
        }
    }

    updateSongInfo(track) {
        this.songInfoElement.innerText = `${track.metaData.artist} - ${track.metaData.title}`;
   
    }

    playTrack(index) {
        if (index >= 0 && index < this.tracks.length) {
            this.currentTrackIndex = index;
            const track = this.tracks[index];
            const sourceElement = this.audioElement.querySelector('source');
            sourceElement.src = track.url;
            this.audioElement.load();
            this.audioElement.play().then(() => {
                console.log(`Playing track: ${track.metaData.title}`);
                this.updateSongInfo(track);
            }).catch(error => {
                console.error('Playback failed', error);
            });
        }
    }

    nextTrack() {
        const nextIndex = (this.currentTrackIndex + 1) % this.tracks.length;
        this.playTrack(nextIndex);
    }

    previousTrack() {
        const prevIndex = (this.currentTrackIndex - 1 + this.tracks.length) % this.tracks.length;
        this.playTrack(prevIndex);
    }

    getTracks() {
        return this.tracks;
    }

    getVolume() {
        return this.audioElement.volume;
    }

    playPause() {
        if (this.audioElement.paused) {
            this.audioElement.play().catch(error => {
                console.error('Playback failed', error);
            });
        } else {
            this.audioElement.pause();
        }
    }

    stop() {
        this.audioElement.pause();
        this.audioElement.currentTime = 0;
    }
}
