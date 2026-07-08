import Popup from "./Popup.js";

export default class PopupWithConfirmation extends Popup {
  constructor(popupSelector, handleConfirm) {
    super(popupSelector);
    this._handleConfirm = handleConfirm;
    this._confirmButton = this._popup.querySelector(".modal__button_delete");
  }

  setEventListeners() {
    super.setEventListeners();
    if (this._confirmButton) {
      this._confirmButton.addEventListener("click", () => {
        if (typeof this._handleConfirm === "function") {
          this._handleConfirm();
        }
        this.close();
      });
    }
  }

  open(callback) {
    this._handleConfirm = callback;
    super.open();
  }
}
