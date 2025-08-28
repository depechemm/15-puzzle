export class gameOfFifteen {
  slidingGameElements = {
    gameTableContainer: null,
    gameTableElement: null,
    PuzzleElements: null,
    finalPuzzleElement: null,
    clicksCountElement: null,
    levelNumberElement: null,
  };

  slidingGameInfo = {
    gameTableSize: null,
    currentLevelNumber: null,
    levelPuzzlesImages: null,
    levelFullImage: null,
    isWin: null,
    clicksCount: 0,
    startPosition: null,
  };

  movingRules = {
    withoutLeftSibling: [],
    withoutRightSibling: [],
  };

  constructor(SlidingGameTheme, levelNumber, container, startPosition, clicks) {
    this.slidingGameInfo.currentLevelNumber = levelNumber;

    this.slidingGameInfo.gameTableSize =
      SlidingGameTheme[this.slidingGameInfo.currentLevelNumber].tableSize;
    this.slidingGameInfo.levelPuzzlesImages =
      SlidingGameTheme[this.slidingGameInfo.currentLevelNumber].puzzles;
    this.slidingGameInfo.levelFullImage =
      SlidingGameTheme[this.slidingGameInfo.currentLevelNumber].fullImage;
    this.slidingGameInfo.isWin = false;
    this.slidingGameInfo.startPosition = startPosition;
    this.slidingGameInfo.clicksCount = clicks;

    this.slidingGameElements.gameTableContainer = container;
    this.slidingGameElements.gameTableContainer.innerHTML = "";

    this.createGameTable(container);

    this.slidingGameElements.gameTableElement =
      document.querySelector("#game-table");
    this.slidingGameElements.PuzzleElements =
      document.querySelector("#game-table").children;
    this.slidingGameElements.clicksCountElement =
      document.querySelector("#clicks-count");
    this.slidingGameElements.levelNumberElement =
      document.querySelector("#level-number");

    this.addRules();
    this.startSlidingGame();
  }

  addRules() {
    let leftNumber = 1;
    let rightNumber = this.slidingGameInfo.gameTableSize;

    for (let i = 1; i <= this.slidingGameInfo.gameTableSize; i++) {
      this.movingRules.withoutRightSibling.push(rightNumber);
      this.movingRules.withoutLeftSibling.push(leftNumber);
      rightNumber += this.slidingGameInfo.gameTableSize;
      leftNumber += this.slidingGameInfo.gameTableSize;
    }
  }

  mixedPuzzles() {
    let mixedPuzzles = [];

    if (!this.slidingGameInfo.startPosition) {
      do {
        mixedPuzzles = this.slidingGameInfo.levelPuzzlesImages.sort(
          () => Math.random() - 0.5
        );
      } while (!this.isSolvable(mixedPuzzles));
    } else {
      const tempSortObject = this.slidingGameInfo.levelPuzzlesImages;

      this.slidingGameInfo.startPosition.forEach((number) => {
        const entry = Object.entries(tempSortObject).find(
          ([_, value]) => value.number === number
        );

        if (entry) {
          mixedPuzzles[
            this.slidingGameInfo.startPosition.indexOf(entry[1].number)
          ] = entry[1];
        }
      });
    }

    return mixedPuzzles;
  }

  addRightNumbers() {
    let rightNumber = 1;

    for (let puzzle of this.slidingGameElements.PuzzleElements) {
      puzzle.setAttribute("data-js-right-number", rightNumber);
      rightNumber++;
    }
  }

  addPuzzleElement(puzzle) {
    if (puzzle.number === this.slidingGameInfo.gameTableSize ** 2) {
      this.slidingGameElements.gameTableElement.insertAdjacentHTML(
        "beforeend",
        `<article class="game-table__puzzle" data-js-position-number=${puzzle.number} id="final-puzzle">
        </article>`
      );
      this.slidingGameElements.finalPuzzleElement =
        document.querySelector("#final-puzzle");
    } else {
      this.slidingGameElements.gameTableElement.insertAdjacentHTML(
        "beforeend",
        `<article class="game-table__puzzle" data-js-position-number=${puzzle.number}>
                <p class="puzzle__number">${puzzle.number}</p>
                <img class="puzzle__image invalid" src="${puzzle.img}" alt="">
            </article>`
      );
    }
  }

  startSlidingGame() {
    this.slidingGameElements.levelNumberElement.innerHTML =
      this.slidingGameInfo.currentLevelNumber;

    let gamePuzzles = this.mixedPuzzles();

    gamePuzzles.forEach((element) => {
      this.addPuzzleElement(element);
    });

    this.addRightNumbers();

    document.addEventListener("click", this.puzzleClickEvent);
    this.checkPuzzlesPosition();
    this.isWin();
  }

  checkPuzzlesPosition() {
    for (let puzzle of this.slidingGameElements.PuzzleElements) {
      if (
        puzzle.getAttribute("data-js-right-number") ===
        puzzle.getAttribute("data-js-position-number")
      ) {
        setTimeout(() => {
          puzzle.lastElementChild?.classList.remove("invalid");
        }, 50);
      } else {
        setTimeout(() => {
          puzzle.lastElementChild?.classList.add("invalid");
        }, 50);
      }
    }
  }

  puzzleClickEvent = (event) => {
    const puzzle = event.target.closest(".game-table__puzzle");
    if (puzzle && !event.target.closest("#full-puzzle")) {
      this.puzzleClick(puzzle);
    }
  };

  puzzleClick(puzzle) {
    this.addRightNumbers();
    const puzzleRightNumber = +puzzle.getAttribute("data-js-right-number");

    let leftSibling;
    let rightSibling;

    if (
      this.movingRules.withoutLeftSibling.some(
        (number) => number === puzzleRightNumber
      )
    ) {
      leftSibling = null;
    } else {
      leftSibling = document.querySelector(
        `[data-js-right-number="${puzzleRightNumber - 1}"]`
      );
    }

    if (
      this.movingRules.withoutRightSibling.some(
        (number) => number === puzzleRightNumber
      )
    ) {
      rightSibling = null;
    } else {
      rightSibling = document.querySelector(
        `[data-js-right-number="${puzzleRightNumber + 1}"]`
      );
    }

    const topSibling = document.querySelector(
      `[data-js-right-number="${
        puzzleRightNumber - this.slidingGameInfo.gameTableSize
      }"]`
    );
    const bottomSibling = document.querySelector(
      `[data-js-right-number="${
        puzzleRightNumber + this.slidingGameInfo.gameTableSize
      }"]`
    );

    const leftMove = () => {
      this.slidingGameElements.finalPuzzleElement.after(puzzle);
      leftSibling.after(this.slidingGameElements.finalPuzzleElement);
    };

    const rightMove = () => {
      this.slidingGameElements.finalPuzzleElement.after(puzzle);
      rightSibling.before(this.slidingGameElements.finalPuzzleElement);
    };

    if (
      topSibling === this.slidingGameElements.finalPuzzleElement &&
      leftSibling
    ) {
      puzzle.classList.add("top-move");
      setTimeout(() => {
        puzzle.classList.remove("top-move");
        leftMove();
      }, 390);
    } else if (
      bottomSibling === this.slidingGameElements.finalPuzzleElement &&
      leftSibling
    ) {
      puzzle.classList.add("bottom-move");
      setTimeout(() => {
        puzzle.classList.remove("bottom-move");
        leftMove();
      }, 390);
    } else if (
      topSibling === this.slidingGameElements.finalPuzzleElement &&
      rightSibling
    ) {
      puzzle.classList.add("top-move");
      setTimeout(() => {
        puzzle.classList.remove("top-move");
        rightMove();
      }, 390);
    } else if (
      bottomSibling === this.slidingGameElements.finalPuzzleElement &&
      rightSibling
    ) {
      puzzle.classList.add("bottom-move");
      setTimeout(() => {
        puzzle.classList.remove("bottom-move");
        rightMove();
      }, 390);
    } else if (leftSibling === this.slidingGameElements.finalPuzzleElement) {
      puzzle.classList.add("left-move");
      setTimeout(() => {
        puzzle.classList.remove("left-move");
        this.slidingGameElements.finalPuzzleElement.before(puzzle);
      }, 390);
    } else if (rightSibling === this.slidingGameElements.finalPuzzleElement) {
      puzzle.classList.add("right-move");
      setTimeout(() => {
        puzzle.classList.remove("right-move");
        this.slidingGameElements.finalPuzzleElement.after(puzzle);
      }, 390);
    }

    this.slidingGameInfo.clicksCount++;
    document.querySelector("#clicks-count").innerHTML =
      this.slidingGameInfo.clicksCount.toString();
    setTimeout(() => {
      this.addRightNumbers();
      this.checkPuzzlesPosition();
      this.isWin();
    }, 390);
  }

  isSolvable(gamePuzzles) {
    let countInversions = 0;
    let allNumbers = gamePuzzles.map((object) => object.number).reverse();
    let numbersGameElements = allNumbers.filter(
      (number) => number < this.slidingGameInfo.gameTableSize ** 2
    );

    for (let i = 0; i < numbersGameElements.length; i++) {
      for (let j = i + 1; j < numbersGameElements.length; j++) {
        if (numbersGameElements[i] > numbersGameElements[j]) {
          countInversions++;
        }
      }
    }

    if (this.slidingGameInfo.gameTableSize % 2 !== 0) {
      return countInversions % 2 === 0;
    }

    let emptyElementIndex = allNumbers.indexOf(
      this.slidingGameInfo.gameTableSize ** 2
    );

    let emptyElementRow = 1;

    for (
      let i = this.slidingGameInfo.gameTableSize ** 2;
      i >= 0;
      i -= this.slidingGameInfo.gameTableSize, emptyElementRow++
    ) {
      if (
        i - this.slidingGameInfo.gameTableSize <= emptyElementIndex &&
        emptyElementIndex <= i
      ) {
        break;
      }
    }

    if (countInversions % 2 === 0) {
      return emptyElementRow % 2 !== 0;
    } else {
      return emptyElementRow % 2 === 0;
    }
  }

  isWin() {
    let rightPuzzlesCount = 0;

    for (let puzzle of this.slidingGameElements.PuzzleElements) {
      if (
        puzzle.getAttribute("data-js-right-number") ===
        puzzle.getAttribute("data-js-position-number")
      ) {
        rightPuzzlesCount++;
      }
    }
    if (rightPuzzlesCount === this.slidingGameInfo.gameTableSize ** 2) {
      let lastPuzzle = null;

      for (let key in this.slidingGameInfo.levelPuzzlesImages) {
        if (
          this.slidingGameInfo.levelPuzzlesImages[key].number ===
          this.slidingGameInfo.gameTableSize ** 2
        ) {
          lastPuzzle = this.slidingGameInfo.levelPuzzlesImages[key].img;
          break;
        }
      }

      setTimeout(() => {
        this.slidingGameElements.finalPuzzleElement.insertAdjacentHTML(
          "beforeend",
          `<img class="puzzle__image last-puzzle" src="${lastPuzzle}" alt="">`
        );
      }, 800);
      setTimeout(() => {
        this.slidingGameElements.gameTableElement.innerHTML = "";
        document.documentElement.style.setProperty("--game-table-size", "1");
        

        this.slidingGameElements.gameTableElement.insertAdjacentHTML(
          "afterbegin",
          `<article class="game-table__puzzle" id="full-puzzle">
      <img class="full-image" src="${this.slidingGameInfo.levelFullImage}" />
      <button class="puzzle__button" type="button" id="continue-button">CONTINUE</button>
    </article>`
        );

        document.removeEventListener("click", this.puzzleClickEvent);

        requestAnimationFrame(() => {
          const continueButton = document.querySelector("#continue-button");
          if (continueButton) {
            continueButton.addEventListener("click", () => {
              document.dispatchEvent(new Event("win"));
            });
          }
        });
      }, 2000);
    }
  }

  createGameTable() {
    document.documentElement.style.setProperty(
      "--game-table-size",
      this.slidingGameInfo.gameTableSize
    );

    this.slidingGameElements.gameTableContainer.insertAdjacentHTML(
      "afterbegin",
      `<section class="game-table" id="game-table">
        </section>`
    );
  }
}
