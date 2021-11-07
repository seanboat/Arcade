const BOARD = document.getElementById("board");

let state = {
  board: [],
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

createBoard(25, 25);

const startNode = document.getElementById("square-12:12");

const snakeNodes = Array.from(
  document.querySelectorAll(
    '[id="square-12:12"], [id="square-12:11"], [id="square-12:10"]'
  )
);
const snakeState = [
  [12, 11],
  [12, 12],
  [12, 13],
];

function drawSnake() {
  // each snakeState element is an array [rowIdx, colIdx]
  snakeState.forEach(([rowIdx, colIdx]) => {
    const node = document.getElementById(`square-${rowIdx}:${colIdx}`);
    node.classList.add("snake");
  });
}
drawSnake();

function moveRight() {
  let currentHead = snakeState[snakeState.length - 1];
  let row = currentHead[0];
  let col = currentHead[1];
  let nextCol = col + 1;
  let nextHead = [row, nextCol];

  snakeState.push(nextHead);
  snakeState.shift();

  drawSnake();

  // console.log(snakeState);
}

function moveLeft() {
  let currentHead = snakeState[snakeState.length - 1];
  let row = currentHead[0];
  let col = currentHead[1];
  let nextCol = col - 1;
  let nextHead = [row, nextCol];

  snakeState.push(nextHead);
  snakeState.shift();

  drawSnake();

  // console.log(snakeState);
}

function moveUp() {
  let currentHead = snakeState[snakeState.length - 1];
  let row = currentHead[0];
  let col = currentHead[1];
  let nextRow = row - 1;
  let nextHead = [nextRow, col];

  snakeState.push(nextHead);
  snakeState.shift();

  drawSnake();

  console.log(snakeState);
}

function moveDown() {
  let currentHead = snakeState[snakeState.length - 1];
  let row = currentHead[0];
  let col = currentHead[1];
  let nextRow = row + 1;
  let nextHead = [nextRow, col];

  snakeState.push(nextHead);
  snakeState.shift();

  drawSnake();

  console.log(snakeState);
}

function controlSnake() {
  window.addEventListener("keyup", controlSnake());
  if (e.keyCode === 39) {
    moveRight;
  } else if (e.keyCode === 37) {
    moveLeft;
  } else if (e.keyCode === 38) {
    moveUp;
  } else if (e.keyCode === 40) {
    moveDown;
  }
}

// setInterval(moveRight, 2000);

// function updateSnake() {
//   for (let i = snakeNodes.length; i <= 0; i--) {
//     snakeNodes.unshift(startNode);
//     snakeNodes.pop();
//     console.log(snakeNodes);
//   }
// }
// updateSnake();

let currentTimeBetweenFires = 2000;

const updateInterval = (newTimeBetweenFire) => {
  return setInterval(() => {
    controlSnake();
    console.log("fired func with new time between fires: ", newTimeBetweenFire);
  }, newTimeBetweenFire);
};

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
      newIntervalTime = 2000;
      break;
    case "medium":
      newIntervalTime = 1000;
      break;
    case "hard":
      newIntervalTime = 500;
      break;
    default:
      return 2000;
  }

  modifyInterval(newIntervalTime);
  console.log("newInterval is: ", newIntervalTime);
});
