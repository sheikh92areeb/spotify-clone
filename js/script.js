console.log("Let's Write some Scripting by JavaScript")

let songs;
let currentSong = new Audio();
let currFolder;

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

async function getSongs(folder) {
    currFolder = folder
    let a = await fetch(`http://127.0.0.1:3000/songs/${folder}`);
    let response = await a.text()
    let div = document.createElement("div")
    div.innerHTML = response
    let anchors = div.getElementsByTagName("a")
    songs = []
    for (let index = 0; index < anchors.length; index++) {
        const element = anchors[index]
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`${folder}`).slice(-1)[0].replaceAll("/", ""))
        }
    }

    let songUL = document.querySelector(".song-list")
    songUL.innerHTML = "";
    for (const song of songs) {
        songUL.innerHTML += `<li class="list-item d-flex item-center justify-between">
                            <div class="song-img">
                                <img class="invert" src="img/music.svg" alt="Home Icon" width="30"> 
                            </div>
                            <div class="song-info">
                                <div class="song-name">${song.replaceAll("%20", " ")}</div>
                                <div class="song-artist">Unknown</div>
                            </div>
                            <div class="play-now d-flex item-center">
                                <span>Play Now</span>
                                <img class="invert" src="img/circle-play-regular.svg" alt="Home Icon" width="20px">
                            </div>
                        </li>`
    }

    Array.from(document.querySelector(".song-list").getElementsByTagName("li")).forEach((e) => {
        e.addEventListener("click", () => {
            console.log("Play",e.querySelector(".song-name").innerHTML)
            playSong(e.querySelector(".song-name").innerHTML)
        })
    })

    return songs
}

async function displayAlbums() {
    let a = await fetch(`http://127.0.0.1:3000/songs/`);
    let response = await a.text()
    let div = document.createElement("div")
    div.innerHTML = response
    let anchors = div.getElementsByTagName("a")
    let cardContainer = document.querySelector(".card-container")
    let array = Array.from(anchors)
    for (let index = 0; index < array.length; index++) {
        const e = array[index]
        if (e.href.includes("/songs")) {
            let folder = e.href.split("/").slice(-2)[0];
            let a = await fetch(`http://127.0.0.1:3000/songs/${folder}/info.json`);
            let response = await a.json()
            cardContainer.innerHTML += `<div data-folder="${folder}" class="card radius">
                        <div class="card-img">
                            <img src="/songs/${folder}/cover.jpg" alt="Album Cover" width="140" height="140">
                            <div class="paly-now-icon">
                                <img src="img/play.svg" alt="play icon">
                            </div>
                        </div>
                        <div class="card-text">
                            <h3 class="album-name">${response.title}</h3>
                            <p class="description">
                                ${response.description}
                            </p>
                        </div>
                    </div>`
        }
    }

    Array.from(document.getElementsByClassName("card")).forEach((e)=> {
        e.addEventListener("click", async (item)=> {
            console.log( item.currentTarget.dataset.folder)
            songs = await getSongs(`${item.currentTarget.dataset.folder}`)
            playSong(songs[0])
        })
    })
}


const playSong = (track, pause = false)=> {
    currentSong.src = `http://127.0.0.1:3000/songs/${currFolder}/${track}`;
    if (!pause) {
        currentSong.play();
        play.src = "img/pause.svg";
    }
    let songName = document.querySelector(".song-play-detail").getElementsByClassName("song-name")[0];
    songName.innerHTML = (!track)?"Song Name":decodeURI(track);
    document.querySelector(".song-duration").innerHTML = "00:00 / 00:00";
}

async function main() {
    await getSongs();
    playSong(songs[0], true);
    displayAlbums();

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
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if ((index - 1) >= 0) {
            playSong(songs[index - 1])
        } else {
            console.log("No Previous song available.");
        }
    });

    next.addEventListener("click", () => {
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if ((index + 1) < songs.length) {
            playSong(songs[index + 1])
        } else {
            console.log("No next song available.");
        }
    });

    document.querySelector(".volume").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        console.log("Setting volume to", e.target.value, "/ 100");
        currentSong.volume = parseInt(e.target.value) / 100;

        let img = document.querySelector(".volume > img");
        if (currentSong.volume > 0) {
            img.src = img.src.replace("mute.svg", "volume.svg")
        }else {
            img.src = img.src.replace("volume.svg", "mute.svg")
        }
        
    })

    document.querySelector(".volume > img").addEventListener("click", (e) => {
        if (e.target.src.includes("volume.svg")) {
            e.target.src = e.target.src.replace("volume.svg", "mute.svg");
            currentSong.volume = 0;
            document.querySelector(".volume").getElementsByTagName("input")[0].value = 0;
        }else {
            e.target.src = e.target.src.replace("mute.svg", "volume.svg");
            currentSong.volume = 0.10;
            document.querySelector(".volume").getElementsByTagName("input")[0].value = 10;
        }
    })
    
}

main()