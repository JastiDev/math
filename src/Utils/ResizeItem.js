import interact from 'interactjs';
import store from '../Store';
import $ from 'jquery';

const attachResize = () => {
  interact('.pointers').draggable({
    onstart: () => {},
    onmove: event => {},
    onend: () => {}
  });
};
const destroyResize = () => {
  interact('.pointers').unset();
};

export { attachResize, destroyResize };
