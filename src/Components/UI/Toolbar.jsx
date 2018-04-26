import React, { Component } from 'react';
import { observer } from 'mobx-react';
import uuidv4 from 'uuid/v4';
import store from '../../Store';

export default observer(
  class Toolbar extends Component {
    createGroup = () => {
      store.createGroup(uuidv4());
    };
    destroyGroup = () => {
      store.destroyGroup();
    };

    render() {
      return (
        <div className="toolbar">
          <div className="toolbar-container">
            {store.showGroup ? (
              <button onClick={this.createGroup}>Group</button>
            ) : null}
            {store.showUnGroup ? (
              <button onClick={this.destroyGroup}>UnGroup</button>
            ) : null}
          </div>
        </div>
      );
    }
  }
);
