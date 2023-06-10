import React , {useState,useEffect} from "react";
import Table from 'react-bootstrap/Table';
import '../../css/ManageBooks.css';
import { Link, useParams , useNavigate } from "react-router-dom";
import  Alert  from "react-bootstrap/Alert";
import axios from "axios";
import "../../helper/Storage.js"
import { getAuthUser } from "../../helper/Storage.js";

const ManageBooks=()=>{

  const Navigate = useNavigate();
  const Auth = getAuthUser();
    const [books,setBooks] = useState ({
    loading : true,
    results : [],
    err : null,
    reload : 0
  })

  // const [Chapters,setChapters] = useState ({
  //   loading : true,
  //   results : [],
  //   err : null,
  //   reload : 0
  // })


  useEffect(()=>{
    setBooks({...books, loading : true })
    axios.get("http://localhost:4000/books",{
      headers :{
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

  const deleteBook = (id) => {
    axios
      .delete("http://localhost:4000/books/" + id, {
        headers: {
          tokens: Auth.tokens,
        },
      })
      .then((resp) => {
        setBooks({ ...books, reload: books.reload + 1 });
      })
      .catch((err) => {
        setBooks({...books, loading : false , err :"something went wrong , please try again later!" })
      });
  };
  
    return(

        <div className="manage-books p-5">
        <div className="header-table mb-4">
        <h3 className="text-center">Manage Books</h3>
        </div>
 <Table striped bordered hover size="sm" variant="dark">
      <thead>
        <tr>
          <th>#</th>
          <th>Image</th>
          <th>Name</th>
          <th>Description</th>
          <th>Author</th>
          <th>Field</th>
          <th>Puplication date</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
          {books.results.map(book =>
            <tr key={book.id}>
          <td>{book.id}</td>
          <td> <img src={book.img_url} alt={book.name} className="image-icon"/> </td>
          <td>{book.name} </td>
          <td><p>{book.description} </p></td>
          <td>{book.author} </td>
          <td>{book.field} </td>
          <td>{book.puplication_date} </td>
          <td>
            <Link to={"/"+ book.id} className="btn btn-sm btn-info">Show</Link>
            <Link to={"/manage-books/"+book.id} className="btn btn-sm btn-primary mx-1">Update</Link>

            <button className="btn btn-sm btn-success mx-1"
             onClick={(e) => {
              Navigate("/manage-books/manage-chapters",{state:{ name : book.name ,id : book.id}}) ;
                  }}>
            Manage Chapters
            </button>

            <button className="btn btn-sm btn-danger" 
            onClick={(e) => {
              deleteBook(book.id);
                  }}>
            Delete
            </button>
          </td>
        </tr>
          )}
      </tbody>
      <Link to={"add"} className="new-book btn btn-success mt-2">Add New Book</Link>    
    </Table>
    
        </div>
    );
};

export default ManageBooks;