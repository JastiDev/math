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
  zIndex: 4
};

const box5 = {
  id: '5',
  width: 120,
  height: 40,
  top: 420,
  left: 221,
  rotate: 0,
  background: 'violet',
  zIndex: 5
};

const box6 = {
  id: '6',
  width: 160,
  height: 150,
  top: 20,
  left: 621,
  rotate: 75,
  background: 'yellow',
  zIndex: 6
};

const selector = SelectorModel.create();
const internalDraggable = InternalDraggableModel.create();
const store = Store.create({
  selector: selector,
  internaleDraggable: internalDraggable
});
store.addItems([box1, box2, box3, box4, box5, box6]);

export default store;
