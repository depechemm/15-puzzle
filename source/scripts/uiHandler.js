const burgerButton = document.querySelector(".burger-button");
const burgerMenuOptions = document.querySelector(".burger-menu__options");

burgerButton.addEventListener("click", () => {
  burgerButton.classList.toggle("open");
  burgerMenuOptions.classList.toggle("hide");
});

document.addEventListener("click", (event) => {
  if (!event.target.closest(".burger-menu") && burgerButton.closest(".open")) {
    burgerButton.classList.remove("open");
    burgerMenuOptions.classList.add("hide");
  }
});

const modeSwitcher = document.querySelector(".mode-switcher");
const modalContainer = document.querySelector(".modal-container");

modeSwitcher.addEventListener("click", (event) => {
  event.preventDefault();

  document.querySelector(".mode-switcher__container").classList.toggle("open");

  let icons = document.querySelectorAll(".icon");

  for (const icon of icons) {
    icon.classList.toggle("no-active");
  }

  document.body.classList.toggle("dark-theme");

  let modalText = "";

  if (document.body.closest(".dark-theme")) {
    modalText = "NC-17 MOD IS ENABLED";
  } else {
    modalText = "NC-17 MOD DISABLED";
  }

  modalContainer.insertAdjacentHTML(
    "afterbegin",
    `<dialog class="modal">
    <div class="modal__buttons-wrapper">
          <p class="modal__text text--warning">${modalText}</p>
        </dialog>`
  );

  const modal = document.querySelector(".modal");

  modal.showModal();

  setTimeout(() => {
    modal.close();
    modalContainer.innerHTML = "";
  }, 2000);

  document.dispatchEvent(new Event("switchTheme"));
});

const reloadButton = document.querySelector(".reload");

reloadButton.addEventListener("click", () => {
  modalContainer.insertAdjacentHTML(
    "afterbegin",
    `<dialog class="modal">
        <p class="modal__text">RESET CURRENT LEVEL PROGRESS?</p>
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
    .querySelector(".modal__button.main-button ")
    .addEventListener("click", () => {
      document.dispatchEvent(new Event("reloadLevel"));
      modal.close();
      modalContainer.innerHTML = "";
    });
});

const themeSelectButton = document.querySelector("#select-theme");

themeSelectButton.addEventListener("click", () => {
  burgerButton.click();

  modalContainer.insertAdjacentHTML(
    "afterbegin",
    `<dialog class="modal">
    <div class="modal__buttons-wrapper">
          <button class="modal__button close-button">CLOSE</button></div>
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

  document.dispatchEvent(new Event("selectTheme"));
});

const levelSelectButton = document.querySelector("#select-level");

levelSelectButton.addEventListener("click", () => {
  burgerButton.click();

  modalContainer.insertAdjacentHTML(
    "afterbegin",
    `<dialog class="modal">
    <div class="modal__buttons-wrapper">
          <button class="modal__button close-button">CLOSE</button></div>
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

  document.dispatchEvent(new Event("selectLevel"));
});

const deleteProgressButton = document.querySelector("#delete-progress");

deleteProgressButton.addEventListener("click", () => {
  burgerButton.click();

  modalContainer.insertAdjacentHTML(
    "afterbegin",
    `<dialog class="modal">
        <p class="modal__text">DELETE ALL PROGRESS?</p>
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
      document.dispatchEvent(new Event("deleteProgress"));
      modal.close();
      modalContainer.innerHTML = "";
    });
});
