import './App.css';
import { useState, useEffect } from 'react';
import Cookies from 'js-cookies';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect
} from "react-router-dom";
 
// components
import Homepage from './components/Homepage.js';
import Login from './components/Login.js';
import Register from './components/Register.js';

function App() {

  useEffect(() => {
    isAlreadyAuth();
  })

 
  const isAlreadyAuth = async () => {
    try {
      const response = await fetch('/verify-auth', {
        credentials: 'same-origin',
        method: "GET",
        headers: {Accept: 'application/json', 'Content-Type': 'application/json'}
      })

      const parseRes = await response.json();
      parseRes.verified === true ? setIsAuth(true) : setIsAuth(false);
    } 
    catch (error) {
      console.log(error.message)
    }
  }

  const Logout = async () => {
    try {
      const response = await fetch("/logout", {
        method: "GET"
      });

      // if server agrees on logout req then remove cookie and set auth to false
      const parseRes = await response.json();
      if(parseRes.verified === false){
        Cookies.removeItem('session')
        setIsAuth(false);
      } 

    } 
    catch (error) {
      console.log(error.message)
    }
  }

  const [ isAuth, setIsAuth ] = useState(false);
  const setAuth = (boolean) => {
    setIsAuth(boolean);
  }
  return (
    <>
      <Router>
        <div className="App container">
          <Switch>
            <Route exact path="/" render={props => isAuth ? (<Homepage {...props} setAuth={setAuth} Logout={Logout} />) : (<Redirect to="/login" />) } ></Route>
            <Route exact path="/login" render={props => isAuth ? (<Redirect to="/" />) : (<Login {...props} setAuth={setAuth} />)}></Route>
            <Route exact path="/register" render={props => isAuth ? (<Redirect to="/" />) : (<Register {...props} setAuth={setAuth} />)}></Route>
          </Switch>
        </div>
      </Router>
    </>
    
  );
}

export default App;


/*

<Route exact path="/" render={props => isAuth ? (<Homepage {...props} setAuth={setAuth} />) : (<Redirect to="/login" />) }></Route>
<Route exact path="/login" render={props => !isAuth ? (<Login {...props} setAuth={setAuth} />) : (<Redirect to="/" />) }></Route>
<Route exact path="/register" render={props => !isAuth ? (<Register {...props} setAuth={setAuth} />) : (<Redirect to="/" />) }></Route>

*/