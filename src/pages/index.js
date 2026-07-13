import "./index.css";
import Card from "../components/Card.js";
import FormValidator from "../components/FormValidator.js";
import Section from "../components/Section.js";
import PopupWithImage from "../components/PopupWithImage.js";
import PopupWithForm from "../components/PopupWithForm.js";
import PopupWithConfirmation from "../components/PopupWithConfirmation.js";
import UserInfo from "../components/UserInfo.js";
import Api from "../components/Api.js";

// Review branch for submission
const validationConfig = {
  formSelector: ".modal__form",
  inputSelector: ".modal__input",
  submitButtonSelector: ".modal__button",
  inactiveButtonClass: "modal__button_disabled",
  inputErrorClass: "modal__input_type_error",
  errorClass: "modal__input-error",
};

const defaultCards = [
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

const addMissingDefaultCards = (cards) => {
  const missingCards = defaultCards.filter(
    (defaultCard) =>
      !cards.some(
        (card) =>
          card.name === defaultCard.name && card.link === defaultCard.link,
      ),
  );

  if (missingCards.length === 0) {
    return Promise.resolve(cards);
  }

  return Promise.all(missingCards.map((card) => api.createCard(card)))
    .then((createdCards) => cards.concat(createdCards))
    .catch((err) => {
      console.error(err);
      return cards;
    });
};

// popup instances will handle opening/closing and image population
const popupImage = new PopupWithImage("#image-modal");
const popupDeleteCard = new PopupWithConfirmation("#delete-card-modal");

const popupProfile = new PopupWithForm("#profile-edit-modal", (data) => {
  popupProfile.setSubmitButtonLoading(true);
  api
    .patchUserInfo({ name: data.title, about: data.description })
    .then((updatedUser) => {
      userInfo.setUserInfo({
        title: updatedUser.name,
        description: updatedUser.about,
        avatar: updatedUser.avatar,
      });
      popupProfile.close();
    })
    .catch((err) => {
      console.error(err);
    })
    .finally(() => {
      popupProfile.setSubmitButtonLoading(false);
    });
});

const popupAvatarEdit = new PopupWithForm("#avatar-edit-modal", (data) => {
  popupAvatarEdit.setSubmitButtonLoading(true);
  api
    .patchUserAvatar({ avatar: data.link })
    .then((updatedUser) => {
      userInfo.setUserInfo({
        avatar: updatedUser.avatar,
      });
      popupAvatarEdit.close();
    })
    .catch((err) => {
      console.error(err);
    })
    .finally(() => {
      popupAvatarEdit.setSubmitButtonLoading(false);
    });
});

const popupAddCard = new PopupWithForm("#add-card-modal", (data) => {
  popupAddCard.setSubmitButtonLoading(true);
  api
    .createCard({ name: data.name, link: data.link })
    .then((createdCard) => {
      const newCardElement = renderCard(createdCard);
      cardSection.addItem(newCardElement);
      cardForm.reset();
      const cardFormValidator = formValidators.get(cardForm);
      if (cardFormValidator) cardFormValidator.resetValidation();
      popupAddCard.close();
    })
    .catch((err) => {
      console.error(err);
    })
    .finally(() => {
      popupAddCard.setSubmitButtonLoading(false);
    });
});

const userInfo = new UserInfo({
  nameSelector: ".profile__title",
  jobSelector: ".profile__description",
  avatarSelector: ".profile__image",
});

function handleImageClick(card) {
  popupImage.open(card);
}

const renderCard = (item) => {
  const cardInstance = new Card(
    item,
    "#card-template",
    handleImageClick,
    (cardId, cardInstanceRef) => {
      popupDeleteCard.open(() => {
        api
          .deleteCard(cardId)
          .then(() => {
            cardInstanceRef.removeCard();
          })
          .catch((err) => {
            console.error(err);
          });
      });
    },
    (cardId, cardInstanceRef) => {
      const request = cardInstanceRef.isLiked()
        ? api.unlikeCard(cardId)
        : api.likeCard(cardId);

      request
        .then((updatedCard) => {
          cardInstanceRef.updateLikeStatus(updatedCard.isLiked);
        })
        .catch((err) => {
          console.error(err);
        });
    },
  );
  const cardElement = cardInstance.generateCard();
  return cardElement;
};

const cardSection = new Section(
  {
    items: [],
    renderer: (item) => renderCard(item),
  },
  ".cards__list",
);

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
const avatarEditButton = document.querySelector(".profile__avatar-edit-button");
const addCardButton = document.querySelector(".profile__add-button");
const profileModal = document.querySelector("#profile-edit-modal");
const avatarModal = document.querySelector("#avatar-edit-modal");
const addCardModal = document.querySelector("#add-card-modal");
const profileForm = document.forms["profile-form"];
const avatarForm = document.querySelector("#avatar-form");
const cardForm = document.querySelector("#add-card-form");
const profileNameInput = profileForm.querySelector(".modal__input_type_name");
const profileDescriptionInput = profileForm.querySelector(
  ".modal__input_type_description",
);
const avatarLinkInput = avatarForm.querySelector(".modal__input_type_link");
const cardTitleInput = cardForm.querySelector(".modal__input_type_title");
const cardLinkInput = cardForm.querySelector(".modal__input_type_link");
const profileTitle = document.querySelector(".profile__title");
const profileDescription = document.querySelector(".profile__description");

// wire popup event listeners
popupImage.setEventListeners();
popupDeleteCard.setEventListeners();
popupProfile.setEventListeners();
popupAvatarEdit.setEventListeners();
popupAddCard.setEventListeners();

profileEditButton.addEventListener("click", () => {
  const currentUser = userInfo.getUserInfo();
  profileNameInput.value = currentUser.title;
  profileDescriptionInput.value = currentUser.description;

  const profileFormValidator = formValidators.get(profileForm);
  if (profileFormValidator) profileFormValidator.resetValidation();

  popupProfile.open();
});

avatarEditButton.addEventListener("click", () => {
  avatarLinkInput.value = "";

  const avatarFormValidator = formValidators.get(avatarForm);
  if (avatarFormValidator) avatarFormValidator.resetValidation();

  popupAvatarEdit.open();
});

addCardButton.addEventListener("click", () => {
  popupAddCard.open();
});

// ---------- Api Configuration ----------
const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "f3fad189-0cfa-46f8-b8c2-da77ba09c015",
    "Content-Type": "application/json",
  },
});

// ---------- Load User Information and Cards ----------
api
  .getAppInfo()
  .then(([userData, cardsData]) => {
    userInfo.setUserInfo({
      title: userData.name,
      description: userData.about,
      avatar: userData.avatar,
    });
    return addMissingDefaultCards(cardsData);
  })
  .then((allCards) => {
    cardSection.setItems(allCards);
    cardSection.renderItems();
  })
  .catch((err) => {
    console.error(err);
  });
