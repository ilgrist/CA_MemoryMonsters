// Those are global variables, they stay alive and reflect the state of the game
var elPreviousCard = null;
var flippedCouplesCount = 0;
var isProcessing = false;
var playerName = localStorage.getItem("playername");

// Time variables and sets
var startTime = new Date();
var seconds = 0;
var millisconds = 0;
// resets the best time
localStorage.removeItem("prevBestTime");

// This is a constant that we dont change during the game (we mark those with CAPITAL letters)
var TOTAL_COUPLES_COUNT = document.querySelectorAll(".card").length / 2;

// Load an audio file
var audioWin = new Audio("sound/win.mp3");
var audioRight = new Audio("sound/right.mp3");
var audioWrong = new Audio("sound/wrong.mp3");

// prompts the player for their name and displays it onscreen
if (playerName == null) {
  getName();
} else {
  document.getElementById("playerNameHTML").innerHTML = playerName;
}

// This function is called whenever the user click a card
function cardClicked(elCard) {
  // If the user clicked an already flipped card - do nothing and return from the function
  if (elCard.classList.contains("flipped")) {
    return;
  } else if (isProcessing) {
    return;
  }

  // Flip it
  elCard.classList.add("flipped");

  // This is a first card, only keep it in the global variable
  if (elPreviousCard === null) {
    elPreviousCard = elCard;
    // gets the start time
    startTime = Date.now();
  } else {
    // get the data-card attribute's value from both cards
    var card1 = elPreviousCard.getAttribute("data-card");
    var card2 = elCard.getAttribute("data-card");

    // No match, schedule to flip them back in 1 second
    if (card1 !== card2) {
      audioWrong.play();
      isProcessing = true;
      setTimeout(function() {
        elCard.classList.remove("flipped");
        elPreviousCard.classList.remove("flipped");
        elPreviousCard = null;
        isProcessing = false;
      }, 1000);
    } else {
      // Yes! a match!
      audioRight.play();
      flippedCouplesCount++;
      elPreviousCard = null;

      // All cards flipped! Shows reset button
      if (TOTAL_COUPLES_COUNT === flippedCouplesCount) {
        audioWin.play();
        calctime();
        setTimeout(() => {
          changeButton();
        }, 500);
      }
    }
  }
}

// Resets the game
function resetGame() {
  for (let i = 0; i < TOTAL_COUPLES_COUNT * 2; i++) {
    document.querySelector(".flipped").classList.remove("flipped");
  }
  changeButton();
  flippedCouplesCount = 0;
}

// unhides button + hides cards, OR hides button + shows cards
function changeButton() {
  var elResetButton = document.getElementById("resetButton");
  var cardDisplay = document.querySelectorAll("div.card");
  if (elResetButton.style.display === "block") {
    elResetButton.style.display = "none";
    for (let i = 0; i < cardDisplay.length; i++) {
      cardDisplay[i].style.display = "block";
    }
  } else {
    elResetButton.style.display = "block";
    for (let i = 0; i < cardDisplay.length; i++) {
      cardDisplay[i].style.display = "none";
    }
  }
}

//Gets and sets the player's name
function getName() {
  playerName = prompt("Please enter your name");
  localStorage.setItem("playername", playerName);
  document.getElementById("playerNameHTML").innerHTML = playerName;
}

function calctime() {
  // calculates and displays current try time
  let finishTime = Date.now();
  let adjustedResultTime = Math.round(finishTime - startTime) / 1000;
  document.getElementById("timer").innerHTML = adjustedResultTime + " seconds";
  //calculates best time to localStorage and page
  let prevBestTime = localStorage.getItem("prevBestTime");
  if (prevBestTime == null || prevBestTime > adjustedResultTime) {
    prevBestTime = adjustedResultTime;
    document.getElementById("bestTime").innerHTML =
      adjustedResultTime + " seconds";
    localStorage.setItem("prevBestTime", adjustedResultTime);
  } else {
    document.getElementById("bestTime").innerHTML = prevBestTime;
  }
}
