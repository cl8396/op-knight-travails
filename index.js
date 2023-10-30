class Queue {
  constructor() {
    this.elements = {};
    this.frontIndex = 0;
    this.backIndex = 0;
  }
  enqueue(element) {
    this.elements[this.backIndex] = element;
    this.backIndex++;
    return `${element} inserted`;
  }

  dequeue() {
    let item = this.elements[this.frontIndex];
    delete this.elements[this.frontIndex];
    this.frontIndex++;
    return item;
  }

  peek() {
    return this.elements[this.frontIndex];
  }

  get printQueue() {
    return this.items;
  }

  get isEmpty() {
    return this.frontIndex === this.backIndex ? true : false;
  }
}

class Graph {
  constructor(noOfVertices) {
    this.noOfVertices = noOfVertices;
    this.AdjList = new Map();
  }

  addVertex(v) {
    this.AdjList.set(v, []);
  }

  addEdge(v, w) {
    this.AdjList.get(v).push(w);
  }

  print() {
    let get_keys = this.AdjList.keys();

    for (let i of get_keys) {
      let get_values = this.AdjList.get(i);
      let conc = '';

      for (let j of get_values) conc += j + ' ';

      // print the vertex and its adjacency list
      console.log(i + ' -> ' + conc);
    }
  }

  findPath(startNode, targetNode) {
    let queue = new Queue();
    // visited object to ensure we don't revisit nodes
    let visited = {};

    if (startNode === targetNode) {
      return startNode;
    }

    // mark starting node as visited
    visited[startNode] = true;

    // add current node, and current path to the queue
    queue.enqueue([startNode, [startNode]]);

    while (!queue.isEmpty) {
      let [current, path] = queue.dequeue();

      // if we come across our target node, return the path we have taken
      if (current === targetNode) {
        return path;
      }

      // get the adjacency list for our current node
      let adjList = this.AdjList.get(current);

      for (let i in adjList) {
        let neighbour = adjList[i];

        // if we haven't visited the adjacent node yet, enqueue it as well as the current path
        if (!visited[neighbour]) {
          visited[neighbour] = true;
          queue.enqueue([neighbour, [...path, neighbour]]);
        }
      }
    }
  }
}

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

// populate board with coordinates
function createChessboard(size = 64) {
  if (!Number.isInteger(Math.sqrt(size))) {
    throw new Error('bad number, not a perfect square');
  }
  // calculate the extremity of the board
  const maxPos = Math.sqrt(size) - 1;

  let board = [];

  for (let i = 0; i <= maxPos; i++) {
    for (let j = 0; j <= maxPos; j++) {
      board.push([i, j]);
    }
  }
  return board;
}

function createBoardGraph(board) {
  let graph = new Graph(board.length);

  board.forEach((tile) => {
    // create vertexes
    graph.addVertex(tile);

    // create edges
    MOVE_OFFSETS.forEach((offset) => {
      let move = [tile[0] + offset[0], tile[1] + offset[1]];
      if (checkLegalMove(move, graph)) {
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

//add vertices to board graph

const checkLegalMove = (move, graph) => {
  const maxPos = Math.sqrt(graph.noOfVertices) - 1;

  if (move[0] >= 0 && move[0] <= maxPos) {
    if (move[1] >= 0 && move[1] <= maxPos) {
      return true;
    }
  } else {
    return false;
  }
};

function knightMoves(startPos, endPos) {
  let startNode = BOARD.find((tile) => {
    return tile[0] === startPos[0] && tile[1] === startPos[1];
  });

  let endNode = BOARD.find((tile) => {
    return tile[0] === endPos[0] && tile[1] === endPos[1];
  });

  let path = boardGraph.findPath(startNode, endNode);

  let output = 'Shortest path is: ';

  path.forEach((tile) => {
    output += `(${tile}) `;
  });

  console.log(output);
}

const BOARD = createChessboard();
//create a new graph
let boardGraph = createBoardGraph(BOARD);

knightMoves([0, 0], [7, 7]);
