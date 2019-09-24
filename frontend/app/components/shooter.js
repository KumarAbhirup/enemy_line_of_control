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
        { x: shooter.body.position.x, y: shooter.body.position.y },
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
