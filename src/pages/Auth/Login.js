import React ,{useState} from "react";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import '../../css/Login.css';
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import  Alert  from "react-bootstrap/Alert";
import {setAuthUser} from "../../helper/Storage.js"

const Login =()=>{
 const Navigate = useNavigate();
  const [login,setLogin]=useState({
   email:"",
   password : "",
   loading : false,
   err : [],
  });

  const LoginFun = (e)=>{
    e.preventDefault();
    console.log(login);
    setLogin({...login,loading:true,err:[]})
    axios.post("http://localhost:4000/auth/login",{
      email : login.email,
      password : login.password,
    })
    .then((resp)=>{
      setLogin({...login,loading:true,err:[]})
      setAuthUser(resp.data);
      Navigate("/");
  

    })
    .catch((errors)=>{
      console.log(errors);
      setLogin({...login,loading:true,err:errors.response.data.errors});
    })
  };

    return(
    <div className="login-container">
    <h1 className="mb-4">Login Form</h1>
    {login.err.map((error , index)=>(
      <Alert key={index} variant="danger" className="p-1">
               {error.msg}
               </Alert>
    ))}

    <Form onSubmit={LoginFun}>
    <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Control type="email" placeholder="Email address"  
        required
        value = {login.email}
        onChange={(e)=>
        setLogin({...login, email:e.target.value}) }
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Control type="password" placeholder="Password" 
        required
         value = {login.password}
        onChange={(e)=>
        setLogin({...login, password:e.target.value}) }

        />
      </Form.Group>
      <Button className="btn btn-dark me-4" variant="primary" type="submit" disabled={login.loading===true}>
        Login
      </Button>
      <Link to={'/register'} className="btn btn-dark" variant="primary" >
        Create new account
      </Link>
    </Form>
    </div>
    );
};

export default Login;