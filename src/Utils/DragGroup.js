import interact from 'interactjs';
import store from '../Store';
import $ from 'jquery';
import { getRotationDegrees } from '../Utils/Math';
const attachDrag = group => {
  interact(group.node).draggable({
    onstart: event => {
      store.startDrag(group);
    },
    // call this function on every dragmove event
    onmove: event => {
      store.selectedItems.map(selectedItem => {
        // keep the dragged position in the data-x/data-y attributes
        var x =
          (parseFloat(selectedItem.node.style.left) || 0) +
          event.dx / store.delta; // THIS IS THE DELTA SCALED
        var y =
          (parseFloat(selectedItem.node.style.top) || 0) +
          event.dy / store.delta; // THIS IS THE DELTA SCALED
        selectedItem.setPosition(parseFloat(x), parseFloat(y));
      });
    },
    // call this function on every dragend event
    onend: function(event) {
      store.endDrag();
      store.selector.updatePosition();
      store.internaleDraggable.updatePosition();
    }
  });
};

const destroyDrag = node => {
  interact(node).unset();
};

export { attachDrag, destroyDrag };
