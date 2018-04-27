import { types, onPatch, resolvePath, getRoot } from 'mobx-state-tree';
import $ from 'jquery';
import store from '../../Store';

const InternalDraggableModel = types
  .model('InternalDraggableModel', {
    id: 'fake-drag',
    width: 0,
    height: 0,
    y: 0,
    x: 0,
    transform: 'rotate(0deg)',
    rotate: 0
  })
  .views(self => ({
    getData() {
      const root = getRoot(self);
      const delta = root.delta;
      // Multiple items
      if (root.selectedItems.length > 0) {
        const minY = root.selectedItems.map(item =>
          parseFloat($(item.node).position().top / delta)
        );
        const minX = root.selectedItems.map(item => {
          return parseFloat($(item.node).position().left / delta);
        });
        const maxWidth = root.selectedItems.map(item => {
          if (item.rotate === 0) {
            return (
              $(item.node).position().left / delta +
              item.node.getBoundingClientRect().width / delta
            );
          } else {
            return (
              $(item.node).position().left / delta +
              item.node.getBoundingClientRect().width / delta
            );
          }
        });
        const maxHeight = root.selectedItems.map(item => {
          if (item.rotate === 0) {
            return (
              $(item.node).position().top / delta +
              item.node.getBoundingClientRect().height / delta
            );
          } else {
            return (
              $(item.node).position().top / delta +
              item.node.getBoundingClientRect().height / delta
            );
          }
        });

        const internalDraggableSizeAndPosition = {
          get top() {
            return Math.min(...minY);
          },
          get left() {
            return Math.min(...minX);
          },
          get width() {
            return Math.max(...maxWidth) - this.left;
          },
          get height() {
            return Math.max(...maxHeight) - this.top;
          }
        };

        const px = {
          y: internalDraggableSizeAndPosition.top,
          x: internalDraggableSizeAndPosition.left,
          width: internalDraggableSizeAndPosition.width,
          height: internalDraggableSizeAndPosition.height
        };

        return px;
      }
    },
    get node() {
      return document.getElementById(self.id);
    }
  }))
  .actions(self => ({
    setRotation(rotate, transform) {
      self.transform = transform;
      self.rotate = rotate;
    },
    updatePosition() {
      const root = getRoot(self);
      const delta = store.delta;
      // Multiple items
      if (root.selectedItems.length === 1) {
        const item = root.selectedItems[0];

        const px = {
          y: parseFloat($(item.node).position().top / delta),
          x: parseFloat($(item.node).position().left / delta)
        };

        self.height = item.node.getBoundingClientRect().height / delta;
        self.width = item.node.getBoundingClientRect().width / delta;
        self.x = px.x;
        self.y = px.y;
      } else if (root.selectedItems.length > 1) {
        const minY = root.selectedItems.map(item =>
          parseFloat($(item.node).position().top / delta)
        );
        const minX = root.selectedItems.map(item => {
          return parseFloat($(item.node).position().left / delta);
        });
        const maxWidth = root.selectedItems.map(item => {
          if (item.rotate === 0) {
            return (
              $(item.node).position().left / delta +
              item.node.getBoundingClientRect().width / delta
            );
          } else {
            return (
              $(item.node).position().left / delta +
              item.node.getBoundingClientRect().width / delta
            );
          }
        });
        const maxHeight = root.selectedItems.map(item => {
          if (item.rotate === 0) {
            return (
              $(item.node).position().top / delta +
              item.node.getBoundingClientRect().height / delta
            );
          } else {
            return (
              $(item.node).position().top / delta +
              item.node.getBoundingClientRect().height / delta
            );
          }
        });

        const fakeDrag = {
          get top() {
            return Math.min(...minY);
          },
          get left() {
            return Math.min(...minX);
          },
          get width() {
            return Math.max(...maxWidth) - this.left;
          },
          get height() {
            return Math.max(...maxHeight) - this.top;
          }
        };

        const px = {
          y: fakeDrag.top,
          x: fakeDrag.left,
          width: fakeDrag.width,
          height: fakeDrag.height
        };

        self.height = fakeDrag.height;
        self.width = fakeDrag.width;
        self.x = fakeDrag.left;
        self.y = fakeDrag.top;
        self.rotate = 0;
        self.transform = 'rotate(0deg)';
      }
    }
  }));

export default InternalDraggableModel;
