let eventTime = 500
let script = {
  skipIntro: [
    {
      message: ".",
      iconAppear: [
        "water",
        "leaf",
        // "bug",
        // "frog",
        // "tree",
        // "cat",
        // "crow"
      ],
      resourceUpdate: { water: 1, leaf: 9 },
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
    },
    {
      message: "You should create some now.",
      iconAppear: ["water"],
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
      message: "But when you are alone you must be careful.",
      // setImage: 'http://place-puppy.com/200x200',
      setTint: 0x22ccdd,
      heal: 100,
      duration: eventTime * 2,
      // resourceUpdate: { water: 5 },
    },
    {
      message: "The presence of water will bring plants.",
      iconAppear: ["leaf"],
      resourceUpdate: { leaf: 5 },
    },
    "Plants will periodically drink water.",
    "Water is returned once it is used, ",
    "But if a plant can't find any water to drink, it will die.",
    "Plants will slowly reproduce on their own.",
    "I will return once you have 10 plants.",
    ],
  bugs: [
   "Very good.",
    {
      message: "Bugs have come to eat the plants",
      iconAppear: ["bug"],
      resourceUpdate: { bug: 5 },
    },
    "They still require water, too... but not much.",
    "Plants do not return once consumed the way the water does.",
    "Once eaten, plants are gone for good.",
    "Finding balance is the key to a successful garden.",
    "It is a tremendous responsibility, to tend such a thing.",
    "but I have faith in you.",
  ],
  frogs: [
    {
      message: "Frogs have appeared to eat the bugs",
      iconAppear: ["frog"],
      resourceUpdate: {frog: 5}
    },
    "Be careful, if any species go extinct...",
    "Well. Please don't let that happen."
  ],

}
