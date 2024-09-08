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
    console.log(doodler, "doodler");

    setTimeout(() => {
      doodler.style.bottom = `${parseInt(doodler.style.bottom) + 20}%`;
      fall(doodler, 35, 1); // Doodler starts falling
    }, 300);
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

  function moveUp() {
    let doodlerBottom = parseInt(doodler.style.bottom) || 5;
    let doodlerLeft = parseInt(doodler.style.left) || 50;
    if (parseInt(doodlerBottom) < 90) {
      doodler.style.bottom = `${parseInt(doodlerBottom) + 30}%`;
    }
  }

  // Check if doodler is on a platform
  function isOnPlatform() {
    const platforms = document.querySelectorAll(".platform");
    const doodlerRect = doodler.getBoundingClientRect();

    return [...platforms].some((platform) => {
      const platformRect = platform.getBoundingClientRect();
      const isDoodlerOnPlatform =
        doodlerRect.bottom === platformRect.top &&
        doodlerRect.left + doodlerRect.width > platformRect.left &&
        doodlerRect.left < platformRect.left + platformRect.width;

      return isDoodlerOnPlatform;
    });
  }

  // Make an object fall at the specified interval
  function fall(obj, time, fallAmount) {
    const fallInterval = setInterval(() => {
      let bottom = obj.style.bottom || "5%";
      if (parseInt(bottom) > 5) {
        if (obj.classList.contains("doodler") && isOnPlatform()) {
          doodler.style.bottom = `${parseInt(doodler.style.bottom) + 45}%`;
          counter++;
          document.querySelector(".counter").innerHTML = counter;
          console.log(counter, "counter");
          return;
        }
        obj.style.bottom = `${parseInt(bottom) - fallAmount}%`;
      } else if (
        obj.classList.contains("platform") &&
        !obj.classList.contains("doodler")
      ) {
        obj.style.display = "none"; // Remove platform when out of view
        clearInterval(fallInterval); // Clear interval when platform is removed
      } else if (
        obj.classList.contains("doodler") &&
        !isOnPlatform() &&
        startTimer
      ) {
        startTimer = false;
      } else if (!startTimer) {
        clearInterval(fallInterval);
        endGame(); // Trigger game over when doodler hits the bottom
      }
    }, time);
    intervals.push(fallInterval); // Store interval IDs
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

  // Initialize the game by creating the doodler and platforms
  createDoodler();
  createInitialPlatforms(); // Create the first platforms when the game starts
  addPlatforms(); // Add new platforms over time
});
