import React, { Component } from 'react';
import { BrowserRouter as Router, Route} from 'react-router-dom'

import { Login } from './components/login';
import { Room } from './components/room';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Router>
          <div>
            <Route exact path={process.env.PUBLIC_URL + "/" } component={Login}/>
            <Route exact path={process.env.PUBLIC_URL + "/room"} component={Room} />
          </div>
        </Router>
      </div>
    );
  }
}

export default App;
