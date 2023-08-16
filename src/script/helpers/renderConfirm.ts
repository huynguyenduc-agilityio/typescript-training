import { querySelector } from '.';
import { IConfirm } from '../interfaces';
import { renderConfirm } from '../templates';

export const confirmPopup = ({ message, onConfirm }: IConfirm) => {
  const mainElement: HTMLDivElement = querySelector(`main.main-content`);
  const confirmElement = document.createElement('div');

  confirmElement.classList.add('modal-container', 'open');

  // Add html body confirm
  confirmElement.innerHTML = renderConfirm(message);

  // Remove toast when clicked
  confirmElement.onclick = (event: Event) => {
    const target = event.target as Element;

    // If find the closest button or button cancel element that matches
    if (target.closest('.btn-close') || target.closest('.btn-cancel')) {
      confirmElement.remove();
    } else if (target.closest('.btn-confirm')) {
      onConfirm();
      confirmElement.remove();
    }
  };

  mainElement.appendChild(confirmElement);
};
