import { useState } from 'react';
import {Link} from 'react-router-dom';
import Cookies from 'js-cookies';

function Login({ setAuth }) {
  const [inputs, setInputs] = useState({
    email: "",
    password: ""
  });

  const { email, password } = inputs;

  const onchange = (e) => {
    setInputs({...inputs, [e.target.name]:e.target.value})
  };

  const onSubmitForm = async(e) => {
    e.preventDefault();

    try {
      const body = { email, password };
      const response = await fetch('/login', {
        method: "POST",
        headers: {"Content-type":"application/json"},
        body: JSON.stringify(body)
      })

      const parseRes = response;
      const myCookie = Cookies.getItem('session');

      if(parseRes.status !== 200 || parseRes.ok !== true){
        return console.log('bad response login')
      }
      setAuth(true);

    } 
    catch (error) {
      console.log(error.message);
    }
  };

  return (
    <>
      <h1 className="display-1">Login</h1>
      <form className="col-4 mx-auto" onSubmit={onSubmitForm}>
        <input type="text" name="email" placeholder="email" value={email} onChange={e => onchange(e)} className="form-control my-3" pattern="\b[\w\.-]+@[\w\.-]+\.\w{2,4}\b" required/>
        <input type="password" name="password" placeholder="password" value={password} onChange={e => onchange(e)} className="form-control my-3" required/>
        <button className="btn btn-secondary col-12" type="submit">Log In</button>
      </form>
      <div className="text-muted row col-4 mx-auto my-5">
        <p>Need to make an account?</p>
        <Link className="btn btn-secondary col-4 col-lg-3 mx-auto" to="/register">Register</Link>
      </div>
    </>
  );
}

export default Login;
