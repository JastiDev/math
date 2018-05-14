import { types, getRoot } from 'mobx-state-tree';
import ItemModel from './ItemModel';
import { Point } from '../../Utils/planeTransforms.js';
import { visuallySetItem, scaleItem } from '../../Utils/Math.js';

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
      },
      getCoordinatesfromSlide(item) {
        // Given an item inside the group, we get the coordinates (left, top, rotate)
        // from the slide
        return {left: item.left + self.left,
          top: item.top + self.top,
          rotate: item.rotate + self.rotate, width: item.width, height: item.height};
      },
      getCoordinatesfromGroup(p){ 
        return new Point(p.x - self.left, p.y - self.top);
      },
      setSize(width, height) {
        self.width = width;
        self.height = height;
      },
      scale(scaleFactor, scaleCenter){
        // Update the position, width and height of each children
        self.groupedItems.map(item => {
          // The scale of the children of the container is easy but 
          // has to be understood properly. Since the group container itself
          // is changing with the scale so it is the coordinates origin (the
          // top left corner of the group container) for the children elements.
          // However, once we redraw the group container in the slide using
          // `visuallySetItem` function the `cascade` in the CSS move accordingly
          // all the children elements (position:absolute is set in the parent).
          // As a consecuence, the top-left coordinates of each of the children
          // is computed just multiplying the original one by the scale factor
          // and so it is the width and height
          let newItemData = {};
          newItemData.left = item.left * scaleFactor;
          newItemData.top = item.top * scaleFactor;
          newItemData.width = item.width * scaleFactor;
          newItemData.height = item.height * scaleFactor;
          newItemData.rotate = item.rotate;

          // We update the position of the item in the browser. 
          // Notice that since each item is a child of a div.group with
          // a position:absolute attribute its coordinates are refered
          // to the parent instead of the `slide`
          visuallySetItem(newItemData, item);
        });
        // // Update the top-left cornor of the *container*
        // let newContainerData = scaleItem(scaleFactor, scaleCenter, self);
        // // Update the with and height of the *container*
        // self.width = scaleFactor*self.width;
        // self.width = newContainerData.width;
        // self.height = newContainerData.height;
        // self.left = newContainerData.left;
        // self.top = newContainerData.top;
      }
    };
  });

export default GroupModel;
