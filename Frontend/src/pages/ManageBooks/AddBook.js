import React , {useState,useRef} from "react";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import  Alert  from "react-bootstrap/Alert";
import axios from "axios";
import { getAuthUser } from "../../helper/Storage.js";
const AddBook=()=>{

  const Auth = getAuthUser();
  const [book,setBook] = useState ({
    err: "",
    success : "",
    loading: false,
    success: null,
    name :"",
    description : "",
    author : "",
    puplication_date : "",
    field : "",
  });
  const image_url = useRef(null);
  const pdf_files = useRef(null);

  const createBook = (e) => {
    e.preventDefault();

    setBook({ ...book, loading: true });

    const formData = new FormData();
    formData.append("name", book.name);
    formData.append("field", book.field);
    formData.append("author", book.author);
    formData.append("puplication_date",book.puplication_date);
    formData.append("description", book.description);
    if (image_url.current.files && image_url.current.files[0]) {
      formData.append("image_url", image_url.current.files[0]);
    }
    if (pdf_files.current.files && pdf_files.current.files[0]) {
      formData.append("pdf_files", pdf_files.current.files[0]);
    }
    axios
      .post("http://localhost:4000/books", formData, {
        headers: {
          tokens: Auth.tokens,
          "Content-Type": "multipart/form-data",
        },
      })
      .then((resp) => {
        setBook({
          name: "",
          description: "",
          author : "",
         puplication_date : "",
         field : "",
          err: null,
          loading: false,
          success: "Book Created Successfully !",
        });
        image_url.current.value = null;
        pdf_files.current.value=null;
      })
      .catch((err) => {
        setBook({
          ...book,
          loading: false,
          success: null,
          err: "Something went wrong, please try again later !",
        });
      });
  };
    return(
        <div className="login-container">
    <h1 className="mb-4">Add New Book </h1>

    {book.err && (
        <Alert variant="danger" className="p-2">
          {book.err}
        </Alert>
      )}

      {book.success && (
        <Alert variant="success" className="p-2">
          {book.success}
        </Alert>
      )}

      <Form onSubmit={createBook}> 

      <Form.Group className="mb-3" >
        <Form.Control  
        type="text" 
        value={book.name} onChange={(e) => setBook({ ...book, name: e.target.value })}
        required
        placeholder="Book's Name"/>
      </Form.Group>

      <Form.Group className="mb-3">
        <textarea
         className="form-control" 
         value={book.description} onChange={(e) => setBook({ ...book, description: e.target.value })}
         required
         placeholder="Description"></textarea>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Control 
        type="text" 
        value={book.author} onChange={(e) => setBook({ ...book, author: e.target.value })}
         required
        placeholder="Author" />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Control 
        type="text"
        value={book.field} onChange={(e) => setBook({ ...book, field: e.target.value })}
        required
         placeholder="Filed" />
      </Form.Group>
      
      <Form.Group className="mb-3">
        <Form.Control 
         type="text" 
         value={book.puplication_date} onChange={(e) => setBook({ ...book, puplication_date: e.target.value })}
         required
         placeholder="Publication Date" />
      </Form.Group>

      <Form.Group className="mb-3">
        <input type="file" className="form-control" ref={image_url} required></input>
      </Form.Group>
      <Form.Group className="mb-3">
        <input type="file" className="form-control" ref={pdf_files} required></input>
      </Form.Group>
      <Button className="btn btn-dark" variant="primary" type="submit">
        Add New Book
      </Button>
      </Form>
     
    </div>
    );
};

export default AddBook;