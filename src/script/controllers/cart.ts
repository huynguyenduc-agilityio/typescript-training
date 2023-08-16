import { CART_MESSAGE, CHECKOUT_MESSAGE } from '../constants/message';
import { LocalStorage, Toast, redirect } from '../helpers';
import { CartModel } from '../models/cart';
import { DEFAULT_CATEGORY, DEFAULT_ROUTER, LocalStorageType, ProductCart } from '../types';
import { CartView } from '../views/cart';

export class CartController {
  model: CartModel;
  view: CartView;
  dataProduct: ProductCart[];
  cartId: string;
  private toast: Toast = new Toast();

  constructor(model: CartModel, view: CartView) {
    this.model = model;
    this.view = view;
    this.dataProduct = [];
    this.cartId = LocalStorage.getItem(LocalStorageType.CART);
    this.init();
  }

  init(): void {
    const isAuth = LocalStorage.getItem(LocalStorageType.SIGNIN);

    this.handleShowListCart();

    if (isAuth) {
      this.view.bindClickButtonLogout(() => {
        LocalStorage.removeItem(LocalStorageType.SIGNIN);
      });
    }
  }

  handleShowListCart = async (): Promise<void> => {
    const dataCart = (await this.model.getCartById(this.cartId)).itemList;

    // If data cart has
    if (dataCart) {
      for (const item of dataCart) {
        const response = await this.model.getProductById(item.productId);
        this.dataProduct.push({ ...response, quantity: item.quantity });
      }
    }

    this.view.bindCartInit(this.dataProduct);
    this.view.performCheckout(this.onRemoveCart);
  };

  onRemoveCart = async () => {
    try {
      // Remove cart by id in server
      await this.model.removeCartById(this.cartId);

      // Remove id cart in localStorage
      LocalStorage.removeItem(LocalStorageType.CART);

      this.toast.success({ message: CHECKOUT_MESSAGE.successCheckout });
      redirect(DEFAULT_ROUTER.HOME);
    } catch (error) {
      this.toast.success({ message: CART_MESSAGE.notFoundCart });
    }
  };
}
