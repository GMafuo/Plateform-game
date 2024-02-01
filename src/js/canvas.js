import {
  createImage,
  createImageAsync,
  isOnTopOfPlatform,
  collisionTop,
  isOnTopOfPlatformCircle,
  hitBottomOfPlatform,
  hitSideOfPlatform
} from './utils.js'

import plateform from '../img/plateform.png'
import background from '../img/background.png'
import block from '../img/block.png'
import blockTri from '../img/blockTri.png'
import pjump from '../img/pjump.png'

import spriteRunLeft from '../img/spriteRunLeft.png'
import spriteRunRight from '../img/spriteRunRight.png'
import spriteStandLeft from '../img/spriteStandLeft.png'
import spriteStandRight from '../img/spriteStandRight.png'
import spriteEnemy from '../img/spriteGoomba.png'

import spriteMarioRunLeft from '../img/spriteMarioRunLeft.png'
import spriteMarioRunRight from '../img/spriteMarioRunRight.png'
import spriteMarioStandLeft from '../img/spriteMarioStandLeft.png'
import spriteMarioStandRight from '../img/spriteMarioStandRight.png'
import spriteMarioJumpRight from '../img/spriteMarioJumpRight.png'
import spriteMarioJumpLeft from '../img/spriteMarioJumpLeft.png'

import 'regenerator-runtime/runtime';

const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = window.innerWidth
canvas.height = window.innerHeight

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

});

const gravity = 1.5

class Player {
    constructor() {
        this.speed = 10
        this.position = {
            x: 100,
            y: 100
        }
        this.velocity = {
            x: 0,
            y: 0
        }
        this.scale = 0.3
        this.width = 398 * this.scale
        this.height = 353 * this.scale

        this.image = createImage(spriteStandRight)
        this.frames = 0
        this.sprites = {
            stand: {
                right: createImage(spriteMarioStandRight),
                left: createImage(spriteMarioStandLeft),
                cropWidth: 398,
                width: 398 * this.scale
            },
            run: {
                right: createImage(spriteMarioRunRight),
                left: createImage(spriteMarioRunLeft),
                cropWidth: 398,
                width: 398 * this.scale
            },
            jump: {
              right: createImage(spriteMarioJumpRight),
              left: createImage(spriteMarioJumpLeft),
              cropWidth: 398,
              width: 398 * this.scale
            }
        }

        this.currentSprite = this.sprites.stand.right
        this.currentCropWidth = this.sprites.stand.cropWidth
    }

    draw() {
      //HitBox
      //c.fillStyle = 'rgba(255, 0, 0, .2)'
      //c.fillRect(this.position.x, this.position.y, this.width, this.height)
        c.drawImage(
            this.currentSprite, 
            this.currentCropWidth * this.frames,
            0,
            this.currentCropWidth,
            353,
            this.position.x, 
            this.position.y, 
            this.width, 
            this.height
        )
    }

