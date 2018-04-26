import { types, getRoot } from 'mobx-state-tree';
import $ from 'jquery';

const SelectorModel = types
  .model('SelectorModel', {
    id: 'selector',
    width: 0,
    height: 0,
    y: 0,
    x: 0,
    transform: 'rotate(0deg)',
    angle: 0
  })
  .views(self => ({
    get node() {
      return document.getElementById(self.id);
    }
  }))
  .actions(self => ({
    updatePosition() {
      const rootPath = getRoot(self);

      if (rootPath.selectedItems.length === 1) {
        console.log(rootPath.selectedItems);
        const $nodeCloned = $(rootPath.selectedItems[0].node).clone();
        const previousTransform = $nodeCloned.css('transform');
        $nodeCloned.css('transform', 'none');
        $nodeCloned.css('display', 'block');

        $('#slide').append($nodeCloned);
        const values = $nodeCloned[0].getBoundingClientRect();

        self.y = values.y;
        self.x = values.x;
        self.width = values.width;
        self.height = values.height;
        self.transform = previousTransform;
        $nodeCloned.remove();
        return values;
      } else {
        const minY = rootPath.selectedItems.map(item => {
          return item.node.getBoundingClientRect().y;
        });
        const minX = rootPath.selectedItems.map(
          item => item.node.getBoundingClientRect().x
        );
        const maxX = rootPath.selectedItems.map(item => {
          const bounded = item.node.getBoundingClientRect();
          return bounded.right;
        });
        const maxY = rootPath.selectedItems.map(item => {
          const bounded = item.node.getBoundingClientRect();
          return bounded.bottom;
        });

        const selectorSize = {
          get minorTop() {
            return Math.min(...minY);
          },
          get maxTop() {
            return Math.max(...maxY);
          },
          get minorLeft() {
            return Math.min(...minX);
          },
          get maxLeft() {
            return Math.max(...maxX);
          }
        };

        self.y = selectorSize.minorTop;
        self.x = selectorSize.minorLeft;
        self.width = selectorSize.maxLeft - selectorSize.minorLeft;
        self.height = selectorSize.maxTop - selectorSize.minorTop;
        self.rotate = 0;
        self.transform = 'rotate(0deg)';
      }
    },
    setRotation(rotate, transform) {
      self.transform = transform;
      self.rotate = rotate;
    }
  }));

export default SelectorModel;
