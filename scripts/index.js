const profileEditBtn = document.querySelector(".profile__edit-button");
const profileEditModal = document.querySelector("#profile-edit-modal");

profileEditBtn.addEventListener("click", () => {
  profileEditModal.classList.add("modal_opened");
  e.preventDefault;
});

const profileCloseBtn = document.querySelector(".modal__close");
profileCloseBtn.addEventListener("click", () => {
  profileEditModal.classList.add("modal__close");
  e.preventDefault;
});
