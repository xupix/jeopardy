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

  // get user input for contestant names and populate those in the DOM
  // player1 = prompt("What's player 1's name?");
  // $(".player1").text(player1);
  // player2 = prompt("What's player 2's name?");
  // $(".player2").text(player2);
  // player3 = prompt("What's player 3's name?");
  // $(".player3").text(player3);

  // helper function to decide if an answer is correct
  const isCorrectAnswer = () => {
    const answer = prompt("Some question");

    if (answer !== null) {
      return true;
    }

    return false;
  };

  // the handler for the question listener
  const question = function() {
    // update the question that was picked
    $(this)
      .attr("disabled", "disabled")
      .addClass("answered");

    // check if the answer is correct
    const answer = isCorrectAnswer();

    // turn helper
    const turnHelper = function(player, playerScore, isCorrect, thisObject) {
      if (isCorrect) {
        playerScore += parseInt(
          $(thisObject)
            .text()
            .slice(1, $(thisObject).text().length)
        );

        // TODO: fix negative score
        $(`.${player}-score`).text(`$${playerScore}`);
      } else {
        playerScore -= parseInt(
          $(thisObject)
            .text()
            .slice(1, $(thisObject).text().length)
        );

        // TODO: fix negative score
        $(`.${player}-score`).text(`$${playerScore}`);
      }

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

  // logic for game ending
  const isGameOver = function() {
    // check if the maximum number of questions have been answered
    if (answeredQuestions === $(".question").length) {
      alert(`Game Over!`);
      // announce winner (if any)
      if (p1Score > p2Score && p1Score > p3Score) {
        alert(`${player1} is the winner with $${p1Score}!`);
      } else if (p2Score > p1Score && p2Score > p3Score) {
        alert(`${player2} is the winner with $${p2Score}!`);
      } else if (p3Score > p1Score && p3Score > p2Score) {
        alert(`${player3} is the winner with $${p3Score}!`);
      } else {
        alert(
          `No winners today. Multiple contestants got $${Math.max(
            p1Score,
            p2Score,
            p3Score
          )}.`
        );
      }
    }
  };

  const resetForm = function() {    
    $(".modal").attr("style", "display: none");
    $(".answer").val("");
  }

  const setNames = function(playerNumber) {   
    console.log('setNames');
    console.log(playerNumber);

     
    $(".modal").attr("style", "display: block");
    $(".modal").find("p").text("What's your name?");
    $(".answer").focus();

    $(".modal").find("h2").text(`Player ${playerNumber}`);
    $(".modal").find(".answer").attr("placeholder", `Player ${playerNumber}`);
    
    $(".modal").find("form").on("submit", function(e) {
      e.preventDefault();
      if ($("input").val() !== "") {
        if (playerNumber === 1) {
          $('.player1').text($("input").val());
        } else if (playerNumber === 2) {
          console.log('2 is running');
          
          $('.player2').text($("input").val());
        } else if (playerNumber === 3) {
          $('.player3').text($("input").val());
        }
      }

      resetForm();
    });
  }

  // event listeners
  // window.addEventListener("load", function(event) {
  //   setNames();
  // });

  // $("form").on("submit", function(event) {
  //   event.preventDefault();
  // })

  $(".players").on("click", ".player", function() {    
    if ($(this).children(".player1").length) {
      setNames(1);
    } else if ($(this).children(".player2").length) {   
      setNames(2);
    } else if ($(this).children(".player3").length) {
      setNames(3);
    }
  });

  $(".question").on("click", question);
  $(".question").on("click", isGameOver);

  $(".modal-button").on("click", function() {
    $(".modal").toggle();
  })
});
