// game speed handling

// this is a global var we'll use to track the speed of our game loop
let currentTimeBetweenFires = 1000;

const updateInterval = (newTimeBetweenFire) => {
  return setInterval(() => {
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
  const node = e.target; // easy medium or hard

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
