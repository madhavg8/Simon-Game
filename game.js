var buttonColours = ["red", "blue", "green", "yellow"];
var gamePattern = [];
var userClickedPattern = [];
var started = false;
var level = 0;
var highScore = localStorage.getItem("simonHighScore") || 0;
var leaderboard = JSON.parse(localStorage.getItem("simonLeaderboard")) || [];
var soundEnabled = true;

$("#high-score").text("High Score: " + highScore);

$("#theme-toggle").click(function () {
  $("body").toggleClass("light-mode");
  var isLight = $("body").hasClass("light-mode");
  $(this).text(isLight ? "☀️ Light Mode" : "🌙 Dark Mode");
  localStorage.setItem("simonTheme", isLight ? "light" : "dark");
});

if (localStorage.getItem("simonTheme") === "light") {
  $("body").addClass("light-mode");
  $("#theme-toggle").text("☀️ Light Mode");
}

$("#sound-toggle").click(function () {
  soundEnabled = !soundEnabled;
  $(this).text(soundEnabled ? "🔊 Sound On" : "🔇 Sound Off");
});

$("#leaderboard-btn").click(function () {
  showLeaderboard();
});

$(".close-btn").click(function () {
  $("#leaderboard-modal").fadeOut();
});

$(window).click(function (event) {
  if (event.target.id === "leaderboard-modal") {
    $("#leaderboard-modal").fadeOut();
  }
});

function showLeaderboard() {
  var listHtml = "";
  if (leaderboard.length === 0) {
    listHtml = "<li>No scores yet!</li>";
  } else {
    leaderboard.forEach(function (entry, index) {
      listHtml +=
        "<li><span>" +
        (index + 1) +
        ". " +
        entry.name +
        "</span><span>Lvl " +
        entry.score +
        "</span></li>";
    });
  }
  $("#leaderboard-list").html(listHtml);
  $("#leaderboard-modal").fadeIn();
}

function updateLeaderboard(score) {
  if (
    leaderboard.length < 5 ||
    score > leaderboard[leaderboard.length - 1].score
  ) {
    setTimeout(function () {
      var name = prompt("New High Score! Enter your name:");
      if (name) {
        leaderboard.push({ name: name.substring(0, 10), score: score });
        leaderboard.sort((a, b) => b.score - a.score);
        leaderboard = leaderboard.slice(0, 5);
        localStorage.setItem("simonLeaderboard", JSON.stringify(leaderboard));
        showLeaderboard();
      }
    }, 500);
  }
}

$(document).on("keydown", function () {
  if (!started) {
    $("#level-title").text("Level " + level);
    nextSequence();
    started = true;
  }
});

$("#level-title").click(function () {
  if (!started) {
    $("#level-title").text("Level " + level);
    nextSequence();
    started = true;
  }
});

$(".btn").click(function () {
  var userChosenColour = $(this).attr("id");

  userClickedPattern.push(userChosenColour);
  console.log(userClickedPattern);
  playSound(userChosenColour);
  animatePress(userChosenColour);
  checkAnswer(userClickedPattern.length - 1);
});

function checkAnswer(currentLevel) {
  if (gamePattern[currentLevel] === userClickedPattern[currentLevel]) {
    console.log("success");

    if (userClickedPattern.length === gamePattern.length) {
      if (level > highScore) {
        highScore = level;
        localStorage.setItem("simonHighScore", highScore);
        $("#high-score").text("High Score: " + highScore);
      }

      setTimeout(function () {
        nextSequence();
      }, 1000);
    }
  } else {
    console.log("wrong");
    playSound("wrong");

    $("#level-title").text("Game Over, Press any Key to Restart");

    $("body").addClass("game-over");

    setTimeout(function () {
      $("body").removeClass("game-over");
    }, 200);

    var finalScore = level > 0 ? level - 1 : 0;
    updateLeaderboard(finalScore);

    startOver();
  }
}

function nextSequence() {
  userClickedPattern = [];
  level++;
  $("#level-title").text("Level " + level);

  var randomNumber = Math.floor(Math.random() * 4);
  var randomChosenColour = buttonColours[randomNumber];
  gamePattern.push(randomChosenColour);

  var selectedButton = $("#" + randomChosenColour);
  selectedButton.fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100);

  playSound(randomChosenColour);
}

function playSound(name) {
  if (soundEnabled) {
    var audio = new Audio("sounds/" + name + ".mp3");
    audio.play();
  }
}

function animatePress(currentColour) {
  $("#" + currentColour).addClass("pressed");

  setTimeout(function () {
    $("#" + currentColour).removeClass("pressed");
  }, 100);
}

function startOver() {
  level = 0;
  gamePattern = [];
  started = false;
}
