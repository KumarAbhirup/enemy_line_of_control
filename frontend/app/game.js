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
  bullets.forEach(bullet => {
    bullet.show()
    bullet.update()
  })

  shooter.show()

  lineOfControl.show()

  enemies.forEach(enemy => {
    enemy.show()
    enemy.update()
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
  if (spawnTimer >= 1.25) {
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

      addScore(
        -3,
        imgBulletParticles,
        {
          x: enemy.body.position.x,
          y: enemy.body.position.y,
        },
        isMobile ? 5 : 15,
        { floatingText: true }
      )

      sndLostLife.play(0, 1, 100)

      if (lives === 1) {
        setTimeout(loseLife, 1000)
      } else {
        loseLife()
      }
    }
  })

  // Enemy-Bullet collision
  enemies.forEach((enemy, index) => {
    bullets.forEach(bullet => {
      if (
        enemy.didTouch({ sizing: bullet.sizing, body: bullet.body }, 'circle')
      ) {
        enemy.removable = true
        bullet.didCollide = true

        sndEnemyHit.play(0, 1, 100)

        addScore(
          1,
          imgLife,
          {
            x: enemy.body.position.x,
            y: enemy.body.position.y,
          },
          isMobile ? 5 : 15,
          { floatingText: true }
        )
      }
    })
  })

  bullets.forEach((bullet, index) => {
    if (bullet.wentOutOfFrame()) {
      if (!bullet.didCollide) {
        sndLostLife.play(0, 1, 100)

        floatingTexts.push(
          new OldFloatingText(
            width / 2,
            height / 2 - height * 0.01,
            Koji.config.strings.bulletWastedFloatingText,
            Koji.config.colors.floatingTextColor,
            objSize * 1.2,
            2
          )
        )

        loseLife()
      }

      bullets.splice(index, 1)
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
