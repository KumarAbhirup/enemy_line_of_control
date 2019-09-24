/* eslint-disable no-empty */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable prefer-const */

// Strict Stuffs (EDITING THESE WILL MAKE GAME CRASH)
let myFont // The font we'll use throughout the app

let gameOver = false // If it's true the game will render the main menu
let gameBeginning = true // Should be true only before the user starts the game for the first time

let gameStart = false // Becomes true after a moment when game initializes

let canEnd = false

// Effects
let floatingTexts = []
let particles = []

// Game Objects (READ-ONLY)
let shooter
let lineOfControl
let enemies = []
let bullets = []

// Game Stuffs (READ-N-WRITE)
let shooterRotateLimit
let enemySize
let enemyTypes = []

// Buttons
let playButton
let soundButton
let leaderboardButton
let endButton

// Score data
let startingLives
let scoreGain
let highscoreGained
let highScore
let score = 0

// Data taken from Game Settings
let comboTexts = []

// Images
let imgShooter
let imgBullet
let imgBulletParticles
let imgEnemies = []

let imgLife
let imgBackground

// Audio
let sndMusic
let sndTap
let sndMatch
let sndEnd
let sndEnemyHit
let sndExplosion
let sndLostLife

let soundEnabled = true
let canMute = true

let soundImage
let muteImage

// Timer
let startingGameTimer
let gameTimer
let gameTimerEnabled = false
let gameOverRectangleHeight = 0 // for game over animation

let canScore = false

// Custom timers
let spawnTimer = 0

// Size stuff
let objSize // Base size modifier of all objects, calculated based on screen size

/**
 * @description Game size in tiles
 * using bigger numbers will decrease individual object sizes but allow more objects to fit the screen
 * Keep in mind that if you change this, you might need to change text sizes as well
 */
const gameSize = 18

// Mobile
let isMobile = false // check if it really is mobile
let isMobileSize = false // check if the browser is mobile size
let touching = false // Whether the user is currently touching/clicking

// Load assets
function preload() {
  // Load font from google fonts link provided in game settings
  const link = document.createElement('link')
  link.href = Koji.config.strings.fontFamily
  link.rel = 'stylesheet'
  document.head.appendChild(link)
  myFont = getFontFamily(Koji.config.strings.fontFamily)
  const newStr = myFont.replace('+', ' ')
  myFont = newStr

  // Load background if there's any
  if (Koji.config.images.background !== '') {
    imgBackground = loadImage(Koji.config.images.background)
  }

  // Load images
  imgShooter = loadImage(Koji.config.images.shooterImage)
  imgBullet = loadImage(Koji.config.images.bulletImage)
  imgBulletParticles = loadImage(Koji.config.images.bulletParticles)
  imgEnemies[0] = loadImage(Koji.config.images.enemyImage1)
  imgEnemies[1] = loadImage(Koji.config.images.enemyImage2)
  imgEnemies[2] = loadImage(Koji.config.images.enemyImage3)

  imgLife = loadImage(Koji.config.images.lifeIcon)
  soundImage = loadImage(Koji.config.images.soundImage)
  muteImage = loadImage(Koji.config.images.muteImage)

  /**
   * Load Sounds here
   * Include a simple IF check to make sure there is a sound in config, also include a check when you try to play the sound, so in case there isn't one, it will just be ignored instead of crashing the game
   * Music is loaded in setup(), to make it asynchronous
   */
  if (Koji.config.sounds.tap) sndTap = loadSound(Koji.config.sounds.tap)
  if (Koji.config.sounds.match) sndMatch = loadSound(Koji.config.sounds.match)
  if (Koji.config.sounds.end) sndEnd = loadSound(Koji.config.sounds.end)
  if (Koji.config.sounds.enemyHit)
    sndEnemyHit = loadSound(Koji.config.sounds.enemyHit)
  if (Koji.config.sounds.explosion)
    sndExplosion = loadSound(Koji.config.sounds.explosion)
  if (Koji.config.sounds.life) sndLostLife = loadSound(Koji.config.sounds.life)
  if (Koji.config.sounds.enemyDestroy)
    sndEnemyHit = loadSound(Koji.config.sounds.enemyHit)

  // Load settings from Game Settings
  scoreGain = parseInt(Koji.config.strings.scoreGain)
  startingLives = parseInt(Koji.config.strings.lives)
  comboTexts = Koji.config.strings.comboText.split(',')
  startingGameTimer = parseInt(Koji.config.strings.gameTimer)
  lives = startingLives

  // Timer stuff
  if (startingGameTimer <= 0) {
    gameTimer = 99999
    gameTimerEnabled = false
  } else {
    gameTimer = startingGameTimer
    gameTimerEnabled = true
  }
}

// Instantiate objects here
function instantiate() {
  // Shooter
  shooterRotateLimit = isMobileSize ? objSize * 3 : objSize * 7
  shooter = new Shooter(
    { x: width / 2, y: height - objSize * 2 },
    { width: 2 * objSize, height: 4 * objSize },
    {
      shape: 'rectangle',
      image: imgShooter,
      color: { r: 255, g: 255, b: 255 },
      rotate: true,
    }
  )

  // Line of Control
  lineOfControl = new Line(
    { x: 0, y: height * 0.55 },
    { x: width, y: height * 0.55 },
    { color: '#ffffff', strokeWeight: 2, shape: 'line', alpha: 0.3 }
  )

  // Enemy size
  enemySize = isMobileSize ? 1 : 1.5

  // Enemy types
  enemyTypes = [
    {
      type: 0,
      image: imgEnemies[0],
      speed: objSize * 0.04,
    },
    {
      type: 1,
      image: imgEnemies[1],
      speed: objSize * 0.06,
    },
    {
      type: 2,
      image: imgEnemies[2],
      speed: objSize * 0.08,
    },
  ]
}

