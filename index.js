import Chessboard from './modules/chessboard.js';

const BOARD = new Chessboard();

class UI {
  constructor(board) {
    this.boardSquares = board.squares;
    this.boardSize = board.size;
    this.boardGrid = document.querySelector('.chessboard');
  }

  init() {
    this.drawBoard();
    this.setupEventListeners();
  }

  get tilesInAxis() {
    return Math.sqrt(this.boardSize);
  }

  drawBoard() {
    // add correct styling to chessboard

    this.boardGrid.style = `grid-template-columns: repeat(${this.tilesInAxis}, 1fr); background-color: red;`;

    // create tiles
    const MAX_AXIS_VAL = this.tilesInAxis - 1;
    for (let j = MAX_AXIS_VAL; j >= 0; j--) {
      this.boardSquares
        .filter((coordinate) => {
          return coordinate[1] === j;
        })
        .forEach((coordinate) => {
          let square = document.createElement('div');
          square.classList.add('chessboard__tile');
          square.setAttribute('x', coordinate[0]);
          square.setAttribute('y', coordinate[1]);
          square.innerHTML = `${coordinate[0]},${coordinate[1]}`;
          this.boardGrid.appendChild(square);
        });
    }
  }

  setupEventListeners() {
    this.boardGrid.addEventListener('click', this.handleBoardClick);
  }

  handleBoardClick(e) {
    let tile = e.target;
    let x = tile.getAttribute('x');
    let y = tile.getAttribute('y');
    alert(`${x}, ${y}`);
  }
}

let ui = new UI(BOARD);
ui.init();

console.log(ui);

BOARD.knightMoves([0, 0], [7, 0]);
