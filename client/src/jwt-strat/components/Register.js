import { useState } from 'react';
import {Link} from 'react-router-dom';

function Register({ setAuth }) {
  const [inputs, setInputs] = useState({
    email: "",
    password: "",
    name: ""
  });

  const {email, password, name} = inputs;

  const onchange = (e) => {
    setInputs({...inputs, [e.target.name]:e.target.value})
  };

  const onSubmitForm = async(e) => {
    e.preventDefault();

    try {
      // send req to server with valid info, get res back with auth header
      const body = { name, email, password };
      const response = await fetch('/register', {
        method: "POST",
        headers: {"Content-type":"application/json"},
        body: JSON.stringify(body)
      })

      // get auth header and check if valid
      const parseRes = response.headers.get('Authorization');
      if (parseRes !== null){
        localStorage.setItem('Authorization', parseRes);
        setAuth(true);
      }

    } 
    catch (error) {
      console.log(error.message)
    }
  };

  return (
    <>
      <h1 className="display-1">Register</h1>
      <form className="col-4 mx-auto" onSubmit={onSubmitForm}>
        <input type="text" name="email" placeholder="email" value={email} onChange={e => onchange(e)} className="form-control my-3" pattern="\b[\w\.-]+@[\w\.-]+\.\w{2,4}\b" required/>
        <input type="password" name="password" placeholder="password" value={password} onChange={e => onchange(e)} className="form-control my-3" required/>
        <input type="text" name="name" placeholder="name" value={name} onChange={e => onchange(e)} className="form-control my-3" required/>
        <button className="btn btn-secondary col-12" type="submit">Register</button>
      </form>
      <div className="text-muted row col-4 mx-auto my-5">
        <p>Already have an account?</p>
        <Link className="btn btn-secondary col-3 mx-auto" to="/login">login</Link>
      </div>
    </>
  );
}

export default Register;
