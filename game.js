let scriptIndex = 0

function toAdvanceDefault() { return true }

let activeScene = {
  scene: script.intro,
  // scene: script.skipIntro,
  index: 0,
  isActive: true,
  toAdvance: toAdvanceDefault,
  buttons: false,
  game: {},
  current() {
    return this.scene[this.index]
  },
  setActive() {
    this.index = 0
    this.isActive = true
  },
  triggeredScenes: [],
  // SCENETRIGGERS {{{
  checkSceneTriggers() {
    console.log("SCENE TRIGGA!")
    if (!this.triggeredScenes.includes('bugs') &&
        this.game.resources.leaf.count >= 10) {
      console.log("TRIGGERING BUGS")
      this.scene = script.bugs
      this.setActive()
      busy = false
      this.triggeredScenes.push('bugs')
      if (sceneContinue) 
        sceneContinue()
    }
    else if (!this.triggeredScenes.includes('frogs') &&
        this.game.resources.bug.count >= 10) {
      console.log("TRIGGERING FROGS")
      this.scene = script.frogs
      this.setActive()
      busy = false
      this.triggeredScenes.push('frogs')
      if (sceneContinue) 
        sceneContinue()
    }
    else if (!this.triggeredScenes.includes('crows') &&
        this.game.resources.frog.count >= 10) {
      console.log("TRIGGERING CROWS")
      this.scene = script.crows
      this.setActive()
      busy = false
      this.triggeredScenes.push('crows')
      if (sceneContinue) 
        sceneContinue()
    }
    else if (!this.triggeredScenes.includes('cats') &&
        this.game.resources.crow.count >= 10) {
      console.log("TRIGGERING CROWS")
      this.scene = script.cats
      this.setActive()
      busy = false
      this.triggeredScenes.push('cats')
      if (sceneContinue) 
        sceneContinue()
    }
    else if (!this.triggeredScenes.includes('ending') &&
        this.game.resources.cat.count >= 10) {
      console.log("TRIGGERING END")
      this.scene = script.ending
      this.setActive()
      busy = false
      this.triggeredScenes.push('ending')
      if (sceneContinue) 
        sceneContinue()
    }
  },
  // }}}
}

let busy = false;
let sceneContinue;

class Game {
  constructor() {
    this.hurtRecoveryTime = 8
    this.healthRecoveryRate = 0.05
    this.tickRate = 0.1
    // this.hurtColor = '#ff2222'
    this.hurtColor = '#241919'
    this.normalSpeed = 0.15
    this.hurtSpeed = -this.normalSpeed * 1.4
    this.playerHealth = 100
    let resource_callbacks = {
      update: (cost, clicked) => this.onResourceUpdate(cost, clicked),
      onTake: (from, to, count) => this.onTake(from, to, count),
      returnWater: (element, amount) => this.returnWaterCallback(element, amount)
    }
    activeScene.game = this
    this.healthDOM = document.querySelector('#health-bar')
    // RESOURCES {{{
    this.resources = {
      water: new Resource('water', resource_callbacks, {
        count: 4,
        cost: 10,
        breedingRate: 0,
        breedingPopulation: 0,
        canBreed: false,
      }),
      leaf: new Resource('leaf', resource_callbacks, {
        count: 0,
        cost: 8,
        breedingRate: 500,
        breedingPopulation: 1,
        canBreed: true,
        needs: {
          water: {
            cooldown: 6,
            ratio : 1/2,
            time: 10
          },
        }
      }),
      bug: new Resource('bug', resource_callbacks, {
        count: 0,
        cost: 12,
        breedingRate: 150,
        breedingPopulation: 1,
        canBreed: true,
        needs: {
          water: {
            cooldown: 4,
            ratio: 1/8,
            time: 16
          },
          leaf: {
            cooldown: 4,
            ratio: 1/8,
            time: 30
          }
        }
      }),
      frog: new Resource('frog', resource_callbacks, {
        count: 0,
        cost: 10,
        breedingRate: 400,
        breedingPopulation: 1,
        canBreed: true,
        canBreed: true,
        needs: {
          water: {
            cooldown: 4,
            ratio: 1/6,
            time: 12
          },
          bug: {
            cooldown: 3,
            ratio: 1/4,
            time: 12
          }
        }
      }),
      /*
      tree: new Resource('tree', resource_callbacks, {
        count: 0,
        cost: 10,
        breedingRate: 20,
        breedingPopulation: 1,
        canBreed: true,
      }),
      */
      crow: new Resource('crow', resource_callbacks, {
        count: 0,
        cost: 10,
        breedingRate: 300,
        breedingPopulation: 1,
        canBreed: true,
        needs: {
          water: {
            cooldown: 4,
            ratio: 1/8,
            time: 20
          },
          bug: {
            cooldown: 3,
            ratio: 1/6,
            time: 24
          },
          frog: {
            cooldown: 3,
            ratio: 1/4,
            time: 34
          }
        }
      }),
      cat: new Resource('cat', resource_callbacks, {
        count: 0,
        cost: 10,
        breedingRate: 400,
        breedingPopulation: 1,
        canBreed: true,
        needs: {
          water: {
            cooldown: 4,
            ratio: 1/8,
            time: 12
          },
          frog: {
            cooldown: 3,
            ratio: 1/4,
            time: 24
          },
          crow: {
            cooldown: 3,
            ratio: 1/4,
            time: 26
          },
        }
      }),
    }
    // }}}
    this.tick()
  }

