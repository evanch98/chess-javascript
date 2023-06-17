/* Retrieving the document */
const gameBoard = document.querySelector("#gameboard");
const playerDisplay = document.querySelector("#player");
const infoDisplay = document.querySelector("#info-display");

const width = 8; // a chess board is made up of 8x8 tiles
let playerGo = "black"; // to keep track of the player
playerDisplay.textContent = "black"; // to display which player's turn

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
  square.addEventListener("dragover", dragOver);
  square.addEventListener("drop", dragDrop);
});

let startPosition; // start position of the piece
let draggedElement; // the element that is being dragged

// function to handle dragStart
function dragStart(e) {
  startPosition = e.target.parentNode.getAttribute("square-id");
  draggedElement = e.target;
}

// function to handle dragOver
function dragOver(e) {
  e.preventDefault(); // to prevent the default actions
}

// function to handle dragDrop
function dragDrop(e) {
  e.stopPropagation(); // prevent any propagation of the same event

  const correctGo = draggedElement.firstChild.classList.contains(playerGo); // check if the current turn is the dragged element's turn
  const taken = e.target.classList.contains("piece"); // check if the target square contains the chess piece
  const valid = checkIfValid(e.target); // to check if the move is a valid move
  const opponentGo = playerGo === "white" ? "black" : "white"; // change the opponent
  const takenByOpponent = e.target.firstChild?.classList.contains(opponentGo); // check if the current contains the opponent piece
  if (correctGo) {
    // if the current target is taken by opponent and the move is valid
    if (takenByOpponent && valid) {
      e.target.parentNode.append(draggedElement); // add the dragged element to the square
      e.target.remove(); // remove the piece at the square
      changePlayer(); // change the player
      return;
    }

    // if the current taken is taken by other pieces on the same team, there is nothing to do
    // just inform the player that they cannot make the move they are trying to make
    if (taken && !takenByOpponent) {
      infoDisplay.textContent = "you cannot go here!";
      setTimeout(() => (infoDisplay.textContent = ""), 2000);
      return;
    }

    // if the move is valid, move the piece and change player
    if (valid) {
      e.target.append(draggedElement);
      changePlayer();
      return;
    }
  }
}

// to change the player's turn
function changePlayer() {
  if (playerGo === "black") {
    reverseIds();
    playerGo = "white";
    playerDisplay.textContent = "white";
  } else {
    revertIds();
    playerGo = "black";
    playerDisplay.textContent = "black";
  }
}

/* to reverse the ids */
function reverseIds() {
  const allSquares = document.querySelectorAll(".square");
  allSquares.forEach((square, i) =>
    square.setAttribute("square-id", width * width - 1 - i)
  );
}

/* to revert the ids */
function revertIds() {
  const allSquares = document.querySelectorAll(".square");
  allSquares.forEach((square, i) => square.setAttribute("square-id", i));
}

function checkIfValid() {
  
}
