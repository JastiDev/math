import React from 'react';
import { observer } from 'mobx-react';
import store from '../../Store';

export default observer(() => (
  <div className="toolbar">
    <div className="toolbar-container">
      {store.showGroup ? <button>Group</button> : null}
      {store.showUnGroup ? <button>UnGroup</button> : null}
    </div>
  </div>
));
