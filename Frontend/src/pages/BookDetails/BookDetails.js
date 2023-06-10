import React ,{useState,useEffect}  from "react";
import Table from 'react-bootstrap/Table';
import '../../css/BookDetails.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import { Link, useParams } from "react-router-dom";
import  Alert  from "react-bootstrap/Alert";
import axios from "axios";
import Spinner from "react-bootstrap/Spinner";
import { getAuthUser } from "../../helper/Storage.js";
import { Document, Page } from 'react-pdf';

const BookDetails=()=>{
  let {id}=useParams();
  const Auth = getAuthUser();
  const [book,setBook]=useState({
    loading : true,
    result : [],
    err : null,
    reload : 0
  })

  const [chapters,setChapters]=useState({
    loading : true,
    results : [],
    err : null,
    reload : 0
  })

  useEffect(()=>{
    setChapters({...chapters, loading : true })
    axios.get("http://localhost:4000/books/"+ id +"/chapters")
    .then(resp =>{
      console.log(resp);
      setChapters({...chapters , results :resp.data ,loading : false , err : null })
    })
    .catch(err =>{
      setChapters({...chapters, loading : false , err :"something went wrong , please try again later!" })
    })
  },[chapters.reload])

  useEffect(()=>{
    setBook({...book, loading:true})
    axios.get("http://localhost:4000/books/" + id)
    .then(resp =>{
      console.log(resp);
      setBook({...book , result :resp.data ,loading : false , err : null })

    })
    .catch(err =>{
      setBook({...book, loading : false , err :"something went wrong , please try again later!" })
    })
  },[])
  const [request,setRequest] = useState ({
    err: "",
    success : "",
    loading: false,
    success: null,
    book_id :"",
  });

  const requestBook = (id)=> {
    axios
      .post("http://localhost:4000/books/requests", {
        book_id : id,
      }, {
        headers: {
          tokens: Auth.tokens,
        },
      })
      .then((resp) => {
        setRequest({
          ...request,
          err: null,
          loading: true,
          success: "Requested Successfully !",
        });
       
      })
      .catch((err) => {
        setRequest({
          ...request,
          loading: true,
          success: null,
          err: "Something went wrong, please try again later !",
        });
      });
  };

    return(
    <div className="book-details-container p-4">
    {book.loading === true && (
          <Spinner animation="border" role="status" variant="Dark">
            <span className="visually-hidden">Loading...</span>
           </Spinner>
      )}
      { book.loading== false && book.err!= null && (
           <Alert variant="danger" className="p-1">
                 {book.err}
            </Alert>
  )}
  { book.loading== false && book.err== null && book.result.length==0 && (
           <Alert variant="info" className="p-1">
                 no book , please try again later!
            </Alert>
  )}

  { book.loading== false && book.err== null && (
    <>
       <div>
       <Table striped bordered hover variant="dark">
      <thead>
          <tr style={{boxSizing:"20px"}}>
          <td colSpan={2}><h3>Book Details</h3></td>
          </tr>
      </thead>
      <tbody>
      <tr>
          <td><h5>Image</h5></td>
          <td > 
          <div className="col-2">
              <img
                className="book-image"
                src={book.result.img_url}
                alt={book.result.name}
              />
            </div>
            </td>
        </tr>
        <tr>
          <td><h5>BookName</h5></td>
          <td >{book.result.name}</td>
        </tr>
        <tr>
          <td><h5>Description</h5></td>
          <td>{book.result.description}</td>
        </tr>
        <tr>
          <td><h5>Author</h5></td>
          <td >{book.result.author}</td>
        </tr>
        <tr>
          <td><h5>Field</h5></td>
          <td >{book.result.field}</td>
        </tr>
        <tr>
          <td><h5>Publication date</h5></td>
          <td>{book.result.puplication_date} </td>
        </tr>
        <tr>
          <td><h5>PDF File</h5></td>
          <td> 
          {book.result.PDF_File}
          </td>
        </tr>
      </tbody>    
    </Table>
    <hr></hr>
    <div>
       <Table striped bordered hover variant="dark">
      <thead>
          <tr style={{boxSizing:"20px"}}>
          <td colSpan={2}><h3>Book Chapters</h3></td>
          </tr>
      </thead>
      <tbody >
                               {/* ERRORS */}
      { chapters.loading== false && chapters.err== null && chapters.results.length==0 && (
        <Alert variant="info" className="p-1">
                 NO CHAPTERS YET!
            </Alert>
      )}
      { chapters.loading== false && chapters.err!= null && (
        <Alert variant="danger" className="p-1">
                 Try again later
            </Alert>
      )}
                    {/* CHAPTERS */}
      {chapters.results.map(chapter=>
        <tr key={chapter.id}>
          <td><h5>Title</h5></td>
          <td >{chapter.title}</td>
        </tr>
      )}
      
      </tbody>    
    </Table>
    <button className="btn btn-dark ms-2" variant="primary"
         disabled={request.loading===true}
            onClick={(e) => {
              requestBook(id);
                  }}>
              Request Book
            </button>
    
        </div>
       </div>
    </>
  )}   
    </div>               
    );
};

export default BookDetails;