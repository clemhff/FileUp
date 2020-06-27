import React from 'react';

import UploadPage from './UploadPage';
import Login from './Login';




const App = () => {



  let mylog = () => {
    if(!localStorage.mkt || localStorage.mkt === undefined) {
      return <Login/>;
    }
    else {
      return <UploadPage/>;
    }
  }

  return (
    <div>{mylog()}</div>
  );

}

export default App;
