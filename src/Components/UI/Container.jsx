import React from 'react';
import { observer } from 'mobx-react';
import { Slide, Selector } from '../Items';

export default observer(() => (
  <div id="container" className="container">
    <div id="container-holder" className="container-holder">
      <div id="slide-holder" className="slide-holder">
        <Slide />
      </div>
    </div>
  </div>
));
