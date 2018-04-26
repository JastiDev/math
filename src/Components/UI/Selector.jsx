import React, { Component, Fragment } from 'react';
import { observer } from 'mobx-react';
import store from '../../Store';

import '../../Utils/RotateItem';

const Selector = observer(
  class Selector extends Component {
    render() {
      return (
        <div
          id="selector"
          style={{
            left: store.selector.x + 'px',
            top: store.selector.y + 'px',
            width: store.selector.width + 'px',
            height: store.selector.height + 'px',
            transform: store.selector.transform,
            display: store.isDragging ? 'none' : 'block'
          }}
          className="selector"
        >
          {store.selectedItems.length > 1 && store.anyGroup ? null : (
            <Fragment>
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
              {!store.showResizingMiddle ? (
                <Fragment>
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
                </Fragment>
              ) : null}

              <div className="pointer-rotate pointer9" />
              <div className="rotate-line" />
            </Fragment>
          )}

          <span className="topline lines-resize" />
          <span className="rightline lines-resize" />
          <span className="botline lines-resize" />
          <span className="leftline lines-resize" />
        </div>
      );
    }
  }
);

export default Selector;
