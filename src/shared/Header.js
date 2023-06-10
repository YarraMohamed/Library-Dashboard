import React from "react";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { Link , useNavigate} from "react-router-dom";
import {removeAuthUser , getAuthUser} from "../helper/Storage.js"
import axios from "axios";
import "../pages/Auth/Logout.js";
const Header =()=>{
  const Auth = getAuthUser();
  const Navigate = useNavigate();
  
  const Logout= ()=>{
    axios.put("http://localhost:4000/books/"+ Auth.id +"/logout")
   removeAuthUser();
  Navigate("/login");
};
    return(
    <div>
       <Navbar bg="dark" variant="dark">
        <Container>
        
        <Navbar.Brand style={{fontFamily: "Sigmar, cursive"}} ><h3>Library Dashboard</h3></Navbar.Brand>
          <Nav className="ms-auto text-center">
          
          {!Auth && (
            <>
            <Link className="nav-link" to={'/login'}><h5>Login</h5></Link>
            <Link className="nav-link" to={'/register'}><h5>Register</h5></Link>
            </>
          )}

          { Auth && Auth.type== 1 && (
            <>
            <Link className="nav-link" to={'/'}><h5>Books list</h5></Link>
            <Link className="nav-link" to={'/requests'}><h5>Requests</h5></Link>
           <NavDropdown title="Manage" menuVariant="dark" style={{fontSize:"18.1px",fontWeight:"bolder"}}>
              <Link className="dropdown-item" to={'/manage-books'}>Books</Link>
              <Link className="dropdown-item" to={'/manage-readers'}>Readers</Link>
            </NavDropdown>
            <Nav.Link className="nav-link" onClick={Logout}> <h5>Logout</h5></Nav.Link> 
            
            </>
          )
          }
          {
            Auth && Auth.type != 1 && (
              <>
              <Link className="nav-link" to={'/'}><h5>Books list</h5></Link>
            <Link className="nav-link" to={'/history'}><h5>Show History</h5></Link>
            <Nav.Link className="nav-link" onClick={Logout}> <h5>Logout</h5></Nav.Link> 

              </>
              

            )
          }

          </Nav>
        </Container>
      </Navbar>
    </div>
    );
};

export default Header;