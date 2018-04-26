import React, { Component } from 'react';
import { observer } from 'mobx-react';
import store from '../../Store';
import fit from '../../Vendors/fit.js';
import Item from './Item';
import Group from './Group';
import { InternalDraggable } from '../UI';
import { tapContainer, destroyTapContainer } from '../../Utils/TapContainer';
export default observer(
  class Slide extends Component {
    constructor(props) {
      super(props);
      this.node = React.createRef();
    }

    componentDidMount() {
      const container = document.getElementById('slide-holder');
      const dataFit = fit(this.node.current, container, {
        // Alignment
        hAlign: fit.CENTER,
        vAlign: fit.CENTER,
        watch: true
      });

      store.setDelta(dataFit.scale);
      tapContainer(document.getElementById('slide'));

      window.addEventListener('resize', () => {
        store.setDelta(dataFit.scale);
        store.selector.updatePosition();
        store.internaleDraggable.updatePosition();
      });
    }

    componentWillUnmount() {
      window.removeEventListener('resize', this);
      destroyTapContainer(this.node.current);
    }

    render() {
      return (
        <div className="slide" id="slide" ref={this.node}>
          {store.showInternalDraggable ? <InternalDraggable /> : null}
          {store.items.map(item => {
            return item.idGroup === null ? (
              <Item item={item} key={item.id} />
            ) : null;
          })}
          {store.groups.map(group => {
            return <Group key={group.id} group={group} />;
          })}
        </div>
      );
    }
  }
);
