let music = new Howl({
  src: ['ld44.mp3'],
  loop: true,

})
music.play()

function recoverMusic(time) {
    let steps = 100;
    let delay = time/2;
    for (let i = 0; i <= steps; ++i) {
      setTimeout(() => {
        let rate = 0.5 + (i/steps/2)
        if (music.rate() < rate)
          music.rate(rate)
      }, delay + time * (i * (1000/steps)))
    }
  // setTimeout(() => music.rate(1), delay + time * 1000)
}
