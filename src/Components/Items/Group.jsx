import React, { Component } from 'react';
import interact from 'interactjs';
import { observer } from 'mobx-react';
import store from '../../Store';
import { attachTap, destroyTap } from '../../Utils/TapGroup';
import { attachDrag, destroyDrag } from '../../Utils/DragGroup';
import Item from './Item';

export default observer(
  class extends Component {
    constructor(props) {
      super(props);
      this.myRef = React.createRef();
    }

    componentDidMount() {
      const { group } = this.props;
      attachTap(group);
      attachDrag(group);
    }

    componentWillUnmount() {
      destroyTap(this.myRef.current);
      destroyDrag(this.myRef.current);
    }

    render() {
      const {
        id,
        left,
        top,
        width,
        height,
        rotate,
        isSelected,
        groupedItems,
        zIndex
      } = this.props.group;

      const style = {
        left: left,
        top: top,
        width: width,
        height: height,
        position: 'absolute',
        transform: 'rotate(' + rotate + 'deg)',
        zIndex: zIndex
      };
      return (
        <div id={id} className="group" ref={this.myRef} style={style}>
          {groupedItems.map(item => {
            return <Item key={item.id} item={item} />;
          })}
        </div>
      );
    }
  }
);
