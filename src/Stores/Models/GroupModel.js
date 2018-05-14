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
      scale(scaleFactor, scaleCenter, topLeftGroupContainer){
        // Update the position, width and height of each children
        self.groupedItems.map(item => {
          // Since the top-left vertex of each item is computed with respect
          // to the group top-left corner we change our coordinate system to
          // the one provided by the group container to do the scale.
          let newScaleCenter = self.getCoordinatesfromGroup(scaleCenter);
          // let newScaleCenter = new Point(scaleCenter.x - topLeftGroupContainer.x, scaleCenter.y - topLeftGroupContainer.y);
          // newScaleCenter.log();
          let newItemData = scaleItem(scaleFactor, newScaleCenter, item);
          // newItemData.left -= topLeftGroupContainer.x - self.left; 
          // newItemData.top -= topLeftGroupContainer.y - self.top; 
          // Since the origin of coordinates (top-left corner) is changing
          // with the scaling, the new data of the children (top, left, width, height)
          // is obtained multiplying the original values by the `scaleFactor`
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
