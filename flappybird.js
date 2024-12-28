//board
let board
let boardWidth = 360
let boardHeight = 640
let context

//bird
let birdHeight = 60
let birdWidth = 60
let birdX = boardWidth/8
let birdY = boardHeight/2
let bird = {
    x : birdX,
    y : birdY,
    width : birdWidth,
    height : birdHeight
}
let birdPadding = 18

const bgImage = new Image()
bgImage.src = "assets/background.jpg"
const birdImg = new Image()
birdImg.src = "assets/bird.png"

//Sounds
let pipePassedSound = new Audio()
pipePassedSound.src = "assets/passed.mp3"
pipePassedSound.load()
pipePassedSound.volume = 0.35

let gameOverSound = new Audio()
gameOverSound.src = "assets/gameover.mp3"
gameOverSound.load()

//pipes
let pipeArray = []
let pipeWidth = 64
let pipeHeight = 512
let pipeX = boardWidth
let pipeY = 0

let topPipeImg
let bottomPipeImg

//physics
let velocityX = -1.5 //pipe
let velocityY = 0 //bird jump speed
let gravity = 0.2

let gameOver = false
let score = 0

let count = 0

let gameOverSoundPlayed = false

window.onload = function(){
    board = document.querySelector(".board")
    board.height = boardHeight
    board.width = boardWidth
    context = board.getContext("2d")

    //load background
    bgImage.onload = () =>{
        context.drawImage(bgImage, 0, 0, board.width, board.height)
    }

    //load bird
    
    birdImg.onload = function(){
        context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height)
    }


    requestAnimationFrame(update)
    document.addEventListener("keydown",function first(e){
        if(count == 0 && (e.code == "Space" || e.code == "ArrowUp")){
        topPipeImg = new Image()
        topPipeImg.src = "assets/top pipe.png"
        
        bottomPipeImg = new Image()
        bottomPipeImg.src = "assets/bottom pipe.png"
        
        setInterval(placePipe, 1500)
        
        document.addEventListener("keydown", moveBird)
        count++
        document.removeEventListener("keydown",first)
        }
    })
    if(count > 0){
        topPipeImg = new Image()
        topPipeImg.src = "assets/top pipe.png"
        
        bottomPipeImg = new Image()
        bottomPipeImg.src = "assets/bottom pipe.png"
        setInterval(placePipe, 1500)
        
        document.addEventListener("keydown", moveBird)
    }
}

function update(){
    requestAnimationFrame(update)
    if(gameOver){
        if(!gameOverSoundPlayed){
            gameOverSound.play()
            gameOverSoundPlayed = true
        }
        return
    }
    context.clearRect(0, 0, board.width, board.height)

    //background
    context.drawImage(bgImage, 0, 0, board.width, board.height)

    //bird
    if(count>0)
    {
        velocityY += gravity
        bird.y = Math.max(bird.y + velocityY, 0)
    }
    context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height)

    if(bird.y+bird.height > board.height){
        gameOver = true
    }

    //pipes
    for(let i = 0; i < pipeArray.length; i++){
        let pipe = pipeArray[i]
        pipe.x += velocityX
        context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height)

        if(!pipe.passed && bird.x > pipe.x + pipe.width){
            score+=0.5
            pipe.passed = true
            pipePassedSound.play()
        }

        if(detectCollision(bird, pipe)){
            gameOver = true
        }
    }

    //clear pipes
    while(pipeArray.length > 0 && pipeArray[0].x + pipeArray[0].width < 0){
        pipeArray.shift()
    }

    //score
    context.fillStyle = "white"
    context.font = "25px 'Press Start 2P'"
    context.fillText(score, 5, 45)

    if(gameOver){
        context.fillText("Game Over!", 65, boardHeight/2)
    }
}
function placePipe(){
    if(gameOver) return
    let randomPipeY = pipeY - pipeHeight/4 - (Math.random()*pipeHeight/2)
    let openingSpace = board.height/4

    let topPipe = {
        img : topPipeImg,
        x : pipeX,
        y : randomPipeY,
        width : pipeWidth,
        height : pipeHeight,
        passed : false
    }

    pipeArray.push(topPipe)

    let bottomPipe = {
        img : bottomPipeImg,
        x : pipeX,
        y : randomPipeY + pipeHeight + openingSpace,
        width : pipeWidth,
        height : pipeHeight,
        passed : false
    }

    pipeArray.push(bottomPipe)
}

function moveBird(e){
    if((e.code == "Space" || e.code == "ArrowUp") && count > 0){
        //jump
        velocityY = -5

        //reset game
        if(gameOver){
            gameOverSound.load()
            pipePassedSound.load()
            gameOverSound.pause()
            gameOver.currentTime = 0
            pipePassedSound.pause()
            pipePassedSound.currentTime = 0
            bird.y = birdY
            pipeArray = []
            score = 0
            gameOver = false
            gameOverSoundPlayed = false
        }
    }
}

function detectCollision(a, b){
    return a.x + birdPadding < b.x + b.width && a.x + a.width - birdPadding > b.x && a.y + birdPadding < b.y + b.height && a.y + a.height - birdPadding > b.y
}