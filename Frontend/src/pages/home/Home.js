import React ,{useState,useEffect} from "react";
import BooksCard from "../../components/BooksCard";
import Form from 'react-bootstrap/Form';
import Spinner from "react-bootstrap/Spinner";
import InputGroup from 'react-bootstrap/InputGroup';
import  Alert  from "react-bootstrap/Alert";
import axios from "axios";
import { getAuthUser } from "../../helper/Storage.js";


const Home =()=>{
  const Auth = getAuthUser();
  const [books,setBooks] = useState ({
    loading : true,
    results : [],
    err : null,
    reload : 0
  })

  const [search,setSearch] = useState ("")

  useEffect(()=>{
    setBooks({...books, loading : true })
    axios.get("http://localhost:4000/books",{
      params :{
        search : search
      },
      headers:{
        tokens : Auth.tokens
      }
    })
    .then(resp =>{
      console.log(resp);
      setBooks({...books , results :resp.data ,loading : false , err : null })

    })
    .catch(err =>{
      setBooks({...books, loading : false , err :"something went wrong , please try again later!" })
    })
  },[books.reload])

  
  const searchBooks= (e) => {
    e.preventDefault();
    setBooks({...books ,reload : books.reload+1})  
  };


return(
  <div className="home-container p-3">
                   {/* Loader  */}
     {books.loading === true && (
          <Spinner animation="border" role="status" variant="Dark">
            <span className="visually-hidden">Loading...</span>
           </Spinner>
      )}
        

                     {/* HOME */}
      { books.loading== false && books.err== null && (
        <>
                  {/* FILTER */}
         <Form onSubmit={searchBooks} >
            <Form.Group className="mb-3 d-flex">
              <Form.Control
                type="text"
                placeholder="Search Movies"
                className="rounded-0"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button className="btn btn-dark rounded-0 text-aligin center">Search</button>
            </Form.Group>
          </Form>
          <div className="row">
              {
            books.results.map(book =>
              <div className="col-3 card-book" key={book.id}>
                 <BooksCard 
                 name={book.name} description={book.description} 
                  img_url={book.img_url} id={book.id}
                 />
              </div>
              )}
          </div>
          </>
         )}
                   {/* ERROR */}
      { books.loading== false && books.err!= null && (
           <Alert variant="danger" className="p-1">
                 {books.err}
            </Alert>
  )}
  { books.loading== false && books.err== null && books.results.length==0 && (
           <Alert variant="info" className="p-1">
                 no book , please try again later!
            </Alert>
  )}
  </div> 
);
};

export default Home;
