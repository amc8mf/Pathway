module.exports = () => {
  function Graph() {
    this.adjList = {};
  }
  var graph = new Graph();

  Graph.prototype.addVertex = function(vertex) {
    // Add each tile to the adjaceny list, where the vertex is the name of the tile.
    this.adjList[vertex] = [];
  }

  Graph.prototype.addEdge = function(vertex1, vertex2) {
    // Add neighbor to the value of vertex1, which is an array.
    this.adjList[vertex1].push(vertex2);
  }

  Graph.prototype.dfs = function(blackCircle, myCircle) {
    // Nodes is an array of both players' positions. We need these for knowing where to start our DFS.
    var nodes = [];
    nodes.push(blackCircle.position);
    nodes.push(myCircle.position);
    // First iteration is player 2 who is moving downward towards row 9.
    this.winningRow = '9';
    var isWallValid;
    var that = this;
    nodes.forEach(function(node) {
      // If the wall was invalidated on the first iteration, no need to check the second iteration.
      if(isWallValid == false) {return}
      var visited = {};
      isWallValid = graph._dfsUtil(node, visited);
      // At end of first iteration, update winning row to reflect the first player who is moving upwards.
      that.winningRow = '1';
    });
    return isWallValid;
  }

  Graph.prototype._dfsUtil = function(vertex, visited) {
    if (vertex[1] == this.winningRow) {
      // If we have reached the winning row, then we know the path is not blocked, and can return true.
      return true;
    } else {
      if (!visited[vertex]) {
        // If we haven't added this vertex to the visited object yet, add it.
        visited[vertex] = true;
        var neighbors = [];
        // Now we need to determine and loop through the neighbors of the given vertex.
        this.adjList[vertex].forEach(function(neighbor) {
          // Trying to increase efficiency by prioritizing the north or south neighbors first.
          if(neighbor[0] == vertex[0]) {
            // If neighbor is north or south of vertex, put it in front of array.
            neighbors.unshift(neighbor)
          } else {
            neighbors.push(neighbor);
          }
        });
        for (var i = 0; i < neighbors.length; i ++) {
          var neighbor = neighbors[i];
          // Traverse the neigbors and recursively execute _dfsUtil.
          if(this._dfsUtil(neighbor, visited)) {return true};
        }
        return false;
      }
    }
  }


  var addPossibleMoves = (tile, rowPosition) => {
    var letterList = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];

    var commonMoves = () => {
      // Every tile needs these moves added. There is a check to not add a left neighbor to the 1st column or right neighbor to last column.
      var columnIndex = letterList.indexOf(tile.charAt(0));
      if (columnIndex > 0) {
        var leftMove = letterList[columnIndex - 1] + tile.charAt(1);
        graph.addEdge(tile, leftMove);
      }
      if (columnIndex < 8) {
        var rightMove = letterList[columnIndex + 1] + tile.charAt(1);
        graph.addEdge(tile, rightMove);
      }
    }
    // don't have to check if row index being the top or bottom, we handle that before calling up/down move.
    var upMove = () => {
      var upMoveTile = tile.charAt(0) + (parseInt(tile.charAt(1)) - 1);
      graph.addEdge(tile, upMoveTile);
    }

    var downMove = () => {
      var downMoveTile = tile.charAt(0) + (parseInt(tile.charAt(1)) + 1);
      graph.addEdge(tile, downMoveTile);  
    }

    if(rowPosition == 'top') {
      // For top row only.
      if(tile.charAt(0) == 'A') {
        //do stuff for left side of top row manually.
        graph.addEdge(tile, 'A2');
        graph.addEdge(tile, 'B1');
      } else if(tile.charAt(0) == 'I') {
        //do stuff for right side of top row manually.
        graph.addEdge(tile, 'H1');
        graph.addEdge(tile, 'I2');
      } else {
        // for tiles in between, add left, right, and down neighbors.
        commonMoves();
        downMove();
      }

    } else if(rowPosition == 'bottom') {
      // For bottom row only.
      if(tile.charAt(0) == 'A') {
        //do stuff for left side of bottom row manually.
        graph.addEdge(tile, 'A8');
        graph.addEdge(tile, 'B9');
      } else if(tile.charAt(0) == 'I') {
        //do stuff for right side of bottom row manually.
        graph.addEdge(tile, 'H9');
        graph.addEdge(tile, 'I8');
      } else {
        commonMoves();
        upMove();
      }

    } else {
      // For other rows, add all moves.
      commonMoves();
      upMove();
      downMove();
    }
  }

  var number = 1;
  var letterList = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];
  // The gameboard is 9x9, so there are 81 tiles to iterate through.
  // First build the adjacency list where an empty array gets added.
  for(var i=1; i < 82; i++) {
    for(var index in letterList) {
      var vertex = letterList[index] + number
      graph.addVertex(vertex)
    }
    if(number < 9) {
      number += 1;
    } else {
      number = 1;
    }
  }
  // Then add to array each possible tile that a player could move to from the current tile.
  for(var tile in graph.adjList) {
    if(tile.charAt(1) == '1') {
      addPossibleMoves(tile, 'top')
    } else if(tile.charAt(1) == '9') {
      addPossibleMoves(tile, 'bottom')
    } else {
      addPossibleMoves(tile);

    }
  }
  return graph;
}