export default class UserInfo {
  constructor({ nameSelector, jobSelector, avatarSelector }) {
    this._nameElement = document.querySelector(nameSelector);
    this._jobElement = document.querySelector(jobSelector);
    this._avatarElement = avatarSelector
      ? document.querySelector(avatarSelector)
      : null;
  }

  getUserInfo() {
    return {
      title: this._nameElement.textContent,
      description: this._jobElement.textContent,
    };
  }

  setUserInfo({ title, description, avatar }) {
    if (title !== undefined) this._nameElement.textContent = title;
    if (description !== undefined) this._jobElement.textContent = description;
    if (avatar !== undefined && this._avatarElement) {
      this._avatarElement.src = avatar;
    }
  }
}
