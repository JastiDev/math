import interact from 'interactjs';
import store from '../Store';
import $ from 'jquery';

const attachIconsResize = () => {
  $('.pointers').on('mouseenter', event => {
    console.log(event);
    console.log(event.currentTarget);
    // Do stuff here
  });
};
const destroyIconsResize = () => {
  $('.pointers').off('mouseenter');
};

export { attachIconsResize, destroyIconsResize };
