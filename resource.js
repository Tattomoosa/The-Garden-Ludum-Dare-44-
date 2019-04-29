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
    this.returnWaterCallback = callbacks.returnWater
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
    // Breed
    if (this.canBreed) {
      if (this.breedingCounter > this.breedingRate) {
        this.breedingCounter -= this.breedingRate
        this.change(1)
      }
      let breedPercent = Math.min(((this.breedingCounter / this.breedingRate)) * 100, 100)
      this.breedbar.style.width = breedPercent + '%'
    }
    // Take
    for (let need in this.needs) {
      // take needs
      if (!this.needs.hasOwnProperty(need)) continue
      let needObj = this.needs[need]
      needObj.counter += deltaTime * this.count * needObj.ratio
      while (needObj.counter > needObj.time) {
        needObj.counter -= needObj.time
        let domElement = this.takeCallback(this, need, 1)
        if (domElement)
          needObj.held.push({
            name: need,
            cooldown: needObj.cooldown,
            domElement: domElement
          })
        else
          this.change(-1)
      }
      // return/destroy needs
      let toDestroy = []
      for (let i = 0; i < needObj.held.length; ++i) {
        needObj.held[i].cooldown -= deltaTime
        if (needObj.held[i].cooldown < 0) toDestroy.push(i)
      }
      for (let i = toDestroy.length - 1; i >= 0; --i) {
        let index = toDestroy.pop()
        let domElement = needObj.held[index].domElement;
        if (needObj.held[index].name == 'water') {
          this.returnWaterCallback(domElement, 1);
        } else {
          domElement.style.top = '40%'
          domElement.classList.add('hidden')
        }
        setTimeout(() => { domElement.parentNode.removeChild(domElement) }, 8000)
        // does this work?
        for (let j = index; j > 0; --j) {
          let domElement = needObj.held[j].domElement
          let left = domElement.style.left.replace('px', '')
          let top = domElement.style.left.replace('px', '')
          console.log(left, top)
          domElement.style.left = (left + 2) + 'px'
          domElement.style.top = (top + 2) + 'px'
        }

        // console.log(needObj.held[index])
        needObj.held.splice(index, 1)
      }
    }
  }

}
