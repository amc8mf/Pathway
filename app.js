var Crafty = require('craftyjs');
var swal = require('sweetalert2');

var movePlayer = require('./MoveUtils/MovePlayer');
var onWallClick = require('./MoveUtils/OnWallClick');

var makeGraph = require('./GraphUtils/MakeGraph');
var defineWallName = require('./GraphUtils/DefineWallName');
var moment = require('moment');
window.onload = () => {

  const gWidth = 500;
  const gHeight = 500;
  const squareWidth = 0.085 * gWidth;
  const squareHeight = 0.085 * gHeight;
  const numRows = 9;
  // Calculate the dimensions of 'wall placement' tiles.
  // Take gameboard and divide by 9 columns, subtract the amount of space the square tile takes.
  // Subtract .003 of gameboard to account for the 10th row/column of tinysquares.
  const tinySquareWidth = ((1/numRows)*gWidth - squareWidth - .003*(gWidth));
  const tinySquareHeight = ((1/numRows)*gHeight - squareHeight  - .003*(gHeight));

  // Distances in pixels that players will move.
  this.xStep = squareWidth + tinySquareWidth;
  this.yStep = squareHeight + tinySquareHeight;

	Crafty.init(gWidth, gHeight);
	Crafty.canvas.init();
  this.graph = makeGraph();
  // Keep track of walls placed so users cannot add a wall in the same place more than once.
  // Also keeps track of all walls that are invalid because they intersect with an existing wall.
  this.wallArray = [];
  // Give each player 10 walls to place.
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
        // Define function for creating circles.
        var ctx = Crafty.canvas.context;
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc((this.x+this.w/2)+1, (this.y+this.h/2)+1, this.radius-1, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
      }
    });

    // Define function for making 'move' tiles.
    var makeTiles = () => {
      var letterIndex = 0;
      var number = 0;
      // This list is what we iterate through to generate the name of each 'move' tile.
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
          // Define the name that the 'move' tile will be called. For example, Tile 'A1' means row A column 1.
          var nameVar = letterList[letterIndex] + number.toString()
          // This is a list of 'move' tiles that a player can move to for a given tile, it is modified as walls are placed.
          var movesVar = this.graph.adjList[nameVar];
          Crafty.e('2D, Canvas, Color, Solid, Tile, Collision, Mouse, Touch, SpriteAnimation, PlayerSprite, Primary').attr({
            x: tileX,
            y: tileY,
            w: squareWidth,
            h: squareHeight,
            z: 0,
            name : nameVar,
            moves : movesVar
          }).color('#E6BF83');
        }
      }
    }

    // These 'wall placement' tiles allow user to select wall placement.
    // Variable for determing scoreboard text.
    this.toggle = true;
    var self = this;
    var makeWallConnections = () => {
      letterIndex = 0;
      number = -1;
      // Iterate through this list to generate names of the 'wall placement' tiles.
      // Notice there are 2 extra columns. That is because there are 9 columns/rows of 'move' tiles the player can move to, but 11 columns of 'wall placement' tiles.
      // There are 11 columns because on the perimiters of the gameboard, one end of a wall could be placed there.
      // The user must click 2 'wall placement' tiles to place the wall. The 2 tiles clicked must be 2 'move' tiles apart.
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
          // Multiply iterator by width/ height of a 'move' tile to account for proper spacing.
          // Also, add the distance for all 'wall placement' tiles that have been rendered.
          // The sum gives you the starting point for the next 'wall placement' tile to be rendered.
          // (0,0) is at the top left of the graph, (500, 500) is the bottom right of the graph.
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
            // Apply the outer context 'self', pass the clickedSquare as a parameter 'this'.
            // Pass the squareWidth as it is used to calculate wall coordinates.
            // Pass in both players' circles because we use them as parameter to the ToggleTurn() function and for executing the DFS validation.
            // onwallClick() will return dimensions for making wall only on the 2nd click and if the wall is valid.
            var wallColor = greenCircle.turn ? '  #800000' : '  #191970';
            var wallDimensions = onWallClick.apply(self, [this, squareWidth, greenCircle, blueCircle]);
            // Helps to identify which player placed the wall.
            // Render wall
            if(wallDimensions) Crafty.e("2D, Canvas, Color, Solid, Mouse, Touch, Draw, Collision").attr(wallDimensions).color(wallColor);
          }).bind('MouseOver', function() {
            this.color('orange');
          }).bind('MouseOut', function() {
            // We want to keep clicked wall tiles red.
            if (this._color != 'rgba(255, 140, 0, 1)') this.color('gray');
          })
        }
      } 
    }

    // Build the gameboard calling these 2 functions.
    makeTiles();
    makeWallConnections();

    // Render pawns for both players.
    var greenCircle = Crafty.e('2D, Canvas, Fourway, Color, Circle, Solid, Collision').attr({
      x: gWidth * .4545,
      y: gHeight * .02,
      w: squareWidth,
      h: squareHeight,
      z: 8,
      radius: squareWidth * .41,
      color: '#800000',
      turn : false,
      position : 'E1',
      player : 2
    });

    var blueCircle = Crafty.e("2D, Canvas, Fourway, Color, Circle, Solid, Collision").attr({
      x: gWidth * .4545,
      y: gHeight * .89,
      w: squareWidth,
      h: squareHeight,
      radius: squareWidth * .41,
      z: 8,
      color: '  #191970',
      turn : true,
      position : 'E9',
      player: 1
    });
    // Highlight possible moves at start of game.
    var firstPosition = blueCircle.position;
    var possibleMoves = this.graph.adjList[firstPosition];
    Crafty("Primary").each(function() {
      if (possibleMoves.includes(this.name)) {
        this.color('#ffff66');
        this.bind('Click', function() {
          movePlayer.apply(self, [blueCircle, greenCircle, this.name]);
        });
      } else {
        this.color('#E6BF83');
      }
    })

    Crafty.bind('KeyDown', (e) => {
      // Prevent scrolling of page when player attempts to move.
      e.originalEvent.preventDefault();
    });
	});
  this.counter = 0;
  function update() {
    $('.clock').html(moment().minute(0).second(this.counter++).format('mm : ss'));
  }

  setInterval(update.bind(this), 1000);


  // Render game.
  Crafty.scene("game");
}