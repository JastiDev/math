import { types, getRoot } from 'mobx-state-tree';

const ItemModel = types
  .model('ItemModel', {
    id: types.identifier(),
    width: 0,
    height: 0,
    top: 0,
    left: 0,
    rotate: 0,
    zIndex: 0,
    background: 'white',
    idGroup: types.maybe(types.string),
    type: 'item'
  })
  .views(self => ({
    get node() {
      return document.getElementById(self.id);
    },
    get isSelected() {
      return getRoot(self).selectedItems.find(box => box === self);
    }
  }))
  .actions(self => {
    return {
      setPosition(left, top) {
        self.left = left;
        self.top = top;
      },
      setSize(width, height) {
        self.width = width;
        self.height = height;
      },
      setRotation(rotate) {
        self.rotate = rotate;
      }
    };
  });

export default ItemModel;
