import { getElementById, querySelector } from './doms';

export const openSidebar = () => {
  const menuToggleElement: HTMLDivElement = getElementById('toggle-menu');
  const headerElement: HTMLDivElement = querySelector('.header');
  const navbarElement: HTMLDivElement = querySelector('.navbar');
  const navListElement: HTMLDivElement = querySelector('.navbar-list');

  menuToggleElement.addEventListener('click', (event: MouseEvent) => {
    headerElement.classList.add('header-mobile');
    event.stopPropagation();
  });

  navbarElement.addEventListener('click', (event) => {
    if (!navListElement.contains(event.target as Node)) {
      headerElement.classList.remove('header-mobile');
    }
  });
};
