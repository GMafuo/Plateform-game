import plateform from '../img/plateform.png'
import background from '../img/background.png'
import pjump from '../img/pjump.png'

import spriteRunLeft from '../img/spriteRunLeft.png'
import spriteRunRight from '../img/spriteRunRight.png'
import spriteStandLeft from '../img/spriteStandLeft.png'
import spriteStandRight from '../img/spriteStandRight.png'
import spriteEnemy from '../img/spriteGoomba.png'

import 'regenerator-runtime/runtime';

const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = window.innerWidth
canvas.height = window.innerHeight

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Ajoutez ici tout autre code que vous souhaitez exécuter lorsque la fenêtre est redimensionnée
});

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
    
        if (
          this.frames > 59 &&
          (this.currentSprite === this.sprites.stand.right ||
            this.currentSprite === this.sprites.stand.left)
        )
          this.frames = 0
        else if (
          this.frames > 29 &&
          (this.currentSprite === this.sprites.run.right ||
            this.currentSprite === this.sprites.run.left)
        )
          this.frames = 0
    
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
        c.drawImage(this.image, this.position.x, this.position.y - (this.image.height - this.height));
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

class Enemy {
    constructor({ position, velocity }) {
      this.position = {
        x: position.x,
        y: position.y
      }
  
      this.velocity = {
        x: velocity.x,
        y: velocity.y
      }
  
      this.width = 43.33
      this.height = 50

      this.image = createImage(spriteEnemy)
      this.frames = 0
    }
  
    draw() {
    //   c.fillStyle = 'red'
    //   c.fillRect(this.position.x, this.position.y, this.width, this.height)
    c.drawImage(
        this.image,
        130 * this.frames,
        0,
        130,
        150,
        this.position.x,
        this.position.y,
        this.width,
        this.height
    )
}
  
    update() {  
        this.frames++
        if (this.frames >=58) this.frames = 0
      this.draw()
      this.position.x += this.velocity.x
      this.position.y += this.velocity.y
  
      if (this.position.y + this.height + this.velocity.y <= canvas.height)
        this.velocity.y += gravity
    }
  }

  class Particle {
    constructor({ position, velocity, radius }) {
      this.position = {
        x: position.x,
        y: position.y
      }
  
      this.velocity = {
        x: velocity.x,
        y: velocity.y
      }
  
      this.radius = radius
      this.ttl = 300
    }
  
    draw() {
      c.beginPath()
      c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2, false)
      c.fillStyle = '#654428'
      c.fill()
      c.closePath()
    }
  
    update() {
      this.ttl--
      this.draw()
      this.position.x += this.velocity.x
      this.position.y += this.velocity.y
  
      if (this.position.y + this.radius + this.velocity.y <= canvas.height)
        this.velocity.y += gravity * 0.4
    }
  }
function createImage(imageSrc) {
    const image = new Image()
    image.src = imageSrc
    return image
  }

function createImageAsync(imageSrc) {
    return new Promise((resolve) => {
      const image = new Image()
      image.onload = () => {
        resolve(image)
      }
      image.src = imageSrc
    })
  }

let plateformImage = createImageAsync(plateform)

let player = new Player()
let plateforms = []
let genericObjects = []
let enemies = []
let particles = []

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

function isOnTopOfPlatform({ object, platform }) {
    return (
      object.position.y + object.height <= platform.position.y &&
      object.position.y + object.height + object.velocity.y >=
        platform.position.y &&
      object.position.x + object.width >= platform.position.x &&
      object.position.x <= platform.position.x + platform.width
    )
  }
  
  function collisionTop({ object1, object2 }) {
    return (
      object1.position.y + object1.height <= object2.position.y &&
      object1.position.y + object1.height + object1.velocity.y >=
        object2.position.y &&
      object1.position.x + object1.width >= object2.position.x &&
      object1.position.x <= object2.position.x + object2.width
    )
  }

  function isOnTopOfPlatformCircle({ object, platform }) {
    return (
      object.position.y + object.radius <= platform.position.y &&
      object.position.y + object.radius + object.velocity.y >=
        platform.position.y &&
      object.position.x + object.radius >= platform.position.x &&
      object.position.x <= platform.position.x + platform.width
    )
  }

