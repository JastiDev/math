import React, { Fragment, Component } from 'react';
import { observer } from 'mobx-react';
import { Header, Sidebar, Toolbar, Container, Selector } from './Components/UI';

import store from './Store';

class App extends Component {
  render() {
    return (
      <Fragment>
        <Header />
        <Toolbar />
        <Sidebar />
        {store.showSelector ? <Selector /> : null}
        <Container />
      </Fragment>
    );
  }
}

export default observer(App);
