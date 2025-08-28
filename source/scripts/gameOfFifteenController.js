import { themes_PG_13 } from "./gameThemes.js";
import { themes_NC_17 } from "./gameThemes.js";
import { gameOfFifteen } from "./gameOfFifteen.js";

let themes = themes_PG_13;
let currentThemesNames;
let themeNames_PG_13 = [];
let themeNames_NC_17 = [];
let levelNumbers = [];
let currentLevelNumber = 1;
let currentThemeIndex = 0;

for (let themeName in themes_PG_13) {
  themeNames_PG_13.push(themeName);
}

for (let themeName in themes_NC_17) {
  themeNames_NC_17.push(themeName);
}

document.addEventListener("DOMContentLoaded", () => {
  if (getCurrentGameMode() === "NC_17") {
    document.querySelector(".mode-switcher").click();
    themes = themes_NC_17;
    currentThemesNames = themeNames_NC_17;
  } else {
    themes = themes_PG_13;
    currentThemesNames = themeNames_PG_13;
  }

  if (!localStorage.getItem("gameOfFifteen")) {
    const gameOfFifteenData = {
      currentMode: "PG_13",
      PG_13: {
        currentTheme: themeNames_PG_13[0],
        themes: {
          [themeNames_PG_13[0]]: {
            currentLevel: 1,
            levels: {
              1: {
                puzzlesPosition: null,
                clicks: 0,
                isCompleted: false,
              },
            },
          },
        },
      },
      NC_17: {
        currentTheme: themeNames_NC_17[0],
        themes: {
          [themeNames_NC_17[0]]: {
            currentLevel: 1,
            levels: {
              1: {
                puzzlesPosition: null,
                clicks: 0,
                isCompleted: false,
              },
            },
          },
        },
      },
    };

    localStorage.setItem("gameOfFifteen", JSON.stringify(gameOfFifteenData));
  } else {
    const gameOfFifteenData = JSON.parse(localStorage.getItem("gameOfFifteen"));
    currentThemeIndex = currentThemesNames.indexOf(
      gameOfFifteenData[getCurrentGameMode()].currentTheme
    );
    currentLevelNumber =
      gameOfFifteenData[getCurrentGameMode()].themes[
        currentThemesNames[currentThemeIndex]
      ].currentLevel;
  }

  createGame(
    themes[currentThemesNames[currentThemeIndex]],
    currentLevelNumber,
    getCurrentLevelInfo()
  );
});

document.addEventListener("win", () => {
  const gameOfFifteenData = JSON.parse(localStorage.getItem("gameOfFifteen"));

  gameOfFifteenData[getCurrentGameMode()].themes[
    currentThemesNames[currentThemeIndex]
  ].levels[currentLevelNumber].isCompleted = true;

  localStorage.setItem("gameOfFifteen", JSON.stringify(gameOfFifteenData));

  currentLevelNumber++;

  if (currentLevelNumber > Math.max(levelNumbers)) {
    if (currentThemeIndex < currentThemesNames.length - 1) {
      movingOnToNextTheme();
    } else {
      endOfTheGame();
    }
  } else {
    gameOfFifteenData[getCurrentGameMode()].themes[
      currentThemesNames[currentThemeIndex]
    ].levels[currentLevelNumber] = {
      puzzlesPosition: null,
      clicks: 0,
      isCompleted: false,
    };
    gameOfFifteenData[getCurrentGameMode()].themes[
      currentThemesNames[currentThemeIndex]
    ].currentLevel = currentLevelNumber;

    localStorage.setItem("gameOfFifteen", JSON.stringify(gameOfFifteenData));

    createGame(
      themes[currentThemesNames[currentThemeIndex]],
      currentLevelNumber,
      getCurrentLevelInfo()
    );
  }
});

document.addEventListener("reloadLevel", () => {
  const gameOfFifteenData = JSON.parse(localStorage.getItem("gameOfFifteen"));

  gameOfFifteenData[getCurrentGameMode()].themes[
    currentThemesNames[currentThemeIndex]
  ].levels[currentLevelNumber] = {
    puzzlesPosition: null,
    clicks: 0,
    isCompleted: false,
  };

  localStorage.setItem("gameOfFifteen", JSON.stringify(gameOfFifteenData));

  createGame(
    themes[currentThemesNames[currentThemeIndex]],
    currentLevelNumber,
    []
  );
});

