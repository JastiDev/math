import interact from 'interactjs';
import store from '../Store';
import $ from 'jquery';
import { getRotationDegrees } from '../Utils/Math';
const attachDrag = item => {
  interact(item.node).draggable({
    // snap: {
    //   // targets: [interact.createSnapGrid({ x: 1, y: 1 })],
    //   range: Infinity,
    //   relativePoints: [{ x: 0, y: 0 }]
    // },
    onstart: event => {
      store.startDrag(item);
      this.$selector = $('#selector');
      this.$fake = $('#fake-drag');
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

        $(selectedItem.node).css('left', x);
        $(selectedItem.node).css('top', y);

        return null;
      });

      const xs = (parseFloat(this.$selector[0].style.left, 10) || 0) + event.dx;
      const ys = (parseFloat(this.$selector[0].style.top, 10) || 0) + event.dy;
      this.$selector.css({ left: xs, top: ys });

      if (store.selectedItems.length > 1) {
        const xf =
          (parseFloat(this.$fake[0].style.left, 10) || 0) +
          event.dx / store.delta;
        const yf =
          (parseFloat(this.$fake[0].style.top, 10) || 0) +
          event.dy / store.delta;

        this.$fake.css({ left: xf, top: yf });
      }
    },
    // call this function on every dragend event
    onend: function(event) {
      store.endDrag();
      if (store.selectedItems.length === 1) {
        store.selector.updatePosition();
      }
    }
  });
};

const destroyDrag = node => {
  interact(node).unset();
};

export { attachDrag, destroyDrag };
