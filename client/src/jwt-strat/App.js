import './App.css';
import { useState, useEffect } from 'react';
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

  const isAlreadyAuth = async () => {
    try {
      const response = await fetch('/verify-auth', {
        method: "GET",
        headers: {'Authorization': localStorage.Authorization}
      })

      var parseRes = await response.json();
      parseRes.verified === true ? setIsAuth(true) : setIsAuth(false);
    } 
    catch (error) {
      console.log(parseRes, error.message)
    }
  }

  useEffect(() => {
    isAlreadyAuth();
  }, [])

  const [ isAuth, setIsAuth ] = useState(false);
  const setAuth = (boolean) => {
    setIsAuth(boolean);
  }

  return (
    <>
      <Router>
        <div className="App container">
          <Switch>
            <Route exact path="/" render={props => isAuth ? (<Homepage {...props} setAuth={setAuth} />) : (<Redirect to="/login" />) }></Route>
            <Route exact path="/login" render={props => !isAuth ? (<Login {...props} setAuth={setAuth} />) : (<Redirect to="/" />) }></Route>
            <Route exact path="/register" render={props => !isAuth ? (<Register {...props} setAuth={setAuth} />) : (<Redirect to="/" />) }></Route>
          </Switch>
        </div>
      </Router>
    </>
    
  );
}

export default App;
