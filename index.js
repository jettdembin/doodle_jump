document.addEventListener("DOMContentLoaded", () => {
  const grid = document.querySelector(".grid");
  const doodler = document.createElement("div");
  let isGameOver = false;

  // Create and position the doodler
  function createDoodler() {
    doodler.classList.add("doodler");
    doodler.style.bottom = "5%";
    grid.appendChild(doodler);
    console.log(doodler, "doodler");

    fall(doodler, 35, 1); // Doodler starts falling
  }

  // Create an initial platform at the start of the game
  function createInitialPlatforms() {
    const platform = document.createElement("div");
    platform.classList.add("platform");
    platform.classList.add("first-platform");
    platform.style.left = "50%";
    platform.style.bottom = "0%";

    setTimeout(() => {
      platform.style.display = "none";
    }, 300);

    const platform2 = document.createElement("div");
    platform2.classList.add("platform");
    platform2.classList.add("first-platform");
    platform2.style.left = "10%";
    platform2.style.bottom = "40%";

    const platform3 = document.createElement("div");
    platform3.classList.add("platform");
    platform3.classList.add("first-platform");
    platform3.style.left = "30%";
    platform3.style.bottom = "21%";

    const platform4 = document.createElement("div");
    platform4.classList.add("platform");
    platform4.classList.add("first-platform");
    platform4.style.left = "50%";
    platform4.style.bottom = "60%";

    const platform5 = document.createElement("div");
    platform5.classList.add("platform");
    platform5.classList.add("first-platform");
    platform5.style.left = "62%";
    platform5.style.bottom = "75%";

    const platform6 = document.createElement("div");
    platform6.classList.add("platform");
    platform6.classList.add("first-platform");
    platform6.style.left = "83%";
    platform6.style.bottom = "90%";

    grid.appendChild(platform);
    grid.appendChild(platform2);
    grid.appendChild(platform3);
    grid.appendChild(platform4);
    grid.appendChild(platform5);
    grid.appendChild(platform6);

    fall(platform, 80, 1);
    fall(platform2, 80, 1);
    fall(platform3, 80, 1);
    fall(platform4, 80, 1);
    fall(platform5, 80, 1);
    fall(platform6, 80, 1);
  }

  // Create a new platform at a random position
  function addPlatform() {
    const platform = document.createElement("div");
    platform.classList.add("platform");
    grid.appendChild(platform);

    const { left } = generateRandomPosition();
    platform.style.left = `${left}%`;
    platform.style.bottom = "100%";

    fall(platform, 80, 1); // Platform starts falling
  }

  // Continuously add new platforms every 3 seconds
  function addPlatforms() {
    setInterval(addPlatform, 1500);
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

  // Function to convert percentage values to pixels
  function convertToPixels(percent, containerDimension) {
    return (parseInt(percent) / 100) * containerDimension;
  }

  // Make an object fall at the specified interval
  function fall(obj, time, fallAmount) {
    setInterval(() => {
      let bottom = obj.style.bottom || 5;
      if (parseInt(bottom) > 5) {
        obj.style.bottom = `${parseInt(bottom) - fallAmount}%`;
      } else if (
        obj.classList.contains("platform") &&
        !obj.classList.contains("doodler")
      ) {
        obj.style.display = "none";
      }

      // Collision detection
      function checkForCollisionWithDoodler() {
        const platforms = document.querySelectorAll(".platform");
        const doodlerRect = doodler.getBoundingClientRect(); // Get doodler's position and size in pixels

        [...platforms].forEach((platform) => {
          const platformRect = platform.getBoundingClientRect(); // Get platform's position and size in pixels

          // Check if the doodler's bottom is colliding with the platform's top
          const isDoodlerOnPlatform =
            doodlerRect.bottom === platformRect.top &&
            doodlerRect.left + doodlerRect.width > platformRect.left &&
            doodlerRect.left < platformRect.left + platformRect.width;

          if (isDoodlerOnPlatform) {
            // If doodler is on the platform, make it jump
            doodler.style.bottom = `${parseInt(doodler.style.bottom) + 20}%`;
          }
        });
      }
      checkForCollisionWithDoodler();
    }, time);
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
  createInitialPlatforms(); // Create the first platform when the game starts
  addPlatforms(); // Add new platforms over time
});
