document.addEventListener('DOMContentLoaded', function () {
  // Define variables to store the state of the towers, moves, discs, etc.
  var towers = [
      [[], document.querySelector(".line1")],
      [[], document.querySelector(".line2")],
      [[], document.querySelector(".line3")],
    ],
    moves = 0,
    discs = null,
    hold = null,
    solving = false,
    stepIndex = 0,
    solutionSteps = [];

  // Function to clear the content of all towers
  function clear() {
    towers[0][1].innerHTML = '';
    towers[1][1].innerHTML = '';
    towers[2][1].innerHTML = '';
  }

  // Function to draw the discs on the towers based on the current state
  function drawdiscs() {
    clear();
    for (var i = 0; i < 3; i++) {
      if (towers[i][0].length > 0) {
        for (var j = 0; j < towers[i][0].length; j++) {
          var discElement = document.createElement("li");
          discElement.id = 'disc' + towers[i][0][j];
          discElement.value = towers[i][0][j];
          discElement.draggable = true;
          towers[i][1].appendChild(discElement);
        }
      }
    }
    // Add drag-and-drop listeners to the discs
    addDragListeners();
  }

  // Function to add drag-and-drop event listeners to the discs
  function addDragListeners() {
    var discElements = document.querySelectorAll(".line1 li, .line2 li, .line3 li");
    discElements.forEach(function (discElement) {
      discElement.addEventListener("dragstart", function (e) {
        e.dataTransfer.setData("text", discElement.id);
      });
    });

    var towerElements = document.querySelectorAll(".line1, .line2, .line3");
    towerElements.forEach(function (towerElement) {
      towerElement.addEventListener("dragover", function (e) {
        e.preventDefault();
      });

      towerElement.addEventListener("drop", function (e) {
        e.preventDefault();
        var discId = e.dataTransfer.getData("text");
        var originTower = document.getElementById(discId).parentNode.parentNode.cellIndex;
        var destinationTower = towerElement.cellIndex;
        moveDisc(originTower, destinationTower);
      });
    });
  }

  // Function to initialize the game state
  function init() {
    clear();
    towers = [
      [[], document.querySelector(".line1")],
      [[], document.querySelector(".line2")],
      [[], document.querySelector(".line3")],
    ];
    discs = document.getElementById("box").value;
    moves = 0;
    hold = null;
    solving = false;
    stepIndex = 0;
    solutionSteps = [];
    for (var i = discs; i > 0; i--) towers[0][0].push(i);
    drawdiscs();
    document.querySelector(".moves").textContent = moves + " moves";
  }

  // Function to perform a deep copy of an array
  function deepCopy(arr) {
    var copy = [];
    for (var i = 0; i < arr.length; i++) {
      if (Array.isArray(arr[i])) {
        copy[i] = deepCopy(arr[i]);
      } else {
        copy[i] = arr[i];
      }
    }
    return copy;
  }

  // Function to handle user interactions with the towers
  function handle(tower) {
    if (hold === null && !solving) {
      if (towers[tower][0].length > 0) {
        hold = tower;
        towers[hold][1].lastElementChild.style.marginTop = "-170px";
      }
    } else {
      if (!solving) {
        var towersCopy = deepCopy(towers);
  
        var move = moveDisc(hold, tower);
        moves += 1;
        document.querySelector(".moves").textContent = moves + " moves";
  
        if (move == 1) {
          drawdiscs();
        } else {
          // Restore towers to the previous state if the move is not valid
          towers = towersCopy;
          drawdiscs();
          // Replace alert with SweetAlert
          Swal.fire({

            title: 'Invalid Move',
            icon: 'error',
            text: "You can't place a bigger ring on a smaller one",
            customClass:
            {
              icon: 'sweetalert-icon',
              title: 'sweetalert-title',
              content: 'sweetalert-text',
            },
            width: window.innerWidth > 600 ? '500px' : '80%'
          });
        }
  
        hold = null;
      }
    }
  
    if (solved()) {
      Swal.fire({
        icon: 'success',
        title: 'Congratulations!',
        text: 'Puzzle solved with ' + moves + ' moves!',
        customClass:
        {
          icon: 'sweetalert-icon',
          title: 'sweetalert-title',
          content: 'sweetalert-text',
        },
        width: window.innerWidth > 600 ? '500px' : '80%'
      });
      document.querySelector(".moves").textContent = "Solved with " + moves + " moves!";
    }
  }

  // Function to move a disc from one tower to another
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

  // Function to check if the puzzle is solved
  function solved() {
    if (
      towers[0][0].length === 0 &&
      towers[1][0].length === 0 &&
      towers[2][0].length == discs
    )
      return 1;
    else return 0;
  }

  // Function to generate the solution steps for auto-solving
  function autoSolveStep(n, source, target, auxiliary) {
    if (n > 0) {
      autoSolveStep(n - 1, source, auxiliary, target);
      solutionSteps.push({ source, target });
      autoSolveStep(n - 1, auxiliary, target, source);
    }
  }

  // Function to animate the auto-solving steps
  function autoSolveAnimation() {
    if (stepIndex < solutionSteps.length) {
      var step = solutionSteps[stepIndex];
      moveDisc(step.source, step.target);
      drawdiscs();
      moves += 1;
      document.querySelector(".moves").textContent = moves + " moves";

      // If the puzzle is solved, display a message
      if (solved()) {
        Swal.fire({
          icon: 'success',
          title: 'Congratulations!',
          text: 'Puzzle solved with ' + moves + ' moves!',
          customClass:
          {
            icon: 'sweetalert-icon',
            title: 'sweetalert-title',
            content: 'sweetalert-text',
          },
          width: window.innerWidth > 600 ? '500px' : '80%'
        });
        document.querySelector(".moves").textContent = "Solved with " + moves + " moves!";
        solving = false;
        return; 
      }

      stepIndex++;
      // Use setTimeout for animation delay
      setTimeout(autoSolveAnimation, 500); 
    } else {
      solving = false;
    }
  }

  // Event handler for the restart button
  document.getElementById("restart").addEventListener("click", function () {
    init();
  });

  // Event handler for the autoSolve button
  document.getElementById("autoSolve").addEventListener("click", function () {
    if (!solving) {
      solving = true;
      autoSolveStep(discs, 0, 2, 1);
      autoSolveAnimation();
    }
  });

  // Event handler for clicking on a tower
  var towerElements = document.querySelectorAll(".t");
  towerElements.forEach(function (towerElement) {
    towerElement.addEventListener("click", function () {
      handle(towerElement.getAttribute("value"));
    });
  });

  // Initialize the game state when the document is ready
  init();
});

