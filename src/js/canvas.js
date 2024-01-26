import plateform from '../img/plateform.png'
import background from '../img/background.png'
import pjump from '../img/pjump.png'

import spriteRunLeft from '../img/spriteRunLeft.png'
import spriteRunRight from '../img/spriteRunRight.png'
import spriteStandLeft from '../img/spriteStandLeft.png'
import spriteStandRight from '../img/spriteStandRight.png'

const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 526

const gravity = 1.5
class Player {
    constructor() {
        this.speed = 7
        this.position = {
            x: 100,
            y: 100
        }
        this.velocity = {
            x: 0,
            y: 0
        }
        this.width = 66
        this.height = 150

        this.image = createImage(spriteStandRight)
        this.frames = 0
        this.sprites = {
            stand: {
                right: createImage(spriteStandRight),
                left: createImage(spriteStandLeft),
                cropWidth: 177,
                width: 66
            },
            run: {
                right: createImage(spriteRunRight),
                left: createImage(spriteRunLeft),
                cropWidth: 341,
                width: 127.875
            }
        }
        this.currentSprite = this.sprites.stand.right
        this.currentCropWidth = 177
    }

    draw() {
        c.drawImage(
            this.currentSprite, 
            this.currentCropWidth * this.frames,
            0,
            this.currentCropWidth,
            400,
            this.position.x, 
            this.position.y, 
            this.width, 
            this.height
            )
    }

    update() {
        this.frames++
        if (this.frames > 59 && (this.currentSprite === this.sprites.stand.right || this.currentSprite === this.sprites.stand.left)) this.frames = 0
        else if (this.frames > 29 && (this.currentSprite === this.sprites.run.right || this.currentSprite === this.sprites.run.left)) this.frames = 0
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

        if (this.position.y + this.height + this.velocity.y <= canvas.height)
            this.velocity.y += gravity
    }
}

class Plateform {
    constructor({ x, y, image }) {
        this.position = {
            x,
            y
        }

        this.image = image
        this.width = image.width 
        this.height = image.height //TODO Faire les bonnes dimensions cube trop haut
    }

    draw() {
        c.drawImage(this.image, this.position.x, this.position.y)
    }
}

class GenericObject {
    constructor({ x, y, image }) {
        this.position = {
            x,
            y
        }

        this.image = image
        this.width = image.width 
        this.height = image.height //TODO Faire les bonnes dimensions cube trop haut
    }

    draw() {
        c.drawImage(this.image, this.position.x, this.position.y)
    }
}

function createImage(imageSrc) {
const image = new Image()
image.src = imageSrc
return image
}

let plateformImage = createImage(plateform)

let player = new Player()
let plateforms = []
let genericObjects = []

let lastKey
const keys = {
    right: {
        pressed: false
    },
    left: {
        pressed: false
    }
}

let scrollOffset = 0

function init() {
player = new Player()
plateforms = [
    new Plateform({
        x: plateformImage.width * 4 + 300 + plateformImage.width, y: 270, image: createImage(pjump)
    }),
    new Plateform({
        x: -1, y: 420, image: plateformImage
    }), 
    new Plateform({
        x: plateformImage.width - 1, y: 420, image: plateformImage
    }),
    new Plateform({
        x: plateformImage.width - 1, y: 420, image: plateformImage
    }),
    new Plateform({
        x: plateformImage.width * 2 + 200, y: 420, image: plateformImage
    }),
    new Plateform({
        x: plateformImage.width * 3 + 300, y: 420, image: plateformImage
    }),
    new Plateform({
        x: plateformImage.width * 4 + 300, y: 420, image: plateformImage
    }),
    new Plateform({
        x: plateformImage.width * 5 + 800, y: 420, image: plateformImage
    }),
]
genericObjects = [
    new GenericObject({
        x: 0,
        y: 0,
        image: createImage(background)
    })
]

scrollOffset = 0

}

function animate() {
    requestAnimationFrame(animate)
    c.fillStyle = 'wheat'
    c.fillRect(0, 0, canvas.width, canvas.height)

    genericObjects.forEach(genericObject => {
        genericObject.draw()
    })

    plateforms.forEach(plateform => {
        plateform.draw()
    })
    player.update()


    if (keys.right.pressed && player.position.x < 400) {
        player.velocity.x = player.speed
    } else if (
        (keys.left.pressed && player.position.x > 100) || 
        (keys.left.pressed && scrollOffset === 0 && player.position.x > 0)) {
        player.velocity.x = -player.speed
    } else {
        player.velocity.x = 0

        if (keys.right.pressed) {
            plateforms.forEach(plateform => {
                scrollOffset += player.speed
                plateform.position.x -= player.speed
            })
            genericObjects.forEach(genericObject => {
                genericObject.position.x -= player.speed * 0.66
            })
        } else if (keys.left.pressed && scrollOffset > 0) {
            scrollOffset -= player.speed
            plateforms.forEach(plateform => {
                plateform.position.x += player.speed
            })
            genericObjects.forEach(genericObject => {
                genericObject.position.x += player.speed * 0.66
            })
        }
    }

    // plateform collision
    plateforms.forEach(plateform => {
        if (player.position.y + player.height <= plateform.position.y &&
            player.position.y + player.height + player.velocity.y >= plateform.position.y &&
            player.position.x + player.width >= plateform.position.x &&
            player.position.x <= plateform.position.x + plateform.width) {
            player.velocity.y = 0
        }
    })

    // sprite switching

    if (
        keys.right.pressed && 
        lastKey === 'right' && player.currentSprite !== player.sprites.run.right) {
        player.frames = 1
        player.currentSprite = player.sprites.run.right
        player.currentCropWidth = player.sprites.run.cropWidth
        player.width = player.sprites.run.width
    } else if (
        keys.left.pressed && 
        lastKey === 'left' && player.currentSprite !== player.sprites.run.left) {
        player.currentSprite = player.sprites.run.left
        player.currentCropWidth = player.sprites.run.cropWidth
        player.width = player.sprites.run.width
    } else if (
        !keys.left.pressed && 
        lastKey === 'left' && player.currentSprite !== player.sprites.stand.left) {
        player.currentSprite = player.sprites.stand.left
        player.currentCropWidth = player.sprites.stand.cropWidth
        player.width = player.sprites.stand.width
    } else if (
        !keys.right.pressed && 
        lastKey === 'right' && player.currentSprite !== player.sprites.stand.right) {
        player.currentSprite = player.sprites.stand.right
        player.currentCropWidth = player.sprites.stand.cropWidth
        player.width = player.sprites.stand.width
    }

    // Win condition
    if (scrollOffset > 4000) {
        console.log('you win')
    }

    //Lose condition
    if(player.position.y > canvas.height) {
        init()
    }
}

init()
animate()

addEventListener('keydown', ({ keyCode }) => {
    console.log(keyCode)
    switch (keyCode) {
        case 81:
            console.log('left')
            keys.left.pressed = true
            lastKey = 'left'
            break

        case 83:
            console.log('down')
            break

        case 68:
            console.log('right')
            keys.right.pressed = true
            lastKey = 'right'
            break

        case 90:
            console.log('up')
            player.velocity.y -= 25
            break
    }

    console.log(keys.right.pressed)
})

addEventListener('keyup', ({ keyCode }) => {
    console.log(keyCode)
    switch (keyCode) {
        case 81:
            console.log('left')
            keys.left.pressed = false
            break

        case 83:
            console.log('down')
            break

        case 68:
            console.log('right')
            keys.right.pressed = false
    
            break

        case 90:
            console.log('up')
            break
    }
    console.log(keys.right.pressed)
})
