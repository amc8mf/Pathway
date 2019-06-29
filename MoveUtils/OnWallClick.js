var swal = require('sweetalert2');
var defineWallName = require('../GraphUtils/DefineWallName');
var toggleTurn = require('../MoveUtils/ToggleTurn');

module.exports = function(clickedSquare, squareWidth, greenCircle, blueCircle) {
  var wallWidth;
  var wallHeight;
  const letterList = ['Z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];
  var removeEdges = (wallName) => {
    // Store the current state of our graph so in case are wall does not pass validation, we can revert our updates in
    // the graph that occur throughout this function.
    this.placeHolderGraph = JSON.parse(JSON.stringify(this.graph.adjList));
    if (!this.wallArray.includes(wallName)) {
      // Exclude this wall from being placed again.
      this.wallArray.push(wallName);
      var letterList = ['Z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];
      var wallColumn = wallName.charAt(0);
      var wallRow = wallName.charAt(1);
      
      // The wall column and wall row is the starting point of the wall. For vertical walls, this is the top wall tile.
      // For horizontal walls, this is the left wall tile.

      // For vertical walls we need to take away moves in the right direction for 2 tiles on the left of the wall.
      // Also need to take away moves in the left direction for the 2 tiles on right side of wall.

      // For horizontal walls we need to take away moves in the north direction for 2 tiles on the bottom of the wall.
      // Also need to take away moves in the south direction for the 2 tiles on top side of wall.
      
      // Walls are defined based on the left most column they are in between, and the top most row they are in between.
      // They are also given an indicator of their direction. Ex: A1h, B2v.
      var direction = wallName.charAt(2);
      if (direction == 'v') {
        // If the wall to be placed is vertical.
        // Also, push any walls that are invalid based on intersections with the wall we are currently adding.
        // First we add the wall that intersects horizontally.
        // There are also 2 vertical walls that are no longer valid because they would overlap with half of this vertical wall.
        var intersectWall = letterList[letterList.indexOf(wallColumn) - 1] + (parseInt(wallRow) + 1) + 'h';
        this.wallArray.push(intersectWall);
        var upWall = wallColumn + (parseInt(wallRow) + 1) + 'v';
        this.wallArray.push(upWall);
        var downWall = wallColumn + (parseInt(wallRow) - 1) + 'v';
        this.wallArray.push(downWall);
        // A vertical wall on the perimiter of the left or right side is invalid so return nothing.
        if (wallColumn == 'Z') return;
        wallRow = parseInt(wallRow) + 1;
        var graphKey = wallColumn + wallRow;
        // This key defines the name of the tile to the top left of the starting point of wall.
        // Note that the upper left tile name is the same as the wall tile name. 
        var upperLeftGraphKey = wallColumn + wallRow;
        // Grab possible moves from this tile.
        
        possibleMoves = this.graph.adjList[upperLeftGraphKey];
        // Define name of neighboring tile that we need to remove from possible moves array attached to upper-left tile.
        // In this case, we are taking the dimensions of the upper-left tile and shifting one column to the right. (Ex: deleting B1 from A1's possible moves).
        var vertexToDelete = letterList[letterList.indexOf(wallColumn) + 1] + wallRow;
        // Get the index of the neighboring tile to delete.
        var vertexIndex = possibleMoves.indexOf(vertexToDelete);
        // Remove neighboring tile from array.
        possibleMoves.splice(vertexIndex, 1);

        // Delete move to the right from bottom left tile.
        // Now we take the same wall column but shift down one row by iterating up on the 2nd part of the name(A1 -> A2).
        var bottomLeftGraphKey = wallColumn + (parseInt(wallRow) + 1);
        possibleMoves = this.graph.adjList[bottomLeftGraphKey];
        // With the origin of the wall being the top tile, we shift right one column and we shift down one row to(Ex: deleting B2 from A2's possible moves).
        vertexToDelete = letterList[letterList.indexOf(wallColumn) + 1] + (parseInt(wallRow) + 1);
        vertexIndex = possibleMoves.indexOf(vertexToDelete);
        possibleMoves.splice(vertexIndex, 1);

        // Delete move to the left from upper right tile
        var upperRightGraphKey = letterList[letterList.indexOf(wallColumn) + 1] + wallRow;
        possibleMoves = this.graph.adjList[upperRightGraphKey];
        vertexToDelete = wallColumn + wallRow;
        vertexIndex = possibleMoves.indexOf(vertexToDelete);
        possibleMoves.splice(vertexIndex, 1);

        // delete move ot the left from bottom right tile
        var bottomRightGraphKey = letterList[letterList.indexOf(wallColumn) + 1] + (parseInt(wallRow) + 1);
        possibleMoves = this.graph.adjList[bottomRightGraphKey];
        vertexToDelete = wallColumn + (parseInt(wallRow) + 1);
        vertexIndex = possibleMoves.indexOf(vertexToDelete);
        possibleMoves.splice(vertexIndex, 1);
      } else {
        // If the wall to be placed is horizontal.
        // Remove the vertically intersecting wall.
        // Remove 2 overlapping horizontal walls.
        var intersectWall = letterList[letterList.indexOf(wallColumn) + 1] + (parseInt(wallRow) - 1) + 'v';
        this.wallArray.push(intersectWall);
        var leftWall = letterList[letterList.indexOf(wallColumn) - 1] + wallRow + 'h';
        this.wallArray.push(leftWall);
        var rightWall = letterList[letterList.indexOf(wallColumn) + 1] + wallRow + 'h';
        this.wallArray.push(rightWall);
        if (wallRow == '0' || wallRow == '9') return;
        wallColumn = letterList[letterList.indexOf(wallColumn) + 1];
        var graphKey = wallColumn + wallRow;
        var possibleMoves = this.graph.adjList[graphKey];
        
        // Delete move down from top left tile.
        var vertexToDelete = wallColumn + (parseInt(wallRow) + 1);
        var vertexIndex = possibleMoves.indexOf(vertexToDelete);
        possibleMoves.splice(vertexIndex, 1);

        // Delete move up from bottom left tile.
        var bottomLeftGraphKey = wallColumn + (parseInt(wallRow) + 1);
        possibleMoves = this.graph.adjList[bottomLeftGraphKey];
        vertexToDelete = wallColumn + wallRow;
        vertexIndex = possibleMoves.indexOf(vertexToDelete);
        possibleMoves.splice(vertexIndex, 1);

        // Delete move down from upper right tile.
        var upperRightGraphKey = letterList[letterList.indexOf(wallColumn) + 1] + wallRow;
        possibleMoves = this.graph.adjList[upperRightGraphKey];
        vertexToDelete = upperRightGraphKey[0] + (parseInt(wallRow) + 1);
        vertexIndex = possibleMoves.indexOf(vertexToDelete);
        possibleMoves.splice(vertexIndex, 1);

        // Delete move up from bottom right tile.
        var bottomRightGraphKey = letterList[letterList.indexOf(wallColumn) + 1] + (parseInt(wallRow) + 1);
        possibleMoves = this.graph.adjList[bottomRightGraphKey];
        vertexToDelete = bottomRightGraphKey[0] + (parseInt(bottomRightGraphKey[1]) - 1);
        vertexIndex = possibleMoves.indexOf(vertexToDelete);
        possibleMoves.splice(vertexIndex, 1);
      }
    }
  }



  if(this.firstClick) {
    // Store attributes of first wall tile clicked for placing a new wall.
    this.firstClickX = clickedSquare._x;
    this.firstClickY = clickedSquare._y;
    this.firstName = clickedSquare.name;
    // We know that any information for the second wall click is old now, so delete it.
    delete this.secondName;
    delete this.secondClickX;
    delete this.secondClickY;
  } else {
    // Store attributes of second wall tile clicked.
    this.secondName = clickedSquare.name;
    this.secondClickX = clickedSquare._x;
    this.secondClickY = clickedSquare._y;
    // Define possible wall tiles available based on the first wall tile click.
    var options = [];
    var option1 = this.firstName[0] + (parseInt(this.firstName[1]) + 2);
    var option2 = this.firstName[0] + (parseInt(this.firstName[1]) - 2);
    var option3 = letterList[letterList.indexOf(this.firstName[0]) + 2] + this.firstName[1];
    var option4 = letterList[letterList.indexOf(this.firstName[0]) - 2] + this.firstName[1];
    options.push(option1, option2, option3, option4);
    // If they didnt choose one of the four wall tiles available/ clear out all wall tile information and make them re-click both tiles.
    if (!options.includes(this.secondName)) {
      swal({title: 'Error', position : 'bottom-end', text : "The move you're trying to make is invalid", timer: 2000, type: 'error', toast: true, showConfirmButton: false});
      delete this.secondName;
      delete this.secondClickX;
      delete this.secondClickY;
      delete this.firstClickX;
      delete this.firstClickY;
      delete this.firstName;
      this.firstClick = true;
      // Do nothing further.
      return;
    }
  }
  // Wall placement is valid at this point, so determine more wall attributes needed for rendering, and run DFS validation.
  this.firstClick = !this.firstClick
  // Extra safety to ensure these are defined
  if(this.firstClickX != undefined && this.secondClickX != undefined) {
    // This If statement determines if the x coordinates are different, so we know its a horizontally placed wall.
    if(this.secondClickX < this.firstClickX || this.secondClickX > this.firstClickX) {
      // Set horizontal wall.
      if (this.secondClickX < this.firstClickX) {
        // Second click to left of first click.
        this.wallX = this.secondClickX;
        this.wallY = this.secondClickY;
        wallWidth = parseInt(this.firstClickX) - parseInt(this.secondClickX);
      } else {
        // Second click to right of first click.
        this.wallX = this.firstClickX;
        this.wallY = this.firstClickY;
        wallWidth = parseInt(this.secondClickX) - parseInt(this.firstClickX);
      }
      wallHeight = this.xStep - squareWidth;
    } else { 
      // Set vertical wall.
      if (this.secondClickY > this.firstClickY) {
        // Second click below first click.
        this.wallX = this.firstClickX;
        this.wallY = this.firstClickY; 
        wallHeight = parseInt(this.secondClickY) - parseInt(this.firstClickY);
      } else if (this.secondClickY < this.firstClickY){
        // Second click above first click.
        this.wallX = this.secondClickX;
        this.wallY = this.secondClickY;
        wallHeight = parseInt(this.firstClickY) - parseInt(this.secondClickY);   
      } 
      wallWidth = this.xStep - squareWidth;
    }
    var wallName = defineWallName(this.firstName, this.secondName);
    var edgeWall = false;
    // Check that the wall is not placed solely on the perimiter of the game-board.
    if ((wallName[0] == 'Z' || wallName[0] == 'I') && wallName[2] == 'v') {
      edgeWall = true;
    } else if ((wallName[1] == '0' || wallName[1] == '9') && wallName[2] == 'h') {
      edgeWall = true;
    }
    if (!edgeWall && !this.wallArray.includes(wallName)) {
      // Now we know its not an edge wall and not a wall that has been previously invalidated.
      removeEdges(wallName);
      if(this.graph.dfs(greenCircle, blueCircle)) {
        // returns true if DFS validation passes, Safety check for wall coordinates being defined.
        if (this.wallX != undefined && this.wallY != undefined) {
          if(greenCircle.turn) {
            this.player2Walls -= 1;
            $('#player2').text(this.player2Walls);
            var color = 'green';
          } else {
            this.player1Walls -= 1;
            $('#player1').text(this.player1Walls);
            var color = 'blue';
          }
          toggleTurn(greenCircle, blueCircle);
          // Return dimensions needed to render wall.
          var wallColor = greenCircle.turn ? 'Green' : 'Blue';
          return {x: this.wallX, y: this.wallY, w: wallWidth, h: wallHeight, z: 8}
        } else {
          swal({title: 'Error', position : 'bottom-end', text : "The move you're trying to make is invalid", timer: 2000, type: 'error', toast: true, showConfirmButton: false});
          // Revert changes we made to graph throughout this function.
          this.graph.adjList = this.placeHolderGraph;
          // We have added 4 walls to exclude throughout this process, so revert those changes since wall was eventually invalidated.
          this.wallArray.splice(-4);
          this.firstClick = true;
        }
      } else {
        swal({title: 'Error', position : 'bottom-end', text : "The move you're trying to make is invalid", timer: 2000, type: 'error', toast: true, showConfirmButton: false});
        // Revert changes we made to graph throughout this function.
        this.graph.adjList = this.placeHolderGraph;
        // We have added 4 walls to exclude throughout this process, so revert those changes since wall was eventually invalidated.
        this.wallArray.splice(-4);
        this.firstClick = true;
      } 
    } else {
      swal({title: 'Error', position : 'bottom-end', text : "The move you're trying to make is invalid", timer: 2000, type: 'error', toast: true, showConfirmButton: false});
      this.firstClick = true;
    }
    delete this.firstClickX;
    delete this.secondClickX;
  }
}