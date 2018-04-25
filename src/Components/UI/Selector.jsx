import React, { Component } from 'react';
import { observer } from 'mobx-react';
import canvaStore from '../../Store';

import '../../Utils/RotateItem';

const Selector = observer(
  class Selector extends Component {
    render() {
      return (
        <div
          id="selector"
          style={{
            left: canvaStore.selector.x + 'px',
            top: canvaStore.selector.y + 'px',
            width: canvaStore.selector.width + 'px',
            height: canvaStore.selector.height + 'px',
            transform: canvaStore.selector.transform,
            display: canvaStore.isDragging ? 'none' : 'block'
          }}
          className="selector"
        >
          <div id="nw" className="pointers pointer1 resizer">
            <div className="point" />
          </div>
          <div id="sw" className="pointers pointer2 resizer">
            <div className="point" />
          </div>
          <div id="ne" className="pointers pointer3 resizer">
            <div className="point" />
          </div>
          <div id="se" className="pointers pointer4 resizer">
            <div className="point" />
          </div>
          <div className="pointers midle-point pointer-north">
            <div className="point" />
          </div>
          <div className="pointers midle-point pointer-east">
            <div className="point" />
          </div>
          <div className="pointers midle-point pointer-south">
            <div className="point" />
          </div>
          <div className="pointers midle-point pointer-west">
            <div className="point" />
          </div>
          <span className="topline lines-resize" />
          <span className="rightline lines-resize" />
          <span className="botline lines-resize" />
          <span className="leftline lines-resize" />
          <div className="pointer-rotate pointer9" />
          <div className="rotate-line" />
        </div>
      );
    }
  }
);

export default Selector;
