/* Retrieving the document */
const gameBoard = document.querySelector("#gameboard");
const playerDisplay = document.querySelector("#player");
const infoDisplay = document.querySelector("#info-display");

const width = 8; // a chess board is made up of 8x8 tiles

// starting pieces on the chess board
const startPieces = [
  rook,
  knight,
  bishop,
  queen,
  king,
  bishop,
  king,
  rook,
  pawn,
  pawn,
  pawn,
  pawn,
  pawn,
  pawn,
  pawn,
  pawn,
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  pawn,
  pawn,
  pawn,
  pawn,
  pawn,
  pawn,
  pawn,
  pawn,
  rook,
  knight,
  bishop,
  queen,
  king,
  bishop,
  king,
  rook,
];

/* createBoard creates a chessboard */
function createBoard() {
  // there are total of 64 pieces including the empty spaces
  // for each piece create a div
  startPieces.forEach((startPiece, i) => {
    const square = document.createElement("div");
    // add the classList
    square.classList.add("square");
    // change the innerHTML of the div to startPiece
    square.innerHTML = startPiece;
    // give an unique attribute to each square
    square.setAttribute("square-id", i);
    // square.classList.add("beige");
    // to get the row we are currently in
    const row = Math.floor((63 - i) / 8) + 1;
    // every other row
    if (row % 2 === 0) {
      square.classList.add(i % 2 === 0 ? "beige" : "brown");
    } else {
      square.classList.add(i % 2 === 0 ? "brown" : "beige");
    }

    if (i <= 15) {
      square.firstChild.firstChild.classList.add("black");
    }
    // add to the gameboard
    gameBoard.append(square);
  });
}

createBoard();
