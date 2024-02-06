import gsap from 'gsap'
import {
  createImage,
  createImageAsync,
  isOnTopOfPlatform,
  collisionTop,
  isOnTopOfPlatformCircle,
  hitBottomOfPlatform,
  hitSideOfPlatform,
  objectsTouch
} from './utils.js'

import plateform from '../img/plateform.png'
import background from '../img/background.png'
import block from '../img/block.png'
import blockTri from '../img/blockTri.png'
//import pjump from '../img/pjump.png'
import mdPlatform from '../img/mdPlatform.png'
import lgPlatform from '../img/lgPlatform.png'
import tPlatform from '../img/tPlatform.png'
import xtPlatform from '../img/xtPlatform.png'
import flagPoleSprite from '../img/flagPole.png'

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

import spriteFireFlowerRunRight from '../img/spriteFireFlowerRunRight.png'
import spriteFireFlowerRunLeft from '../img/spriteFireFlowerRunLeft.png'
import spriteFireFlowerStandRight from '../img/spriteFireFlowerStandRight.png'
import spriteFireFlowerStandLeft from '../img/spriteFireFlowerStandLeft.png'
import spriteFireFlowerJumpRight from '../img/spriteFireFlowerJumpRight.png'
import spriteFireFlowerJumpLeft from '../img/spriteFireFlowerJumpLeft.png'

import spriteFireFlower from '../img/spriteFireFlower.png'

import { audio } from './audio.js'

import 'regenerator-runtime/runtime';

const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = window.innerWidth
canvas.height = window.innerHeight

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

});

let gravity = 1.5

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
                fireFlower: {
                  right: createImage(spriteFireFlowerStandRight),
                  left: createImage(spriteFireFlowerStandLeft)
                }
            },
            run: {
                right: createImage(spriteMarioRunRight),
                left: createImage(spriteMarioRunLeft),
                fireFlower: {
                  right: createImage(spriteFireFlowerRunRight),
                  left: createImage(spriteFireFlowerRunLeft)
                }
            },
            jump: {
              right: createImage(spriteMarioJumpRight),
              left: createImage(spriteMarioJumpLeft),
              fireFlower: {
                right: createImage(spriteFireFlowerJumpRight),
                left: createImage(spriteFireFlowerJumpLeft)
              }
            }
        }

        this.currentSprite = this.sprites.stand.right
        this.currentCropWidth = 398
        this.powerUps = {
          fireFlower: false
        }
        this.invincible = false
        this.opacity = 1
    }

    draw() {
      c.save()
      c.globalAlpha = this.opacity
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
      c.restore()
    }

    update() {
        this.frames++
        const { currentSprite, sprites } = this
    
        if (
          this.frames > 58 &&
          (currentSprite === sprites.stand.right ||
            currentSprite === sprites.stand.left ||
            currentSprite === sprites.stand.fireFlower.left ||
            currentSprite === sprites.stand.fireFlower.right)
        )
          this.frames = 0
        else if (
          this.frames > 28 &&
          (currentSprite === sprites.run.right ||
            currentSprite === sprites.run.left ||
            currentSprite === sprites.run.fireFlower.right ||
            currentSprite === sprites.run.fireFlower.left)
        )
          this.frames = 0
        else if (
          currentSprite === sprites.jump.right ||
          currentSprite === sprites.jump.left ||
          currentSprite === sprites.jump.fireFlower.right ||
          currentSprite === sprites.jump.fireFlower.left
        )
          this.frames = 0
    
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
    
        if (this.position.y + this.height + this.velocity.y <= canvas.height)
          this.velocity.y += gravity

        if (this.invincible) {
          if (this.opacity === 1) this.opacity = 0
          else this.opacity = 1
        } else this.opacity = 1
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
          c.font = '20px Arial'
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

  class FireFlower {
    constructor({ position, velocity }) {
      this.position = {
        x: position.x,
        y: position.y
      }
  
      this.velocity = {
        x: velocity.x,
        y: velocity.y
      }
  
      this.width = 56
      this.height = 60
  
      this.image = createImage(spriteFireFlower)
      this.frames = 0
    }
  
    draw() {
      // c.fillStyle = 'red'
      // c.fillRect(this.position.x, this.position.y, this.width, this.height)
  
      c.drawImage(
        this.image,
        56 * this.frames,
        0,
        56,
        60,
        this.position.x,
        this.position.y,
        this.width,
        this.height
      )
    }
  
    update() {
      this.frames++
      if (this.frames >= 75) this.frames = 0
      this.draw()
      this.position.x += this.velocity.x
      this.position.y += this.velocity.y
  
      if (this.position.y + this.height + this.velocity.y <= canvas.height)
        this.velocity.y += gravity
    }
  }

  class Particle {
    constructor({
      position,
      velocity,
      radius,
      color = '#654428',
      fireball = false,
      fades = false
    }) {
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
      this.color = color
      this.fireball = fireball
      this.opacity = 1
      this.fades = fades
    }
  
    draw() {
      c.save()
      c.globalAlpha = this.opacity
      c.beginPath()
      c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2, false)
      c.fillStyle = this.color
      c.fill()
      c.closePath()
      c.restore
    }
  
    update() {
      this.ttl--
      this.draw()
      this.position.x += this.velocity.x
      this.position.y += this.velocity.y
  
      if (this.position.y + this.radius + this.velocity.y <= canvas.height)
        this.velocity.y += gravity * 0.4
      if (this.fades && this.opacity > 0) {
        this.opacity -= 0.01
      }

      if (this.opacity < 0) this.opacity = 0
    }
  }

