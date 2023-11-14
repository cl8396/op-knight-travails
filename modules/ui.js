export default class UI {
  constructor(board) {
    this.board = board;
    this.boardSquares = board.squares;
    this.boardSize = board.size;
    this.boardElement = document.querySelector('.chessboard');
    this.instruction = document.querySelector('.instruction-js');
    this.isDrawingPath = false;
    this.selectedSquares = [];
    this.path = [];
    this.ALPHABET = [
      'A',
      'B',
      'C',
      'D',
      'E',
      'F',
      'G',
      'H',
      'I',
      'J',
      'K',
      'L',
      'M',
      'N',
      'O',
      'P',
      'Q',
      'R',
      'S',
      'T',
      'U',
      'V',
      'W',
      'X',
      'Y',
      'Z',
    ];
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
    let boardGrid = document.createElement('div');
    boardGrid.style = `grid-template-columns: repeat(${this.noSquaresInAxis}, 1fr);`;
    boardGrid.classList.add('chessboard__grid');

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

          let sumCoords = coordinate[0] + coordinate[1];
          if (sumCoords % 2 !== 0) {
            square.classList.add('chessboard__square--white');
          } else {
            square.classList.add('chessboard__square--black');
          }
          square.setAttribute('x', coordinate[0]);
          square.setAttribute('y', coordinate[1]);
          boardGrid.appendChild(square);
        });
    }

    this.boardElement.appendChild(boardGrid);

    // create column labels
    let colLabelContainer = document.createElement('div');
    colLabelContainer.classList.add('chessboard__col-label-container');
    colLabelContainer.style = `grid-template-columns: repeat(${this.noSquaresInAxis}, 1fr);`;

    for (let i = 0; i <= MAX_AXIS_VAL; i++) {
      let label = document.createElement('p');
      label.textContent = this.ALPHABET[i];
      label.style = 'margin: auto;';
      colLabelContainer.appendChild(label);
    }

    this.boardElement.appendChild(colLabelContainer);

    // create row labels
    let rowLabelContainer = document.createElement('div');
    rowLabelContainer.classList.add('chessboard__row-label-container');
    rowLabelContainer.style = `grid-template-rows: repeat(${this.noSquaresInAxis}, 1fr);`;

    for (let i = 0; i <= MAX_AXIS_VAL; i++) {
      let label = document.createElement('p');
      label.textContent = MAX_AXIS_VAL + 1 - i;
      rowLabelContainer.appendChild(label);
    }

    this.boardElement.appendChild(rowLabelContainer);

    /*

    Is this a bad idea? Lots of additional elements are created. They get deleted when the board clears. Feels overly encumbersome for a simple label for each column and row
    Maybe it would be better to generate the row and column labels independently in their own container which is then attached to the chessboard grid. As long as the container is the same width/length as the chessboard container, then display flex should be fine for spacing.

     For each value of X (ie 0 - 7) generate an alphabet letter (ABCDEFGH)
     @ the square with coordinate [x, 0], create an absolutely positioned letter corresponsing to that coordinate

     For each value of y (ie 0 - 7)
     @ the sqaure with coordinate [0, y], create an absolutely positioned number corresponsing to that coordinate

     */
  }

  handleBoardClick(e) {
    // stops the user interrupting path being displayed
    if (this.isDrawingPath === true) {
      return;
    }
    // stops the user selecting same square twice
    if (e.target.hasAttribute('selected')) {
      return;
    }
    // removes previous path and selected squares
    if (this.selectedSquares.length === 0) {
      this.clearBoard();
    }

    if (e.target.classList.contains('chessboard-square-js')) {
      let selectedCoords = this.getCoords(e);

      this.selectSquare(selectedCoords);
      this.updateInstruction();

      if (this.selectedSquares.length === 2) {
        this.path = this.board.knightMoves(...this.selectedSquares);
        this.drawPath(this.path);
        this.clearSelectedSquares();
        this.updateInstruction();
      } else {
        return;
      }
    }
  }

  getSquare(coords) {
    let allSquares = [...document.querySelectorAll('.chessboard-square-js')];
    let squareElement = allSquares.find((square) => {
      if (
        square.getAttribute('x') == coords[0] &&
        square.getAttribute('y') == coords[1]
      ) {
        return square;
      }
    });
    return squareElement;
  }

  selectSquare(coords) {
    let squareElement = this.getSquare(coords);

    squareElement.setAttribute('selected', true);

    if (this.selectedSquares.push(coords) === 1) {
      this.addIcon(squareElement, 'start');
    } else {
      this.addIcon(squareElement, 'end');
    }
  }

  addIcon(square, type) {
    let svgName;
    switch (type) {
      case 'start':
        svgName = 'flag-start.svg';
        break;
      case 'end':
        svgName = 'flag-end.svg';
        break;
      default:
        svgName = `${type}.svg`;
    }

    let icon = document.createElement('img');
    icon.classList.add('chessboard__selection-icon');
    icon.src = `img/${svgName}`;

    square.appendChild(icon);
  }

  clearSelectedSquares() {
    this.selectedSquares.forEach((square) => {
      this.getSquare(square).removeAttribute('selected');
    });
    this.selectedSquares = [];
  }

  setupEventListeners() {
    this.boardElement.addEventListener('click', (e) => {
      this.handleBoardClick(e);
    });
  }

  getCoords(e) {
    let square = e.target;

    let x = square.getAttribute('x');
    let y = square.getAttribute('y');
    return [parseInt(x), parseInt(y)];
  }

  updateInstruction() {
    switch (this.selectedSquares.length) {
      case 0:
        this.instruction.textContent = 'Select starting square';
        break;
      case 1:
        this.instruction.textContent = 'Select target square';
        break;
    }
  }

  drawPath() {
    let interval = 100; // delay in ms between drawing each step
    this.isDrawingPath = true; // whilst true user not able to make any inputs.
    let promise = Promise.resolve();

    this.path.forEach((step, counter) => {
      // add delays between steps of path drawing on board
      promise = promise.then(() => {
        let squareElement = this.getSquare(step);
        if (counter !== 0 && counter !== this.path.length - 1) {
          this.addIcon(squareElement, counter + 1);
        }
        return new Promise((resolve) => {
          setTimeout(resolve, interval);
        });
      });
    });

    promise.then(() => {
      // after execution of path drawing 'animation' completes allow the user to make inputs once again
      this.isDrawingPath = false;
    });
  }

  clearBoard() {
    let allSquares = [...document.querySelectorAll('.chessboard-square-js')];

    allSquares.forEach((square) => {
      if (square.children[0]) {
        square.removeChild(square.children[0]);
      }
    });
  }
}

/* 

PLACING THE SELECTED SQUARES INTO THE UI MODULE INSTEAD OF CHESSBOARD 

then we can pass the selected squares into knight moves to obtain the path.

we can use the ui's selected squares to indicate

create a path parameter in the ui.



*/
