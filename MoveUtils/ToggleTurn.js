module.exports = function(circle, otherCircle, toggle) {
  if (this.toggle == true ) {
  	// Make scoreboard show Player 2's turn.
    document.getElementById('playerTurn').innerText = "Player 2's turn";
  } else {
  	// Make scoreboard show Player 1's turn.
    document.getElementById('playerTurn').innerText = "Player 1's turn";
  }
  // Used for the scoreboard
  this.toggle = !this.toggle;
  // Update boolean variable 'turn' for each circle.
  circle.turn = !circle.turn;
  otherCircle.turn = !otherCircle.turn;
  var position = otherCircle.position;
  var possibleMoves = this.graph.adjList[position];
  Crafty("Primary").each(function() {
    if (possibleMoves.includes(this.name)) {
      this.color('yellow');
    } else {
      this.color('gray');
    }
  });
}
