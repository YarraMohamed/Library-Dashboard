import React ,{useState,useRef,useEffect} from "react";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import  Alert  from "react-bootstrap/Alert";
import { getAuthUser } from "../../helper/Storage.js";
import { Link, useParams } from "react-router-dom";
import axios from "axios";

const UpdateBook=()=>{
  const Auth = getAuthUser();
  let {id}=useParams();
  const [book,setBook] = useState ({
    err: "",
    success : "",
    loading: false,
    name :"",
    description : "",
    author : "",
    puplication_date : "",
    field : "",
    img_url : null,
    reload : 0
  });

  const image = useRef(null);
  const pdf_files = useRef(null);

  const updateBook = (e) => {
    e.preventDefault();
    setBook({ ...book, loading: true });
    const formData = new FormData();
    formData.append("name", book.name);
    formData.append("field", book.field);
    formData.append("author", book.author);
    formData.append("puplication_date",book.puplication_date);
    formData.append("description", book.description);
    if (image.current.files && image.current.files[0]) {
      formData.append("image", image.current.files[0]);
    }
    if (pdf_files.current.files && pdf_files.current.files[0]) {
      formData.append("pdf_files", pdf_files.current.files[0]);
    }
    axios
      .put("http://localhost:4000/books/"+ id , formData, {
        headers: {
          tokens: Auth.tokens,
          "Content-Type": "multipart/form-data",
        },
      })
      .then((resp) => {
        setBook({
          ...book,
          loading: false,
          success: "Book updated successfully !",
          reload: book.reload + 1,
        });
        image.current.value = null;
        pdf_files.current.value=null;
      })
      .catch((err) => {
        setBook({
          ...book,
          loading: false,
          err: "Something went wrong, please try again later !",
        });
      });
  };
  useEffect(() => {
    axios
      .get("http://localhost:4000/books/" + id)
      .then((resp) => {
        setBook({
          ...book,
          name: resp.data.name,
          description: resp.data.description,
          img_url: resp.data.img_url,
          author : resp.data.author,
          puplication_date : resp.data.puplication_date ,
          field : resp.data.field,
        });
      })
      .catch((err) => {
        setBook({
          ...book,
          loading: false,
          success: null,
          err: "Something went wrong, please try again later !",
        });
      });
  }, [book.reload]);
    return(
        <div className="login-container">
    <h1 className="mb-4">Update Book Form</h1>

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

      <Form onSubmit={updateBook}>
      <img
          alt={book.name}
          style={{
            width: "50%",
            height: "200px",
            objectFit: "cover",
            borderRadius: "10px",
            border: "1px solid #ddd",
            marginBottom: "10px",
          }}
          src={book.img_url}
        />

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
        <input type="file" className="form-control" ref={image}></input>
      </Form.Group>

      <Form.Group className="mb-3">
        <input type="file" className="form-control" ref={pdf_files}></input>
      </Form.Group>
      
      <Button className="btn btn-dark" variant="primary" type="submit" 
      style={{marginBottom :"5px"}}>
        Update Book
      </Button>

      </Form>
  
    </div>
    );
};

export default UpdateBook;