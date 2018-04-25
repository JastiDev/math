import interact from 'interactjs';
import store from '../Store';
import $ from 'jquery';
import { getRotationDegrees } from '../Utils/Math';
const attachDrag = item => {
  interact(item.node).draggable({
    snap: {
      targets: [interact.createSnapGrid({ x: 1, y: 1 })],
      range: Infinity,
      relativePoints: [{ x: 0, y: 0 }]
    },
    onstart: event => {
      store.startDrag(item);
    },
    onmove: event => {
      store.selectedItems.map(selectedItem => {
        // keep the dragged position in the data-x/data-y attributes
        const x =
          (parseFloat(selectedItem.node.style.left, 10) || 0) +
          event.dx / store.delta; // THIS IS THE DELTA SCALED
        const y =
          (parseFloat(selectedItem.node.style.top, 10) || 0) +
          event.dy / store.delta; // THIS IS THE DELTA SCALED

        selectedItem.setPosition(x, y);

        return null;
      });
    },
    // call this function on every dragend event
    onend: function(event) {
      setTimeout(() => {
        store.endDrag();
        store.selector.updatePosition();
        store.internaleDraggable.updatePosition();
        const $selector = $('#selector');
        const anguloFinal = getRotationDegrees($selector);

        store.selector.setRotation(
          anguloFinal,
          'rotate(' + anguloFinal + 'deg)'
        );
        store.internaleDraggable.setRotation(
          anguloFinal,
          'rotate(' + anguloFinal + 'deg)'
        );
      }, 50);
    }
  });
};

const destroyDrag = node => {
  interact(node).unset();
};

export { attachDrag, destroyDrag };
