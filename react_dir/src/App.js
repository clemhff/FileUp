import React from 'react';

import UploadPage from './UploadPage';
import Login from './Login';




function App() {



  let mylog = () => {
    if(!localStorage.mkt) {
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
