import Card from "../components/Card.js";
import FormValidator from "../components/FormValidator.js";

const validationConfig = {
  formSelector: ".modal__form",
  inputSelector: ".modal__input",
  submitButtonSelector: ".modal__button",
  inactiveButtonClass: "modal__button_disabled",
  inputErrorClass: "modal__input_type_error",
  errorClass: "modal__input-error",
};

const initialCards = [
  {
    name: "Yosemite Valley",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/around-project/yosemite.jpg",
  },
  {
    name: "Lake Louise",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/around-project/lake-louise.jpg",
  },
  {
    name: "Bald Mountains",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/around-project/bald-mountains.jpg",
  },
  {
    name: "Latemar",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/around-project/latemar.jpg",
  },
  {
    name: "Vanoise National Park",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/around-project/vanoise.jpg",
  },
  {
    name: "Lago di Braies",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/around-project/lago.jpg",
  },
];

const cardListEl = document.querySelector(".cards__list");

const modalImage = document.querySelector(".modal__image");
const modalDescription = document.querySelector(".modal__description");
const imageModal = document.querySelector("#image-modal");

// ---------- Modal Functions ----------
function openPopup(modal) {
  modal.classList.add("modal_opened");
  document.addEventListener("keydown", handleEscKey);
}

function closePopup(modal) {
  modal.classList.remove("modal_opened");
  document.removeEventListener("keydown", handleEscKey);
}

// ---------- Image Click Handler ----------
function handleImageClick(card) {
  modalImage.src = card.getLink();
  modalImage.alt = card.getName();
  modalDescription.textContent = card.getName();
  openPopup(imageModal);
}

// ---------- Render Initial Cards ----------
initialCards.forEach((item) => {
  const cardInstance = new Card(item, "#card-template", handleImageClick);
  const cardElement = cardInstance.generateCard();
  cardListEl.prepend(cardElement);
});

// ---------- Enable Form Validation ----------
const formValidators = new Map();
const formList = Array.from(
  document.querySelectorAll(validationConfig.formSelector),
);

formList.forEach((formElement) => {
  const validator = new FormValidator(validationConfig, formElement);
  validator.enableValidation();
  formValidators.set(formElement, validator);
});

// ---------- Modal form elements ----------
const profileEditButton = document.querySelector(".profile__edit-button");
const addCardButton = document.querySelector(".profile__add-button");
const profileModal = document.querySelector("#profile-edit-modal");
const addCardModal = document.querySelector("#add-card-modal");
const profileForm = document.forms["profile-form"];
const cardForm = document.querySelector("#add-card-form");
const profileNameInput = profileForm.querySelector(".modal__input_type_name");
const profileDescriptionInput = profileForm.querySelector(
  ".modal__input_type_description",
);
const cardTitleInput = cardForm.querySelector(".modal__input_type_title");
const cardLinkInput = cardForm.querySelector(".modal__input_type_link");
const profileTitle = document.querySelector(".profile__title");
const profileDescription = document.querySelector(".profile__description");

// duplicate openPopup/closePopup logic is in the top-level functions above
function closeAllPopups() {
  const openedPopup = document.querySelector(".modal_opened");
  if (openedPopup) closePopup(openedPopup);
}

function handleEscKey(evt) {
  if (evt.key === "Escape") {
    closeAllPopups();
  }
}

// click on overlay to close modal
const modals = document.querySelectorAll(".modal");
modals.forEach((modal) => {
  modal.addEventListener("mousedown", (evt) => {
    if (evt.target === modal) closePopup(modal);
  });
});

const closeButtons = document.querySelectorAll(".modal__close");
closeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const modalToClose = button.closest(".modal");
    closePopup(modalToClose);
  });
});

profileEditButton.addEventListener("click", () => {
  profileNameInput.value = profileTitle.textContent;
  profileDescriptionInput.value = profileDescription.textContent;
  openPopup(profileModal);
});

addCardButton.addEventListener("click", () => {
  cardForm.reset();
  const cardFormValidator = formValidators.get(cardForm);
  if (cardFormValidator) cardFormValidator.disableButton();
  openPopup(addCardModal);
});

profileForm.addEventListener("submit", (evt) => {
  evt.preventDefault();

  profileTitle.textContent = profileNameInput.value;
  profileDescription.textContent = profileDescriptionInput.value;

  const profileFormValidator = formValidators.get(profileForm);
  if (profileFormValidator) {
    profileFormValidator.disableButton();
  }

  closePopup(profileModal);
});

cardForm.addEventListener("submit", (evt) => {
  evt.preventDefault();

  const newCardData = {
    name: cardTitleInput.value,
    link: cardLinkInput.value,
  };

  const cardInstance = new Card(
    newCardData,
    "#card-template",
    handleImageClick,
  );
  const cardElement = cardInstance.generateCard();
  cardListEl.prepend(cardElement);

  cardForm.reset();

  const cardFormValidator = formValidators.get(cardForm);
  if (cardFormValidator) {
    cardFormValidator.resetValidation();
  }

  closePopup(addCardModal);
});
