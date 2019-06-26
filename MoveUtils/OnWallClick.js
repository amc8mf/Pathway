var swal = require('sweetalert2');
var defineWallName = require('../GraphUtils/DefineWallName');
var toggleTurn = require('../MoveUtils/ToggleTurn');

// arrow function messes up context here, possible because im calling .apply()
module.exports = function(clickedSquare, squareWidth, greenCircle, blueCircle) {
  var wallWidth;
  var wallHeight;
  var letterList = ['Z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];


  var removeEdges = (wallArray, wallName) => {
    this.placeHolderGraph = JSON.parse(JSON.stringify(this.graph.adjList));
    if (!this.wallArray.includes(wallName)) {
      this.wallArray.push(wallName);
      var letterList = ['Z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];
      var wallColumn = wallName.charAt(0);
      var wallRow = wallName.charAt(1);
      var direction = wallName.charAt(2);
      if (direction == 'v') {
        var intersectWall = letterList[letterList.indexOf(wallColumn) - 1] + (parseInt(wallRow) + 1) + 'h';
        this.wallArray.push(intersectWall);
        var upWall = wallColumn + (parseInt(wallRow) + 1) + 'v';
        this.wallArray.push(upWall);
        var downWall = wallColumn + (parseInt(wallRow) - 1) + 'v';
        this.wallArray.push(downWall);

        if (wallColumn == 'Z') return;
        wallRow = parseInt(wallRow) + 1;
        var graphKey = wallColumn + wallRow;
        var upperLeftGraphKey = wallColumn + wallRow;
        possibleMoves = this.graph.adjList[upperLeftGraphKey];

        // delete move to the right from top left tile
        var vertexToDelete = letterList[letterList.indexOf(wallColumn) + 1] + wallRow;
        var vertexIndex = possibleMoves.indexOf(vertexToDelete);
        possibleMoves.splice(vertexIndex, 1);

        // delete move to the right from bottom left tile
        var bottomLeftGraphKey = wallColumn + (parseInt(wallRow) + 1);
        possibleMoves = this.graph.adjList[bottomLeftGraphKey];
        vertexToDelete = letterList[letterList.indexOf(wallColumn) + 1] + (parseInt(wallRow) + 1);
        vertexIndex = possibleMoves.indexOf(vertexToDelete);
        possibleMoves.splice(vertexIndex, 1);

        // delete move to the left from upper right tile
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
        
        // delete move down from top left tile
        var vertexToDelete = wallColumn + (parseInt(wallRow) + 1);
        var vertexIndex = possibleMoves.indexOf(vertexToDelete);
        possibleMoves.splice(vertexIndex, 1);

        // delete move up from bottom left tile
        var bottomLeftGraphKey = wallColumn + (parseInt(wallRow) + 1);
        possibleMoves = this.graph.adjList[bottomLeftGraphKey];
        vertexToDelete = wallColumn + wallRow;
        vertexIndex = possibleMoves.indexOf(vertexToDelete);
        possibleMoves.splice(vertexIndex, 1);

        // delete move down from upper right tile
        var upperRightGraphKey = letterList[letterList.indexOf(wallColumn) + 1] + wallRow;
        possibleMoves = this.graph.adjList[upperRightGraphKey];
        vertexToDelete = upperRightGraphKey[0] + (parseInt(wallRow) + 1);
        vertexIndex = possibleMoves.indexOf(vertexToDelete);
        possibleMoves.splice(vertexIndex, 1);

        // delete move up from bottom right tile
        var bottomRightGraphKey = letterList[letterList.indexOf(wallColumn) + 1] + (parseInt(wallRow) + 1);
        possibleMoves = this.graph.adjList[bottomRightGraphKey];
        vertexToDelete = bottomRightGraphKey[0] + (parseInt(bottomRightGraphKey[1]) - 1);
        vertexIndex = possibleMoves.indexOf(vertexToDelete);
        possibleMoves.splice(vertexIndex, 1);
      }
    }
  }



  if(this.firstClick) {
    this.firstClickX = clickedSquare._x;
    this.firstClickY = clickedSquare._y;
    this.firstName = clickedSquare.name;
    delete this.secondName;
    delete this.secondClickX;
    delete this.secondClickY;
  } else {
    this.secondName = clickedSquare.name;
    this.secondClickX = clickedSquare._x;
    this.secondClickY = clickedSquare._y;
    var options = [];
    var option1 = this.firstName[0] + (parseInt(this.firstName[1]) + 2);
    var option2 = this.firstName[0] + (parseInt(this.firstName[1]) - 2);
    var option3 = letterList[letterList.indexOf(this.firstName[0]) + 2] + this.firstName[1];
    var option4 = letterList[letterList.indexOf(this.firstName[0]) - 2] + this.firstName[1];
    options.push(option1, option2, option3, option4);
    if (!options.includes(this.secondName)) {
      swal({title: 'Error', position : 'bottom-end', text : "The move you're trying to make is invalid", timer: 2000, type: 'error', toast: true, showConfirmButton: false});
      delete this.secondName;
      delete this.secondClickX;
      delete this.secondClickY;
      delete this.firstClickX;
      delete this.firstClickY;
      delete this.firstName;
      this.firstClick = true;
      return;
    }
  }
  this.firstClick = !this.firstClick
  if(this.firstClickX != undefined && this.secondClickX != undefined) {
    if(this.secondClickX < this.firstClickX || this.secondClickX > this.firstClickX) {
      // set horizontal wall
      if (this.secondClickX < this.firstClickX) {
        // second click to left of first click
        this.wallX = this.secondClickX;
        this.wallY = this.secondClickY;
        wallWidth = parseInt(this.firstClickX) - parseInt(this.secondClickX);
      } else {
        // second click to right of first click
        this.wallX = this.firstClickX;
        this.wallY = this.firstClickY;
        wallWidth = parseInt(this.secondClickX) - parseInt(this.firstClickX);
      }
      wallHeight = this.xStep - squareWidth;
    } else { 
      // set vertical wall
      if (this.secondClickY > this.firstClickY) {
        // second click below first click
        this.wallX = this.firstClickX;
        this.wallY = this.firstClickY; 
        wallHeight = parseInt(this.secondClickY) - parseInt(this.firstClickY);
      } else if (this.secondClickY < this.firstClickY){
        // second click above first click
        this.wallX = this.secondClickX;
        this.wallY = this.secondClickY;
        wallHeight = parseInt(this.firstClickY) - parseInt(this.secondClickY);   
      } 
      wallWidth = this.xStep - squareWidth;
    }
    var wallName = defineWallName(this.firstName, this.secondName);
    var edgeWall = false;
    if ((wallName[0] == 'Z' || wallName[0] == 'I') && wallName[2] == 'v') {
      edgeWall = true;
    } else if ((wallName[1] == '0' || wallName[1] == '9') && wallName[2] == 'h') {
      edgeWall = true;
    }
    if (!edgeWall && !this.wallArray.includes(wallName)) {
      removeEdges(this, wallName);
      if(this.graph.dfs(greenCircle, blueCircle)) {
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
          // return dimensions needed to render wall
          var wallColor = greenCircle.turn ? 'Green' : 'Blue';

          return {x: this.wallX, y: this.wallY, w: wallWidth, h: wallHeight, z: 8}
        } else {
          swal({title: 'Error', position : 'bottom-end', text : "The move you're trying to make is invalid", timer: 2000, type: 'error', toast: true, showConfirmButton: false});
          this.graph.adjList = this.placeHolderGraph;
          wallArray.pop();
          this.firstClick = true;
        }
      } else {
        swal({title: 'Error', position : 'bottom-end', text : "The move you're trying to make is invalid", timer: 2000, type: 'error', toast: true, showConfirmButton: false});
        this.graph.adjList = this.placeHolderGraph;
        wallArray.pop();
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