import { types, getSnapshot } from 'mobx-state-tree';

// Models
import {
  ItemModel,
  GroupModel,
  SelectorModel,
  InternalDraggableModel
} from './Models';

// Math methods
import { rotacionCentro, getDataForRotatedItems } from '../Utils/Math';

const CanvaStore = types
  .model('CanvaStore', {
    items: types.optional(types.array(ItemModel), []),
    selectedItems: types.optional(
      types.array(
        types.union(types.reference(ItemModel), types.reference(GroupModel))
      ),
      []
    ),
    groups: types.optional(types.array(GroupModel), []),
    isDragging: false,
    isRotating: false,
    isResizing: false,
    selector: types.maybe(SelectorModel),
    delta: 1,
    internaleDraggable: types.maybe(InternalDraggableModel)
  })
  .views(self => ({
    get showSelector() {
      return self.selectedItems.length > 0;
    },
    get showInternalDraggable() {
      return self.selectedItems.length > 1;
    },
    getGroup(id) {
      return self.groups.find(group => group.id === id);
    },
    get anyGroup() {
      return self.selectedItems.find(item => item.type === 'group');
    },
    get allGroup() {
      return self.selectedItems.every(item => item.type === 'group');
    },
    get showGroup() {
      return self.selectedItems.length > 1 && !self.anyGroup;
    },
    get showUnGroup() {
      return self.selectedItems.length > 0 && self.allGroup;
    }
  }))
  .actions(self => {
    const addItems = items => {
      items.map(item => self.items.push(ItemModel.create(item)));
    };

    const endDrag = () => {
      self.selectedItems.map(selectedItem => {
        selectedItem.setPosition(
          parseInt(selectedItem.node.style.left, 10),
          parseInt(selectedItem.node.style.top, 10)
        );
      });
      self.isDragging = false;
    };

    const startDrag = itemToMove => {
      self.isDragging = true;
      if (itemToMove) {
        const isSelected = self.selectedItems.find(item => item === itemToMove);
        if (!isSelected) {
          self.cleanAll();
          self.selectItem(itemToMove);
        }
      }
    };

    const createGroup = idGroup => {
      const data = self.fakeDrag.getData();
      const newGroup = GroupModel.create({
        id: idGroup,
        width: data.width,
        height: data.height,
        left: data.x,
        top: data.y,
        zIndex: 10,
        selectedItems: getSnapshot(self.selectedItems)
      });

      self.selectedItems.map(box => {
        box.idGroup = idGroup;
        box.top = box.top - newGroup.top;
        box.left = box.left - newGroup.left;
      });
      self.cleanAll();
      self.groups.push(newGroup);
      self.selectBox(newGroup);
    };

    const destroyGroup = () => {
      self.groups.map(group => {
        const newPositionGroup = rotacionCentro(
          0,
          0,
          group.rotate * Math.PI / 180,
          group.left,
          group.top
        );

        group.selectedItems.map(box => {
          box.idGroup = null;

          const centroCaja = {
            x: box.left + box.width / 2,
            y: box.top + box.height / 2
          };

          const nuevaRotacion = group.rotate + box.rotate;

          const nuevoCentro = rotacionCentro(
            group.left + group.width / 2,
            group.top + group.height / 2,
            group.rotate * Math.PI / 180,
            centroCaja.x,
            centroCaja.y
          );

          const nuevaPosicion = {
            x: nuevoCentro.x - box.width / 2,
            y: nuevoCentro.y - box.height / 2
          };

          box.top = nuevaPosicion.y + newPositionGroup.y;
          box.left = nuevaPosicion.x + newPositionGroup.x;
          box.rotate = nuevaRotacion;
        });
      });

      self.cleanAll();
      self.groups.clear();
      self.selector.updatePosition();
      self.internaleDraggable.updatePosition();
    };

    const setDelta = newDelta => {
      self.delta = newDelta;
    };

    const cleanAll = () => {
      if (self.selectedItems.length > 0) {
        self.selectedItems.clear();
      }
    };

    const selectItem = item => {
      if (!self.selectedItems.find(i => i.id === item.id)) {
        self.selectedItems.push(item);
      } else {
        self.unSelectItem(item);
      }
    };
    const unSelectItem = item => {
      self.selectedItems.remove(item);
    };

    return {
      addItems,
      endDrag,
      startDrag,
      createGroup,
      destroyGroup,
      setDelta,
      cleanAll,
      selectItem,
      unSelectItem
    };
  });

export default CanvaStore;
