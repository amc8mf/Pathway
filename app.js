var Crafty = require('craftyjs');
var swal = require('sweetalert2');

var movePlayer = require('./MoveUtils/MovePlayer');
var onWallClick = require('./MoveUtils/OnWallClick');

var makeGraph = require('./GraphUtils/MakeGraph');
var defineWallName = require('./GraphUtils/DefineWallName');

window.onload = () => {

  var gWidth = 500;
  var gHeight = 500;
  var squareWidth = 0.085 * gWidth;
  var squareHeight = 0.085 * gHeight;
  const numRows = 9;
  // take gameboard and divide by 9 columns, subtract the amount of space the square tile takes.
  // Subtract .003 of gameboard to account for the 10th row/column of tinysquares.
  var tinySquareWidth = ((1/numRows)*gWidth - squareWidth - .003*(gWidth));
  var tinySquareHeight = ((1/numRows)*gHeight - squareHeight  - .003*(gHeight));

  // distances in pixels that players will move
  this.xStep = squareWidth + tinySquareWidth;
  this.yStep = squareHeight + tinySquareHeight;

	Crafty.init(gWidth, gHeight);
	Crafty.canvas.init();
  this.graph = makeGraph();
  this.toggle = true;
  this.wallArray = [];
  this.player1Walls = 10;
  this.player2Walls = 10;

	Crafty.scene("game", () => {
    Crafty.c("Circle", {
      init: function(radius, color) {
        this.requires("2D, Canvas");
        this.bind("Draw", this._draw);
        this.ready = true;
      },
      _draw: function(e) {
        var ctx = Crafty.canvas.context;
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc((this.x+this.w/2)+1, (this.y+this.h/2)+1, this.radius-1, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
      }
    });

    // make tiles for gameboard
    var makeTiles = () => {
      var letterIndex = 0;
      var number = 0;
      var letterList = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];
      for (var i = 1; i <= numRows; i++) { 
        for (var j = 1; j <= numRows; j++) {
          if(number == numRows) {
            number = 1
            letterIndex += 1
          } else {
            number +=1
          }
          var tileX = i * this.xStep - squareWidth;
          var tileY= j * this.yStep - squareWidth;
          var nameVar = letterList[letterIndex] + number.toString()
          var movesVar = this.graph.adjList[nameVar];
          Crafty.e('2D, Canvas, Color, Solid, Tile, Collision, Mouse, Touch').attr({
            x: tileX,
            y: tileY,
            w: squareWidth,
            h: squareHeight,
            z: 0,
            name : nameVar,
            moves : movesVar
          }).color('grey');
        }
      }
    }

    //make smaller squares in between tiles for building walls
    var self = this;
    var makeWallConnections = () => {
      letterIndex = 0;
      number = -1;
      letterList = ['Z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];
      this.firstClick = true;
      for (var i = 0; i <= numRows; i++) { 
        for (var j = 0; j <= numRows; j++) {
          if(number == numRows) {
            number = 0
            letterIndex += 1
          } else {
            number +=1
          }
          var tileX = (i * squareWidth) + (i * (this.xStep - squareWidth));
          var tileY= (j * squareWidth) + (j * (this.yStep - squareWidth));
          var nameVar = letterList[letterIndex] + number.toString();
          Crafty.e('2D, Canvas, Color, Solid, Tile, Collision, Mouse, Touch, Draw').attr({
            x: tileX,
            y: tileY,
            w: tinySquareWidth,
            h: tinySquareHeight,
            z: 10,
            name : nameVar
          }).color('gray').bind("Click", function() {
            // make context the same as here, pass the clickedSquare as a parameter, return dimensions for making wall
            var wallDimensions = onWallClick.apply(self, [this, squareWidth, greenCircle, blueCircle]);
            var wallColor = greenCircle.turn ? 'DarkGreen' : 'Blue'
            if(wallDimensions) Crafty.e("2D, Canvas, Color, Solid, Mouse, Touch, Draw, Collision").attr(wallDimensions).color(wallColor);
          });
        }
      } 
    }

    makeTiles();
    makeWallConnections();


    var greenCircle = Crafty.e('2D, Canvas, Fourway, Color, Circle, Solid, Collision, Touch').attr({
      x: gWidth * .4545,
      y: gHeight * .02,
      w: squareWidth,
      h: squareHeight,
      z: 8,
      radius: squareWidth * .41,
      color: 'Green',
      turn : false,
      position : 'E1',
      player : 2
    });

    var blueCircle = Crafty.e("2D, Canvas, Fourway, Color, Circle, Solid, Collision, Touch").attr({
      x: gWidth * .4545,
      y: gHeight * .89,
      w: squareWidth,
      h: squareHeight,
      radius: squareWidth * .41,
      z: 8,
      color: 'blue',
      turn : true,
      position : 'E9',
      player: 1
    });

    Crafty.bind('KeyDown', (e) => {
      e.originalEvent.preventDefault();
      if (greenCircle.turn) {
        movePlayer.apply(this, [e, greenCircle, blueCircle]);
      } else {
        movePlayer.apply(this, [e, blueCircle, greenCircle]);
      }
    });
	});

  Crafty.scene("game");//start the game
}