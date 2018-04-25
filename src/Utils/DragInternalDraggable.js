import interact from 'interactjs';
import store from '../Store';

const attachDrag = node => {
  interact(node.current).draggable({
    snap: {
      targets: [interact.createSnapGrid({ x: 1, y: 1 })],
      range: Infinity,
      relativePoints: [{ x: 0, y: 0 }]
    },
    onstart: event => {
      store.startDrag();
    },
    // call this function on every dragmove event
    onmove: event => {
      store.selectedItems.map(selectedItem => {
        var x =
          (parseInt(selectedItem.node.style.left) || 0) +
          event.dx / store.delta;
        var y =
          (parseInt(selectedItem.node.style.top) || 0) + event.dy / store.delta;
        selectedItem.node.style.left = x + 'px ';
        selectedItem.node.style.top = y + 'px ';
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
  interact(node.current).unset();
};

export { attachDrag, destroyDrag };
