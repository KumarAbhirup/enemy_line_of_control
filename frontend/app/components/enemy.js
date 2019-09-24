/* eslint-disable no-unused-expressions */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

class Enemy extends GameObject {
  update = () => {
    // Move the enemy forward!
    this.body.position.y += objSize * 0.05
  }
}
