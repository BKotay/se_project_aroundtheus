import "./index.css";
import Card from "../components/Card.js";
import FormValidator from "../components/FormValidator.js";
import Section from "../components/Section.js";
import PopupWithImage from "../components/PopupWithImage.js";
import PopupWithForm from "../components/PopupWithForm.js";
import UserInfo from "../components/UserInfo.js";

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

// popup instances will handle opening/closing and image population
const popupImage = new PopupWithImage("#image-modal");
const popupProfile = new PopupWithForm("#profile-edit-modal", (data) => {
  userInfo.setUserInfo({ title: data.title, description: data.description });
  popupProfile.close();
});

const popupAddCard = new PopupWithForm("#add-card-modal", (data) => {
  const newCardData = { name: data.name, link: data.link };
  const newCardElement = renderCard(newCardData);
  cardSection.addItem(newCardElement);
  cardForm.reset();
  const cardFormValidator = formValidators.get(cardForm);
  if (cardFormValidator) cardFormValidator.resetValidation();
  popupAddCard.close();
});

const userInfo = new UserInfo({
  nameSelector: ".profile__title",
  jobSelector: ".profile__description",
});

function handleImageClick(card) {
  popupImage.open(card);
}

const renderCard = (item) => {
  const cardInstance = new Card(item, "#card-template", handleImageClick);
  const cardElement = cardInstance.generateCard();
  return cardElement;
};

const cardSection = new Section(
  {
    items: initialCards,
    renderer: (item) => renderCard(item),
  },
  ".cards__list",
);

// ---------- Render Initial Cards ----------
cardSection.renderItems();

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

// wire popup event listeners
popupImage.setEventListeners();
popupProfile.setEventListeners();
popupAddCard.setEventListeners();

profileEditButton.addEventListener("click", () => {
  const currentUser = userInfo.getUserInfo();
  profileNameInput.value = currentUser.title;
  profileDescriptionInput.value = currentUser.description;

  const profileFormValidator = formValidators.get(profileForm);
  if (profileFormValidator) profileFormValidator.resetValidation();

  popupProfile.open();
});

addCardButton.addEventListener("click", () => {
  popupAddCard.open();
});
