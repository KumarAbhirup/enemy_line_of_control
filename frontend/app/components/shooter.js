/* eslint-disable no-unused-expressions */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

// NOTE: Turn this.shooting to false for enabling shooter to shoot again.
class Shooter extends GameObject {
  /**
   * @description Running this function shoots the bullet.
   */
  shoot = () => {
    // this.shooting = true
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
        { width: objSize * 2, height: objSize * 4 },
        { shape: 'rectangle', image: imgBullet, rotate: true }
      )
    )
  }

  // YOU MIGHT NOT NEED THIS FUNCTION! It is to bring another bullet after shooting one
  reload = () => {
    this.shooting = false
  }
}
