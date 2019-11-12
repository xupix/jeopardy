$(function() {
  // set up the game mechanics
  let player1 = $(".player1");
  let player2 = $(".player2");
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

  // basic game mechanics for the turn and the game over states
  let turn = 0;
  let answeredQuestions = 0;

  // get user input for contestant names and populate those in the DOM
  player1 = prompt("What's player 1's name?");
  $(".player1").text(player1);
  player2 = prompt("What's player 2's name?");
  $(".player2").text(player2);

  // helper function to decide if an answer is correct
  const isCorrectAnswer = () => {
    const answer = prompt("Some question");

    if (answer !== null) {
      return true;
    }

    return false; 
  }

  // the handler for the question listener
  const question = function() {
    // update the question that was picked
    $(this)
      .attr("disabled", "true")
      .addClass("answered");

    // check if the answer is correct
    const answer = isCorrectAnswer();

    // turn helper
    const turnHelper = function (player, playerScore, isCorrect, thisObject) {
      if (isCorrect) {
        playerScore += parseInt(
        $(thisObject)
          .text()
          .slice(1, $(thisObject).text().length)
        );
        $(`.${player}-score`).text(`$${playerScore}`);
      } else {
        playerScore -= parseInt(
          $(thisObject)
            .text()
            .slice(1, $(thisObject).text().length)
        );
        $(`.${player}-score`).text(`$${playerScore}`);
      }

      return playerScore;
    }

    // updaet the score iff the player got the answer right
    if (answer) {
      if (turn % 2 === 0) {
        p1Score = turnHelper("player1", p1Score, true, this);
      } else {
        p2Score = turnHelper("player2", p2Score, true, this);
      }
    } else {
      if (turn % 2 === 0) {
        p1Score = turnHelper("player1", p1Score, false, this);
      } else {
        p2Score = turnHelper("player2", p2Score, false, this);
      }
    }

      // update the game mechanics: turn and answered questions
      // to keep the state of the game accurate
    turn++;
    answeredQuestions++;
  };

  // logic for game ending
  const isGameOver = function() {
    // check if the maximum number of questions have been answered
    if (answeredQuestions === $(".question").length) {
      alert(`Game Over!`);
      // announce winner (if any)
      if (p1Score > p2Score) {
        alert(`${player1} is the winner with $${p1Score}!`);
      } else if (p2Score > p1Score) {
        alert(`${player2} is the winner with $${p2Score}!`);
      } else {
        alert(`No winners today. Both contestants got $${p1Score}.`);
      }
    }
  };

  // event listeners
  $(".question").on("click", question);
  $(".question").on("click", isGameOver);
});
