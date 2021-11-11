import { defineCustomElements } from '@ionic/pwa-elements/loader';
// Call the element loader after the app has been rendered the first time
defineCustomElements(window);

export { default as BookList } from './BookList';
export { default as BookEdit } from './BookEdit';
