import React, {Component} from 'react';

//import './css/AddQuote.css';


import SignUp from './SignUp';


class Login extends Component {

  /*handleChange = (e) => {
    return null
  }*/

  constructor(props) {
    super(props);
    this.state ={
      email:null,
      password: null,
      userName: null,
      type : 'login'
    }
  }

  onSubmit(e) {

    e.preventDefault();



    let data = {
      "email" : this.state.email,
      "password" : this.state.password
    }

    fetch('http://localhost:8090/signin', {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        headers: {
           'Accept': 'application/json',
           'Content-Type': 'application/json'
         },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(res => {
      if(res.auth === 'Incorrect password'){
        console.log('try again');
      }
      if(res.auth === 'Correct password!'){
        console.log("well done");
        localStorage.setItem("mkt", res.token);
      }
    }
    );
  }


  onSignIn(e) {
    e.preventDefault();

    let data = {
      "userName" : this.state.userName,
      "email" : this.state.email,
      "password" : this.state.password
    }

    fetch('http://localhost:8090/signup', {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        headers: {
           'Accept': 'application/json',
           'Content-Type': 'application/json'
         },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(res => {
      console.log(res);
    }
    );
  }


  onChange(e, i) {
    if (i === 0) {
      const email = e.target.value;
      this.setState({ email : email});
    }

    if (i === 1){
      const password = e.target.value;
      this.setState({ password : password});
    }
    if (i === 2){
      const userName= e.target.value;
      this.setState({ userName : userName});
    }

  }

  signUpButton() {
    this.setState({
      email:null,
      password: null,
      userName: null,
      type : 'signup'
    });
  }



  render () {

    let choose = () => {
      if(this.state.type ==='login') {
        return(
          <div>
            <div className="title_div">
              <div className="container">
                <div className="row">
                  <div className="col-12">
                    <div className="card cardl">
                      <div className="card-body">
                        <form onSubmit={(e) => this.onSubmit(e)}>
                          <div>
                            <label class="label-log" for="user">Email</label>
                            <input id="user" type="text" onChange={(e) => this.onChange(e, 0)} />
                          </div>
                          <div>
                            <label class="label-log" for="password">Password</label>
                            <input id="password" type="text" onChange={(e) => this.onChange(e, 1)} />
                          </div>
                          <button class="btn btn-dark log-button" type="submit">Log In</button>
                          <button class="btn btn-success signup-button" onClick={() => this.signUpButton()} >Sign up</button>
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

      else if(this.state.type ==='signup') {
        return(
            <SignUp
              onChange = {(e, i) => this.onChange(e, i)}
              onSubmit = {(e) => this.onSignIn(e)}
            />
        );
      }
    }

    return (
      <div>
        {choose()}
      </div>
    );
  }

}

export default Login;





/*fetch('http://localhost:8090/stats', {
    method: "POST",
    mode: "cors",
    cache: "no-cache",
    body: data
})
.then(response => response.text())
.then(res => console.log(res));*/