async function init() {
    plateformImage = await createImageAsync(plateform)

    player = new Player()
    enemies = [
        new Enemy({
          position: {
            x: 800,
            y: 100
          },
          velocity: {
            x: -0.3,
            y: 0
          }
        })
      ]
    particles = []
    plateforms = [
        new Plateform({
            x: plateformImage.width * 4 + 300 + plateformImage.width, y: 400, image: createImage(pjump)
        }),
        new Plateform({
            x: -1, y: 615, image: plateformImage
        }), 
        new Plateform({
            x: plateformImage.width - 1, y: 615, image: plateformImage
        }),
        new Plateform({
            x: plateformImage.width - 1, y: 615, image: plateformImage
        }),
        new Plateform({
            x: plateformImage.width * 2 + 200, y: 615, image: plateformImage
        }),
        new Plateform({
            x: plateformImage.width * 3 + 300, y: 615, image: plateformImage
        }),
        new Plateform({
            x: plateformImage.width * 4 + 300, y: 615, image: plateformImage
        }),
        new Plateform({
            x: plateformImage.width * 5 + 800, y: 615, image: plateformImage
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

    enemies.forEach((enemy, index) => {
        enemy.update()

        // enemy stomp squish
        if (
          collisionTop({
            object1: player,
            object2: enemy
          })
        ) {
          for (let i = 0; i < 50; i++) {
            particles.push(
              new Particle({
                position: {
                  x: enemy.position.x + enemy.width / 2,
                  y: enemy.position.y + enemy.height / 2
                },
                velocity: {
                  x: (Math.random() - 0.5) * 7,
                  y: (Math.random() - 0.5) * 15
                },
                radius: Math.random() * 3
              })
            )
          }
          player.velocity.y -= 40
          setTimeout(() => {
            enemies.splice(index, 1)
          }, 0)
        } else if (
          player.position.x + player.width >= enemy.position.x &&
          player.position.y + player.height >= enemy.position.y &&
          player.position.x <= enemy.position.x + enemy.width
        )
          init()
      })

      particles.forEach((particle) => {
        particle.update()
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
            scrollOffset += player.speed
            plateforms.forEach((platform) => {
              platform.position.x -= player.speed
            })
            genericObjects.forEach((genericObject) => {
              genericObject.position.x -= player.speed * 0.66
            })
            enemies.forEach((enemy) => {
                enemy.position.x -= player.speed
            })
            particles.forEach((particle) => {
              particle.position.x -= player.speed
            })
          } else if (keys.left.pressed && scrollOffset > 0) {
            scrollOffset -= player.speed
      
            plateforms.forEach((platform) => {
              platform.position.x += player.speed
            })
      
            genericObjects.forEach((genericObject) => {
              genericObject.position.x += player.speed * 0.66
            })

            enemies.forEach((enemy) => {
                enemy.position.x += player.speed
            })
            particles.forEach((particle) => {
              particle.position.x += player.speed
            })
        }
    }

    // plateform collision
    // platform collision detection
  plateforms.forEach((platform) => {
    if (
      isOnTopOfPlatform({
        object: player,
        platform
      })
    ) {
      player.velocity.y = 0
    }

    // particles bounce
    particles.forEach((particle, index) => {
      if (
        isOnTopOfPlatformCircle({
          object: particle,
          platform
        })
      ) {
        particle.velocity.y = -particle.velocity.y * 0.9

        if (particle.radius - 0.4 < 0) particles.splice(index, 1)
        else particle.radius -= 0.4
      }

      if (particle.ttl < 0) particles.splice(index, 1)
    })

    enemies.forEach((enemy) => {
      if (
        isOnTopOfPlatform({
          object: enemy,
          platform
        })
      )
        enemy.velocity.y = 0
    })
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
