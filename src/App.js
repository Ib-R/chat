import React, { Component, Suspense } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect} from 'react-router-dom'
import { GetCookie } from "./util/util";

import Login from './components/Login';
const Room = React.lazy(() => import('./components/Room')); // Code splitting

class App extends Component {
  constructor(){
    super();
    this.state = {
      room: '',
      isAuthenticated: GetCookie("username") ? true : false
    }
  }

  componentDidMount() {
    if(GetCookie("room") !== ""){
      this.setState({room: GetCookie("room")});
    }
  }

  render() {
    const {room, isAuthenticated} = this.state;
    const publicURL = process.env.PUBLIC_URL;

    const authenticate = () => {      
      this.setState({room: GetCookie("room"), isAuthenticated: true});
    }

    const logout = () => {
      document.cookie = 'username=; expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/;'; 
      document.cookie = 'room=; expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/;'; 
      document.cookie = `server=; expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/;`;
      this.setState({room: '', isAuthenticated: false});
    }

    return (
      <div className="App">
        <Router>
          <Suspense fallback={<h1 className="text-center">Loading...</h1>}>
            <Switch>
              <Route exact path={`${publicURL}/` } render={() => isAuthenticated ?
                  <Redirect to={`${publicURL}/room`} /> :
                  <Login authenticate={authenticate} />}/>
              <Route exact path={`${publicURL}/room`} render={() => isAuthenticated ?
                  <Room room={room} logout={logout} /> :
                  <Redirect to={`${publicURL}/` } /> }/>
               <Redirect to={`${publicURL}/`} /> {/* 404 */}
            </Switch>
          </Suspense>
        </Router>
      </div>
    );
  }
}

export default App;
