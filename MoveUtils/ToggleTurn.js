module.exports = (circle, otherCircle) => {
  if (this.toggle == true ) {
    document.getElementById('playerTurn').innerText = "Player 2's turn";
  } else {
    document.getElementById('playerTurn').innerText = "Player 1's turn";
  }
  this.toggle = !this.toggle;
  circle.turn = !circle.turn;
  otherCircle.turn = !otherCircle.turn;
}
