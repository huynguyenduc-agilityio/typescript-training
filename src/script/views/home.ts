import { CATEGORY_PRODUCT } from '../constants';
import {
  LocalStorage,
  openSidebar,
  getElementById,
  querySelector,
  redirect,
  toggleElement,
} from '../helpers';
import { productCard, renderGearSection, renderModal, renderProductSection } from '../templates';
import { LocalStorageType, DEFAULT_ROUTER, Product } from '../types';
import { Nullable } from '../types/genericTypes';

export class HomeView {
  private selectedProduct: Nullable<Product>;
  private modalContainer: Nullable<HTMLDivElement>;
  private isAuth: string;
  private addToCartHandler: (product: Product) => Promise<void>;

  constructor() {
    this.selectedProduct = null;
    this.modalContainer = null;
    this.isAuth = LocalStorage.getItem(LocalStorageType.SIGNIN);
    this.addToCartHandler = async () => {};
  }

  init(renderHome: () => Promise<void>, handleAddToCart: (product: Product) => Promise<void>) {
    renderHome();
    openSidebar();
    this.addToCartHandler = handleAddToCart; // Store the controller's function
  }

  bindProductSection(products: Product[], category: string): void {
    const sectionElement: HTMLDivElement = querySelector(`.render-${category}`);
    const titleCategoryMatch = CATEGORY_PRODUCT.find((item) => category === item.category);

    if (sectionElement && titleCategoryMatch) {
      // Create Section into HTML
      sectionElement.innerHTML = renderProductSection({
        category: category,
        titleContent: titleCategoryMatch.title,
        isSeeAll: window.location.pathname === DEFAULT_ROUTER.HOME,
      });
    }

    // Render list of product in the section
    const listProductElement: HTMLDivElement = querySelector(`.${category} .product-list`);

    if (listProductElement) {
      const newProducts = products
        .map((product) => {
          return productCard(product);
        })
        .join('');

      // Create list procduct into HTML
      listProductElement.innerHTML = newProducts || renderGearSection();
    }

    const productItemsElement: NodeListOf<HTMLDivElement> =
      listProductElement.querySelectorAll('.product-item');

    // Loop through the products array
    productItemsElement.forEach((element, index) => {
      if (element) {
        element.addEventListener('click', () => {
          // Save product information clicked on selectedProduct variable
          this.selectedProduct = products[index];

          // Show modal when product is clicked
          this.bindModal(this.selectedProduct);
        });
      }
    });
  }

  bindModal = (product: Nullable<Product>): void => {
    const mainBodyElement: HTMLDivElement = querySelector(`main.main-content`);

    if (mainBodyElement && product) {
      if (!this.modalContainer) {
        // Create a new modal container if it doesn't exist
        this.modalContainer = document.createElement('div');
        this.modalContainer.classList.add('modal-container');
        mainBodyElement.appendChild(this.modalContainer);
      }

      this.handleShowModal(product);

      const closeModalEL: HTMLButtonElement = querySelector('.modal-container .btn-close');

      // Add click event for modal close button
      closeModalEL.addEventListener('click', () => {
        this.handleCloseModal();
      });

      this.handleAddToCart(product);
    }
  };

  handleShowModal = (product: Nullable<Product>): void => {
    toggleElement(this.modalContainer!, 'open');

    // Update the modal container content with the new product information
    if (this.modalContainer && product) {
      this.modalContainer.innerHTML = renderModal(product);
    }
  };

  handleCloseModal = () => {
    toggleElement(this.modalContainer!, 'open');
    this.selectedProduct = null;
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

  handleAddToCart = (product: Product) => {
    const buttonAddCartEl: HTMLButtonElement = getElementById('btn-add-cart');

    // Add click event for modal add to cart button
    buttonAddCartEl.addEventListener('click', () => {
      // If not accout, return redirect authentication
      if (!this.isAuth) {
        redirect(DEFAULT_ROUTER.AUTHENTICATION);
      }

      this.addToCartHandler(product);
      toggleElement(this.modalContainer!, 'open');
    });
  };
}
