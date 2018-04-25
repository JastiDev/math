import Store from './Stores/CanvaStore';
import { SelectorModel, InternalDraggableModel } from './Stores/Models';

const box1 = {
  id: '1',
  width: 200,
  height: 200,
  top: 200,
  left: 200,
  rotate: 0,
  background: 'blue',
  zIndex: 1
};
const box2 = {
  id: '2',
  width: 250,
  height: 150,
  top: 220,
  left: 120,
  rotate: 45,
  background: 'green',
  zIndex: 2
};
const box3 = {
  id: '3',
  width: 150,
  height: 120,
  top: 0,
  left: 120,
  rotate: 0,
  background: 'pink',
  zIndex: 3
};
const box4 = {
  id: '4',
  width: 150,
  height: 150,
  top: 220,
  left: 421,
  rotate: 1,
  background: 'orange',
  zIndex: 3
};

const selector = SelectorModel.create();
const internalDraggable = InternalDraggableModel.create();
const store = Store.create({
  selector: selector,
  internaleDraggable: internalDraggable
});
store.addItems([box1, box2, box3, box4]);

export default store;
