import Graph from '/modules/graph.js';

const MOVE_OFFSETS = [
  [1, 2],
  [1, -2],
  [-1, 2],
  [-1, -2],
  [2, 1],
  [2, -1],
  [-2, 1],
  [-2, -1],
];

export default class Chessboard {
  constructor(size = 64) {
    this.size = this.checkSize(size);
    this.squares = this.generateSquares(this.size);
    this.graph = this.generateMovesGraph(this.squares);
  }

  // check if requested size will produce a valid board
  checkSize(size) {
    if (!Number.isInteger(Math.sqrt(size))) {
      alert(
        'error. selected size is not valid. please enter a perfect square. defaulting to standard board size'
      );
      return 64;
    } else {
      return size;
    }
  }

  // populate board with squares ie coordinates
  generateSquares(size) {
    // calculate the extremity of axis.
    const maxPos = Math.sqrt(size) - 1;

    let squares = [];

    for (let i = 0; i <= maxPos; i++) {
      for (let j = 0; j <= maxPos; j++) {
        squares.push([i, j]);
      }
    }
    return squares;
  }

  generateMovesGraph(board) {
    let graph = new Graph(board.length);

    board.forEach((tile) => {
      // create vertexes
      graph.addVertex(tile);

      // create edges
      MOVE_OFFSETS.forEach((offset) => {
        let move = [tile[0] + offset[0], tile[1] + offset[1]];
        if (this.checkLegalMove(move, graph)) {
          //as map keys work on reference rather than value, we have to actually grab the specific BOARD array item that was used as the key
          let foundMove = board.find((item) => {
            return item[0] === move[0] && item[1] === move[1];
          });
          graph.addEdge(tile, foundMove);
        }
      });
    });

    return graph;
  }

  checkLegalMove = (move, graph) => {
    const maxPos = Math.sqrt(graph.noOfVertices) - 1;

    if (move[0] >= 0 && move[0] <= maxPos) {
      if (move[1] >= 0 && move[1] <= maxPos) {
        return true;
      }
    } else {
      return false;
    }
  };

  knightMoves(startPos, endPos) {
    let startNode = this.squares.find((tile) => {
      return tile[0] === startPos[0] && tile[1] === startPos[1];
    });

    let endNode = this.squares.find((tile) => {
      return tile[0] === endPos[0] && tile[1] === endPos[1];
    });

    let path = this.graph.findPath(startNode, endNode);

    return path;
  }
}
