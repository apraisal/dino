const audio = document.getElementById('audioPlayer');
const volIcon = document.getElementById('volumeIcon');
let audioIndex = 0;
let audioVol = audio.volume;
let muted = false;

const playlist = [
    'audio/Harvest_Dawn.mp3',
    'audio/Afternoon_Coffee.mp3',
    'audio/Catamaran.mp3',
    'audio/Cinematic.mp3',
    'audio/Energizer.mp3',
    'audio/Fresh_Start.mp3',
    'audio/Giant_Wave.mp3',
    'audio/HEADPHONK.mp3',
    'audio/Moonlight.mp3',
    'audio/Peaceful.mp3',
    'audio/Travelling.mp3'
];

function playAudio() {
    audio.play();
}

function pauseAudio() {
    audio.pause();
}

function nextSong() {
    if (audioIndex<10) audioIndex++;
    else audioIndex=0;
    audio.src = playlist[audioIndex];
    audio.load();
    audio.play();
}

function adjustVolume(volume) {
    audio.volume = volume;
    audioVol = audio.volume;
}

function audioMute() {
    if (!muted) {
        audioVol = audio.volume;
        audio.volume = 0;
        volIcon.src = "./graphics/volume-mute-icon.png";
        muted = true;
    } else {
        audio.volume = audioVol;
        volIcon.src = "./graphics/volume-icon.png";
        muted = false;
    }
}

audio.load();
audio.play();