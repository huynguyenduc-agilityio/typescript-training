export const renderConfirm = (message: string): string => {
  return `
  <div class="popup">
  <div class="header-popup"><span class="btn-close">×</span></div>
  <div class="content-popup">
    <div class="body-popup-confirm">
        <p class="text-description-medium product-description">${message}</p>
        <div class='btn-action-confirm'>
            <button class="btn btn-cancel">Cancel</button>
            <button class="btn btn-confirm">Confirm</button>
        </div>
    </div>
  </div>
  </div>
  `;
};
