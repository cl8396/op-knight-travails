import Queue from '/modules/queue.js';

export default class Graph {
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
