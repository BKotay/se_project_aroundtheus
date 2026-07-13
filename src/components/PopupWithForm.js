import Popup from "./Popup.js";

export default class PopupWithForm extends Popup {
  constructor(popupSelector, handleFormSubmit) {
    super(popupSelector);
    this._handleFormSubmit = handleFormSubmit;
    this._form = this._popup.querySelector(".modal__form");
    this._inputList = Array.from(this._form.querySelectorAll(".modal__input"));
    this._submitButton = this._form.querySelector(".modal__button");
    this._buttonDefaultText = this._submitButton
      ? this._submitButton.textContent
      : "";
  }

  _getInputValues() {
    const values = {};
    this._inputList.forEach((input) => {
      values[input.name] = input.value;
    });
    return values;
  }

  setSubmitButtonLoading(isLoading) {
    if (this._submitButton) {
      if (isLoading) {
        this._submitButton.textContent = "Saving...";
        this._submitButton.disabled = true;
      } else {
        this._submitButton.textContent = this._buttonDefaultText;
        this._submitButton.disabled = false;
      }
    }
  }

  setEventListeners() {
    super.setEventListeners();
    this._form.addEventListener("submit", (evt) => {
      evt.preventDefault();
      this._handleFormSubmit(this._getInputValues());
    });
  }
}
