$(document).ready(function () {
  var towers = [
      [[], $(".line1")],
      [[], $(".line2")],
      [[], $(".line3")],
    ],
    moves = 0,
    discs = null,
    hold = null,
    solving = false,
    stepIndex = 0,
    solutionSteps = [];

  function clear() {
    towers[0][1].empty();
    towers[1][1].empty();
    towers[2][1].empty();
  }

  function drawdiscs() {
    clear();
    for (var i = 0; i < 3; i++) {
      if (!jQuery.isEmptyObject(towers[i][0])) {
        for (var j = 0; j < towers[i][0].length; j++) {
          towers[i][1].append(
            $(
              "<li id='disc" +
                towers[i][0][j] +
                "' value='" +
                towers[i][0][j] +
                "' draggable='true'></li>"
            )
          );
        }
      }
    }
    addDragListeners();
  }

  function addDragListeners() {
    $(".line1 li, .line2 li, .line3 li").on("dragstart", function (e) {
      e.originalEvent.dataTransfer.setData("text", $(this).attr("id"));
    });
  
    $(".line1, .line2, .line3").on("dragover", function (e) {
      e.preventDefault();
    });
  
    $(".line1, .line2, .line3").on("drop", function (e) {
      e.preventDefault();
      var discId = e.originalEvent.dataTransfer.getData("text");
      var originTower = $("#" + discId).parent().parent().index(); // Adjusted this line
      var destinationTower = $(this).index();
      moveDisc(originTower, destinationTower);
    });
  }
  

  function init() {
    clear();
    towers = [
      [[], $(".line1")],
      [[], $(".line2")],
      [[], $(".line3")],
    ];
    discs = document.getElementById("box").value;
    moves = 0;
    hold = null;
    solving = false;
    stepIndex = 0;
    solutionSteps = [];
    for (var i = discs; i > 0; i--) towers[0][0].push(i);
    drawdiscs();
    $(".moves").text(moves + " moves");
  }

  function handle(tower) {
    if (hold === null && !solving) {
      if (!jQuery.isEmptyObject(towers[tower][0])) {
        hold = tower;
        towers[hold][1].children().last().css("margin-top", "-170px");
      }
    } else {
      if (!solving) {
        var move = moveDisc(hold, tower);
        moves += 1;
        $(".moves").text(moves + " moves");
        if (move == 1) {
          drawdiscs();
        } else {
          alert("You can't place a bigger ring on a smaller one");
        }
        hold = null;
      }
    }
    if (solved()) $(".moves").text("Solved with " + moves + " moves!");
  }

  function moveDisc(a, b) {
    var from = towers[a][0];
    var to = towers[b][0];
    if (from.length === 0) return 0;
    else if (to.length === 0) {
      to.push(from.pop());
      return 1;
    } else if (from[from.length - 1] > to[to.length - 1]) {
      return 0;
    } else {
      to.push(from.pop());
      return 1;
    }
  }

  function solved() {
    if (
      jQuery.isEmptyObject(towers[0][0]) &&
      jQuery.isEmptyObject(towers[1][0]) &&
      towers[2][0].length == discs
    )
      return 1;
    else return 0;
  }

  function autoSolveStep(n, source, target, auxiliary) {
    if (n > 0) {
      autoSolveStep(n - 1, source, auxiliary, target);
      solutionSteps.push({ source, target });
      autoSolveStep(n - 1, auxiliary, target, source);
    }
  }

  function autoSolveAnimation() {
    if (stepIndex < solutionSteps.length) {
      var step = solutionSteps[stepIndex];
      moveDisc(step.source, step.target);
      drawdiscs();
      moves += 1;
      $(".moves").text(moves + " moves");
  
      if (solved()) {
        $(".moves").text("Solved with " + moves + " moves!");
        solving = false;
        return; // Stop the animation
      }
  
      stepIndex++;
      setTimeout(autoSolveAnimation, 500); // Adjust the delay as needed
    } else {
      solving = false;
    }
  }

  $("#restart").click(function () {
    init();
  });

  $("#autoSolve").click(function () {
    if (!solving) {
      solving = true;
      autoSolveStep(discs, 0, 2, 1);
      autoSolveAnimation();
    }
  });

  $(".t").click(function () {
    handle($(this).attr("value"));
  });

  init();
});

const typed = new Typed('.multiple-text',{
  strings: ['Move All The Rings Over Tower 3 With Your Mouse.', 'You Cannot place A Large Ring Onto A Smaller Ring.', 'Press Number Of Rings And Press Restart To Add More Rings.'],
  typeSpeed: 50,
  backSpeed: 50,
  backDelay: 1000,
  loop: true
});