/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

// This function runs when the Game Screen is ON
function gamePlay() {
  // Floating Text effects
  for (let i = 0; i < floatingTexts.length; i += 1) {
    floatingTexts[i].update()
    floatingTexts[i].render()
  }

  // Particle effects
  for (let i = 0; i < particles.length; i += 1) {
    if (particles[i]) {
      particles[i].render()
      particles[i].update()
    }
  }

  // Draw Timer! (Comment this blob of code if you don't want timer)
  if (Koji.config.strings.enableTimer && gameTimerEnabled) {
    gameTimer -= 1 / frameRate()
    drawTimer()
  }

  /* InGame UI */

  // Show and update them all
  shooter.show()

  lineOfControl.show()

  enemies.forEach(enemy => {
    enemy.show()
    enemy.update()
  })

  bullets.forEach(bullet => {
    bullet.show()
    bullet.update()
  })

  // If the bullet is in the air, don't move the shooter
  if (!shooter.shooting) {
    shooter.rotate(
      map(
        mouseX,
        shooterRotateLimit,
        width - shooterRotateLimit,
        PI / -3.5,
        PI / 3.5,
        true
      )
    )
  }

  // Spawn enemies
  spawnTimer += 1 / frameRate()
  if (spawnTimer >= 2) {
    const enemyType = random(enemyTypes)

    enemies.push(
      // spawn enemy in between these x cordinates (shooterRotateLimit, width - shooterRotateLimit)
      new Enemy(
        {
          x: random(shooterRotateLimit, width - shooterRotateLimit),
          y: 0 - objSize * 2,
        },
        { radius: objSize * enemySize },
        {
          shape: 'circle',
          image: enemyType.image,
          rotate: true,
          type: enemyType.type,
          speed: enemyType.speed,
        }
      )
    )

    spawnTimer = 0
  }

  // Enemy-Line collision
  enemies.forEach(enemy => {
    if (
      lineOfControl.didTouch(
        {
          sizing: { radius: enemy.sizing.radius },
          body: enemy.body,
        },
        'circle'
      )
    ) {
      enemy.removable = true

      particlesEffect(
        imgLife,
        {
          x: enemy.body.position.x,
          y: enemy.body.position.y,
        },
        isMobile ? 10 : 20
      )

      loseLife()
    }
  })

  // Score draw
  const scoreX = width - objSize / 2
  const scoreY = objSize / 3
  textSize(objSize * 2)
  fill(Koji.config.colors.scoreColor)
  textAlign(RIGHT, TOP)
  text(score, scoreX, scoreY)

  // Lives draw
  const lifeSize = objSize
  for (let i = 0; i < lives; i += 1) {
    image(
      imgLife,
      lifeSize / 2 + lifeSize * i,
      lifeSize / 2,
      lifeSize,
      lifeSize
    )
  }

  cleanup()
}
