/* eslint-disable no-unused-expressions */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

class Bullet extends GameObject {
  velocity = 0

  shooterRotation = shooter.body.angle - PI / 2

  update = () => {
    this.velocity += 0.65

    const direction = p5.Vector.fromAngle(this.shooterRotation)
    const position = createVector(
      shooter.body.position.x + direction.x * (objSize * this.velocity),
      shooter.body.position.y + direction.y * (objSize * this.velocity)
    )

    this.rotate(this.shooterRotation + PI / 2)
    this.body.position.x = position.x
    this.body.position.y = position.y

    particlesEffect(
      imgBulletParticles,
      {
        x: this.body.position.x,
        y: this.body.position.y,
      },
      isMobile ? 0 : 0.000001
    )
  }
}
