import React, { Component } from 'react';
import { observer } from 'mobx-react';
import interact from 'interactjs';
import store from '../../Store';
import { attachDrag, destroyDrag } from '../../Utils/DragInternalDraggable';

export default observer(
  class componentName extends Component {
    constructor(props) {
      super(props);
      this.myRef = React.createRef();
    }

    componentDidMount() {
      attachDrag(this.myRef);
    }

    componentWillUnmount() {
      destroyDrag(this.myRef);
    }

    render() {
      return (
        <div
          id="fake-drag"
          style={{
            left: store.internaleDraggable.x + 'px',
            top: store.internaleDraggable.y + 'px',
            width: store.internaleDraggable.width + 'px',
            height: store.internaleDraggable.height + 'px',
            position: 'absolute',
            display: store.isDragging ? 'none' : 'block',
            zIndex: 0,
            transform: store.internaleDraggable.transform
          }}
          ref={this.myRef}
          className="selector"
        />
      );
    }
  }
);
