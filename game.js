let scriptIndex = 0

class Game {
  constructor() {
    this.hurtRecoveryTime = 8
    this.healthRecoveryRate = 0.08
    this.tickRate = 0.1
    // this.hurtColor = '#ff2222'
    this.hurtColor = '#222'
    this.hurtSpeed = 0.02
    this.normalSpeed = 0.3
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
            ratio : 1/4,
            time: 2
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
    let time = 500
    this.playerHealth -= damage
    kaleidoscopes[0].setTint(this.hurtColor, time)
    kaleidoscopes[0].setSpeed(this.hurtSpeed, time)
    setTimeout(() => {
      kaleidoscopes[0].setTint(this.calculateTint(), this.hurtRecoveryTime * 1000)
      kaleidoscopes[0].setSpeed(this.normalSpeed, this.hurtRecoveryTime * 1000)
    }, time)
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
  image: './ivy_texture.jpg',
  tint: 0x333354,
  speed: game.normalSpeed
})

window.addEventListener('click', (event) => {
  if (activeScene.isActive && !busy) {
    if (activeScene.toAdvance(game))
      scene.continue()
  }
})
