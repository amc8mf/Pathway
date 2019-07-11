var toggleTurn = require('./ToggleTurn');
var swal = require('sweetalert2');
module.exports =  function(circle, otherCircle, clickedPosition) {

  var letterList = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];
  if(clickedPosition) {
    var currentPosition = circle.position;
    var clickedPosition = clickedPosition;

    var currentPositionColumnIndex = letterList.indexOf(circle.position[0]);
    var clickedPositionColumnIndex = letterList.indexOf(clickedPosition[0]);

    var currentPositionRowNum = parseInt(circle.position[1]);
    var clickedPositionRowNum = parseInt(clickedPosition[1]);
    var direction;

    if (currentPositionColumnIndex < clickedPositionColumnIndex) {
      direction = 'right';
    } else if (currentPositionColumnIndex > clickedPositionColumnIndex) {
      direction = 'left';
    } else if (currentPositionRowNum < clickedPositionRowNum) {
      direction = 'down';
    } else if (currentPositionRowNum > clickedPositionRowNum) {
      direction = 'up';
    }
  }

  if (direction == 'left') {
    var newPosition = letterList[letterList.indexOf(circle.position[0]) - 1] + circle.position[1];
    if(this.graph.adjList[circle.position].includes(newPosition) && newPosition != otherCircle.position) {
      circle.x -= this.xStep;
      circle.position = newPosition;
      toggleTurn.apply(this, [circle, otherCircle]);
    } else if (newPosition == otherCircle.position) {
      var newJumpPosition = letterList[letterList.indexOf(circle.position[0]) - 2] + circle.position[1];
      if (this.graph.adjList[otherCircle.position].includes(newJumpPosition)) {
      // If you are jumping over player.
        circle.position = newJumpPosition;
        circle.x -= this.xStep * 2;
        toggleTurn.apply(this, [circle, otherCircle]);
      } else {
        swal({title: 'Error', position : 'bottom-end', text : "The move you're trying to make is invalid", timer: 2000, type: 'error', toast: true, showConfirmButton: false});
      }
    }  else {
      swal({title: 'Error', position : 'bottom-end', text : "The move you're trying to make is invalid", timer: 2000, type: 'error', toast: true, showConfirmButton: false});
    }


  } else if (direction == 'right') {
    var newPosition = letterList[letterList.indexOf(circle.position[0]) + 1] + circle.position[1];
    if(this.graph.adjList[circle.position].includes(newPosition) && newPosition != otherCircle.position) {
      circle.x += this.xStep;
      circle.position = newPosition;
      toggleTurn.apply(this, [circle, otherCircle]);
    } else if (newPosition == otherCircle.position) {
      var newJumpPosition = letterList[letterList.indexOf(circle.position[0]) + 2] + circle.position[1];
      if (this.graph.adjList[otherCircle.position].includes(newJumpPosition)) {
        circle.position = newJumpPosition;
        circle.x += this.xStep * 2;
        toggleTurn.apply(this, [circle, otherCircle]);
      } else {
        swal({title: 'Error', position : 'bottom-end', text : "The move you're trying to make is invalid", timer: 2000, type: 'error', toast: true, showConfirmButton: false});
      }
    } else {
      swal({title: 'Error', position : 'bottom-end', text : "The move you're trying to make is invalid", timer: 2000, type: 'error', toast: true, showConfirmButton: false});
    }


  } else if (direction == 'up') {
    var newPosition = circle.position[0] + (parseInt(circle.position[1]) - 1);
    if(this.graph.adjList[circle.position].includes(newPosition) && newPosition != otherCircle.position) {
      circle.y -= this.yStep;
      circle.position = newPosition;
      toggleTurn.apply(this, [circle, otherCircle]);
      if (newPosition[1] == 1 && circle.player == 1) {
        swal({title: 'Winner', text : "You've won the game! Congratulations", type : 'success'}).then(function(response) {
          if (response.value == true) location.reload();
        });
      }
    } else if (newPosition == otherCircle.position) {
      var newJumpPosition = circle.position[0] + (parseInt(circle.position[1]) - 2);
      if (this.graph.adjList[otherCircle.position].includes(newJumpPosition)) {
        circle.position = newJumpPosition;
        circle.y -= this.yStep * 2;
        toggleTurn.apply(this, [circle, otherCircle]);
        if (newJumpPosition[1] == 1 && circle.player == 1) {
          swal({title: 'Winner', text : "You've won the game! Congratulations", type : 'success'}).then(function(response) {
            if (response.value == true) location.reload();
          });
        }
      } else {
        swal({title: 'Error', position : 'bottom-end', text : "The move you're trying to make is invalid", timer: 2000, type: 'error', toast: true, showConfirmButton: false});
      }
    } else {
      swal({title: 'Error', position : 'bottom-end', text : "The move you're trying to make is invalid", timer: 2000, type: 'error', toast: true, showConfirmButton: false});
    }


  } else if (direction == 'down') {
    var newPosition = circle.position[0] + (parseInt(circle.position[1]) + 1);
    if(this.graph.adjList[circle.position].includes(newPosition) && newPosition != otherCircle.position) {
      circle.y += this.yStep;
      circle.position = newPosition;
      if (newPosition[1] == 9 && circle.player == 2) {
        swal({title: 'Winner', text : "You've won the game! Congratulations", type : 'success'}).then(function(response) {
          if (response.value == true) location.reload();
        });
      }
      toggleTurn.apply(this, [circle, otherCircle]);
    } else if (newPosition == otherCircle.position) {
      var newJumpPosition = circle.position[0] + (parseInt(circle.position[1]) + 2);
      if (this.graph.adjList[otherCircle.position].includes(newJumpPosition)) {
        circle.position = newJumpPosition;
        circle.y += this.yStep * 2;
        toggleTurn.apply(this, [circle, otherCircle]);
        if (newJumpPosition[1] == 9 && circle.player == 2) {
          swal({title: 'Winner', text : "You've won the game! Congratulations", type : 'success'}).then(function(response) {
            if (response.value == true) location.reload();
          });
        }
      } else {
        swal({title: 'Error', position : 'bottom-end', text : "The move you're trying to make is invalid", timer: 2000, type: 'error', toast: true, showConfirmButton: false});
      }
    } else {
      swal({title: 'Error', position : 'bottom-end', text : "The move you're trying to make is invalid", timer: 2000, type: 'error', toast: true, showConfirmButton: false});
    }
  }
}