document.addEventListener("selectTheme", () => {
  const modal = document.querySelector(".modal");
  modal.insertAdjacentHTML(
    "afterbegin",
    `<section class="modal__buttons-wrapper"></section>`
  );
  for (const themeIndex in currentThemesNames) {
    if (themeIndex == currentThemeIndex) {
      modal.firstElementChild.insertAdjacentHTML(
        "afterbegin",
        `<button class="modal__select-button select-theme select-button--active" data-js-theme-index="${themeIndex}" disabled>${currentThemesNames[themeIndex]}</button>`
      );
    } else {
      modal.firstElementChild.insertAdjacentHTML(
        "beforeend",
        `<button class="modal__select-button select-theme" data-js-theme-index="${themeIndex}">${currentThemesNames[themeIndex]}</button>`
      );
    }
  }
});

document.addEventListener("click", (event) => {
  const modal = document.querySelector(".modal");
  if (event.target.closest(".select-theme")) {
    currentThemeIndex = +event.target.getAttribute("data-js-theme-index");

    const gameOfFifteenData = JSON.parse(localStorage.getItem("gameOfFifteen"));

    gameOfFifteenData[getCurrentGameMode()].currentTheme =
      currentThemesNames[currentThemeIndex];

    if (
      !gameOfFifteenData[getCurrentGameMode()].themes[
        currentThemesNames[currentThemeIndex]
      ]
    ) {
      gameOfFifteenData[getCurrentGameMode()].themes[
        currentThemesNames[currentThemeIndex]
      ] = {
        currentLevel: 1,
        levels: {
          1: {
            puzzlesPosition: null,
            clicks: 0,
            isCompleted: false,
          },
        },
      };
    }
    currentLevelNumber =
      gameOfFifteenData[getCurrentGameMode()].themes[
        currentThemesNames[currentThemeIndex]
      ].currentLevel;

    localStorage.setItem("gameOfFifteen", JSON.stringify(gameOfFifteenData));
    modal.close();
    document.querySelector(".modal-container").innerHTML = "";

    createGame(
      themes[currentThemesNames[currentThemeIndex]],
      currentLevelNumber,
      getCurrentLevelInfo()
    );
  }
});

document.addEventListener("selectLevel", () => {
  const modal = document.querySelector(".modal");
  modal.insertAdjacentHTML(
    "afterbegin",
    `<section class="modal__buttons-wrapper"></section>`
  );

  const gameOfFifteenData = JSON.parse(localStorage.getItem("gameOfFifteen"));

  let completedLevels = [];

  for (let level in gameOfFifteenData[getCurrentGameMode()].themes[
    currentThemesNames[currentThemeIndex]
  ].levels) {
    completedLevels.push(level);
  }

  for (const levelNumber of levelNumbers) {
    if (levelNumber == currentLevelNumber) {
      modal.firstElementChild.insertAdjacentHTML(
        "beforeend",
        `<button class="modal__select-button select-level select-button--active" data-js-level-number="${levelNumber}" disabled>LEVEL ${levelNumber}</button>`
      );
    } else if (!completedLevels.includes(levelNumber)) {
      modal.firstElementChild.insertAdjacentHTML(
        "beforeend",
        `<button class="modal__select-button select-level" data-js-level-number="${levelNumber}" disabled>LEVEL ${levelNumber}</button>`
      );
    } else {
      modal.firstElementChild.insertAdjacentHTML(
        "beforeend",
        `<button class="modal__select-button select-level" data-js-level-number="${levelNumber}">LEVEL ${levelNumber}</button>`
      );
    }
  }
});

document.addEventListener("click", (event) => {
  const modal = document.querySelector(".modal");

  if (event.target.closest(".select-level")) {
    currentLevelNumber = +event.target.getAttribute("data-js-level-number");
    modal.close();
    document.querySelector(".modal-container").innerHTML = "";
    setTheme();

    const gameOfFifteenData = JSON.parse(localStorage.getItem("gameOfFifteen"));
    gameOfFifteenData[getCurrentGameMode()].themes[
      currentThemesNames[currentThemeIndex]
    ].currentLevel = currentLevelNumber;
    localStorage.setItem("gameOfFifteen", JSON.stringify(gameOfFifteenData));

    createGame(
      themes[currentThemesNames[currentThemeIndex]],
      currentLevelNumber,
      getCurrentLevelInfo()
    );
  }
});

