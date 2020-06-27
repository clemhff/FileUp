import React from 'react';


function SignUp(props) {


  return (
    <div>
      <form onSubmit={(e) => props.onSubmit(e)}>
        <label for="username">Username</label>
        <input id="username" type="text" onChange={(e) => props.onChange(e, 2)} />
        <label for="user">Email</label>
        <input id="user" type="text" onChange={(e) => props.onChange(e, 0)} />
        <label for="password">Password</label>
        <input id="password" type="text" onChange={(e) => props.onChange(e, 1)} />
        <button type="submit">Sign up</button>
      </form>
    </div>
  );
}

export default SignUp;
