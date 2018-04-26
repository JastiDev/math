import React, { Component } from 'react';
import { observer } from 'mobx-react';
import store from '../../Store';
import { attachDrag, destroyDrag } from '../../Utils/DragItem';
import { attachTap, destroyTap } from '../../Utils/TapItem';

export default observer(
  class extends Component {
    constructor(props) {
      super(props);
      this.myRef = React.createRef();
    }
    componentWillUnmount() {
      destroyDrag(this.myRef);
    }
    componentDidMount() {
      const { item } = this.props;

      if (item.idGroup === null) {
        attachTap(item);
        attachDrag(item);
      }
    }

    render() {
      const {
        id,
        left,
        top,
        width,
        height,
        rotate,
        background,
        zIndex
      } = this.props.item;

      const style = {
        left: left,
        top: top,
        width: width,
        height: height,
        backgroundColor: background,
        position: 'absolute',
        transform: 'rotate(' + rotate + 'deg)',
        zIndex: zIndex
      };
      return <div id={id} className="item" ref={this.myRef} style={style} />;
    }
  }
);
