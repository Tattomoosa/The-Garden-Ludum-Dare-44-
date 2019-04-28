let arc
let sectionCount = 36
let width = document.querySelector('#background').clientWidth;
let height = document.querySelector('#background').clientHeight;
let colors = [
  0xff9977,
  0x937397,
  0x93ff97,
  0x35a9ff,
]
let kaleidoscopes = []
let maskImages = []
let containers = []
let radius = 4000
let currentPos = { x : 0, y : 0 }
let targetPos = { x : 0, y : 0 }
let velocity = 0.5
let timer = 0

// PIXI setup
const app = new PIXI.Application({
  autoResize: true,
  resolution: devicePixelRatio,
  antialias: true
})
document.querySelector('#background').appendChild(app.view)

// Resize
function resize() {
  const parent = app.view.parentNode
  width = parent.clientWidth
  height = parent.clientHeight
  app.renderer.resize(width, height)
  for (let i = 0; i < kaleidoscopes.length; ++i) {
    kaleidoscopes[i].pixiContainer.position.set(width / 2, height / 2)
  }
}
resize()
window.addEventListener('resize', resize)
// Done
