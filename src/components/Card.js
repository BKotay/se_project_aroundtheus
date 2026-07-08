export default class Card {
  constructor(
    data,
    cardSelector,
    handleImageClick,
    handleCardDelete,
    handleLikeToggle,
  ) {
    this._name = data.name;
    this._link = data.link;
    this._id = data._id;
    this._isLiked = Boolean(data.isLiked);
    this._cardSelector = cardSelector;
    this._handleImageClick = handleImageClick;
    this._handleCardDelete = handleCardDelete;
    this._handleLikeToggle = handleLikeToggle;
  }

  _getTemplate() {
    const cardElement = document
      .querySelector(this._cardSelector)
      .content.querySelector(".card")
      .cloneNode(true);

    return cardElement;
  }

  _handleLike(evt) {
    if (typeof this._handleLikeToggle === "function") {
      this._handleLikeToggle(this._id, this);
    } else {
      this.updateLikeStatus(!this._isLiked);
    }
  }

  _handleDelete() {
    if (typeof this._handleCardDelete === "function") {
      this._handleCardDelete(this._id, this);
    } else {
      this.removeCard();
    }
  }

  removeCard() {
    this._card.remove();
    this._card = null;
  }

  updateLikeStatus(isLiked) {
    this._isLiked = Boolean(isLiked);
    if (this._likeButton) {
      this._likeButton.classList.toggle(
        "card__like-button_active",
        this._isLiked,
      );
    }
  }

  isLiked() {
    return this._isLiked;
  }

  _setEventListeners() {
    const likeButton = this._card.querySelector(".card__like-button");
    const deleteButton = this._card.querySelector(".card__delete-button");
    const cardImage = this._card.querySelector(".card__image");
    this._likeButton = likeButton;

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
    this.updateLikeStatus(this._isLiked);

    this._setEventListeners();

    return this._card;
  }
}
