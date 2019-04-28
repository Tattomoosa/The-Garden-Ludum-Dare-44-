let background = {
  kaleidoscopes: [],
}

class Kaleidoscope {
  constructor({
    image = 'http://placekitten.com/820/850',
    tint = 0x333333,
    sectionCount = 48,
    speed = 0.2
  }) {
    image = PIXI.Texture.fromImage(image)
    this.speed = speed
    this.maskImages = []
    this.containers = []
    this.sectionCount = sectionCount
    arc = 2 * Math.PI / sectionCount
    this.pixiContainer = new PIXI.Container()
    this.pixiContainer.position.set(width / 2, height / 2)
    for (let i = 0; i < sectionCount; ++i) {
      let section = new PIXI.Graphics()
      // mask
      section.beginFill()
      section.moveTo(width / 2, height / 2)
      section.arc(width / 2, height / 2, radius, -arc / 2, arc / 2)
      section.endFill()
      // mask image
      let maskImage = new PIXI.extras.TilingSprite(image, radius, radius)
      maskImage.tint = tint
      this.maskImages.push(maskImage)
      maskImage.mask = section
      // place container
      let container = new PIXI.Container()
      container.addChild(maskImage)
      container.addChild(section)
      container.pivot.x = width / 2
      container.pivot.y = height / 2
      container.rotation = arc * i
      container.scale.x = i % 2 ? 1 : -1
      // container.filters = [this.pixiTint]
      this.containers.push(container)

      this.pixiContainer.addChild(container)
    }
    // this.pixiContainer.filters = this.pixiTint
    app.stage.addChild(this.pixiContainer)
    this.animate()
  }

  animate() {
    app.ticker.add(() => {
      let delta = { 'x': targetPos.x - currentPos.x, 'y': targetPos.y - currentPos.y}
      targetPos = {'x': targetPos.x - (delta.x * velocity), 'y': targetPos.y - (delta.y * velocity)}
      timer += this.speed
      for (let i = 0;i < this.sectionCount; i++) {
        this.maskImages[i].tilePosition.y = targetPos.y + timer
        this.maskImages[i].tilePosition.x = targetPos.x + timer
        this.containers[i].rotation = (arc * i) + (timer / 500)
      }
    })
  }

  setTint(tint, duration = 1000 ) {
    for (let i = 0;i < this.sectionCount; i++) {
      // this.maskImages[i].tint = tint
      TweenMax.to(this.maskImages[i], duration / 1000, {pixi: {tint: tint}})
    }
  }

  setSpeed(speed, duration = 1000) {
      TweenMax.to(this, duration / 1000, { speed: speed })
  }

  setRotation(speed, duration = 1000) {
      TweenMax.to(this, duration / 1000, { speed: speed })
  }

}
