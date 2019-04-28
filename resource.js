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

    }
  }

}
