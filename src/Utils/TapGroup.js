import interact from 'interactjs';
import store from '../Store';

const attachTap = group => {
  interact(group.node).on('tap', event => {
    event.stopPropagation();
    store.cleanAll();
    store.selectItem(group);
    store.selector.updatePosition();
    store.internaleDraggable.updatePosition();
  });
};
const destroyTap = node => {
  interact(node).unset();
};

export { attachTap, destroyTap };
