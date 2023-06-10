import React ,{useState,useRef,useEffect} from "react";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import  Alert  from "react-bootstrap/Alert";
import { getAuthUser } from "../../helper/Storage.js";
import { Link, useParams } from "react-router-dom";
import axios from "axios";

const UpdateReader=()=>{
  const Auth = getAuthUser();
  let {id}=useParams();

  const [reader,setReader] = useState ({
    err: "",
    success : "",
    loading: false,
    success: null,
    name :"",
    phone : "",
    email : "",
    password : "",
    reload : 0
  });

  const updateReader = (e) => {
    e.preventDefault();
    setReader({ ...reader, loading: true });   
    axios
      .put("http://localhost:4000/readers/"+id, {
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
          loading: false,
          success: "Reader updated successfully !",
        });
      })
      .catch((err) => {
        setReader({
          ...reader,
          loading: false,
          success: null,
          err: "Something went wrong, please try again later !",
        });
      });
  };

  useEffect(() => {
    axios
    .get("http://localhost:4000/readers/" + id,{
      headers : {
        tokens:Auth.tokens
      }
    })
    .then ((resp)=> {
      setReader({
        ...reader,
        name : resp.data.name,
        email : resp.data.email,
        phone : resp.data.phone,
      });
    })
    .catch((err) => {
      setReader({
        ...reader,
        loading: false,
        success: null,
        err: "Something went wrong, please try again later !",
      });
    });
}, [reader.reload]);

    return(
        <div className="login-container">
    <h1 className="mb-4">Update Reader</h1>

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

    <Form onSubmit={updateReader}> 
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
  Update Reader
  </Button>

</Form>
    </div>
    );
};

export default UpdateReader;