    update() {
        this.frames++
    
        if (
          this.frames > 58 &&
          (this.currentSprite === this.sprites.stand.right ||
            this.currentSprite === this.sprites.stand.left)
        )
          this.frames = 0
        else if (
          this.frames > 28 &&
          (this.currentSprite === this.sprites.run.right ||
            this.currentSprite === this.sprites.run.left)
        )
          this.frames = 0
        else if (
          this.currentSprite === this.sprites.jump.right ||
          this.currentSprite === this.sprites.jump.left
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
  constructor({ x, y, image, block, text }) {
        this.position = {
            x,
            y
        }

        this.velocity = {
          x: 0
        }

        this.image = image
        this.width = image.width 
        this.height = image.height //TODO Faire les bonnes dimensions cube trop haut
        this.block = block
        this.text = text
    }

    draw() {
        c.drawImage(this.image, this.position.x, this.position.y - (this.image.height - this.height));

        if (this.text) {
          c.fillStyle = 'red'
          c.fillText(this.text, this.position.x, this.position.y)
        }
      }
    
      update() {
        this.draw()
        this.position.x += this.velocity.x
    }
}

class GenericObject {
    constructor({ x, y, image }) {
        this.position = {
            x,
            y
        }

        this.velocity = {
          x: 0
        }

        this.image = image
        this.width = image.width 
        this.height = image.height //TODO Faire les bonnes dimensions cube trop haut
    }

    draw() {
        c.drawImage(this.image, this.position.x, this.position.y)
    }

    update() {
      this.draw()
      this.position.x += this.velocity.x
    } 
}

class Enemy {
  constructor({
    position,
    velocity,
    distance = {
      limit: 50,
      traveled: 0
    }
  }) {
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

      this.distance = distance
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

      // walk the enemy back and forth
      this.distance.traveled += Math.abs(this.velocity.x)

      if (this.distance.traveled > this.distance.limit) {
        this.distance.traveled = 0
        this.velocity.x = -this.velocity.x
      }
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

let plateformImage = createImageAsync(plateform)
let test = createImageAsync(pjump)
let blockTriImage

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

async function init() {
    plateformImage = await createImageAsync(plateform)
    test = await createImageAsync(pjump)
    blockTriImage = await createImageAsync(blockTri)

    player = new Player()
    enemies = [
        new Enemy({
          position: {
            x: 800,
            y: 570
          },
          velocity: {
            x: -0.3,
            y: 0
          },
          distance: {
            limit: 200,
            traveled: 0
          }
        }),
        new Enemy({
          position: {
            x: 1500,
            y: 570
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
        x: -1,
        y: 620,
        image: plateformImage
      }),
      new Plateform({ x: plateformImage.width - 3, y: 620, image: plateformImage }),
      new Plateform({
        x: plateformImage.width * 3 + 100,
        y: 620,
        image: plateformImage,
        text: 'here', 
        block: true
      }),
      new Plateform({
        x: plateformImage.width * 4 + 300,
        y: 620,
        image: plateformImage,
        text: 'here',
        block: true
      }),
      new Plateform({
        x: plateformImage.width * 5 + 300 - 2,
        y: 620,
        image: plateformImage
      }),
      new Plateform({
        x: plateformImage.width * 6 + 700 - 2,
        y: 620,
        image: plateformImage,
        text: 'here',
        block: true
      }),
      new Plateform({
        x: 850,
        y: 370,
        image: blockTriImage,
        block: true
      }),
      new Plateform({
        x: 1090,
        y: 250,
        image: test,
        block: true
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
      genericObject.update()
      genericObject.velocity.x = 0
    })

    plateforms.forEach(plateform => {
      plateform.update()
      plateform.velocity.x = 0
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

    let hitSide = false

    if (keys.right.pressed && player.position.x < 400) {
        player.velocity.x = player.speed
    } else if (
        (keys.left.pressed && player.position.x > 100) || 
        (keys.left.pressed && scrollOffset === 0 && player.position.x > 0)) {
        player.velocity.x = -player.speed
    } else {
        player.velocity.x = 0

        if (keys.right.pressed) {
          for (let i = 0; i < plateforms.length; i++) {
            const plateform = plateforms[i]
            plateform.velocity.x = -player.speed
    
            if (
              plateform.block &&
              hitSideOfPlatform({
                object: player,
                plateform
              })
            ) {
              plateforms.forEach((plateform) => {
                plateform.velocity.x = 0
              })
              hitSide = true
              break
            }
          }

          if (!hitSide) {
            scrollOffset += player.speed
    
            genericObjects.forEach((genericObject) => {
              genericObject.velocity.x = -player.speed * 0.66
            })
    
            enemies.forEach((enemy) => {
              enemy.position.x -= player.speed
            })
    
            particles.forEach((particle) => {
              particle.position.x -= player.speed
            })
          }
          } else if (keys.left.pressed && scrollOffset > 0) {
            for (let i = 0; i < plateforms.length; i++) {
              const plateform = plateforms[i]
              plateform.velocity.x = player.speed
      
              if (
                plateform.block &&
                hitSideOfPlatform({
                  object: player,
                  plateform
                })
              ) {
                plateforms.forEach((plateform) => {
                  plateform.velocity.x = 0
                })
      
                hitSide = true
                break
              }
            }
      
            if (!hitSide) {
              scrollOffset -= player.speed
              genericObjects.forEach((genericObject) => {
                genericObject.velocity.x = player.speed * 0.66
              })

              enemies .forEach((enemy) => {
                enemy.position.x += player.speed
              })
              particles.forEach((particle) => {
                particle.position.x += player.speed
              })
            }
        }
    }

    // plateform collision
    // plateform collision detection
  plateforms.forEach((plateform) => {
    if (
      isOnTopOfPlatform({
        object: player,
        plateform
      })
    ) {
      player.velocity.y = 0
    }

    if (
      plateform.block &&
      hitBottomOfPlatform({
        object: player,
        plateform
      })
    ) {
      player.velocity.y = -player.velocity.y
    }

    if (
      plateform.block &&
      hitSideOfPlatform({
        object: player,
        plateform
      })
    ) {
      player.velocity.x = 0
    }

    // particles bounce
    particles.forEach((particle, index) => {
      if (
        isOnTopOfPlatformCircle({
          object: particle,
          plateform
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
          plateform
        })
      )
        enemy.velocity.y = 0
    })
  })

    // sprite switching

    if (player.velocity.y === 0) {
      if (
        keys.right.pressed &&
        lastKey === 'right' &&
        player.currentSprite !== player.sprites.run.right
      ) {
        player.frames = 1
        player.currentSprite = player.sprites.run.right
        player.currentCropWidth = player.sprites.run.cropWidth
        player.width = player.sprites.run.width
      } else if (
        keys.left.pressed &&
        lastKey === 'left' &&
        player.currentSprite !== player.sprites.run.left
      ) {
        player.currentSprite = player.sprites.run.left
        player.currentCropWidth = player.sprites.run.cropWidth
        player.width = player.sprites.run.width
      } else if (
        !keys.left.pressed &&
        lastKey === 'left' &&
        player.currentSprite !== player.sprites.stand.left
      ) {
        player.currentSprite = player.sprites.stand.left
        player.currentCropWidth = player.sprites.stand.cropWidth
        player.width = player.sprites.stand.width
      } else if (
        !keys.right.pressed &&
        lastKey === 'right' &&
        player.currentSprite !== player.sprites.stand.right
      ) {
        player.currentSprite = player.sprites.stand.right
        player.currentCropWidth = player.sprites.stand.cropWidth
        player.width = player.sprites.stand.width
      }
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

            if (lastKey === 'right') player.currentSprite = player.sprites.jump.right
            else player.currentSprite = player.sprites.jump.left

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
