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

    // if the square has a first child make it draggable
    square.firstChild?.setAttribute("draggable", true);

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

    // to set the color of the chess pieces
    if (i <= 15) {
      square.firstChild.firstChild.classList.add("black");
    }

    if (i >= 48) {
      square.firstChild.firstChild.classList.add("white");
    }
    // add to the gameboard
    gameBoard.append(square);
  });
}

createBoard();

// retrieve all the squares in the gameboard
const allSquares = document.querySelectorAll("#gameboard .square");

// loop through each square
allSquares.forEach((square) => {
  // add event listener to each square
  square.addEventListener("dragstart", dragStart);
});

let startPosition; // start position of the piece
let draggedElement; // the element that is being dragged

function dragStart(e) {
  startPosition = e.target.parentNode.getAttribute("square-id");
  draggedElement = e.target;
}
