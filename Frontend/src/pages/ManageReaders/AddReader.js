import React , {useState} from "react";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import  Alert  from "react-bootstrap/Alert";
import axios from "axios";
import { getAuthUser } from "../../helper/Storage.js";

const AddReaders=()=>{
  const Auth = getAuthUser();

  const [reader,setReader] = useState ({
    err: "",
    success : "",
    loading: false,
    success: null,
    name :"",
    phone : "",
    email : "",
    password : "",
  });
 
  const createReader = (e) => {
    e.preventDefault();
    setReader({ ...reader, loading: true });   
    axios
      .post("http://localhost:4000/readers", {
        name : reader.name,
        email : reader.email,
        phone : reader.phone,
        password : reader.password 
      }, {
        headers: {
          tokens: Auth.tokens,
        },
      })
      .then((resp) => {
        setReader({
          ...reader,
          name: "",
          phone : "",
          email : "",
          password : "",
          err: null,
          loading: false,
          success: "Reader Created Successfully !",
        });
       
      })
      .catch((err) => {
        setReader({
          ...reader,
          loading: false,
          success: null,
          err: err,
        });
      });
  };
    return(
        <div className="login-container">
    <h1 className="mb-4">Add New Reader </h1>

    {reader.err && (
        <Alert variant="danger" className="p-2">
          {reader.err}
        </Alert>
      )}

      {reader.success && (
        <Alert variant="success" className="p-2">
          {reader.success}
        </Alert>
      )}

      <Form onSubmit={createReader}> 

      <Form.Group className="mb-3" >
        <Form.Control  
        type="text" 
        value={reader.name} onChange={(e) => setReader({ ...reader, name: e.target.value })}
        required
        placeholder="Reader's Name"/>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Control 
        type="text" 
        value={reader.email} onChange={(e) => setReader({ ...reader, email: e.target.value })}
         required
        placeholder="Reader's E-mail" />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Control 
        type="text"
        value={reader.phone} onChange={(e) => setReader({ ...reader, phone: e.target.value })}
        required
         placeholder="Reader's Phone" />
      </Form.Group>
      
      <Form.Group className="mb-3">
        <Form.Control 
         type="password" 
         value={reader.password} onChange={(e) => setReader({ ...reader, password: e.target.value })}
         required
         placeholder="Reader's Password" />
      </Form.Group>

      <Button className="btn btn-dark" variant="primary" type="submit">
        Add New Book
      </Button>
      </Form>
     
    </div>
    );
};


export default AddReaders;