let plateformImage = createImageAsync(plateform)
//let test = createImageAsync(pjump)
let blockTriImage
let lgPlateformImage
let tPlateformImage
let xtPlateformImage
let blockImage

let player = new Player()
let plateforms = []
let genericObjects = []
let enemies = []
let particles = []
let fireFlowers = []

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
let flagPole
let flagPoleImage
let game

async function init() {
  game = {
    disableUserInput: false
  }

    plateformImage = await createImageAsync(plateform)
    //test = await createImageAsync(pjump)
    blockTriImage = await createImageAsync(blockTri)
    blockImage = await createImageAsync(block)
    lgPlateformImage = await createImageAsync(lgPlatform)
    tPlateformImage = await createImageAsync(tPlatform)
    xtPlateformImage = await createImageAsync(xtPlatform)  
    flagPoleImage = await createImageAsync(flagPoleSprite)

    fireFlowers = [
      new FireFlower({
        position: {
          x: 400,
          y: 100
        },
        velocity: {
          x: 0,
          y: 0
        }
      })
    ]

  flagPole = new GenericObject({
    x: 6968 + 600,
    //x: 500,
    y: canvas.height - lgPlateformImage.height - flagPoleImage.height,
    image: flagPoleImage
  })

    player = new Player()
    const enemyWidth = 43.33
    enemies = [
        new Enemy({
          position: {
            x: 908 + lgPlateformImage.width - enemyWidth,
            y: 570
          },
          velocity: {
            x: -0.3,
            y: 0
          },
          distance: {
            limit: 400,
            traveled: 0
          }
        }),
        new Enemy({
          position: {
            x: 3249 + lgPlateformImage.width - enemyWidth,
            y: 570
          },
          velocity: {
            x: -0.3,
            y: 0
          }
        }),
        new Enemy({
          position: {
            x: 3249 + lgPlateformImage.width - enemyWidth - enemyWidth,
            y: 100
          },
          velocity: {
            x: -0.3,
            y: 0
          },
          distance: {
            limit: 200,
            limit: 400,
            traveled: 0
          }
        }),
        new Enemy({
          position: {
            x: 1400,
            x:
              3249 +
              lgPlateformImage.width -
              enemyWidth -
              enemyWidth -
              enemyWidth,
            y: 100
          },
          velocity: {
            x: -0.3,
            y: 0
          },
          distance: {
            limit: 400,
            traveled: 0
          }
        }),
        new Enemy({
          position: {
            x:
              3249 +
              lgPlateformImage.width -
              enemyWidth -
              enemyWidth -
              enemyWidth -
              enemyWidth,
            y: 100
          },
          velocity: {
            x: -0.3,
            y: 0
          },
          distance: {
            limit: 400,
            traveled: 0
          }
        }),
        new Enemy({
          position: {
            x: 5135 + xtPlateformImage.width / 2 + enemyWidth,
            y: 100
          },
          velocity: {
            x: -0.3,
            y: 0
          },
          distance: {
            limit: 100,
            traveled: 0
          }
        }),
        new Enemy({
          position: {
            x: 6968,
            y: 0
          },
          velocity: {
            x: -0.3,
            y: 0
          },
          distance: {
            limit: 100,
            traveled: 0
          }
        })
      ]
    particles = []
    particles = []
    plateforms = [
      new Plateform({
        x: 908 + 100,
        y: 300,
        image: blockTriImage,
        block: true
      }),
      new Plateform({
        x: 908 + 100 + blockImage.width,
        y: 100,
        image: blockImage,
        block: true
      }),
      new Plateform({
        x: 1991 + lgPlateformImage.width - tPlateformImage.width,
        y: canvas.height - lgPlateformImage.height - tPlateformImage.height,
        image: tPlateformImage,
        block: false
      }),
      new Plateform({
        x: 1991 + lgPlateformImage.width - tPlateformImage.width - 100,
        y:
          canvas.height -
          lgPlateformImage.height -
          tPlateformImage.height +
          blockImage.height,
        image: blockImage,
        block: true
      }),
      new Plateform({
        x: 5712 + xtPlateformImage.width + 175,
        y: canvas.height - xtPlateformImage.height,
        image: blockImage,
        block: true,
        text: 5712 + xtPlateformImage.width + 175
      }),
      new Plateform({
        x: 6116 + 175,
        y: canvas.height - xtPlateformImage.height,
        image: blockImage,
        block: true
      }),
      new Plateform({
        x: 6116 + 175 * 2,
        y: canvas.height - xtPlateformImage.height,
        image: blockImage,
        block: true
      }),
      new Plateform({
        x: 6116 + 175 * 3,
        y: canvas.height - xtPlateformImage.height - 100,
        image: blockImage,
        block: true
      }),
      new Plateform({
        x: 6116 + 175 * 4,
        y: canvas.height - xtPlateformImage.height - 200,
        image: blockTriImage,
        block: true
      }),
      new Plateform({
        x: 6116 + 175 * 4 + blockTriImage.width,
        y: canvas.height - xtPlateformImage.height - 200,
        image: blockTriImage,
        block: true,
        text: 6116 + 175 * 4 + blockTriImage.width
      }),
      new Plateform({
        x: 6968 + 300,
        y: canvas.height - lgPlateformImage.height,
        image: lgPlateformImage,
        block: true,
        text: 6968 + 300
      })
    ]
    genericObjects = [
      new GenericObject({
        x: -1,
        y: -1,
        image: createImage(background)
      }),
    ]
  
    scrollOffset = 0
  
    const plateformsMap = [
      'lg',
      'lg',
      'gap',
      'lg',
      'gap',
      'gap',
      'lg',
      'gap',
      't',
      'gap',
      'xt',
      'gap',
      'xt',
      'gap',
      'gap',
      'xt'
    ]
  
    let platformDistance = 0
  
    plateformsMap.forEach((symbol) => {
      switch (symbol) {
        case 'lg':
          plateforms.push(
            new Plateform({
              x: platformDistance,
              y: canvas.height - lgPlateformImage.height,
              image: lgPlateformImage,
              block: true,
              text: platformDistance
            })
          )
  
          platformDistance += lgPlateformImage.width - 2
  
          break
  
        case 'gap':
          platformDistance += 175
  
          break
  
        case 't':
          plateforms.push(
            new Plateform({
              x: platformDistance,
              y: canvas.height - tPlateformImage.height,
              image: tPlateformImage,
              block: true
            })
          )
  
          platformDistance += tPlateformImage.width - 2
  
          break
  
        case 'xt':
          plateforms.push(
            new Plateform({
              x: platformDistance,
              y: canvas.height - xtPlateformImage.height,
              image: xtPlateformImage,
              block: true,
              text: platformDistance
            })
          )
  
          platformDistance += xtPlateformImage.width - 2
  
          break
      }
    })
  }

