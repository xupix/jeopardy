$(function() {
  // set up the game mechanics
  const numPlayers = 3;

  // set up players
  let player1 = $(".player1");
  let player2 = $(".player2");
  let player3 = $(".player3");

  // get the score from the initial DOM state
  let p1Score = parseInt(
    $(".player1-score")
      .text()
      .slice(1, $(".player1-score").text().length)
  );
  let p2Score = parseInt(
    $(".player2-score")
      .text()
      .slice(1, $(".player2-score").text().length)
  );
  let p3Score = parseInt(
    $(".player3-score")
      .text()
      .slice(1, $(".player3-score").text().length)
  );

  // basic game mechanics for the turn and the game over states
  let turn = 0;
  let answeredQuestions = 0;

  // helper function to decide if an answer is correct
  const isCorrectAnswer = thisObject => {
    let playerAnswer = prompt(
      $(thisObject)
        .siblings(".question-text")
        .text()
    );
    playerAnswer = playerAnswer.toLowerCase();
    let realAnswer = $(thisObject)
      .siblings(".answer")
      .text();
    realAnswer = realAnswer.trim().toLowerCase();

    if (playerAnswer === realAnswer) {
      return true;
    }

    return false;
  };

  const setScore = function(score, player) {
    if (score >= 0) {
      $(player).text(`$${score}`);
    } else {
      score = Math.abs(score);
      $(player).text(`-$${score}`);
    }
  };

  // the handler for the question listener
  const question = function() {
    // update the question that was picked
    $(this)
      .attr("disabled", "disabled")
      .addClass("answered");

    // check if the answer is correct
    const answer = isCorrectAnswer(this);

    // turn helper
    const turnHelper = function(player, playerScore, isCorrect, thisObject) {
      if (isCorrect) {
        playerScore += parseInt(
          $(thisObject)
            .text()
            .slice(1, $(thisObject).text().length)
        );
      } else {
        playerScore -= parseInt(
          $(thisObject)
            .text()
            .slice(1, $(thisObject).text().length)
        );
      }
      setScore(playerScore, `.${player}-score`);

      return playerScore;
    };

    // update the score iff the player got the answer right
    if (answer) {
      if (turn % 3 === 0) {
        p1Score = turnHelper("player1", p1Score, true, this);
      } else if (turn % 3 === 1) {
        p2Score = turnHelper("player2", p2Score, true, this);
      } else {
        p3Score = turnHelper("player3", p3Score, true, this);
      }
    } else {
      if (turn % 3 === 0) {
        p1Score = turnHelper("player1", p1Score, false, this);
      } else if (turn % 3 === 1) {
        p2Score = turnHelper("player2", p2Score, false, this);
      } else {
        p3Score = turnHelper("player3", p3Score, false, this);
      }
    }

    // update the game mechanics: turn and answered questions
    // to keep the state of the game accurate
    turn++;
    answeredQuestions++;
  };

  const gameWinnerMessage = function(player, score) {
    $(".modal").attr("style", "display: block");
    // hide all unnecessary parts of the modal
    $(".modal")
      .find("input")
      .hide();

    // create winner message
    $(".modal")
      .find("h2")
      .text("Game Over!");
    $(".modal")
      .find("p")
      .text(`${player.text()} is the winner with $${score}!`);
  };

  const multiWinnerMessage = function(score) {
    $(".modal").attr("style", "display: block");
    // hide all unnecessary parts of the modal
    $(".modal")
      .find("input")
      .hide();

    // create winner message
    $(".modal")
      .find("h2")
      .text("Game Over!");
    $(".modal")
      .find("p")
      .text(`Multiple winners today! Multiple contestants got $${score}!`);
  };

  const noWinnerMessage = function() {
    $(".modal").attr("style", "display: block");
    // hide all unnecessary parts of the modal
    $(".modal")
      .find("input")
      .hide();

    // create winner message
    $(".modal")
      .find("h2")
      .text("Game Over!");
    $(".modal")
      .find("p")
      .text(`No winners today. Unfortunately, no one won any money.`);
  };

  // logic for game ending
  const isGameOver = function() {
    // check if the maximum number of questions have been answered
    if (answeredQuestions === $(".question").length) {
      // announce winner (if any)
      if (Math.max(p1Score, p2Score, p3Score) < 0) {
        noWinnerMessage();
      } else if (p1Score > p2Score && p1Score > p3Score) {
        gameWinnerMessage(player1, p1Score);
      } else if (p2Score > p1Score && p2Score > p3Score) {
        gameWinnerMessage(player2, p2Score);
      } else if (p3Score > p1Score && p3Score > p2Score) {
        gameWinnerMessage(player3, p3Score);
      } else {
        multiWinnerMessage(Math.max(p1Score, p2Score, p3Score));
      }
    }
  };

  const resetForm = function() {
    $(".modal").attr("style", "display: none");
    $(".answer").val("");
  };

  // event listeners
  // close modal listeners
  // close with the 'x' button
  $(".close").on("click", function() {
    $(".modal").attr("style", "display: none");
  });

  // close with the 'escape' button
  document.addEventListener("keydown", function(e) {
    if (e.keyCode == 27) {
      $(".modal").attr("style", "display: none");
    }
  });

  // question button listener
  $(".question").on("click", question);
  $(".question").on("click", isGameOver);
});
