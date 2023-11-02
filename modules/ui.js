export default class UI {
  constructor(board) {
    this.board = board;
    this.boardSquares = board.squares;
    this.boardSize = board.size;
    this.boardGrid = document.querySelector('.chessboard');
  }

  init() {
    this.drawBoard();
    this.setupEventListeners();
  }

  get noSquaresInAxis() {
    return Math.sqrt(this.boardSize);
  }

  drawBoard() {
    // add correct styling to chessboard
    this.boardGrid.style = `grid-template-columns: repeat(${this.noSquaresInAxis}, 1fr); background-color: red;`;

    // create Squares
    const MAX_AXIS_VAL = this.noSquaresInAxis - 1;
    for (let j = MAX_AXIS_VAL; j >= 0; j--) {
      this.boardSquares
        .filter((coordinate) => {
          return coordinate[1] === j;
        })
        .forEach((coordinate) => {
          let square = document.createElement('div');
          square.classList.add('chessboard__square');
          square.classList.add('chessboard-square-js');
          square.setAttribute('x', coordinate[0]);
          square.setAttribute('y', coordinate[1]);
          square.innerHTML = `${coordinate[0]},${coordinate[1]}`;
          this.boardGrid.appendChild(square);
        });
    }
  }

  setupEventListeners() {
    this.boardGrid.addEventListener('click', (e) => {
      this.clearPath();
      let selectedCoords = this.handleBoardClick(e);
      alert(`selected ${selectedCoords}`);
      let path = this.board.selectSquare(selectedCoords);
      if (path) {
        this.drawPath(path);
      }
    });
  }

  handleBoardClick(e) {
    let square = e.target;
    let x = square.getAttribute('x');
    let y = square.getAttribute('y');
    return [parseInt(x), parseInt(y)];
  }

  drawPath(path) {
    let allSquares = [...document.querySelectorAll('.chessboard-square-js')];

    path.forEach((step, counter) => {
      let squareElement = allSquares.find((square) => {
        if (
          square.getAttribute('x') == step[0] &&
          square.getAttribute('y') == step[1]
        ) {
          return square;
        }
      });

      let text = document.createElement('span');
      text.classList.add('chessboard__path-indicator');
      text.classList.add('path-js');
      switch (counter) {
        case 0:
          text.textContent = 'start';
          break;
        case path.length - 1:
          text.textContent = 'end';
          break;
        default:
          text.textContent = counter + 1;
          break;
      }
      squareElement.appendChild(text);
    });
  }

  clearPath() {
    let allSquares = [...document.querySelectorAll('.chessboard-square-js')];

    allSquares.forEach((square) => {
      if (square.children[0]) {
        square.removeChild(square.children[0]);
      }
    });
  }
}
