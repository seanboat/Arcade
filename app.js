const BOARD = document.getElementById("board");
document.getElementById("gameMessage").innerText =
  `Current High Score: ${localStorage.getItem("previousScore")}` || "Snake";

const initSnake = [
  [12, 11],
  [12, 12],
  [12, 13],
];

function getNewState() {
  return {
    board: [],
    currentDirection: "ArrowRight",
    snake: [...initSnake],
    grape: [14, 12],
    status: "PREGAME", // use 'PLAYING', 'LOST' as game statuses
    gameInterval: null,
    score: 0,
  };
}

let state = getNewState();

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

document.getElementById("game-restart").addEventListener("click", () => {
  window.location.reload();
});

function drawSnake() {
  // each state.snake element is an array [rowIdx, colIdx]
  state.snake.forEach(([rowIdx, colIdx]) => {
    const node = document.getElementById(`square-${rowIdx}:${colIdx}`);
    node.classList.add("snake");
  });
}

function selectGrape() {
  const [currGrapeX, currGrapeY] = state.grape;

  const grape = document.getElementById(`square-${currGrapeX}:${currGrapeY}`);

  if (grape) {
    grape.classList.remove("grape");
  }

  let gx = Math.floor(Math.random() * 25);
  let gy = Math.floor(Math.random() * 25);

  let node = document.getElementById(`square-${gx}:${gy}`);

  while (node.classList.contains("snake")) {
    gx = Math.floor(Math.random() * 25);
    gy = Math.floor(Math.random() * 25);
    node = document.getElementById(`square-${gx}:${gy}`);
  }

  node.classList.add("grape");

  state.grape = [gx, gy];
}

function keydownListener(event) {
  if (event.key === "ArrowUp") {
    state.currentDirection = "ArrowUp";
  } else if (event.key === "ArrowDown") {
    state.currentDirection = "ArrowDown";
  } else if (event.key === "ArrowLeft") {
    state.currentDirection = "ArrowLeft";
  } else if (event.key === "ArrowRight") {
    state.currentDirection = "ArrowRight";
  }
}

const controlSnake = () => {
  document.addEventListener("keydown", keydownListener);
};

function moveSnake(directiveString) {
  const [snakeHead, snakeCol] = state.snake[state.snake.length - 1];
  const [rowMod, colMod] = directions[state.currentDirection];
  const nextMove = [snakeHead + rowMod, snakeCol + colMod];

  let nextSnake;
  const currentTail = state.snake[0];

  switch (directiveString) {
    case "IS_GRAPE":
      nextSnake = [...state.snake, state.grape];
      break;
    case "COLLISION":
      state.status = "LOST";
      clearInterval(state.gameInterval);
      return;
    default:
      console.log("moveSnake default case no directiveString", directiveString);
      nextSnake = [...state.snake.slice(1), nextMove];
  }

  document
    .getElementById(`square-${currentTail[0]}:${currentTail[1]}`)
    .classList.remove("snake");
  state.snake = nextSnake;
  drawSnake();
}

const directions = {
  ArrowUp: [-1, 0],
  ArrowDown: [1, 0],
  ArrowLeft: [0, -1],
  ArrowRight: [0, 1],
};

let currentTimeBetweenFires = 500;

function eatGrape() {}

const updateInterval = (newTimeBetweenFire) => {
  return setInterval(() => {
    const [rowMod, colMod] = directions[state.currentDirection];
    const [snakeHeadRow, snakeHeadCol] = state.snake[state.snake.length - 1];
    const nextMove = [snakeHeadRow + rowMod, snakeHeadCol + colMod];

    const isGrape =
      nextMove[0] === state.grape[0] && nextMove[1] === state.grape[1];

    const isSnake = state.snake.some(
      ([snakeRow, snakeCol]) =>
        nextMove[0] === snakeRow && nextMove[1] === snakeCol
    );

    const isOutOfBounds =
      nextMove[0] < 0 ||
      nextMove[0] >= state.board.length ||
      nextMove[1] < 0 ||
      nextMove[1] >= state.board[0].length;

    switch (true) {
      case isGrape:
        moveSnake("IS_GRAPE");
        selectGrape();
        state.score += 1000;
        localStorage.setItem("previousScore", String(state.score));
        document.getElementById(
          "gameMessage"
        ).innerText = `Current Score: ${state.score}`;
        break;
      case isSnake || isOutOfBounds:
        moveSnake("COLLISION");
        document.removeEventListener("keydown", keydownListener);
        document.getElementById("gameMessage").innerText = "You lose :(";
        break;
      default:
        moveSnake();
    }
  }, newTimeBetweenFire);
};

window.onload = () => {
  createBoard(25, 25);
  drawSnake();
  selectGrape();
};

function startGame() {
  document.getElementById("gameMessage").innerText = "Current Score: 0";
  controlSnake();
  updateInterval(currentTimeBetweenFires);
}

const START_GAME_BTN = document.getElementById("game-start");
START_GAME_BTN.addEventListener("click", () => startGame());

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
});
