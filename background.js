let background = {
  kaleidoscopes: [],
}

class Kaleidoscope {

  constructor() {
    this.maskImages = []
    this.containers = []
    arc = 2 * Math.PI / sectionCount
    this.pixiContainer = new PIXI.Container()
    this.pixiContainer.position.set(width / 2, height / 2)
    for (let i = 0; i < sectionCount; ++i) {
      let section = new PIXI.Graphics()
      section.beginFill(colors[i])
      section.moveTo(width / 2, height / 2)
      section.arc(width / 2, height / 2, radius, -arc / 2, arc / 2)
      section.endFill()
      // 
      let maskImage = new PIXI.extras.TilingSprite(image, radius, radius)
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
      this.containers.push(container)

      this.pixiContainer.addChild(container)
    }
    app.stage.addChild(this.pixiContainer);
  }

  animate() {
    app.ticker.add(() => {
      let delta = { 'x': targetPos.x - currentPos.x, 'y': targetPos.y - currentPos.y}
      targetPos = {'x': targetPos.x - (delta.x * velocity), 'y': targetPos.y - (delta.y * velocity)}
      timer += 0.3
      for (let i = 0;i < sectionCount; i++) {
        this.maskImages[i].tilePosition.y = targetPos.y + timer
        this.maskImages[i].tilePosition.x = targetPos.x + timer
        this.containers[i].rotation = (arc * i) + (timer / 1000)
      }
    })
  }
}
