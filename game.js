let scriptIndex = 0

class Game {
  constructor() {
    this.hurtRecoveryTime = 8
    this.healthRecoveryRate = 0.04
    this.tickRate = 0.1
    // this.hurtColor = '#ff2222'
    this.hurtColor = '#241919'
    this.normalSpeed = 0.15
    this.hurtSpeed = -this.normalSpeed * 1.4
    this.playerHealth = 100
    let resource_callbacks = {
      update: (cost, clicked) => this.onResourceUpdate(cost, clicked),
      onTake: (from, to, count) => this.onTake(from, to, count)
    }
    this.healthDOM = document.querySelector('#health-bar')
    // RESOURCES {{{
    this.resources = {
      water: new Resource('water', resource_callbacks, {
        count: 4,
        cost: 20,
        breedingRate: 0,
        breedingPopulation: 0,
        canBreed: false,
      }),
      leaf: new Resource('leaf', resource_callbacks, {
        count: 1,
        cost: 35,
        breedingRate: 20,
        breedingPopulation: 5,
        canBreed: true,
        needs: {
          water: {
            cooldown: 2,
            ratio : 1/4,
            time: 4
          },
        }
      }),
      bug: new Resource('bug', resource_callbacks, {
        count: 0,
        cost: 10,
        breedingRate: 20,
        breedingPopulation: 5,
        canBreed: true,
      }),
      frog: new Resource('frog', resource_callbacks, {
        count: 0,
        cost: 10,
        breedingRate: 20,
        breedingPopulation: 5,
        canBreed: true,
      }),
      tree: new Resource('tree', resource_callbacks, {
        count: 0,
        cost: 10,
        breedingRate: 20,
        breedingPopulation: 5,
        canBreed: true,
      }),
      cat: new Resource('cat', resource_callbacks, {
        count: 0,
        cost: 10,
        breedingRate: 20,
        breedingPopulation: 5,
        canBreed: true,
      }),
      crow: new Resource('crow', resource_callbacks, {
        count: 0,
        cost: 10,
        breedingRate: 20,
        breedingPopulation: 5,
        canBreed: true,
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
  }

  hurt(damage) {
    let time = 300
    let delay = 50
    this.playerHealth -= damage
    kaleidoscopes[0].setTint(this.hurtColor, time)
    kaleidoscopes[0].setSpeed(this.hurtSpeed, 0)
    setTimeout(() => {
      kaleidoscopes[0].setTint(this.calculateTint(), this.hurtRecoveryTime * 4000)
      kaleidoscopes[0].setSpeed(this.normalSpeed, this.hurtRecoveryTime * 1000)
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
    console.log(from, "takes " + amount, to)
    let element = document.createElement("div")
    element.classList.add('badge')
    element.classList.add('token')
    let icon = document.createElement("i")
    element.appendChild(icon)
    icon.classList.add('icon')
    icon.classList.add('fas')
    icon.classList.add('fa-' + to.name)
    console.log(element)
    console.log(icon)
    element.style.left = to.domElement.getBoundingClientRect().left
    element.style.top = to.domElement.getBoundingClientRect().top
    let destination = from.domElement.getBoundingClientRect()
    let domelement = document.querySelector('#token-board').appendChild(element)
    domelement.style.transition = '2s top, 2s left'
    let held = from.needs[to.name].held
    held.push(domelement)
    setTimeout(() => {
      domelement.style.left = destination.left - held.length * 2 + 'px'
      domelement.style.top = destination.top - held.length * 2 + 'px'
    }, 200)


    //TweenMax('#token-board', 2, { top: destination.top + 'px', left: destination.left + 'px' })
  }

  calculateTint() {
    return 0x22ccdd;
  }

}

let game = new Game()
function toAdvanceDefault() { return true }

let activeScene = {
  // scene: script.intro,
  scene: script.skipIntro,
  index: 0,
  isActive: true,
  toAdvance: toAdvanceDefault,
  buttons: false,
  current() {
    return this.scene[this.index]
  }
}

let busy = false;

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
      game.heal(current.heal)
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

  // Does NOT play normal hurt animation
  doHurt(cost) {
    // game.hurt(cost)
    game.playerHealth -= cost
    game.updatePlayerHealth()
  },

  resourceUpdate(which) {
    // if (which.water) game.resources.water.change(which.water);
    // if (game.resources[which[0]])
    // game.resources[which[0]].change();
    for (let key in which) {
      if (!which.hasOwnProperty(key)) continue;
      let count = which[key]
      game.resources[key].change(count, )
    }
  },

  redrawStep1(duration) {
    let current = activeScene.current() || { message: "" }
    let text = current.message || current
    // set text
    message.innerText = text
    // set tint
    activeScene.buttons = current.buttons || false
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
    }
    // update message
    else setTimeout(this.redrawStep2, duration)
  },

  redrawStep2() {
      message.classList.remove('hidden')
      busy = false;
  },

  // }}}
}

kaleidoscopes[0] = new Kaleidoscope({
  image: './ivy_grey.jpg',
  tint: game.calculateTint(),
  speed: game.normalSpeed
})

window.addEventListener('click', (event) => {
  if (activeScene.isActive && !busy) {
    if (activeScene.toAdvance(game))
      scene.continue()
  }
})
