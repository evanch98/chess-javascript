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
  startPieces.forEach((startPiece) => {
    const square = document.createElement("div");
    // add the classList
    square.classList.add("square");
    square.classList.add("beige");
    // add to the gameboard
    gameBoard.append(square);
  });
}

createBoard();
