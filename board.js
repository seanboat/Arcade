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

createBoard(30, 30); // you could customize the game board by allowing users to set these values :D