  tick() {
    setTimeout(() => this.tick(), this.tickRate * 1000)
    for (let resource in this.resources) {
      if (!this.resources.hasOwnProperty(resource)) continue;
      this.resources[resource].tick(this.tickRate)
    }
    this.heal(this.healthRecoveryRate)
    if (activeScene)
      activeScene.checkSceneTriggers()
  }

  hurt(damage) {
    let time = 300
    let delay = 50
    this.playerHealth -= damage
    kaleidoscopes[0].setTint(this.hurtColor, time)
    kaleidoscopes[0].setSpeed(this.hurtSpeed, 0)
    music.rate(0.5)
    setTimeout(() => {
      kaleidoscopes[0].setTint(this.calculateTint(), this.hurtRecoveryTime * 1500)
      kaleidoscopes[0].setSpeed(this.normalSpeed, this.hurtRecoveryTime * 1000)
      // MUSIC
      recoverMusic(this.hurtRecoveryTime * 1)
    }, time + delay)
    this.updatePlayerHealth()
  }

  heal(amount) {
    this.playerHealth += amount
    if (this.playerHealth > 100)
      this.playerHealth = 100
    else if (this.playerHealth < 0) this.playerHealth = 0
    this.updatePlayerHealth()
  }

  updatePlayerHealth() {
    this.healthDOM.style = 'width: ' + this.playerHealth + '%;'
    if (this.playerHealth == 0)
      alert("u ded")
  }

  onResourceUpdate(cost, clicked) {
    if (clicked) {
      if (activeScene.isActive) {
        if (activeScene.buttons) return true;
        else return false;
      }
      this.hurt(cost);
    }
    return true;
  }

  onTake(from, to, amount) {
    to = this.resources[to]
    if (to.count < amount) return false;
    // console.log(from, "takes " + amount, to)
    let element = document.createElement("div")
    element.classList.add('badge')
    element.classList.add('token')
    let icon = document.createElement("i")
    element.appendChild(icon)
    icon.classList.add('icon')
    icon.classList.add('fas')
    icon.classList.add('fa-' + to.name)
    // console.log(element)
    // console.log(icon)
    element.style.left = to.domElement.getBoundingClientRect().left
    element.style.top = to.domElement.getBoundingClientRect().top
    let destination = from.domElement.getBoundingClientRect()
    let domelement = document.querySelector('#token-board').appendChild(element)
    domelement.style.transition = '2s top, 2s left, 0.5s opacity'
    let held = from.needs[to.name].held
    // held.push(domelement)
    to.change(-amount)
    setTimeout(() => {
      domelement.style.left = destination.left - held.length * 2 + 'px'
      domelement.style.top = destination.top - held.length * 2 + 'px'
    }, 200)
    return domelement;


    //TweenMax('#token-board', 2, { top: destination.top + 'px', left: destination.left + 'px' })
  }