// Setup your props
function setup() {
  width = window.innerWidth
  height = window.innerHeight

  // How much of the screen should the game take, this should usually be left as it is
  let sizeModifier = 0.75
  if (height > width) {
    sizeModifier = 1
  }

  createCanvas(width, height)

  // Magically determine basic object size depending on size of the screen
  objSize = floor(
    min(floor(width / gameSize), floor(height / gameSize)) * sizeModifier
  )

  isMobile = detectMobile()
  isMobileSize = detectMobileSize()

  textFont(myFont) // set our font
  document.body.style.fontFamily = myFont

  playButton = new PlayButton()
  soundButton = new SoundButton()
  leaderboardButton = new LeaderboardButton()
  endButton = new EndButton()

  instantiate()

  gameBeginning = true

  /**
   * Load music asynchronously and play once it's loaded
   * This way the game will load faster
   */
  if (Koji.config.sounds.backgroundMusic)
    sndMusic = loadSound(Koji.config.sounds.backgroundMusic, () =>
      playMusic(sndMusic, 0.4, false)
    )
}

// An infinite loop that never ends in p5
function draw() {
  // Manage cursor - show it on main menu, and hide during game, depending on game settings
  if (!gameOver && !gameBeginning) {
    if (!Koji.config.strings.enableCursor) {
      noCursor()
    }
  } else {
    cursor(ARROW)
  }

  // Draw background or a solid color
  if (imgBackground) {
    background(imgBackground)
  } else {
    background(Koji.config.colors.backgroundColor)
  }

  // Draw UI
  if (gameOver || gameBeginning) {
    gameBeginningOver()
  } else {
    gamePlay()
  }

  soundButton.render()
}

/**
 * Go through objects and see which ones need to be removed
 * A good practive would be for objects to have a boolean like removable, and here you would go through all objects and remove them if they have removable = true;
 */
function cleanup() {
  for (let i = 0; i < floatingTexts.length; i += 1) {
    if (floatingTexts[i].timer <= 0) {
      floatingTexts.splice(i, 1)
    }
  }

  for (let i = 0; i < particles.length; i += 1) {
    if (particles[i].removable) {
      particles.splice(i, 1)
    }
  }

  for (let i = 0; i < bullets.length; i += 1) {
    if (bullets[i].wentOutOfFrame()) {
      bullets.splice(i, 1)
    }
  }

  for (let i = 0; i < enemies.length; i += 1) {
    if (enemies[i].removable) {
      enemies.splice(i, 1)
    }
  }
}

// Call this when a lose life event should trigger
function loseLife() {
  // eslint-disable-next-line no-plusplus
  lives--

  if (lives <= 0) {
    gameOver = true
    checkHighscore()

    if (score > parseInt(Koji.config.strings.minimumScoreToSave)) {
      submitScore(score)
    }
  }
}

// Handle input
function touchStarted() {
  if (gameOver || gameBeginning) {
  }

  if (soundButton.checkClick()) {
    toggleSound()
    return
  }

  if (!gameOver && !gameBeginning) {
    // InGame
    touching = true

    if (canEnd) {
      gameOver = true

      if (score > parseInt(Koji.config.strings.minimumScoreToSave)) {
        submitScore(score)
      }
    }
  }
}

function touchEnded() {
  // This is required to fix a problem where the music sometimes doesn't start on mobile
  if (soundEnabled) {
    if (getAudioContext().state !== 'running') {
      getAudioContext().resume()
    }
  }

  touching = false

  if (!shooter.shooting && isMobile) shooter.shoot() // shoot when touch ended on mobile
}

// Key pressed and released
function keyPressed() {
  if (!gameOver && !gameBeginning) {
    // Ignore this complete if statement. It is just for testing purposes. You don't even need to remove this code anyway.
    if (Koji.config.strings.trialTesting) {
      if (key === '-') {
        loseLife()
      }

      if (keyCode === ENTER) {
        addScore(
          1,
          imgLife,
          {
            x: random(0, width),
            y: random(0, height),
          },
          10,
          { floatingText: true }
        )
      }

      if (key === ' ') {
        particlesEffect(
          imgLife,
          {
            x: width / 2,
            y: height / 2,
          },
          10
        )
      }
    }
  }
}

function keyReleased() {
  if (!gameOver && !gameBeginning) {
    // if (key === ' ' || keyCode === ENTER || keyCode === UP_ARROW) {
    //   if (!shooter.shooting) shooter.shoot() // shoot by keys on desktop
    // }
  }
}

// Mouse Clicked
function mouseClicked() {
  if (!gameOver && !gameBeginning) {
    if (!shooter.shooting && !isMobile) shooter.shoot() // shoot by mouse click on desktop
  }
}

/**
 * Call this every time you want to start or reset the game
 * This is a good place to clear all arrays like enemies, bullets etc before starting a new game
 */
function init() {
  gameOver = false

  lives = startingLives
  highscoreGained = false
  score = 0

  gameTimer = startingGameTimer
  gameOverRectangleHeight = 0

  floatingTexts = []
  particles = []

  // Keep everyone at their original place
  instantiate()
  enemies = []
  bullets = []

  floatingTexts.push(
    new OldFloatingText(
      width / 2,
      height / 2 - height * 0.01,
      Koji.config.strings.gameStartedFloatingText,
      Koji.config.colors.floatingTextColor,
      objSize * 1.2,
      2
    )
  )

  canScore = false
  canEnd = false

  // set score to zero if score increases mistakenly
  setTimeout(() => {
    score = 0
    gameStart = true
  }, 1000)
}
