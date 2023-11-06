export default class UI {
  constructor(board) {
    this.board = board;
    this.boardSquares = board.squares;
    this.boardSize = board.size;
    this.boardGrid = document.querySelector('.chessboard');
    this.instruction = document.querySelector('.instruction-js');
  }

  init() {
    this.drawBoard();
    this.setupEventListeners();
    this.updateInstruction();
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

      let path = this.board.selectSquare(selectedCoords);

      this.displaySelectedSquares();

      if (path) {
        this.drawPath(path);
        this.board.clearSelectedSquares();
      }

      this.updateInstruction();
    });
  }

  displaySelectedSquares() {
    let moves = this.board.selectedSquares;

    moves.forEach((move, index) => {
      if (index === 0) {
        this.updateSquare(move, 'Start');
      } else if (index === 1) {
        this.updateSquare(move, 'End');
      }
    });
  }

  handleBoardClick(e) {
    let square = e.target;
    let x = square.getAttribute('x');
    let y = square.getAttribute('y');
    return [parseInt(x), parseInt(y)];
  }

  updateInstruction() {
    let selectedSquares = this.board.selectedSquares;

    switch (selectedSquares.length) {
      case 0:
        this.instruction.textContent = 'Select starting square';
        break;
      case 1:
        this.instruction.textContent = 'Select target square';
        break;
    }
  }

  updateSquare(coords, content) {
    let allSquares = [...document.querySelectorAll('.chessboard-square-js')];
    let squareElement = allSquares.find((square) => {
      if (
        square.getAttribute('x') == coords[0] &&
        square.getAttribute('y') == coords[1]
      ) {
        return square;
      }
    });

    let text = document.createElement('span');
    text.classList.add('chessboard__path-indicator');
    text.classList.add('path-js');
    text.textContent = content;

    squareElement.appendChild(text);
  }

  drawPath(path) {
    path.forEach((step, counter) => {
      if (counter !== 0 && counter !== path.length - 1) {
        this.updateSquare(step, counter + 1);
      }
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
