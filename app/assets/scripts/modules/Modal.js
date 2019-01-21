import $ from 'jquery';

class Modal {
    constructor() {
        this.modal = $('.modal');
        this.openModalButtons = $('.open-modal');
        this.closeModalButton = $('.modal__close');
        this.events();
    }

    events() {
        // Clicking the open modal button
        this.openModalButtons.click(this.openModal.bind(this));

        // Clicking the x close modal button

        this.closeModalButton.click(this.closeModal.bind(this));

        // Pushes any key
        $(document).keydown(this.keyPressHandler.bind(this));
    }
    
    openModal() {
        this.modal.addClass('modal--is-visible');
        return false;
    }

    closeModal() {
        this.modal.removeClass('modal--is-visible');
    }

    keyPressHandler(e) {
        if (e.keyCode == 27) {
            this.closeModal();
        }
    }
}

export default Modal;