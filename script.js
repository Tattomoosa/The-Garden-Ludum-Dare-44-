let eventTime = 500
let script = {
  skipIntro: [
    {
      message: ".",
      iconAppear: [
        "water",
        "leaf",
        "bug",
        "frog",
        "tree",
        "cat",
        "crow"],
      resourceUpdate: { water: 1 },
      setTint: 0x22ccdd,
    },
  ],
  intro: [
    "I have something to show you.",
    {
      message: "This is a garden, of your very own.",
      // setImage: 'http://place-puppy.com/200x200',
      setTint: 0x22ccdd,
      duration: eventTime * 3,
    },
    "It is just like mine.",
    "Well, maybe a bit smaller. For now.",
    {
      message: "Everything in your garden depends on water.",
      // resourceUpdate: { water: 10 },
      iconAppear: ["water"]
    },
    {
      message: "You should create some now.",
      buttons: true,
      toAdvance(game) {
        console.log("HERE")
        return (game.resources.water.count >= 5)
      }
    },
    {
      message: "Ooh. That hurt, didn't it?",
      setTint: '#333333',
      doHurt: 20,
      duration: eventTime * 0.2,
    },
   "Creation takes a lot out of us.",
   "Something cannot come from nothing, after all.",
   "This time I will lend you some of my power",
    {
      message: "But when I am gone, you must be careful.",
      // setImage: 'http://place-puppy.com/200x200',
      setTint: 0x22ccdd,
      heal: 100,
      duration: eventTime * 2,
      // resourceUpdate: { water: 5 },
    },
    {
      message: "The presence of water will bring plants.",
      iconAppear: ["leaf"]
    },
    "Plants survive on water.",
    "One water sustains two plants.",
    "It is a tremendous responsibility, to tend such a thing.",
    "but I have faith in you.",
  ],
  tutorial: [

  ]
}
