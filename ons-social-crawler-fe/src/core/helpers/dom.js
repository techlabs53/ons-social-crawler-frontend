import { Modal } from 'bootstrap'

/*const hideModal = (modalEl: HTMLElement | null): void => {
  if (!modalEl) {
    return;
  }

  const myModal = Modal.getInstance(modalEl);
  myModal?.hide();
};

const removeModalBackdrop = (): void => {
  if (document.querySelectorAll(".modal-backdrop.fade.show").length) {
    document.querySelectorAll(".modal-backdrop.fade.show").forEach((item) => {
      item.remove();
    });
  }
};*/

const getModalInstance = (modalId) => document.getElementById(modalId.toString())

const hideModal = (modalId) => {
  const element = getModalInstance(modalId)
  if (element) {
    const myModal = Modal.getInstance(element)
    myModal?.hide()
  }
}

const showModal = (modalId) => {
  const element = getModalInstance(modalId)
  if (element) {
    const myModal = new Modal(element)
    myModal?.show()
  }
}

export { hideModal, getModalInstance, showModal }
