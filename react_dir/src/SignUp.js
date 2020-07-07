import React from 'react';
import './css/SignUp.css';

function SignUp(props) {


  return (
    <div>
      <div className="title_div">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="card cards">
                <div className="card-body">
                  <form onSubmit={(e) => props.onSubmit(e)}>
                    <div>
                      <label class="label-log" for="username">Username</label>
                      <input id="username" type="text" onChange={(e) => props.onChange(e, 2)} />
                    </div>
                    <div>
                      <label class="label-log" for="user">Email</label>
                      <input id="user" type="text" onChange={(e) => props.onChange(e, 0)} />
                    </div>
                    <div>
                      <label class="label-log" for="password">Password</label>
                      <input id="password" type="password" onChange={(e) => props.onChange(e, 1)} />
                    </div>
                    <button class="btn btn-success signup-button" type="submit">Sign up</button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
