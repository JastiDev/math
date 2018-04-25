import interact from 'interactjs';
import store from '../Store';

const attachTap = item => {
  interact(item.node).on('tap', event => {
    event.stopPropagation();
    if (event.metaKey) {
      store.selectItem(item);
    } else {
      store.cleanAll();
      store.selectItem(item);
    }
    store.selector.updatePosition();
    store.internaleDraggable.updatePosition();
  });
};
const destroyTap = item => {
  interact(item.node).unset();
};

export { attachTap, destroyTap };