  returnWaterCallback(domElement, amount) {
    domElement.style.transition = '1s top, 1s left, .5s opacity'
    domElement.style.left = this.resources.water.domElement.getBoundingClientRect().left
    domElement.style.top = this.resources.water.domElement.getBoundingClientRect().top
    setTimeout(() => {
      domElement.classList.add('hidden')
      this.resources.water.change(amount)
    }, 1000)
  }

  calculateTint() {
    let colors = {
      water: '#548588',
      leaf: '#8ec07c',
      frog: '#d3869b',
      tree: '#427b58',

    }
    return 0x22ccdd;
    // return 0xffffff;
    // return colors.water;
  }

}

let game = new Game()

let scene = {
  continue() {
    this.redraw()
  },


  // redraw {{{
  redraw() {
    let current = activeScene.current() || {}
    let message = document.querySelector('#message')
    message.classList.add('hidden')
    busy = true;
    let duration = 1000
    // set toAdvance function
    if (current.doHurt)
      this.doHurt(current.doHurt)
    if (current.heal)
      this.doHeal(current.heal)
    if (current.toAdvance)
      activeScene.toAdvance = current.toAdvance
    else activeScene.toAdvance = toAdvanceDefault
    // set duration
    if (current.duration)
      duration = current.duration/2
    setTimeout(() => {this.redrawStep1(duration)}, duration);
  },

  iconAppear(iconIDNames) {
    for (let i = 0; i < iconIDNames.length; ++i) {
      let icon = document.querySelector('#' + iconIDNames[i])
      icon.classList.remove('hidden')
      this.resourceUpdate({ [iconIDNames[i]] : 0 })
    }
  },

  doHeal(amount) {
      game.heal(amount)
      kaleidoscopes[0].setSpeed(game.normalSpeed, game.hurtRecoveryTime * 1000)
      recoverMusic(2)
  },

  // Does NOT play normal hurt animation
  doHurt(cost) {
    // game.hurt(cost)
    game.playerHealth -= cost
    game.updatePlayerHealth()
    kaleidoscopes[0].setSpeed(0.001, 0.4)
    music.rate(0.5)
  },

  resourceUpdate(which) {
    // if (which.water) game.resources.water.change(which.water);
    // if (game.resources[which[0]])
    // game.resources[which[0]].change();
    for (let key in which) {
      if (!which.hasOwnProperty(key)) continue;
      let count = which[key]
      game.resources[key].change(count)
    }
  },

  redrawStep1(duration) {
    let current = activeScene.current() || { message: "" }
    let text = current.message || current
    // set text
    message.innerText = text
    // set tint
    // THIS DISABLED BUTTONS BUT MAYBE I WANT EM ALWAYS ENABLED
    activeScene.buttons = current.buttons || false
    // buttons
    if (activeScene.buttons)
      document.querySelector('#fade-buttons').classList = 'hidden'
    else document.querySelector('#fade-buttons').classList = ''

    if (current.resourceUpdate)
      this.resourceUpdate(current.resourceUpdate)
    if (current.setTint)
      kaleidoscopes[0].setTint(current.setTint, duration)
    if (current.iconAppear)
      this.iconAppear(current.iconAppear)
    // done if end of scene
    if (activeScene.scene.length <= activeScene.index++) {
      activeScene.sceneName = ''
      activeScene.isActive = false
      document.querySelector('#fade-buttons').classList = 'hidden'
    }
    // update message
    else setTimeout(this.redrawStep2, duration)
  },

  redrawStep2() {
    message.classList.remove('hidden')
    setTimeout(() => { busy = false; }, 500)
  },

  // }}}
}

sceneContinue = () => scene.continue()

kaleidoscopes[0] = new Kaleidoscope({
  image: './ivy_grey.jpg',
  // tint: game.calculateTint(),
  tint: 0x121212,
  speed: game.normalSpeed
})

let onButtons = false

document.querySelector('#top-marquee').onmouseover = () => { onButtons = true }
document.querySelector('#top-marquee').onmouseout = () => { onButtons = false }

window.addEventListener('click', (event) => {
  if (onButtons && !activeScene.buttons) return
  if (activeScene.isActive && !busy) {
    if (activeScene.toAdvance(game)) {
      scene.continue()
    }
  }
})
