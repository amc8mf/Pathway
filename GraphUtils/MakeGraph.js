module.exports = () => {
  function Graph() {
    this.adjList = {};
  }
  var graph = new Graph();

  Graph.prototype.addVertex = function(vertex) {
    this.adjList[vertex] = [];
  }

  Graph.prototype.addEdge = function(vertex1, vertex2) {
    this.adjList[vertex1].push(vertex2);
  }

  Graph.prototype.dfs = function(blackCircle, myCircle) {
    var nodes = [];
    nodes.push(blackCircle.position);
    nodes.push(myCircle.position);
    this.winningRow = '9';
    var isWallValid;
    var that = this;
    nodes.forEach(function(node) {
      if(isWallValid == false) {return}
      var visited = {};
      isWallValid = graph._dfsUtil(node, visited);
      that.winningRow = '1';
    });
    return isWallValid;
  }

  Graph.prototype._dfsUtil = function(vertex, visited) {
    if (vertex[1] == this.winningRow) {
      return true;
    } else {
      if (!visited[vertex]) {
        visited[vertex] = true;
        var neighbors = [];
        this.adjList[vertex].forEach(function(neighbor) {
          if(neighbor[0] == vertex[0]) {
            neighbors.unshift(neighbor)
          } else {
            neighbors.push(neighbor);
          }
        });
        for (var i = 0; i < neighbors.length; i ++) {
          var neighbor = neighbors[i];
          if(this._dfsUtil(neighbor, visited)) {return true};
        }
        return false;
      }
    }
  }


  var addPossibleMoves = (tile, rowPosition) => {
    var letterList = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];

    var commonMoves = () => {
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

    var upMove = () => {
      var upMoveTile = tile.charAt(0) + (parseInt(tile.charAt(1)) - 1);
      graph.addEdge(tile, upMoveTile);
    }

    var downMove = () => {
      var downMoveTile = tile.charAt(0) + (parseInt(tile.charAt(1)) + 1);
      graph.addEdge(tile, downMoveTile);  
    }

    if(rowPosition == 'top') {
      if(tile.charAt(0) == 'A') {
        //do stuff for left side
        graph.addEdge(tile, 'A2');
        graph.addEdge(tile, 'B1');
      } else if(tile.charAt(0) == 'I') {
        //do stuff for right side
        graph.addEdge(tile, 'H1');
        graph.addEdge(tile, 'I2');
      } else {
        commonMoves();
        downMove();
      }

    } else if(rowPosition == 'bottom') {
      if(tile.charAt(0) == 'A') {
        //do stuff for left side
        graph.addEdge(tile, 'A8');
        graph.addEdge(tile, 'B9');
      } else if(tile.charAt(0) == 'I') {
        //do stuff for right side
        graph.addEdge(tile, 'H9');
        graph.addEdge(tile, 'I8');
      } else {
        commonMoves();
        upMove();
      }

    } else {
      commonMoves();
      upMove();
      downMove();
    }
  }

  var number = 1;
  var letterList = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];

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