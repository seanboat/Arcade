const BOARD = document.getElementById("board");

let state = {
  board: [],
  currentDirection: "",
};

function createBoard(m, n) {
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      const square = document.createElement("span");
      square.id = `square-${i}:${j}`; // later, i can access these values by splitting just the id and the colon as the separator
      // const [iValue, jValue] = square.id.slice(7).split(":")
      square.className = "square";
      BOARD.appendChild(square);
    }
  }

  state.board = new Array(m).fill(null).map(() => new Array(n).fill(null));
}

const startNode = document.getElementById("square-12:12");

const snakeNodes = Array.from(
  document.querySelectorAll(
    '[id="square-12:12"], [id="square-12:11"], [id="square-12:10"]'
  )
);
98;

let snakeState = [
  [12, 11],
  [12, 12],
  [12, 13],
];
// console.log(snakeState);

function restartGame() {
  console.log("reload");
  window.location.reload();
}

function drawSnake() {
  // each snakeState element is an array [rowIdx, colIdx]
  snakeState.forEach(([rowIdx, colIdx]) => {
    const node = document.getElementById(`square-${rowIdx}:${colIdx}`);
    node.classList.add("snake");
  });
}

function drawGrape() {
  let gx = Math.floor(Math.random() * 25);
  let gy = Math.floor(Math.random() * 25);
  let grapeState = [[gx, gy]];
  // console.log(grapeState);
  grapeState.forEach(([rowIdx, colIdx]) => {
    const node = document.getElementById(`square-${rowIdx}:${colIdx}`);
    node.classList.add("grape");
  });
}

function detectCollision() {
  let snakeStatus = document.getElementsByClassName("snake");
  let grapeStatus = document.getElementsByClassName("grape");
  // snakeStatus.forEach(() => {
  //   if (snakeStatus === grapeStatus) {
  //     drawGrape();
  //   }
  // });
}
detectCollision();

const controlSnake = () => {
  window.addEventListener("keydown", (event) => {
    if (event.key === "ArrowUp") {
      state.currentDirection = "ArrowUp";
    } else if (event.key === "ArrowDown") {
      state.currentDirection = "ArrowDown";
    } else if (event.key === "ArrowLeft") {
      state.currentDirection = "ArrowLeft";
    } else if (event.key === "ArrowRight") {
      state.currentDirection = "ArrowRight";
    }
  });
};

const moveRight = () => {
  let currentHead = snakeState[snakeState.length - 1];
  let row = currentHead[0];
  let col = currentHead[1];
  let nextCol = col + 1;
  let nextHead = [row, nextCol];

  snakeState.push(nextHead);

  // paint the tail the default color before shifting old tail
  //  background-color: #98fb98;
  let tail = snakeState[0];
  document
    .getElementById(`square-${tail[0]}:${tail[1]}`)
    .classList.remove("snake");

  snakeState.shift();
  drawSnake();
};

const moveLeft = () => {
  let currentHead = snakeState[snakeState.length - 1];
  let row = currentHead[0];
  let col = currentHead[1];
  let nextCol = col - 1;
  let nextHead = [row, nextCol];

  snakeState.push(nextHead);

  let tail = snakeState[0];
  document
    .getElementById(`square-${tail[0]}:${tail[1]}`)
    .classList.remove("snake");

  snakeState.shift();
  drawSnake();
};

const moveUp = () => {
  let currentHead = snakeState[snakeState.length - 1];
  let row = currentHead[0];
  let col = currentHead[1];
  let nextRow = row - 1;
  let nextHead = [nextRow, col];

  snakeState.push(nextHead);

  let tail = snakeState[0];
  document
    .getElementById(`square-${tail[0]}:${tail[1]}`)
    .classList.remove("snake");

  snakeState.shift();
  drawSnake();
};

const moveDown = () => {
  let currentHead = snakeState[snakeState.length - 1];
  let row = currentHead[0];
  let col = currentHead[1];
  let nextRow = row + 1;
  let nextHead = [nextRow, col];

  snakeState.push(nextHead);
  let tail = snakeState[0];
  document
    .getElementById(`square-${tail[0]}:${tail[1]}`)
    .classList.remove("snake");

  snakeState.shift();
  drawSnake();
};

let currentTimeBetweenFires = 500;

const updateInterval = (newTimeBetweenFire) => {
  return setInterval(() => {
    // console.log(state.currentDirection);
    // take user input, save to global/state variable as 'currentDirection'?
    // move snake in new direction
    if (
      state.currentDirection === "ArrowUp" &&
      state.currentDirection !== "ArrowDown"
    ) {
      moveUp();
    } else if (
      state.currentDirection === "ArrowDown" &&
      state.currentDirection !== "ArrowUp"
    ) {
      moveDown();
    } else if (
      state.currentDirection === "ArrowLeft" &&
      state.currentDirection !== "ArrowRight"
    ) {
      moveLeft();
    } else if (
      state.currentDirection === "ArrowRight" &&
      state.currentDirection !== "ArrowLeft"
    ) {
      moveRight();
    }
  }, newTimeBetweenFire);
};

createBoard(25, 25);
drawSnake();
drawGrape();
// add event listener to start game button that invokes controlSnake
controlSnake();

let myInterval = updateInterval(currentTimeBetweenFires);

const modifyInterval = (newTimeBetweenFire) => {
  if (isNaN(+newTimeBetweenFire) || newTimeBetweenFire < 0) {
    throw "Error: please supply a value that's an integer between 0 and Infinity";
  }

  currentTimeBetweenFires = newTimeBetweenFire;
  clearInterval(myInterval);
  myInterval = updateInterval(currentTimeBetweenFires);
};

// any time we want to reset the speed of game updates
// we just pass a new interval integer between 0 and infinity here

const GAME_DIFFICULTY = document.getElementById("gameDifficulty");

GAME_DIFFICULTY.addEventListener("change", (e) => {
  const node = e.target;

  let newIntervalTime;
  switch (node.value) {
    case "easy":
      newIntervalTime = 500;
      break;
    case "medium":
      newIntervalTime = 150;
      break;
    case "hard":
      newIntervalTime = 75;
      break;
    default:
      return 500;
  }

  modifyInterval(newIntervalTime);
  // console.log("newInterval is: ", newIntervalTime);
});

// const startButton = document.getElementById("game-start");
// startButton.addEventListener("click", startGame());

// const restartButton = document.getElementById("restart");
// restartButton.addEventListener("click", restartGame());
