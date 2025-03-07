console.log("Let's Write some Scripting by JavaScript")

let left = document.querySelector(".left")

document.querySelector(".hamburger").addEventListener("click", () => {
    left.style.left = 0
})

document.querySelector(".close").addEventListener("click", () => {
    left.style.left = "-100%"
})
