let scriptIndex = 0
let activeScene = {
  scene: script.intro,
  index: 0,
  isActive: true,
  current() {
    return this.scene[this.index]
  }
}
let busy = false;

let scene = {
  continue() {
    // if (!activeScene.isActive) return;
    ++activeScene.index
    this.redraw()
  },
  redraw() {
    let message = document.querySelector('#message')
    // if (typeof
    message.classList.add('hidden')
    busy = true;
    setTimeout(() => {
      let current = activeScene.current()
      let text = current.message || current
      message.innerText = text
      if (activeScene.scene.length <= activeScene.index + 1) {
        activeScene.sceneName = ''
        activeScene.isActive = false
      }
      setTimeout(() => {
        message.classList.remove('hidden')
        busy = false;
      }, 1000)
    }, 1000);
  },
}

window.addEventListener('click', (event) => {
  if (!busy)
    scene.continue()
})
