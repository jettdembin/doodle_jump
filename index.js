document.addEventListener("DOMContentLoaded", () => {
  const grid = document.querySelector(".grid");
  const doodler = document.createElement("div");
  let isGameOver = false;
  let startTimer = true;
  let intervals = [];

  let counter = 0;

  // Create and position the doodler
  function createDoodler() {
    doodler.classList.add("doodler");
    doodler.style.bottom = "5%";
    grid.appendChild(doodler);
    document.querySelector(".counter").innerHTML = counter;

    // setTimeout(() => {
    //   doodler.style.bottom = `${parseInt(doodler.style.bottom) + 40}%`;
    //   fall(doodler, 20, 1); // Doodler starts falling
    // }, 300);
  }

  // Create initial platforms programmatically
  function createInitialPlatforms() {
    const initialPlatforms = [
      { left: "50%", bottom: "0%" },
      { left: "10%", bottom: "40%" },
      { left: "30%", bottom: "21%" },
      { left: "50%", bottom: "60%" },
      { left: "62%", bottom: "75%" },
      { left: "83%", bottom: "90%" },
    ];

    initialPlatforms.forEach((position) => {
      const platform = document.createElement("div");
      platform.classList.add("platform", "first-platform");
      platform.style.left = position.left;
      platform.style.bottom = position.bottom;
      grid.appendChild(platform);
      fall(platform, Math.floor(Math.random() * 51) + 50, 1);
    });
  }

  // Create a new platform at a random position
  function addPlatform() {
    const platform = document.createElement("div");
    platform.classList.add("platform");
    grid.appendChild(platform);

    const { left } = generateRandomPosition();
    platform.style.left = `${left}%`;
    platform.style.bottom = "100%";

    fall(platform, Math.floor(Math.random() * 51) + 50, 1);
  }

  // Continuously add new platforms every 1.5 seconds
  function addPlatforms() {
    let platformInterval = setInterval(addPlatform, 1500);
    intervals.push(platformInterval); // Save interval ID for clearing later
  }

  // Generate a random position for platforms
  function generateRandomPosition() {
    return { left: Math.floor(Math.random() * 100) };
  }

  // Control movement: left, right, and up
  function moveLeft() {
    let left = parseInt(doodler.style.left) || 50;
    doodler.style.left = `${parseInt(left) - 10}%`;
  }

  function moveRight() {
    let left = doodler.style.left || 50;
    doodler.style.left = `${parseInt(left) + 10}%`;
  }

  // Make an object fall at the specified interval
  function fall(obj, time, fallAmount) {
    const fallInterval = setInterval(() => {
      let bottom = obj.style.bottom || "5%";
      if (parseInt(bottom) > 5) {
        obj.style.bottom = `${parseInt(bottom) - fallAmount}%`;
      } else if (obj.classList.contains("platform")) {
        obj.style.display = "none"; // Remove platform when out of view
        clearInterval(fallInterval); // Clear interval when platform is removed
      }
    }, time);
    intervals.push(fallInterval); // Store interval IDs
  }

  // Smooth jump using bottom style
  function jumpDoodler() {
    let doodlerBottom = parseInt(doodler.style.bottom) || 5;
    const doodlerRect = doodler.getBoundingClientRect();
    const gridRect = grid.getBoundingClientRect();

    let jumpHeight = 200;
    let isJumping = true;
    let startTime = null;

    function jump(timestamp) {
      if (!startTime) startTime = timestamp;
      let progress = timestamp - startTime;
      let jumpProgress = Math.min(progress / 5, jumpHeight);

      // Move up until reaching the peak of the jump
      if (isJumping && jumpProgress < jumpHeight) {
        doodler.style.bottom = `${doodlerBottom + jumpProgress}px`; // Update the bottom directly
        requestAnimationFrame(jump);
      } else {
        isJumping = false;
        // Once the jump is complete, start falling
        fallDoodler();
      }
    }

    // Call jump animation
    requestAnimationFrame(jump);
  }

  // Fall after the jump
  function fallDoodler() {
    let doodlerBottom = parseInt(doodler.style.bottom);
    let isFalling = true;
    let startTime = null;
    let fallHeight = Math.max(grid.clientHeight, 200);
    let gravity = 2; // Fall speed

    function fall(timestamp) {
      if (!startTime) startTime = timestamp;
      let progress = timestamp - startTime;
      let fallProgress = Math.min(progress / 5, fallHeight);

      // Move down
      if (isFalling) {
        doodler.style.bottom = `${doodlerBottom - fallProgress}px`;

        //Check if doodler is at bottom of grid
        const doodlerRect = doodler.getBoundingClientRect();
        const gridRect = grid.getBoundingClientRect();

        const platforms = document.querySelectorAll(".platform");

        let isOnPlatform = [...platforms].some((platform) => {
          const platformRect = platform.getBoundingClientRect();
          const isDoodlerOnPlatform =
            doodlerRect.bottom >= platformRect.top - 5 &&
            doodlerRect.bottom <= platformRect.top + 5 &&
            doodlerRect.left + doodlerRect.width > platformRect.left &&
            doodlerRect.left < platformRect.left + platformRect.width;

          if (isDoodlerOnPlatform) {
            return true;
          }
        });

        if (isOnPlatform) {
          isFalling = false;
          jumpDoodler();
          counter++;
          document.querySelector(".counter").innerHTML = counter;
          return;
        }

        if (doodlerRect.bottom + 20 >= gridRect.bottom) {
          isFalling = false;
          debugger;
          endGame(); // End game if doodler hits the bottom
        } else {
          requestAnimationFrame(fall);
          debugger;
        }
      }
    }

    // Call fall animation
    requestAnimationFrame(fall);
  }

  // End game and clear all intervals
  function endGame() {
    isGameOver = true;
    intervals.forEach(clearInterval); // Clear all intervals
    alert("Game Over!");
    location.reload(); // Reload the page
  }

  // Handle key events to control movement
  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") {
      moveLeft();
    } else if (e.key === "ArrowRight") {
      moveRight();
    } else if (e.key === " ") {
      moveUp();
    }
  });

  function startGame() {
    createDoodler();
    createInitialPlatforms();
    addPlatforms();

    jumpDoodler();
  }

  startGame();
});