document.addEventListener("switchTheme", () => {
  const gameOfFifteenData = JSON.parse(localStorage.getItem("gameOfFifteen"));

  let currentMode = "";

  if (document.body.closest(".dark-theme")) {
    themes = themes_NC_17;
    currentThemesNames = themeNames_NC_17;
    currentMode = "NC_17";
  } else if (themes === themes_NC_17) {
    themes = themes_PG_13;
    currentThemesNames = themeNames_PG_13;
    currentMode = "PG_13";
  }

  currentThemesNames = [];

  for (let themeName in themes) {
    currentThemesNames.push(themeName);
  }
  console.log(currentMode);

  gameOfFifteenData.currentMode = currentMode;

  currentThemeIndex = currentThemesNames.indexOf(
    gameOfFifteenData[currentMode].currentTheme
  );
  currentLevelNumber =
    gameOfFifteenData[currentMode].themes[currentThemesNames[currentThemeIndex]]
      .currentLevel;

  localStorage.setItem("gameOfFifteen", JSON.stringify(gameOfFifteenData));

  createGame(
    themes[currentThemesNames[currentThemeIndex]],
    currentLevelNumber,
    getCurrentLevelInfo()
  );
});

document.addEventListener("click", (event) => {
  if (
    event.target.closest(".game-table__puzzle") &&
    !event.target.closest("#full-puzzle")
  ) {
    setTimeout(() => {
      const gameOfFifteenData = JSON.parse(
        localStorage.getItem("gameOfFifteen")
      );
      gameOfFifteenData[getCurrentGameMode()].themes[
        currentThemesNames[currentThemeIndex]
      ].levels[currentLevelNumber].puzzlesPosition =
        getCurrentPuzzlesPosition();
      gameOfFifteenData[getCurrentGameMode()].themes[
        currentThemesNames[currentThemeIndex]
      ].levels[currentLevelNumber].clicks =
        +document.querySelector("#clicks-count").innerHTML;
      localStorage.setItem("gameOfFifteen", JSON.stringify(gameOfFifteenData));
    }, 400);
  }
});

document.addEventListener("deleteProgress", () => {
  const gameOfFifteenData = JSON.parse(localStorage.getItem("gameOfFifteen"));

  gameOfFifteenData[getCurrentGameMode()] = {
    currentTheme: currentThemesNames[0],
    themes: {
      [currentThemesNames[0]]: {
        currentLevel: 1,
        levels: {
          1: {
            puzzlesPosition: null,
            clicks: 0,
            isCompleted: false,
          },
        },
      },
    },
  };

  localStorage.setItem("gameOfFifteen", JSON.stringify(gameOfFifteenData));

  location.reload();
});

function createGame(
  SlidingGameTheme,
  levelNumber,
  [startPosition = null, clicksCount = 0]
) {
  document.querySelector("#clicks-count").innerHTML = clicksCount;
  setTheme();
  new gameOfFifteen(
    SlidingGameTheme,
    levelNumber,
    document.querySelector(".window__table-wrapper"),
    startPosition,
    clicksCount
  );
}

function setTheme() {
  levelNumbers = [];

  for (let leftNumber in themes[currentThemesNames[currentThemeIndex]]) {
    levelNumbers.push(leftNumber);
  }
}

function getCurrentGameMode() {
  const gameOfFifteenData = JSON.parse(localStorage.getItem("gameOfFifteen"));

  return gameOfFifteenData?.currentMode;
}

function getCurrentPuzzlesPosition() {
  let gamePosition = [];

  const puzzles = document.querySelector("#game-table").children;

  for (const puzzle of puzzles) {
    gamePosition.push(+puzzle.getAttribute("data-js-position-number"));
  }

  if (gamePosition.length <= 1) {
    gamePosition = null;
  }

  return gamePosition;
}

function getCurrentLevelInfo() {
  const gameOfFifteenData = JSON.parse(localStorage.getItem("gameOfFifteen"));
  console.log(getCurrentGameMode());
  console.log(gameOfFifteenData);
  console.log(
    gameOfFifteenData[getCurrentGameMode()].themes[
      currentThemesNames[currentThemeIndex]
    ]
  );
  console.log(currentLevelNumber);
  const startPosition =
    gameOfFifteenData[getCurrentGameMode()].themes[
      currentThemesNames[currentThemeIndex]
    ].levels[currentLevelNumber].puzzlesPosition;

  const clicksCount =
    gameOfFifteenData[getCurrentGameMode()].themes[
      currentThemesNames[currentThemeIndex]
    ].levels[currentLevelNumber].clicks;

  return [startPosition, clicksCount];
}

