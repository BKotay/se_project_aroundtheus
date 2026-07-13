export default class Card {
  constructor(data, cardSelector, handleImageClick) {
    this._name = data.name;
    this._link = data.link;
    this._cardSelector = cardSelector;
    this._handleImageClick = handleImageClick;
  }

  _getTemplate() {
    const cardElement = document
      .querySelector(this._cardSelector)
      .content.querySelector(".card")
      .cloneNode(true);

    return cardElement;
  }

  _handleLike(evt) {
    evt.target.classList.toggle("card__like-button_active");
  }

  _handleDelete() {
    this._card.remove();
  }

  _setEventListeners() {
    const likeButton = this._card.querySelector(".card__like-button");
    const deleteButton = this._card.querySelector(".card__delete-button");
    const cardImage = this._card.querySelector(".card__image");

    likeButton.addEventListener("click", (evt) => {
      this._handleLike(evt);
    });

    deleteButton.addEventListener("click", () => {
      this._handleDelete();
    });

    cardImage.addEventListener("click", () => {
      this._handleImageClick(this);
    });
  }

  getName() {
    return this._name;
  }

  getLink() {
    return this._link;
  }

  generateCard() {
    this._card = this._getTemplate();

    const cardImage = this._card.querySelector(".card__image");
    const cardTitle = this._card.querySelector(".card__title");

    cardImage.src = this._link;
    cardImage.alt = this._name;
    cardImage.onerror = () => {
      cardImage.src =
        "https://via.placeholder.com/300x200?text=Image+Unavailable";
    };

    cardTitle.textContent = this._name;

    this._setEventListeners();

    return this._card;
  }
}
