import interact from 'interactjs';
import store from '../Store';
import $ from 'jquery';

const attachDrag = node => {
  interact(node.current).draggable({
    onstart: event => {
      store.startDrag();
      this.$selector = $('#selector');
      this.$fake = $('#fake-drag');
    },
    // call this function on every dragmove event
    onmove: event => {
      store.selectedItems.map(selectedItem => {
        var x =
          (parseFloat(selectedItem.node.style.left) || 0) +
          event.dx / store.delta;
        var y =
          (parseFloat(selectedItem.node.style.top) || 0) +
          event.dy / store.delta;
        selectedItem.node.style.left = x + 'px ';
        selectedItem.node.style.top = y + 'px ';
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
      // store.selector.updatePosition();
      // store.internaleDraggable.updatePosition();
    }
  });
};

const destroyDrag = node => {
  interact(node.current).unset();
};

export { attachDrag, destroyDrag };
