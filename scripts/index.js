
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

// ---------- Validation Config ----------
const validationConfig = {
  formSelector: ".modal__form",
  inputSelector: ".modal__input",
  submitButtonSelector: ".modal__button",
  inactiveButtonClass: "modal__button_disabled",
  inputErrorClass: "modal__input_type_error",
  errorClass: "modal__input-error",
};

// ---------- Elements ----------
const profileEditButton = document.querySelector(".profile__edit-button");
const profileEditModal = document.querySelector("#profile-edit-modal");
const profileEditCloseButton = profileEditModal.querySelector(".modal__close");
const profileTitle = document.querySelector(".profile__title");
const profileDescription = document.querySelector(".profile__description");
const profileTitleInput = document.querySelector(".modal__input_type_name");
const profileDescriptionInput = document.querySelector(
  ".modal__input_type_description"
);
const profileEditForm = profileEditModal.querySelector(".modal__form");

const addCardButton = document.querySelector(".profile__add-button");
const addCardModal = document.querySelector("#add-card-modal");
const addCardCloseButton = addCardModal.querySelector(".modal__close");
const addCardForm = document.querySelector("#add-card-form");
const cardTitleInput = addCardForm.querySelector(".modal__input_type_title");
const cardLinkInput = addCardForm.querySelector(".modal__input_type_link");

const cardListEl = document.querySelector(".cards__list");
const cardTemplate = document
  .querySelector("#card-template")
  .content.querySelector(".card");

const imageModal = document.querySelector("#image-modal");
const modalCloseButton = imageModal.querySelector(".modal__close");
const modalImage = imageModal.querySelector(".modal__image");
const modalDescription = imageModal.querySelector(".modal__description");

// ---------- Modal Functions ----------
function openPopup(modal) {
  modal.classList.add("modal_opened");
  document.addEventListener("keydown", handleEscClose);
}

function closePopup(modal) {
  modal.classList.remove("modal_opened");
  document.removeEventListener("keydown", handleEscClose);
}

function handleEscClose(evt) {
  if (evt.key === "Escape") {
    const openedModal = document.querySelector(".modal_opened");
    if (openedModal) closePopup(openedModal);
  }
}

// ---------- Overlay Click ----------
document.querySelectorAll(".modal").forEach((modal) => {
  modal.addEventListener("mousedown", (evt) => {
    if (evt.target === modal) closePopup(modal);
  });
});

// ---------- Cards ----------
function getCardElement(cardData) {
  const card = cardTemplate.cloneNode(true);
  const img = card.querySelector(".card__image");
  const title = card.querySelector(".card__title");

  img.src = cardData.link;
  img.alt = cardData.name;
  title.textContent = cardData.name;

  img.addEventListener("click", () => {
    modalImage.src = cardData.link;
    modalImage.alt = cardData.name;
    modalDescription.textContent = cardData.name;
    openPopup(imageModal);
  });

  card
    .querySelector(".card__like-button")
    .addEventListener("click", (e) =>
      e.target.classList.toggle("card__like-button_active")
    );

  card
    .querySelector(".card__delete-button")
    .addEventListener("click", () => card.remove());

  return card;
}

// ---------- Handlers ----------
profileEditForm.addEventListener("submit", () => {
  profileTitle.textContent = profileTitleInput.value;
  profileDescription.textContent = profileDescriptionInput.value;
  closePopup(profileEditModal);
});

addCardForm.addEventListener("submit", () => {
  cardListEl.prepend(
    getCardElement({ name: cardTitleInput.value, link: cardLinkInput.value })
  );
  addCardForm.reset();
  resetValidation(addCardForm, validationConfig);
  closePopup(addCardModal);
});

// ---------- Events ----------
profileEditButton.addEventListener("click", () => {
  profileTitleInput.value = profileTitle.textContent;
  profileDescriptionInput.value = profileDescription.textContent;
  resetValidation(profileEditForm, validationConfig);
  openPopup(profileEditModal);
});

profileEditCloseButton.addEventListener("click", () =>
  closePopup(profileEditModal)
);

addCardButton.addEventListener("click", () => {
  addCardForm.reset();
  resetValidation(addCardForm, validationConfig);
  openPopup(addCardModal);
});

addCardCloseButton.addEventListener("click", () => closePopup(addCardModal));

modalCloseButton.addEventListener("click", () => closePopup(imageModal));

// ---------- Init ----------
initialCards.forEach((card) => cardListEl.prepend(getCardElement(card)));

enableValidation(validationConfig);
