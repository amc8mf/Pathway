
module.exports = function(circle, otherCircle) {
  var movePlayer = require('./MovePlayer');
  if (this.toggle == true) {
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

  // Code below accounts for when the pawn has an option to jump over other pawn.
  var position = otherCircle.position;
  var possibleMoves = this.graph.adjList[position];
  var tempMoves = [];
  var letterList = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

  var self = this;
  possibleMoves.forEach(function(move) {
    if (move == circle.position) {
      debugger;
      var firstCircleColumnIndex = letterList.indexOf(otherCircle.position[0]);
      var secondCircleColumnIndex = letterList.indexOf(circle.position[0]);
      var firstCircleRowNum = parseInt(otherCircle.position[1]);
      var secondCircleRowNum = parseInt(circle.position[1]);

      if (firstCircleColumnIndex < secondCircleColumnIndex) {
          move = letterList[firstCircleColumnIndex + 2] + move[1];
          // Checks to make sure a wall isnt there.
          if (!self.graph.adjList[circle.position].includes(move)) {
            return;
          }
      } else if (firstCircleColumnIndex > secondCircleColumnIndex) {
        move = letterList[firstCircleColumnIndex - 2] + move[1];
        if (!self.graph.adjList[circle.position].includes(move)) {
          return;
        }
      } else if (firstCircleRowNum > secondCircleRowNum) {
          move = otherCircle.position[0] + (firstCircleRowNum - 2);
          if (!self.graph.adjList[circle.position].includes(move)) {
            return;
          }
      } else if (firstCircleRowNum < secondCircleRowNum) {      
        move = otherCircle.position[0] + (firstCircleRowNum + 2);
        if (!self.graph.adjList[circle.position].includes(move)) {
          return;
        }
      }
    }
    tempMoves.push(move);

  })

  Crafty("Primary").each(function() {
    this.unbind('Click');
  })

  Crafty("Primary").each(function() {
    if (tempMoves.includes(this.name) && !self.wallArray.includes(this.name)) {
      this.color('yellow');
      this.bind('Click', function() {
        movePlayer.apply(self, [otherCircle, circle, this.name]);
      });
    } else {
      this.color('gray');
    }
  });
}
