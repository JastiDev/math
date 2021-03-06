import React, { Component, Fragment } from 'react';
import { observer } from 'mobx-react';
import store from '../../Store';
import { attachResize, destroyResize } from '../../Utils/ResizeItem';
import { attachIconsResize, destroyIconsResize } from '../../Utils/IconsResize';

import '../../Utils/RotateItem';

const Selector = observer(
  class Selector extends Component {
    componentDidMount() {
      attachResize();
      attachIconsResize();
    }

    componentWillUnmount() {
      destroyResize();
      destroyIconsResize();
    }

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
          {store.hideAnyResizing ? null : (
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
              {store.hideResizingMiddle ? null : (
                <Fragment>
                  <div id="nm" className="pointers midle-point pointer-north">
                    <div className="point" />
                  </div>
                  <div id="em" className="pointers midle-point pointer-east">
                    <div className="point" />
                  </div>
                  <div id="sm" className="pointers midle-point pointer-south">
                    <div className="point" />
                  </div>
                  <div id="wm" className="pointers midle-point pointer-west">
                    <div className="point" />
                  </div>
                </Fragment>
              )}

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
