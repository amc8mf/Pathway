module.exports = (circle, otherCircle, toggle) => {
  if (toggle == true ) {
  	// Make scoreboard show Player 2's turn.
    document.getElementById('playerTurn').innerText = "Player 2's turn";
  } else {
  	// Make scoreboard show Player 1's turn.
    document.getElementById('playerTurn').innerText = "Player 1's turn";
  }
  // Update boolean variable 'turn' for each circle.
  circle.turn = !circle.turn;
  otherCircle.turn = !otherCircle.turn;
}
