import Popup from "./Popup.js";

export default class PopupWithImage extends Popup {
  constructor(popupSelector) {
    super(popupSelector);
    this._image = this._popup.querySelector(".modal__image");
    this._caption = this._popup.querySelector(".modal__description");
  }

  open(data) {
    const name = data.name || (data.getName && data.getName());
    const link = data.link || (data.getLink && data.getLink());
    this._image.src = link;
    this._image.alt = name;
    this._caption.textContent = name;
    super.open();
  }

  close() {
    super.close();
    this._image.src = "";
    this._image.alt = "";
    this._caption.textContent = "";
  }
}
