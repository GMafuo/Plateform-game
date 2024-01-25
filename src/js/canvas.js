import plateform from '../img/plateform.png'
import background from '../img/background.png'
const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 526

const gravity = 1.5
class Player {
    constructor() {
        this.position = {
            x: 100,
            y: 100
        }
        this.velocity = {
            x: 0,
            y: 0
        }
        this.width = 30
        this.height = 30
    }

    draw() {
        c.fillStyle = 'red'
        c.fillRect(this.position.x, this.position.y, this.width, this.height)
    }

    update() {
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
let plateforms = [new Plateform({
    x: -1, y: 420, image: plateformImage
}), new Plateform({
    x: plateformImage.width - 1, y: 420, image: plateformImage
}),
    new Plateform({
        x: plateformImage.width - 1, y: 420, image: plateformImage
    }),
    new Plateform({
        x: plateformImage.width * 2 + 200, y: 420, image: plateformImage
    })
]
let genericObjects = [
    new GenericObject({
        x: 0,
        y: 0,
        image: createImage(background)
    })
]

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
plateforms = [new Plateform({
    x: -1, y: 420, image: plateformImage
}), new Plateform({
    x: plateformImage.width - 1, y: 420, image: plateformImage
}),
    new Plateform({
        x: plateformImage.width - 1, y: 420, image: plateformImage
    }),
    new Plateform({
        x: plateformImage.width * 2 + 200, y: 420, image: plateformImage
    })
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
        player.velocity.x = 5
    } else if (keys.left.pressed && player.position.x > 100) {
        player.velocity.x = -5
    } else {
        player.velocity.x = 0

        if (keys.right.pressed) {
            plateforms.forEach(plateform => {
                scrollOffset += 5
                plateform.position.x -= 5
            })
            genericObjects.forEach(genericObject => {
                genericObject.position.x -= 3
            })
        } else if (keys.left.pressed) {
            scrollOffset -= 5
            plateforms.forEach(plateform => {
                plateform.position.x += 5
            })
            genericObjects.forEach(genericObject => {
                genericObject.position.x += 3
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

    // Win condition
    if (scrollOffset > 4000) {
        console.log('you win')
    }

    //Lose condition
    if(player.position.y > canvas.height) {
        init()
    }
}

animate()

addEventListener('keydown', ({ keyCode }) => {
    console.log(keyCode)
    switch (keyCode) {
        case 81:
            console.log('left')
            keys.left.pressed = true
            break

        case 83:
            console.log('down')
            break

        case 68:
            console.log('right')
            keys.right.pressed = true
            break

        case 90:
            console.log('up')
            player.velocity.y -= 20
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
            player.velocity.y -= 20
            break
    }
    console.log(keys.right.pressed)
})