// This will be auto generate the text in the objectives and loop it
var typed = new Typed('.multiple-text',{
  strings: ['Move All The Rings Over Tower 3 With Your Mouse.', 'You Cannot place A Large Ring Onto A Smaller Ring.', 'Press Number Of Rings And Press Restart To Add More Rings.'],
  typeSpeed: 50,
  backSpeed: 50,
  backDelay: 1000,
  loop: true
});


//This will check if the minimum and maximum Rings or Disc if they exceed or less than the input
document.addEventListener('DOMContentLoaded', function () {
  var inputBox = document.getElementById('box');

  // Event listener for keydown events
  inputBox.addEventListener('keydown', function (event) {
    // Check if the pressed key is Enter (key code 13)
    if (event.key === 'Enter') {
      var enteredValue = parseInt(inputBox.value, 10);
      var minValue = parseInt(inputBox.min, 10);
      var maxValue = parseInt(inputBox.max, 10);

      // Check if the entered value is within the specified range
      if (isNaN(enteredValue) || enteredValue < minValue || enteredValue > maxValue) {
        // Display SweetAlert error message
        Swal.fire({
          icon: 'error',
          title: 'Invalid Input',
          text: 'Please enter a value between ' + minValue + ' and ' + maxValue + '.',
          customClass:
          {
            icon: 'sweetalert-icon',
            title: 'sweetalert-title',
            content: 'sweetalert-text',
          },
          width: window.innerWidth > 600 ? '500px' : '80%'
        });

        // Prevent the default behavior of the Enter key (form submission)
        event.preventDefault();
      }
    }
  });
});




//This is my scroll reveal when the page is load

ScrollReveal({ 
  // reset: true,
  distance: '40px',
  duration:  1400,
  delay: 100
});

ScrollReveal().reveal('.title', { origin: 'top' });
ScrollReveal().reveal('.towers',  { origin: 'bottom' });
ScrollReveal().reveal('.section, .objectives',  { origin: 'left' });


