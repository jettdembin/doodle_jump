document.addEventListener("DOMContentLoaded", () => {
  class Game {
    constructor() {
      this.platforms = [];
      this.intervals = [];
      this.counter = 0;
      this.doodler = new Doodler(this);
    }

    addPlatform = () => {
      const platform = new Platform(
        `${this.generateRandomPosition().left}%`,
        "100%",
        this
      );
      this.platforms.push(platform);
      const platformType =
        Math.random() < 0.5
          ? "NORMAL"
          : Math.random() < 0.5
          ? "BLINK"
          : "SPRING";

      if (platformType === "BLINK") {
        const blinkPlatform = new BlinkPlatform(
          platform.platform.style.left,
          platform.platform.style.bottom
        );
        this.platforms.pop();
        this.platforms.push(blinkPlatform);
      }

      if (platformType === "SPRING") {
        const springPlatform = new SpringPlatform(
          platform.platform.style.left,
          platform.platform.style.bottom
        );
        this.platforms.pop();
        this.platforms.push(springPlatform);
      }

      platform.fall(platform.platform, Math.floor(Math.random() * 51) + 50, 1);
    };

    // Continuously add new platforms every 1.5 seconds
    addPlatforms = () => {
      let platformInterval = setInterval(this.addPlatform, 1500);
      this.intervals.push(platformInterval); // Save interval ID for clearing later
    };

    createInitialPlatforms = () => {
      const initialPlatforms = [
        { left: "50%", bottom: "0%" },
        { left: "10%", bottom: "40%" },
        { left: "30%", bottom: "21%" },
        { left: "50%", bottom: "60%" },
        { left: "62%", bottom: "75%" },
        { left: "83%", bottom: "90%" },
      ];

      initialPlatforms.forEach((position) => {
        const platform = new Platform(position.left, position.bottom, this);
        this.platforms.push(platform);
      });
    };

    generateRandomPosition = () => {
      return {
        left: Math.floor(Math.random() * 100),
      };
    };

    startGame = () => {
      this.createInitialPlatforms();
      this.addPlatforms();
    };

    // End game and reset all values
    endGame = () => {
      this.intervals.forEach(clearInterval); // Clear all intervals

      // Clear all platforms
      document.querySelectorAll(".platform").forEach((platform) => {
        platform.remove();
      });

      // Reset doodler position
      this.doodler.doodler.style.bottom = "5%";
      this.doodler.doodler.style.left = "50%";

      this.intervals = [];
      this.counter = 0;
      document.querySelector(".counter").innerHTML = 0;
    };
  }

  class Doodler {
    constructor(game) {
      this.doodler = document.createElement("div");
      this.doodler.classList.add("doodler", "shadow-sm");
      this.doodler.style.bottom = "5%";
      document.querySelector(".grid").appendChild(this.doodler);
      document.querySelector(".counter").innerHTML = 0;
      this.game = game;

      document.querySelector(".start").addEventListener("click", () => {
        this.jumpDoodler();
      });

      // Handle key events to control movement
      document.addEventListener("keydown", (e) => {
        if (e.key === "ArrowLeft") {
          this.moveLeft();
        } else if (e.key === "ArrowRight") {
          this.moveRight();
        }
      });
    }

    // Smooth jump using bottom style
    jumpDoodler = (type) => {
      let doodlerBottom = parseInt(this.doodler.style.bottom) || 5;
      const doodlerRect = this.doodler.getBoundingClientRect();
      const gridRect = document.querySelector(".grid").getBoundingClientRect();

      let jumpHeight =
        type === "SPRING"
          ? Math.abs(gridRect.top - doodlerRect.top) > 300
            ? 300
            : Math.abs(gridRect.top - doodlerRect.top)
          : Math.abs(gridRect.top - doodlerRect.top) > 200
          ? 200
          : Math.abs(gridRect.top - doodlerRect.top);
      let isJumping = true;
      let startTime = null;

      const jump = (timestamp) => {
        if (!startTime) startTime = timestamp;
        let progress = timestamp - startTime;
        let jumpProgress = Math.min(
          progress / (type === "SPRING" ? 2 : 5),
          jumpHeight
        );

        // Move up until reaching the peak of the jump
        if (isJumping && jumpProgress < jumpHeight) {
          this.doodler.style.bottom = `${doodlerBottom + jumpProgress}px`; // Update the bottom directly
          requestAnimationFrame(jump);
        } else {
          isJumping = false;
          // Once the jump is complete, start falling
          this.fallDoodler();
        }
      };

      // Call jump animation
      requestAnimationFrame(jump);
    };

    // Fall after the jump
    fallDoodler = () => {
      let doodlerBottom = parseInt(this.doodler.style.bottom);
      let isFalling = true;
      let startTime = null;
      let fallHeight = Math.max(
        document.querySelector(".grid").clientHeight,
        200
      );
      let gravity = 2; // Fall speed

      const fall = (timestamp) => {
        if (!startTime) startTime = timestamp;
        let progress = timestamp - startTime;
        let fallProgress = Math.min(progress / 5, fallHeight);

        // Move down
        if (isFalling) {
          this.doodler.style.bottom = `${doodlerBottom - fallProgress}px`;

          //Check if doodler is at bottom of grid
          const doodlerRect = this.doodler.getBoundingClientRect();
          const gridRect = document
            .querySelector(".grid")
            .getBoundingClientRect();

          const platforms = document.querySelectorAll(".platform");

          let platformDoodlerIsOn = null;

          let isOnPlatform = [...platforms].some((platform) => {
            const platformRect = platform.getBoundingClientRect();
            const isDoodlerOnPlatform =
              doodlerRect.bottom >= platformRect.top - 5 &&
              doodlerRect.bottom <= platformRect.top + 5 &&
              doodlerRect.left + doodlerRect.width > platformRect.left &&
              doodlerRect.left < platformRect.left + platformRect.width;

            if (isDoodlerOnPlatform) {
              platformDoodlerIsOn = platform;
              return isDoodlerOnPlatform;
            }
          });

          if (isOnPlatform) {
            isFalling = false;
            this.game.counter++;
            document.querySelector(".counter").innerHTML = this.game.counter;
            if (platformDoodlerIsOn.classList.contains("spring")) {
              this.jumpDoodler("SPRING");
            } else {
              this.jumpDoodler();
            }

            return;
          }

          if (doodlerRect.bottom + 20 >= gridRect.bottom) {
            isFalling = false;

            this.game.endGame(); // End game if doodler hits the bottom
          } else {
            requestAnimationFrame(fall);
          }
        }
      };

      // Call fall animation
      requestAnimationFrame(fall);
    };

    moveLeft = () => {
      let left = parseInt(this.doodler.style.left) || 50;
      const shouldMove = left > 10;

      shouldMove ? (this.doodler.style.left = `${left - 10}%`) : null;
    };

    moveRight = () => {
      let left = parseInt(this.doodler.style.left) || 50;
      const shouldMove = left + 10 <= 90;
      shouldMove ? (this.doodler.style.left = `${left + 10}%`) : null;
    };
  }

  class Platform {
    constructor(left, bottom, game) {
      this.platform = document.createElement("div");
      this.platform.classList.add("platform", "shadow-lg");
      this.platform.style.left = left;
      this.platform.style.bottom = bottom;
      document.querySelector(".grid").appendChild(this.platform);
      this.fall(this.platform, Math.floor(Math.random() * 51) + 50, 1);

      this.game = game;
    }

    fall = (platform, time, speed) => {
      let interval = setInterval(() => {
        let bottom = parseInt(platform.style.bottom);
        bottom -= speed;
        platform.style.bottom = `${bottom}%`;

        if (bottom <= -10) {
          clearInterval(interval);
          platform.remove();
        }
      }, time);
      if (this.game) {
        this.game.intervals.push(interval);
      }
    };
  }

  class BlinkPlatform extends Platform {
    constructor(left, bottom) {
      super(left, bottom);
      this.platform.classList.add("blink");
      this.randomTime = Math.floor(Math.random() * 6000) + 2000;

      setTimeout(() => {
        this.platform.style.display = "none";
      }, this.randomTime);
    }
  }

  class SpringPlatform extends Platform {
    constructor(left, bottom) {
      super(left, bottom);
      this.platform.classList.add("spring");
      this.platform.style.backgroundColor = "green";
      this.isSpring = true;
    }
  }

  const game = new Game();
  document.querySelector(".start").addEventListener("click", () => {
    game.startGame();
  });
});
