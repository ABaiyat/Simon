$(document).ready(function() {
  var strictState = false;
  var startState = false;
  var machineState = false;
  var playerTurn = false;
  var flag = false;
  var a,b,c;
  var count = 0;
  var curPos = 0;
  var movesToWin = 20;
  var playerSet = [];
  var solutionSet = [];
  var buttons = [
    ["#q1", "#1565C0", "#4484CD", "button1"],
    ["#q2", "#1B5E20", "#497E4D", "button2"],
    ["#q3", "#B71C1C", "#C54949", "button3"],
    ["#q4", "#FDD835", "#FEE67C", "button4"]
  ];

  // Switch Handler Changes the state of the Switch
  // to reset the board
  $("input[type='checkbox']").change(function() {
    if (machineState) {
      machineState = false;
      $(".strictButton").css("border-color", "black");
      resetColors();

      // Resets any button changes in progress
      clearTimeout(a);
      clearTimeout(b);
      clearTimeout(c);
      // Sets
      $("#count").html("");
      strictState = false;
      count = 0;
      solutionSet = [];
    } else if (!machineState) {
      machineState = true;
      $("#count").html("--");
    }
  });

  $(".strictButton").click(function() {
    if (machineState) {
      if (strictState) {
        $(".strictButton").css("border-color", "black");
        strictState = false;
      } else {
        $(".strictButton").css("border-color", "red");
        strictState = true;
      }
    }
  });

  $(".startButton").click(function() {
    resetColors();
    if (machineState && !startState) {
      startState = true;
      setTimeout(lockState, 1000);
      solutionSet = [];
      clearPlayerSet();
      $("#count").html("--");
      count = 1;
      $("#count")
        .fadeOut(300)
        .fadeIn(300)
        .fadeOut(300)
        .fadeIn(300)
        .fadeOut(300);

      setTimeout(function() {
        $("#count").html(1).fadeIn(0);
        flag = false;
      }, 1500);
      addToSolution();
      playSolution();

      function lockState() {
        startState = false;
      }
    }
  });

  // Shows the activation state for each
  function pingButton(index) {
    // Timeout function used to change the count
    a = setTimeout(function() {
      if (count !== 0) {
        if (machineState) {
          $("#count").html(count).fadeIn();
        } else {
          return false;
        }
      }
    }, 1500 + index * 800);

    // Used to show button activation
    b = setTimeout(function() {
      if (machineState) {
        // Changes corresponding button to indicate that button is activated
        $(buttons[solutionSet[index]][0]).css(
          "background-color",
          buttons[solutionSet[index]][2]
        );
        // Plays corresponding sound
        soundManager.play(buttons[solutionSet[index]][3]);
      } else {
        return false;
      }
    }, 2000 + index * 800);

    // Resets button color back to unactivated state
    c = setTimeout(function() {
      if (machineState) {

        $(buttons[solutionSet[index]][0]).css(
          "background-color",
          buttons[solutionSet[index]][1]
        );
      } else {
        return false;
      }
    }, 2500 + index * 800);

    // Recursive callback until all entries in the set have been shown
    if (index < solutionSet.length - 1) {
      pingButton(index + 1);
    } else {
      return true;
    }
  }

  // Calls pingButton to display the solution and sets the enables the player's
  // turn
  function playSolution() {
    if (machineState) {
        var ping = pingButton(0);
    }
    setTimeout(function() {
      playerTurn = true;
    }, 2000 + count * 800);
  }

  // Handles the red, blue, green, and yellow button clicks
  $(".q1, .q2, .q3, .q4").click(function(event) {
    if (playerTurn && machineState && solutionSet.length > 0) {
      var id = $(event.target).attr("id");

      // Changing click color and playing audio
      var index = ["q1", "q2", "q3", "q4"].indexOf(id);
      playerClicked(index);

      // Pushes the clicked button's value to compare with the solution
      playerSet.push("#" + id);

      // If the clicked button is incorrect
      if (
        playerSet[playerSet.length - 1] !==
        buttons[solutionSet[playerSet.length - 1]][0]
      ) {
        clearPlayerSet()
        soundManager.play("error");
        $("#count").html("!!!").fadeOut(400).fadeIn(400).fadeOut(400);
        // If strict state is disabled, the same soltuion is used and the
        if (!strictState) {
          setTimeout(function() {
            $("#count").html(count).fadeIn(0);
          }, 1600);
        }
        // If strict state is enabled, the solution is reset
        else if (strictState) {
          setTimeout(function() {
            $("#count").html(1).fadeIn(0);
          }, 1600);
          solutionSet = [];
          count = 1;
          addToSolution();
        }
        playSolution();

      }
      // The clicked button is correct in the sequence
      else {
        soundManager.play(buttons[index][3]);

        // If the player entered all of the correct buttons in the sequences
        if (playerSet.length === solutionSet.length) {
          clearPlayerSet();

          // If the count is equal to the number of moves to win, indicates
          // a win, and resets the count and the solution
          if (count === movesToWin) {
            setTimeout(function() {
              $("#count").html("WIN").fadeOut(400).fadeIn(400).fadeOut(400);
              soundManager.play("winner");
            }, 200);

            setTimeout(function() {
              $("#count").html(1).fadeIn(0);
            }, 2000);
            count = 0;
            solutionSet = [];
          }
          count++;
          addToSolution();
          playSolution();
        }
      }
    }
  });

  // Generates a random number for the next entry to the solution, and pushes
  // that entry onto the solution set
  function addToSolution() {
    var random = Math.floor(Math.random() * 4);
    solutionSet.push(random);
  }

  // Resets all Colors to indicate an unactivated state
  function resetColors() {
    $(".q1").css("background-color", buttons[0][1]);
    $(".q2").css("background-color", buttons[1][1]);
    $(".q3").css("background-color", buttons[2][1]);
    $(".q4").css("background-color", buttons[3][1]);
  }

  // Shows button in activation state by changing its color
  function playerClicked(index) {
    $(buttons[index][0]).css("background-color", buttons[index][2])
    setTimeout(function() {
      $(buttons[index][0]).css("background-color", buttons[index][1]);
    }, 400);
  }

  // Clears the player set and disables the player's turn
  function clearPlayerSet() {
    playerSet = [];
    playerTurn = false;
  }

  soundManager.onready(function() {
    soundManager.createSound({
      id: "button1",
      url: "https://s3.amazonaws.com/freecodecamp/simonSound1.mp3"
    });
    soundManager.createSound({
      id: "button2",
      url: "https://s3.amazonaws.com/freecodecamp/simonSound2.mp3"
    });
    soundManager.createSound({
      id: "button3",
      url: "https://s3.amazonaws.com/freecodecamp/simonSound3.mp3"
    });
    soundManager.createSound({
      id: "button4",
      url: "https://s3.amazonaws.com/freecodecamp/simonSound4.mp3"
    });
    soundManager.createSound({
      id: "error",
      url: "http://www.threecaster.com/wavy/WARNING1.wav"
    });
    soundManager.createSound({
      id: "winner",
      url: "http://www.qwizx.com/gssfx/usa/ff-bell.wav"
    });
  });
});
