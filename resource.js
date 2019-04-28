class Resource {
  constructor(name, callbacks, options) {
    this.name = name
    this.count = options.count
    this.cost = options.cost
    this.needs = options.needs || null
    // breeding
    this.breedingRate = options.breedingRate
    this.breedingPopulation = options.breedingPopulation
    this.breedingCounter = 0
    this.canBreed = options.canBreed
    // dom
    this.domElement = document.querySelector('#' + name)
    this.badge = this.domElement.querySelector('.badge')
    this.breedbar = this.domElement.querySelector('.breed-bar')
    this.domElement.parentNode.onclick = () => this.change(1, true)
    // callbacks
    this.updateCallback = callbacks.update
    this.takeCallback = callbacks.onTake
    // needs
    for (let need in this.needs) {
      if (!this.needs.hasOwnProperty(need)) continue
      let needObj = this.needs[need]
      needObj.counter = 0
      needObj.held = []
    }

    if (!this.canBreed)
      this.breedbar.parentNode.style.display = "none"
  }

  change(by, clicked = false) {
    // console.log("change " + this.name)
    if (this.updateCallback(this.cost, clicked)) {
      this.updateIcon(this.count += by)
    }
  }

  updateIcon(count) {
    this.badge.innerText = this.count
  }

  tick(deltaTime) {
    if (this.count >= this.breedingPopulation)
      this.breedingCounter += deltaTime * (this.count / this.breedingPopulation)
    // console.log("breedingCounter", this.breedingCounter)
    if (this.canBreed) {
      if (this.breedingCounter > this.breedingRate) {
        this.breedingCounter -= this.breedingRate
        this.change(1)
      }
      let breedPercent = Math.min(((this.breedingCounter / this.breedingRate)) * 100, 100)
      this.breedbar.style.width = breedPercent + '%'
    }
    for (let need in this.needs) {
      if (!this.needs.hasOwnProperty(need)) continue
      let needObj = this.needs[need]
      needObj.counter += deltaTime * this.count * needObj.ratio
      while (needObj.counter > needObj.time) {
        needObj.counter -= needObj.time
        if (this.takeCallback(this, need, 1))
          needObj.held.push(needObj.cooldown)
      }
      let toDestroy = []
      // TODO: push domelement into here and handle ordering it to move back from here.
      for (let i = 0; i < needObj.held.length; ++i) {
        needObj.held[i] -= deltaTime
        if (needObj.held[i] < 0)
          toDestroy.push(needObj.held[i])
      }
      for (let i = 0; i < toDestroy.length; ++i) {
        toDestroy.pop()
      }
    }
  }

}
