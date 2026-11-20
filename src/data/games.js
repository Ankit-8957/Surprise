/**
 * Data and Questions for Planet of Fun 🎮 (3 Mini-Games)
 */

export const GAMES_DATA = {
  // GAME A: Catch the Hearts
  catchGame: {
    durationSeconds: 20,
    targetScore: 12,
    titles: {
      high: "Cosmic Heart Collector 💖",
      medium: "Certified Sweetheart 🌸",
      starter: "Warm Hugger ✨"
    },
    messages: {
      high: "Incredible reflexes! You caught so many cosmic hearts. You've officially unlocked unlimited real-life hugs!",
      medium: "Awesome job! Every single heart you caught is a reminder of how cherished you are.",
      starter: "Cute effort! Even the stars were cheering for you. Play again anytime!"
    }
  },

  // GAME B: How Well Do You Know Me?
  quizGame: {
    questions: [
      {
        question: "Why was this entire universe coded from scratch?",
        options: [
          "To practice some boring software algorithms",
          "Because Priyanka makes my world beautiful and deserves something unique ❤️",
          "By complete accident when my cat stepped on the keyboard",
          "To enter a hackathon competition"
        ],
        correctIndex: 1,
        feedback: "Bingo! Exactly right. It was crafted with pure love, just to make you smile. 🥰"
      },
      {
        question: "What is my absolute favourite notification on my phone?",
        options: [
          "A battery low alert",
          "A LinkedIn marketing email",
          "Seeing 'Priyanka' pop up on the screen ✨",
          "A software update reminder"
        ],
        correctIndex: 2,
        feedback: "100%! Nothing beats the instant smile when your name lights up my phone. 📱💫"
      },
      {
        question: "How many reasons why you're special are hidden across this galaxy?",
        options: [
          "Only 1 (I ran out of ideas)",
          "Exactly 30 original reasons (and counting!) 🌟",
          "404 reasons not found",
          "Zero, you have to guess them all"
        ],
        correctIndex: 1,
        feedback: "Spot on! 30 heartfelt reasons waiting on the Planet of Appreciation! ⭐"
      },
      {
        question: "If I could teleport to you right now, what would I bring?",
        options: [
          "A stack of math homework",
          "A cold cup of decaf water",
          "Your favourite treats and the warmest hug ever 🤗",
          "A lecture on computer hardware"
        ],
        correctIndex: 2,
        feedback: "Aww yes! The biggest, warmest hug and all your favourite goodies. 🍫"
      },
      {
        question: "What is the most important secret this entire universe holds for you?",
        options: [
          "Always restart your router when Wi-Fi fails",
          "You are deeply appreciated, endlessly special, and truly adored ❤️",
          "Remember to drink 8 glasses of water",
          "Don't click random links on the internet"
        ],
        correctIndex: 1,
        feedback: "Never, ever forget that. You mean the entire world to me! 🪐💖"
      }
    ],
    results: {
      perfect: "Cosmic Soulmate (5/5) 🏆✨",
      perfectMsg: "You know this universe by heart! You are officially the queen of this galaxy.",
      great: "Galactic Cutie (4/5) 🌸",
      greatMsg: "Almost perfect! You pay attention to all the sweetest little details.",
      fun: "Lovely Star Explorer ⭐",
      funMsg: "You played with so much charm! You get infinite love points anyway."
    }
  },

  // GAME C: Unlock the Secret
  secretPuzzle: {
    hint: "Enter the cosmic 4-key sequence by matching the constellation symbols in order:",
    sequence: [
      { id: "star", symbol: "⭐", name: "Starlight" },
      { id: "heart", symbol: "💖", name: "Love" },
      { id: "moon", symbol: "🌙", name: "Dream" },
      { id: "planet", symbol: "🪐", name: "Universe" }
    ],
    unlockedMessage: {
      title: "Secret Constellation Unlocked! 🌌",
      quote: "No matter how vast the cosmos is, the most beautiful thing in it will always be the way you light up my life.",
      badge: "Cipher Solved With Love 🗝️✨"
    }
  }
};
