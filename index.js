import Chessboard from './modules/chessboard.js';
import UI from './modules/ui.js';


const BOARD = new Chessboard();
let ui = new UI(BOARD);
ui.init();
