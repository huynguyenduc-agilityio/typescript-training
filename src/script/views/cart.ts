import { MIN_QUANTITY } from '../constants';
import { CART_MESSAGE } from '../constants/message';
import {
  LocalStorage,
  confirmPopup,
  openSidebar,
  querySelector,
  querySelectorAll,
} from '../helpers';
import { renderCart } from '../templates/renderCart';
import { LocalStorageType, ProductCart } from '../types';

export class CartView {
  private isAuth: string;

  constructor() {
    this.isAuth = LocalStorage.getItem(LocalStorageType.SIGNIN);
  }

  bindCartInit(cartList: ProductCart[]): void {
    const cartBodyElement: HTMLDivElement = querySelector(`.body-cart`);

    // If element has and cart has item
    if (cartBodyElement && !!cartList.length) {
      cartBodyElement.innerHTML = renderCart(cartList);
      this.renderAdjustQuantity();
    }

    openSidebar();
  }

  private renderAdjustQuantity() {
    const quantityGroups = querySelectorAll('.quantity-group');

    quantityGroups.forEach((group) => {
      const btnIncrease = group.querySelector(`.btn-increase`) as HTMLButtonElement;
      const btnDecrease = group.querySelector(`.btn-decrease`) as HTMLButtonElement;
      const quantityInput = group.querySelector('.quantity') as HTMLInputElement;

      // Click events decrease quantity
      btnDecrease.addEventListener('click', () => {
        this.handleAdjustQuantity(quantityInput, -1);
      });

      // Click events increase quantity
      btnIncrease.addEventListener('click', () => {
        this.handleAdjustQuantity(quantityInput, 1);
      });

      // Blur events quantity
      quantityInput.addEventListener('blur', () => {
        const currentQuantity = parseInt(quantityInput.value);

        // If not a number or a number less than 1
        if (currentQuantity < MIN_QUANTITY) {
          quantityInput.value = '1';
        }
      });
    });
  }

  private handleAdjustQuantity = (inputElement: HTMLInputElement, change: number) => {
    const currentQuantity = parseInt(inputElement.value);

    // If the sum of quantity and change is greater than or equal to 1
    if (currentQuantity + change >= MIN_QUANTITY) {
      inputElement.value = (currentQuantity + change).toString();
    }
  };

  performCheckout = (onRemoveCart: () => void) => {
    const btnCheckout: HTMLButtonElement = querySelector('.btn-checkout');

    // Add even click for button checkout
    btnCheckout.onclick = async () => {
      confirmPopup({
        message: CART_MESSAGE.checkoutCart,
        onConfirm: () => onRemoveCart(),
      });
    };
  };

  // Bind click button log out
  bindClickButtonLogout(handler: () => void): void {
    const btnAccountEl: HTMLButtonElement = querySelector('.header-actions .btn-login');

    // If there is accout in localstorage and btnAccount have element
    if (this.isAuth && btnAccountEl) {
      btnAccountEl.innerHTML = `<img class='btn-logout' src="/svgs/logout.svg" alt="logout" />`;
    }

    const btnLogout = document.querySelector('.btn-logout');

    if (btnLogout) {
      btnLogout.addEventListener('click', handler);
    }
  }
}
