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
  knight,
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
  knight,
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
      checkForWin();
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
      checkForWin();
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

// to check if a player has won
function checkForWin() {
  const kings = Array.from(document.querySelectorAll("#king"));
  if (!kings.some((king) => king.firstChild.classList.contains("white"))) {
    infoDisplay.innerHTML = "Black player wins!";
    const allSquares = document.querySelectorAll(".square");
    allSquares.forEach((square) =>
      square.firstChild?.setAttribute("draggable", false)
    );
  }
  if (!kings.some((king) => king.firstChild.classList.contains("black"))) {
    infoDisplay.innerHTML = "White player wins!";
    const allSquares = document.querySelectorAll(".square");
    allSquares.forEach((square) =>
      square.firstChild?.setAttribute("draggable", false)
    );
  }
}

function checkIfValid(target) {
  // get the target id
  const targetId =
    Number(target.getAttribute("square-id")) ||
    Number(target.parentNode.getAttribute("square-id"));

  const startId = Number(startPosition); // start id
  const piece = draggedElement.id; // the id of the piece that is being dragged

  // to determine the valid move of a piece based on the type of the piece
  switch (piece) {
    case "pawn":
      const starterRow = [8, 9, 10, 11, 12, 13, 14, 15]; // starting row of the pawn

      if (
        // if the pawn is at the starter row, that pawn can be moved two squares
        // e.g. startId = 8, width * 2 = 16, targetId can be 24 because 16 + 8 = 24
        // in other words, the pawn can be moved up to two squares if it is at the starter row
        (starterRow.includes(startId) && startId + width * 2 === targetId) ||
        // if the startId + width is equal to the targetId, that means, the pawn is moved one square
        // it is also a valid move
        startId + width === targetId ||
        // a pawn can move diagonally only if the target square has an opponent on it
        // width - 1 to make the pawn move diagonally before the square in front of it
        (startId + width - 1 === targetId &&
          document.querySelector(`[square-id="${startId + width - 1}"]`)
            .firstChild) ||
        // a pawn can move diagonally only if the target square has an opponent on it
        // width - 1 to make the pawn move diagonally after the square in front of it
        (startId + width + 1 === targetId &&
          document.querySelector(`[square-id="${startId + width + 1}"]`)
            .firstChild)
      ) {
        return true;
      }
      break;
    case "knight":
      if (
        startId + width * 2 - 1 === targetId ||
        startId + width * 2 + 1 === targetId ||
        startId + width - 2 === targetId ||
        startId + width + 2 === targetId ||
        startId - width * 2 - 1 === targetId ||
        startId - width * 2 + 1 === targetId ||
        startId - width - 2 === targetId ||
        startId - width + 2 === targetId
      ) {
        return true;
      }
      break;
    case "bishop":
      if (
        // direction 1 START
        startId + width + 1 === targetId ||
        (startId + width * 2 + 2 === targetId &&
          !document.querySelector(`[square-id="${startId + width + 1}"]`)
            .firstChild) ||
        (startId + width * 3 + 3 === targetId &&
          !document.querySelector(`[square-id="${startId + width + 1}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 2 + 2}"]`)
            .firstChild) ||
        (startId + width * 4 + 4 === targetId &&
          !document.querySelector(`[square-id="${startId + width + 1}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 2 + 2}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 3 + 3}"]`)
            .firstChild) ||
        (startId + width * 5 + 5 === targetId &&
          !document.querySelector(`[square-id="${startId + width + 1}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 2 + 2}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 3 + 3}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 4 + 4}"]`)
            .firstChild) ||
        (startId + width * 6 + 6 === targetId &&
          !document.querySelector(`[square-id="${startId + width + 1}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 2 + 2}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 3 + 3}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 4 + 4}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 5 + 5}"]`)
            .firstChild) ||
        (startId + width * 7 + 7 === targetId &&
          !document.querySelector(`[square-id="${startId + width + 1}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 2 + 2}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 3 + 3}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 4 + 4}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 5 + 5}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 6 + 6}"]`)
            .firstChild) ||
        // direction 1 END
        // direction 2 START
        startId - width - 1 === targetId ||
        (startId - width * 2 - 2 === targetId &&
          !document.querySelector(`[square-id="${startId - width - 1}"]`)
            .firstChild) ||
        (startId - width * 3 - 3 === targetId &&
          !document.querySelector(`[square-id="${startId - width - 1}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 2 - 2}"]`)
            .firstChild) ||
        (startId - width * 4 - 4 === targetId &&
          !document.querySelector(`[square-id="${startId - width - 1}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 2 - 2}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 3 - 3}"]`)
            .firstChild) ||
        (startId - width * 5 - 5 === targetId &&
          !document.querySelector(`[square-id="${startId - width - 1}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 2 - 2}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 3 - 3}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 4 - 4}"]`)
            .firstChild) ||
        (startId - width * 6 - 6 === targetId &&
          !document.querySelector(`[square-id="${startId - width - 1}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 2 - 2}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 3 - 3}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 4 - 4}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 5 - 5}"]`)
            .firstChild) ||
        (startId - width * 7 - 7 === targetId &&
          !document.querySelector(`[square-id="${startId - width - 1}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 2 - 2}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 3 - 3}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 4 - 4}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 5 - 5}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 6 - 6}"]`)
            .firstChild) ||
        // direction 2 END
        // direction 3 START
        startId - width + 1 === targetId ||
        (startId - width * 2 + 2 === targetId &&
          !document.querySelector(`[square-id="${startId - width + 1}"]`)
            .firstChild) ||
        (startId - width * 3 + 3 === targetId &&
          !document.querySelector(`[square-id="${startId - width + 1}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 2 + 2}"]`)
            .firstChild) ||
        (startId - width * 4 + 4 === targetId &&
          !document.querySelector(`[square-id="${startId - width + 1}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 2 + 2}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 3 + 3}"]`)
            .firstChild) ||
        (startId - width * 5 + 5 === targetId &&
          !document.querySelector(`[square-id="${startId - width + 1}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 2 + 2}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 3 + 3}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 4 + 4}"]`)
            .firstChild) ||
        (startId - width * 6 + 6 === targetId &&
          !document.querySelector(`[square-id="${startId - width + 1}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 2 + 2}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 3 + 3}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 4 + 4}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 5 + 5}"]`)
            .firstChild) ||
        (startId - width * 7 + 7 === targetId &&
          !document.querySelector(`[square-id="${startId - width + 1}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 2 + 2}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 3 + 3}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 4 + 4}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 5 + 5}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 6 + 6}"]`)
            .firstChild) ||
        // direction 3 END
        // direction 4 START
        startId + width - 1 === targetId ||
        (startId + width * 2 - 2 === targetId &&
          !document.querySelector(`[square-id="${startId + width - 1}"]`)
            .firstChild) ||
        (startId + width * 3 - 3 === targetId &&
          !document.querySelector(`[square-id="${startId + width - 1}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 2 - 2}"]`)
            .firstChild) ||
        (startId + width * 4 - 4 === targetId &&
          !document.querySelector(`[square-id="${startId + width - 1}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 2 - 2}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 3 - 3}"]`)
            .firstChild) ||
        (startId + width * 5 - 5 === targetId &&
          !document.querySelector(`[square-id="${startId + width - 1}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 2 - 2}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 3 - 3}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 4 - 4}"]`)
            .firstChild) ||
        (startId + width * 6 - 6 === targetId &&
          !document.querySelector(`[square-id="${startId + width - 1}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 2 - 2}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 3 - 3}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 4 - 4}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 5 - 5}"]`)
            .firstChild) ||
        (startId + width * 7 - 7 === targetId &&
          !document.querySelector(`[square-id="${startId + width - 1}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 2 - 2}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 3 - 3}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 4 - 4}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 5 - 5}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 6 - 6}"]`)
            .firstChild)
        // direction 4 END
      ) {
        return true;
      }
      break;
    case "rook":
      if (
        // direction 1 START
        startId + width === targetId ||
        (startId + width * 2 === targetId &&
          !document.querySelector(`[square-id="${startId + width}"]`)
            .firstChild) ||
        (startId + width * 3 === targetId &&
          !document.querySelector(`[square-id="${startId + width}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 2}"]`)
            .firstChild) ||
        (startId + width * 4 === targetId &&
          !document.querySelector(`[square-id="${startId + width}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 2}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 3}"]`)
            .firstChild) ||
        (startId + width * 5 === targetId &&
          !document.querySelector(`[square-id="${startId + width}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 2}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 3}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 4}"]`)
            .firstChild) ||
        (startId + width * 6 === targetId &&
          !document.querySelector(`[square-id="${startId + width}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 2}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 3}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 4}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 5}"]`)
            .firstChild) ||
        (startId + width * 7 === targetId &&
          !document.querySelector(`[square-id="${startId + width}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 2}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 3}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 4}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 5}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 6}"]`)
            .firstChild) ||
        // direction 1 END
        // direction 2 START
        startId - width === targetId ||
        (startId - width * 2 === targetId &&
          !document.querySelector(`[square-id="${startId - width}"]`)
            .firstChild) ||
        (startId - width * 3 === targetId &&
          !document.querySelector(`[square-id="${startId - width}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 2}"]`)
            .firstChild) ||
        (startId - width * 4 === targetId &&
          !document.querySelector(`[square-id="${startId - width}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 2}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 3}"]`)
            .firstChild) ||
        (startId - width * 5 === targetId &&
          !document.querySelector(`[square-id="${startId - width}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 2}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 3}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 4}"]`)
            .firstChild) ||
        (startId - width * 6 === targetId &&
          !document.querySelector(`[square-id="${startId - width}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 2}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 3}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 4}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 5}"]`)
            .firstChild) ||
        (startId - width * 7 === targetId &&
          !document.querySelector(`[square-id="${startId - width}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 2}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 3}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 4}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 5}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 6}"]`)
            .firstChild) ||
        // direction 2 END
        // direction 3 START
        startId - 1 === targetId ||
        (startId - 2 === targetId &&
          !document.querySelector(`[square-id="${startId - 1}"]`).firstChild) ||
        (startId - 3 === targetId &&
          !document.querySelector(`[square-id="${startId - 1}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId - 2}"]`).firstChild) ||
        (startId - 4 === targetId &&
          !document.querySelector(`[square-id="${startId - 1}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId - 2}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId - 3}"]`).firstChild) ||
        (startId - 5 === targetId &&
          !document.querySelector(`[square-id="${startId - 1}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId - 2}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId - 3}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId - 4}"]`).firstChild) ||
        (startId - 6 === targetId &&
          !document.querySelector(`[square-id="${startId - 1}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId - 2}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId - 3}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId - 4}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId - 5}"]`).firstChild) ||
        (startId - 7 === targetId &&
          !document.querySelector(`[square-id="${startId - 1}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId - 2}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId - 3}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId - 4}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId - 5}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId - 6}"]`).firstChild) ||
        // direction 3 END
        // direction 4 START
        startId + 1 === targetId ||
        (startId + 2 === targetId &&
          !document.querySelector(`[square-id="${startId + 1}"]`).firstChild) ||
        (startId + 3 === targetId &&
          !document.querySelector(`[square-id="${startId + 1}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId + 2}"]`).firstChild) ||
        (startId + 4 === targetId &&
          !document.querySelector(`[square-id="${startId + 1}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId + 2}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId + 3}"]`).firstChild) ||
        (startId + 5 === targetId &&
          !document.querySelector(`[square-id="${startId + 1}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId + 2}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId + 3}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId + 4}"]`).firstChild) ||
        (startId + 6 === targetId &&
          !document.querySelector(`[square-id="${startId + 1}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId + 2}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId + 3}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId + 4}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId + 5}"]`).firstChild) ||
        (startId + 7 === targetId &&
          !document.querySelector(`[square-id="${startId + 1}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId + 2}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId + 3}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId + 4}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId + 5}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId + 6}"]`).firstChild)
        // direction 4 END
      ) {
        return true;
      }
      break;
    case "queen":
      if (
        startId + width + 1 === targetId ||
        (startId + width * 2 + 2 === targetId &&
          !document.querySelector(`[square-id="${startId + width + 1}"]`)
            .firstChild) ||
        (startId + width * 3 + 3 === targetId &&
          !document.querySelector(`[square-id="${startId + width + 1}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 2 + 2}"]`)
            .firstChild) ||
        (startId + width * 4 + 4 === targetId &&
          !document.querySelector(`[square-id="${startId + width + 1}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 2 + 2}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 3 + 3}"]`)
            .firstChild) ||
        (startId + width * 5 + 5 === targetId &&
          !document.querySelector(`[square-id="${startId + width + 1}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 2 + 2}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 3 + 3}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 4 + 4}"]`)
            .firstChild) ||
        (startId + width * 6 + 6 === targetId &&
          !document.querySelector(`[square-id="${startId + width + 1}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 2 + 2}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 3 + 3}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 4 + 4}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 5 + 5}"]`)
            .firstChild) ||
        (startId + width * 7 + 7 === targetId &&
          !document.querySelector(`[square-id="${startId + width + 1}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 2 + 2}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 3 + 3}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 4 + 4}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 5 + 5}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 6 + 6}"]`)
            .firstChild) ||
        // direction 1 END
        // direction 2 START
        startId - width - 1 === targetId ||
        (startId - width * 2 - 2 === targetId &&
          !document.querySelector(`[square-id="${startId - width - 1}"]`)
            .firstChild) ||
        (startId - width * 3 - 3 === targetId &&
          !document.querySelector(`[square-id="${startId - width - 1}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 2 - 2}"]`)
            .firstChild) ||
        (startId - width * 4 - 4 === targetId &&
          !document.querySelector(`[square-id="${startId - width - 1}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 2 - 2}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 3 - 3}"]`)
            .firstChild) ||
        (startId - width * 5 - 5 === targetId &&
          !document.querySelector(`[square-id="${startId - width - 1}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 2 - 2}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 3 - 3}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 4 - 4}"]`)
            .firstChild) ||
        (startId - width * 6 - 6 === targetId &&
          !document.querySelector(`[square-id="${startId - width - 1}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 2 - 2}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 3 - 3}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 4 - 4}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 5 - 5}"]`)
            .firstChild) ||
        (startId - width * 7 - 7 === targetId &&
          !document.querySelector(`[square-id="${startId - width - 1}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 2 - 2}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 3 - 3}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 4 - 4}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 5 - 5}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 6 - 6}"]`)
            .firstChild) ||
        // direction 2 END
        // direction 3 START
        startId - width + 1 === targetId ||
        (startId - width * 2 + 2 === targetId &&
          !document.querySelector(`[square-id="${startId - width + 1}"]`)
            .firstChild) ||
        (startId - width * 3 + 3 === targetId &&
          !document.querySelector(`[square-id="${startId - width + 1}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 2 + 2}"]`)
            .firstChild) ||
        (startId - width * 4 + 4 === targetId &&
          !document.querySelector(`[square-id="${startId - width + 1}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 2 + 2}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 3 + 3}"]`)
            .firstChild) ||
        (startId - width * 5 + 5 === targetId &&
          !document.querySelector(`[square-id="${startId - width + 1}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 2 + 2}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 3 + 3}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 4 + 4}"]`)
            .firstChild) ||
        (startId - width * 6 + 6 === targetId &&
          !document.querySelector(`[square-id="${startId - width + 1}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 2 + 2}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 3 + 3}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 4 + 4}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 5 + 5}"]`)
            .firstChild) ||
        (startId - width * 7 + 7 === targetId &&
          !document.querySelector(`[square-id="${startId - width + 1}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 2 + 2}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 3 + 3}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 4 + 4}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 5 + 5}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 6 + 6}"]`)
            .firstChild) ||
        // direction 3 END
        // direction 4 START
        startId - width - 1 === targetId ||
        (startId - width * 2 - 2 === targetId &&
          !document.querySelector(`[square-id="${startId + width - 1}"]`)
            .firstChild) ||
        (startId - width * 3 - 3 === targetId &&
          !document.querySelector(`[square-id="${startId + width - 1}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 2 - 2}"]`)
            .firstChild) ||
        (startId - width * 4 - 4 === targetId &&
          !document.querySelector(`[square-id="${startId + width - 1}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 2 - 2}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 3 - 3}"]`)
            .firstChild) ||
        (startId - width * 5 - 5 === targetId &&
          !document.querySelector(`[square-id="${startId + width - 1}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 2 - 2}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 3 - 3}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 4 - 4}"]`)
            .firstChild) ||
        (startId - width * 6 - 6 === targetId &&
          !document.querySelector(`[square-id="${startId + width - 1}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 2 - 2}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 3 - 3}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 4 - 4}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 5 - 5}"]`)
            .firstChild) ||
        (startId - width * 7 - 7 === targetId &&
          !document.querySelector(`[square-id="${startId + width - 1}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 2 - 2}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 3 - 3}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 4 - 4}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 5 - 5}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 6 - 6}"]`)
            .firstChild) ||
        // direction 4 END
        // direction 5 START
        startId + width === targetId ||
        (startId + width * 2 === targetId &&
          !document.querySelector(`[square-id="${startId + width}"]`)
            .firstChild) ||
        (startId + width * 3 === targetId &&
          !document.querySelector(`[square-id="${startId + width}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 2}"]`)
            .firstChild) ||
        (startId + width * 4 === targetId &&
          !document.querySelector(`[square-id="${startId + width}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 2}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 3}"]`)
            .firstChild) ||
        (startId + width * 5 === targetId &&
          !document.querySelector(`[square-id="${startId + width}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 2}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 3}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 4}"]`)
            .firstChild) ||
        (startId + width * 6 === targetId &&
          !document.querySelector(`[square-id="${startId + width}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 2}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 3}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 4}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 5}"]`)
            .firstChild) ||
        (startId + width * 7 === targetId &&
          !document.querySelector(`[square-id="${startId + width}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 2}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 3}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 4}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 5}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 6}"]`)
            .firstChild) ||
        // direction 5 END
        // direction 6 START
        startId - width === targetId ||
        (startId - width * 2 === targetId &&
          !document.querySelector(`[square-id="${startId - width}"]`)
            .firstChild) ||
        (startId - width * 3 === targetId &&
          !document.querySelector(`[square-id="${startId - width}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 2}"]`)
            .firstChild) ||
        (startId - width * 4 === targetId &&
          !document.querySelector(`[square-id="${startId - width}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 2}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 3}"]`)
            .firstChild) ||
        (startId - width * 5 === targetId &&
          !document.querySelector(`[square-id="${startId - width}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 2}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 3}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 4}"]`)
            .firstChild) ||
        (startId - width * 6 === targetId &&
          !document.querySelector(`[square-id="${startId - width}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 2}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 3}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 4}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 5}"]`)
            .firstChild) ||
        (startId - width * 7 === targetId &&
          !document.querySelector(`[square-id="${startId - width}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 2}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 3}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 4}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 5}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 6}"]`)
            .firstChild) ||
        // direction 6 END
        // direction 7 START
        startId - 1 === targetId ||
        (startId - 2 === targetId &&
          !document.querySelector(`[square-id="${startId - 1}"]`).firstChild) ||
        (startId - 3 === targetId &&
          !document.querySelector(`[square-id="${startId - 1}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId - 2}"]`).firstChild) ||
        (startId - 4 === targetId &&
          !document.querySelector(`[square-id="${startId - 1}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId - 2}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId - 3}"]`).firstChild) ||
        (startId - 5 === targetId &&
          !document.querySelector(`[square-id="${startId - 1}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId - 2}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId - 3}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId - 4}"]`).firstChild) ||
        (startId - 6 === targetId &&
          !document.querySelector(`[square-id="${startId - 1}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId - 2}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId - 3}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId - 4}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId - 5}"]`).firstChild) ||
        (startId - 7 === targetId &&
          !document.querySelector(`[square-id="${startId - 1}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId - 2}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId - 3}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId - 4}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId - 5}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId - 6}"]`).firstChild) ||
        // direction 7 END
        // direction 8 START
        startId + 1 === targetId ||
        (startId + 2 === targetId &&
          !document.querySelector(`[square-id="${startId + 1}"]`).firstChild) ||
        (startId + 3 === targetId &&
          !document.querySelector(`[square-id="${startId + 1}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId + 2}"]`).firstChild) ||
        (startId + 4 === targetId &&
          !document.querySelector(`[square-id="${startId + 1}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId + 2}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId + 3}"]`).firstChild) ||
        (startId + 5 === targetId &&
          !document.querySelector(`[square-id="${startId + 1}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId + 2}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId + 3}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId + 4}"]`).firstChild) ||
        (startId + 6 === targetId &&
          !document.querySelector(`[square-id="${startId + 1}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId + 2}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId + 3}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId + 4}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId + 5}"]`).firstChild) ||
        (startId + 7 === targetId &&
          !document.querySelector(`[square-id="${startId + 1}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId + 2}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId + 3}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId + 4}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId + 5}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId + 6}"]`).firstChild)
        // direction 8 END
      ) {
        return true;
      }
      break;
    case "king":
      if (
        startId + 1 === targetId ||
        startId - 1 === targetId ||
        startId + width === targetId ||
        startId - width === targetId ||
        startId + width - 1 === targetId ||
        startId + width + 1 === targetId ||
        startId - width - 1 === targetId ||
        startId - width + 1 === targetId
      ) {
        return true;
      }
      break;
  }
}
