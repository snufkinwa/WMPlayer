import { audioConfig } from './config.js';
import { musicPlayer } from './audioPlayer.js';
import { visualize } from './visualizer.js';

let player;

function main() {
    console.log("loaded");
    player = new musicPlayer("audioPlayer");
    player.loadTracks(audioConfig.tracks);
    visualize(player);

    document.getElementById("playButton").onclick = function() { playPause() };
    document.getElementById("nextButton").onclick = function() { nextTrack() };
    document.getElementById("prevButton").onclick = function() { previousTrack() };
    document.getElementById("stopButton").onclick = function() { stopAudio() };
}

function playPause() {
    console.log("playPause");
    if (player) {
        player.resumeAudioContext();
        if (player.audioElement.paused) {
            player.playTrack(player.currentTrackIndex);
        } else {
            player.playPause();
        }
    }
}

function nextTrack() {
    console.log("nextTrack");
    if (player) {
        player.resumeAudioContext();
        player.nextTrack();
    }
}

function previousTrack() {
    console.log("previousTrack");
    if (player) {
        player.resumeAudioContext();
        player.previousTrack();
    }
}

function stopAudio() {
    console.log("stopAudio");
    if (player) {
        player.resumeAudioContext();
        player.stop();
    }
}

window.onload = main;
