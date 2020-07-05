import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

import UploadPage from './UploadPage';
import Login from './Login';




const App = () => {
  /*var token = true;
  //let mylog = () => {
    if(!localStorage.mkt || localStorage.mkt === undefined) {
      token = false ;
    }*/

      return (
        <Router>
          <div className="App">
            <Switch>
              <Route exact path={process.env.PUBLIC_URL + '/'} >
                <UploadPage/>
              </Route>
              <Route exact path={process.env.PUBLIC_URL + '/login'} >
                <Login/>
              </Route>
              <Route>
                <div>Bad request</div>
              </Route>
            </Switch>
          </div>
        </Router>
      );
    /*}
  }

  return (
    <div>{mylog()}</div>
  );*/
  //{token === false ? <Redirect to="/i" /> : <UploadPage/>}
}

export default App;
