import interact from 'interactjs';
import store from '../Store';

const tapContainer = node => {
  interact(node).on('tap', event => {
    store.cleanAll();
  });
};
const destroyTapContainer = node => {
  interact(node).unset();
};

export { tapContainer, destroyTapContainer };