function animate() {
    requestAnimationFrame(animate)
    c.fillStyle = 'wheat'
    c.fillRect(0, 0, canvas.width, canvas.height)

    genericObjects.forEach(genericObject => {
      genericObject.update()
      genericObject.velocity.x = 0
    })

    particles.forEach((particle, i) => {
      particle.update()
  
      if (
        particle.fireball &&
        (particle.position.x - particle.radius >= canvas.width ||
          particle.position.x + particle.radius <= 0)
      )
        setTimeout(() => {
          particles.splice(i, 1)
        }, 0)
    })

    plateforms.forEach(plateform => {
      plateform.update()
      plateform.velocity.x = 0
    })

    if (flagPole) {
      flagPole.update()
      flagPole.velocity.x = 0
  
      // mario touches flagpole
      // win condition
      // complete level
      if (
        !game.disableUserInput &&
        objectsTouch({
          object1: player,
          object2: flagPole
        })
      ) {
        audio.completeLevel.play()
        audio.musicLevel1.stop()
        game.disableUserInput = true
        player.velocity.x = 0
        player.velocity.y = 0
        gravity = 0
  
        player.currentSprite = player.sprites.stand.right
  
        if (player.powerUps.fireFlower)
          player.currentSprite = player.sprites.stand.fireFlower.right

        // flagpole slide
        setTimeout(() => {
          audio.descend.play()
        }, 200)
        gsap.to(player.position, {
          y: canvas.height - lgPlateformImage.height - player.height,
          duration: 1,
          onComplete() {
            player.currentSprite = player.sprites.run.right
  
            if (player.powerUps.fireFlower)
              player.currentSprite = player.sprites.run.fireFlower.right
          }
        })
  
        gsap.to(player.position, {
          delay: 1,
          x: canvas.width,
          duration: 2,
          ease: 'power1.in'
        })

        // fireworks
      const particleCount = 300
      const radians = (Math.PI * 2) / particleCount
      const power = 8
      let increment = 1

      const intervalId = setInterval(() => {
        for (let i = 0; i < particleCount; i++) {
          particles.push(
            new Particle({
              position: {
                x: (canvas.width / 4) * increment,
                y: canvas.height / 2
              },
              velocity: {
                x: Math.cos(radians * i) * power * Math.random(),
                y: Math.sin(radians * i) * power * Math.random()
              },
              radius: 3 * Math.random(),
              color: `hsl(${Math.random() * 200}, 50%, 50%)`,
              fades: true
            })
          )
        }

        audio.fireworkBurst.play()
        audio.fireworkWhistle.play()

        if (increment === 3) clearInterval(intervalId)

        increment++
      }, 1000)
      }
    }

    enemies.forEach((enemy, index) => {
        enemy.update()
        // remove enemy on fireball hit
    particles
    .filter((particle) => particle.fireball)
    .forEach((particle, particleIndex) => {
      if (
        particle.position.x + particle.radius >= enemy.position.x &&
        particle.position.y + particle.radius >= enemy.position.y &&
        particle.position.x - particle.radius <=
          enemy.position.x + enemy.width &&
        particle.position.y - particle.radius <=
          enemy.position.y + enemy.height
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
        setTimeout(() => {
          enemies.splice(index, 1)
          particles.splice(particleIndex, 1)
        }, 0)
      }
    })

        // goomba stomp squish / squash
        if (
          collisionTop({
            object1: player,
            object2: enemy
          })
        ) {
          audio.goombaSquash.play()

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
          ) {

            // player hits enemy
            // lose fireflower / lose powerup
            if (player.powerUps.fireFlower) {
              player.invincible = true
              player.powerUps.fireFlower = false
              audio.losePowerUp.play()
      
              setTimeout(() => {
                player.invincible = false
              }, 1000)
             } else if (!player.invincible) {
              audio.die.play()
              init()
            }
          }
      })
      player.update()

    if (game.disableUserInput) return

     // scrolling code starts
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

            flagPole.velocity.x = -player.speed
    
            genericObjects.forEach((genericObject) => {
              genericObject.velocity.x = -player.speed * 0.66
            })
    
            enemies.forEach((enemy) => {
              enemy.position.x -= player.speed
            })

            fireFlowers.forEach((fireFlower) => {
              fireFlower.position.x -= player.speed
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

              flagPole.velocity.x = player.speed

              genericObjects.forEach((genericObject) => {
                genericObject.velocity.x = player.speed * 0.66
              })

              enemies .forEach((enemy) => {
                enemy.position.x += player.speed
              })
              fireFlowers.forEach((fireFlower) => {
                fireFlower.position.x += player.speed
              })

              particles.forEach((particle) => {
                particle.position.x += player.speed
              })
            }
        }
    }

    // extra life
  fireFlowers.forEach((fireFlower, i) => {
    if (
      objectsTouch({
        object1: player,
        object2: fireFlower
      })
    ) {
      player.powerUps.fireFlower = true
      setTimeout(() => {
        fireFlowers.splice(i, 1)
      }, 0)
    } else fireFlower.update()
  })

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
        const bounce = 0.9
        particle.velocity.y = -particle.velocity.y * 0.99

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
    fireFlowers.forEach((fireFlower) => {
      if (
        isOnTopOfPlatform({
          object: fireFlower,
          plateform
        })
      )
        fireFlower.velocity.y = 0
    })
  })

  

    //Lose condition
    if(player.position.y > canvas.height) {
        audio.die.play()
        init()
    }

    // sprite switching
  if (player.velocity.y !== 0) return

  if (
    keys.right.pressed &&
    lastKey === 'right' &&
    player.currentSprite !== player.sprites.run.right
  ) {
    player.currentSprite = player.sprites.run.right
  } else if (
    keys.left.pressed &&
    lastKey === 'left' &&
    player.currentSprite !== player.sprites.run.left
  ) {
    player.currentSprite = player.sprites.run.left
  } else if (
    !keys.left.pressed &&
    lastKey === 'left' &&
    player.currentSprite !== player.sprites.stand.left
  ) {
    player.currentSprite = player.sprites.stand.left
  } else if (
    !keys.right.pressed &&
    lastKey === 'right' &&
    player.currentSprite !== player.sprites.stand.right
  ) {
    player.currentSprite = player.sprites.stand.right
  }

  // fireflower sprites
  if (!player.powerUps.fireFlower) return

  if (
    keys.right.pressed &&
    lastKey === 'right' &&
    player.currentSprite !== player.sprites.run.fireFlower.right
  ) {
    player.currentSprite = player.sprites.run.fireFlower.right
  } else if (
    keys.left.pressed &&
    lastKey === 'left' &&
    player.currentSprite !== player.sprites.run.fireFlower.left
  ) {
    player.currentSprite = player.sprites.run.fireFlower.left
  } else if (
    !keys.left.pressed &&
    lastKey === 'left' &&
    player.currentSprite !== player.sprites.stand.fireFlower.left
  ) {
    player.currentSprite = player.sprites.stand.fireFlower.left
  } else if (
    !keys.right.pressed &&
    lastKey === 'right' &&
    player.currentSprite !== player.sprites.stand.fireFlower.right
  ) {
    player.currentSprite = player.sprites.stand.fireFlower.right
  }
}

init()
animate()

addEventListener('keydown', ({ keyCode }) => {
    if (game.disableUserInput) return
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

            audio.jump.play()

            if (lastKey === 'right') player.currentSprite = player.sprites.jump.right
            else player.currentSprite = player.sprites.jump.left
            if (!player.powerUps.fireFlower) break

      if (lastKey === 'right')
        player.currentSprite = player.sprites.jump.fireFlower.right
      else player.currentSprite = player.sprites.jump.fireFlower.left

      break

    case 32:
      console.log('space')

      if (!player.powerUps.fireFlower) return

      audio.fireFlowerShot.play()

      let velocity = 15
      if (lastKey === 'left') velocity = -velocity

      particles.push(
        new Particle({
          position: {
            x: player.position.x + player.width / 2,
            y: player.position.y + player.height / 2
          },
          velocity: {
            x: velocity,
            y: 0
          },
          radius: 5,
          color: 'red',
          fireball: true
        })
      )

            break
    }

    console.log(keys.right.pressed)
})

addEventListener('keyup', ({ keyCode }) => {
    if (game.disableUserInput) return
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
