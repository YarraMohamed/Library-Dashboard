import React ,{useEffect,useState}from "react";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import  Alert  from "react-bootstrap/Alert";
import { Link , useParams,useLocation} from "react-router-dom";
import { getAuthUser } from "../../helper/Storage.js";
import axios from "axios";

const AddChapters=()=>{
  const Auth = getAuthUser();
  const { state } = useLocation();
  const{id}=state


  const [chapter,setChapter] = useState ({
    err: "",
    success : "",
    loading: false,
    success: null,
    title :"",
    description : "",
  });
  const createChapter = (e) => {
    e.preventDefault();
    setChapter({ ...chapter, loading: true });   
    axios
      .post("http://localhost:4000/books/"+id+"/chapters", {
        title : chapter.title,
        description : chapter.description,
      }, {
        headers: {
          tokens: Auth.tokens,
        },
      })
      .then((resp) => {
        setChapter({
          ...chapter,
          title :"",
          description : "",
          err: null,
          loading: false,
          success: "Chapter Created Successfully !",
        });
       
      })
      .catch((err) => {
        setChapter({
          ...chapter,
          loading: false,
          success: null,
          err: "Something went wrong, please try again later !",
        });
      });
  };

    return(
        <div className="login-container">
    <h1 className="mb-4">Add New Chapter</h1>

    {chapter.err && (
      <Alert variant="danger" className="p-2">
          {chapter.err}
        </Alert>
    )}

    {chapter.success && (
      <Alert variant="success" className="p-2">
          {chapter.success}
        </Alert>
    )}

       <Form onSubmit={createChapter}>
       <Form.Group className="mb-3">
        <Form.Control type="text"
        value={chapter.title} onChange={(e) => setChapter({ ...chapter, title: e.target.value })}
        required
         placeholder="Chapter's Title" />
      </Form.Group>

      <Form.Group className="mb-3">
        <textarea className="form-control" 
        value={chapter.description} onChange={(e) => setChapter({ ...chapter, description: e.target.value })}
        required
        placeholder="Description"></textarea>
      </Form.Group>

      <Button className="btn btn-dark" variant="primary" type="submit">
        Add New Chapter
      </Button>
       </Form>
    </div>
    );
};

export default AddChapters;