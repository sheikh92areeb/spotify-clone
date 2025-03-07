console.log("Let's Write some Scripting by JavaScript")

let songs;
let currentSong = new Audio();

let left = document.querySelector(".left")

document.querySelector(".hamburger").addEventListener("click", () => {
    left.style.left = 0
})

document.querySelector(".close").addEventListener("click", () => {
    left.style.left = "-100%"
})

function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

async function getSongs() {
    let a = await fetch("http://127.0.0.1:3000/songs/");
    let response = await a.text()
    let div = document.createElement("div")
    div.innerHTML = response
    let anchors = div.getElementsByTagName("a")
    songs = []
    for (let index = 0; index < anchors.length; index++) {
        const element = anchors[index]
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split("/").slice(-1)[0].replaceAll("%20", " "))
        }
    }

    let songUL = document.querySelector(".song-list")
    for (const song of songs) {
        songUL.innerHTML += `<li class="list-item d-flex item-center justify-between">
                            <div class="song-img">
                                <img class="invert" src="img/music.svg" alt="Home Icon" width="30"> 
                            </div>
                            <div class="song-info">
                                <div class="song-name">${song}</div>
                                <div class="song-artist">Unknown</div>
                            </div>
                            <div class="play-now d-flex item-center">
                                <span>Play Now</span>
                                <img class="invert" src="img/circle-play-regular.svg" alt="Home Icon" width="20px">
                            </div>
                        </li>`
    }

    return songs
}

const playSong = (track, pause = false)=> {
    currentSong.src = `http://127.0.0.1:3000/songs/${track}`;
    if (!pause) {
        currentSong.play();
        play.src = "img/pause.svg";
    }
    document.querySelector(".song-play-detail").getElementsByClassName("song-name")[0].innerHTML = track
    document.querySelector(".song-duration").innerHTML = "00:00 / 00:00";
}

async function main() {
    await getSongs()
    playSong(songs[0], true)

    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play();
            play.src = "img/pause.svg";
        }
        else {
            currentSong.pause()
            play.src = "img/circle-play-regular.svg";
        }
    })

    currentSong.addEventListener("timeupdate", () => {
        let songDuration = document.querySelector(".song-duration");
        let circle = document.querySelector(".circle");

        songDuration.innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)} / ${secondsToMinutesSeconds(currentSong.duration)}`;
        circle.style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
    })

    document.querySelector(".seekbar").addEventListener("click", (e) => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = ((currentSong.duration) * percent) / 100
    })

    previous.addEventListener("click", () => {
        let currentTrack = decodeURIComponent(currentSong.src.split("/").pop());
        let index = songs.indexOf(currentTrack);
    
        if ((index - 1) >= 0) {
            playSong(songs[index - 1]);
        } else {
            console.log("No Previous song available.");
        }
    });

    next.addEventListener("click", () => {
        let currentTrack = decodeURIComponent(currentSong.src.split("/").pop());
        let index = songs.indexOf(currentTrack);
    
        if (index !== -1 && index + 1 < songs.length) {
            playSong(songs[index + 1]);
        } else {
            console.log("No next song available.");
        }
    });
    
}

main()