function getGameInfo() {
  let totalClicksCount = 0;
  let totalThemesCount = 0;
  let totalLevelsCount = 0;

  const gameOfFifteenData = JSON.parse(localStorage.getItem("gameOfFifteen"));

  const clicksCountByMode = (mode) => {
    for (let theme in gameOfFifteenData[mode].themes) {
      totalThemesCount++;
      for (let level in gameOfFifteenData[mode].themes[theme].levels) {
        totalLevelsCount++;
        totalClicksCount +=
          gameOfFifteenData[mode].themes[theme].levels[level].clicks;
      }
    }
  };

  clicksCountByMode(getCurrentGameMode());

  return [totalThemesCount, totalLevelsCount, totalClicksCount];
}

function movingOnToNextTheme() {
  const modalContainer = document.querySelector(".modal-container");

  modalContainer.insertAdjacentHTML(
    "afterbegin",
    `<dialog class="modal">
        <p class="modal__text">ALL LEVELS OF THE CURRENT THEME ARE COMPLETED! MOVE ON TO THE NEXT THEME?</p>
        <div class="modal__buttons-wrapper">
          <button class="modal__button main-button">YES</button>
          <button class="modal__button close-button">NO</button></div></dialog>`
  );

  const modal = document.querySelector(".modal");

  modal.showModal();

  document
    .querySelector(".modal__button.close-button")
    .addEventListener("click", () => {
      modal.close();
      modalContainer.innerHTML = "";
    });

  document
    .querySelector(".modal__button.main-button")
    .addEventListener("click", () => {
      modal.close();

      const gameOfFifteenData = JSON.parse(
        localStorage.getItem("gameOfFifteen")
      );

      currentThemeIndex++;

      currentLevelNumber =
        gameOfFifteenData[getCurrentGameMode()].themes[
          currentThemesNames[currentThemeIndex]
        ].currentLevel;

      gameOfFifteenData[getCurrentGameMode()].currentTheme =
        currentThemesNames[currentThemeIndex];

      if (
        !gameOfFifteenData[getCurrentGameMode()].themes[
          currentThemesNames[currentThemeIndex]
        ]
      ) {
        gameOfFifteenData[getCurrentGameMode()].themes[
          currentThemesNames[currentThemeIndex]
        ] = {
          currentLevel: 1,
          levels: {
            [currentLevelNumber]: {
              puzzlesPosition: null,
              clicks: 0,
              isCompleted: false,
            },
          },
        };
      }

      localStorage.setItem("gameOfFifteen", JSON.stringify(gameOfFifteenData));

      createGame(
        themes[currentThemesNames[currentThemeIndex]],
        currentLevelNumber,
        getCurrentLevelInfo()
      );
      modalContainer.innerHTML = "";
    });
}

function endOfTheGame() {
  const modalContainer = document.querySelector(".modal-container");

  const gameInfo = getGameInfo();

  modalContainer.insertAdjacentHTML(
    "afterbegin",
    `<dialog class="modal">
          <p class="modal__text">YOU HAVE COMPLETED ALL THE LEVELS!</p>
          <section class="modal__text-container">
            <p class="modal__text text--additional">
              COMPLETED GAME THEMES: <span>${gameInfo[0]}</span>
            </p>
            <p class="modal__text text--additional">
              COMPLETED LEVELS: <span>${gameInfo[1]}</span>
            </p>
            <p class="modal__text text--additional">
              NUMBER OF CLICKS: <span>${gameInfo[2]}</span>
            </p>
            <p class="modal__text">DO YOU WANT TO TRY AGAIN?</p>
          </section>
          <div class="modal__buttons-wrapper">
            <button class="modal__button main-button">YES</button>
            <button class="modal__button close-button">NO</button>
          </div>
        </dialog>`
  );

  const modal = document.querySelector(".modal");

  modal.showModal();

  document
    .querySelector(".modal__button.close-button")
    .addEventListener("click", () => {
      modal.close();
      modalContainer.innerHTML = "";
    });

  document
    .querySelector(".modal__button.main-button")
    .addEventListener("click", () => {
      modal.close();
      document.dispatchEvent(new Event("deleteProgress"));
    });
}
