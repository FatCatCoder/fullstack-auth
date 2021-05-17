import {
  Link,
  Redirect
} from "react-router-dom";

function Homepage({setAuth, Logout}) {
    return (
      <>
        <h1 className="display-1">Home</h1>
        <p>Welcome Authorized User!</p>
        <button className="btn btn-secondary col-4" onClick={Logout}>Logout</button>
      </>
    );
  }
  
  export default Homepage;
  