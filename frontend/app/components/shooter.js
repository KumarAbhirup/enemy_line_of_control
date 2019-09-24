/* eslint-disable no-unused-expressions */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

// NOTE: Turn this.shooting to false for enabling shooter to shoot again.
class Shooter extends GameObject {
  /**
   * @description Running this function shoots the bullet.
   */
  shoot = () => {
    bullets.push(
      new Bullet(
        {
          x: map(
            mouseX,
            shooterRotateLimit,
            width - shooterRotateLimit,
            width / 2 + objSize * 0.05,
            width / 2 - objSize * 0.05,
            true
          ),
          y: height - objSize * 1.6,
        },
        { radius: objSize * (isMobileSize ? 0.5 : 1) },
        { shape: 'circle', image: imgBullet, rotate: true }
      )
    )

    this.body.position.y -= 10
    this.body.position.y += 10
  }
}
