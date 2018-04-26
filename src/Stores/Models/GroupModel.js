import { types, getRoot } from 'mobx-state-tree';
import ItemModel from './ItemModel';

const GroupModel = types
  .model('GroupModel', {
    id: types.identifier(),
    width: 0,
    height: 0,
    top: 0,
    left: 0,
    rotate: 0,
    zIndex: 0,
    groupedItems: types.array(types.reference(ItemModel)),
    type: 'group'
  })
  .views(self => ({
    get node() {
      return document.getElementById(self.id);
    },
    get isSelected() {
      return getRoot(self).selectedItems.find(item => item === self);
    }
  }))
  .actions(self => {
    return {
      setPosition(left, top) {
        self.left = left;
        self.top = top;
      },
      setRotation(rotate) {
        self.rotate = rotate;
      }
    };
  });

export default GroupModel;
