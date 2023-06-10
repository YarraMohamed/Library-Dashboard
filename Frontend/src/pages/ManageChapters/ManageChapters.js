import React , {useState,useEffect}from "react";
import { Link , useParams,useLocation,useNavigate} from "react-router-dom";
import Table from 'react-bootstrap/Table';
import { getAuthUser } from "../../helper/Storage.js";
import axios from "axios";
import  Alert  from "react-bootstrap/Alert";

const ManageChapters=()=>{
  const Auth = getAuthUser();
  const Navigate= useNavigate();
  const { state } = useLocation();
  const {name}= state
  const{id}=state

  const [chapters,setChapters] = useState ({
    loading : true,
    results : [],
    err : null,
    reload : 0
  })
  useEffect(()=>{
    setChapters({...chapters, loading : true })
    axios.get("http://localhost:4000/books/"+id+"/chapters",{
      headers :
      {
        tokens : Auth.tokens
      }
    })
    .then(resp =>{
      console.log(resp);
      setChapters({...chapters , results :resp.data ,loading : false , err : null })

    })
    .catch(err =>{
      setChapters({...chapters, loading : false , err :"something went wrong , please try again later!" })
    })
  },[chapters.reload])

  const deleteChapter = (bookid) => {
    axios
      .delete("http://localhost:4000/books/" + id+"/chapters/"+bookid, {
        headers: {
          tokens: Auth.tokens,
        },
      })
      .then((resp) => {
        setChapters({ ...chapters, reload: chapters.reload + 1 });
      })
      .catch((err) => {
        setChapters({...chapters, loading : false , err :"something went wrong , please try again later!" })
      });
  };
    return(
        <div> <br></br>

          {chapters.results.length===0 && chapters.err==null &&(
        <Alert variant="info" className="p-1 mt-3"  >
            No Chapters Yet!!
        </Alert>
         )}
            {/* Book Chapters */}
    <Table class="rounded" striped bordered hover variant="dark">
    <thead>
        <tr>
         <td colSpan={3}><h4>{name}'s Chapters</h4></td>
        </tr>
      </thead>
      <thead>
        <tr>
         <td>Title</td>
         <td>Description</td>
         <td>Action</td>
        </tr>
      </thead>
      <tbody>
        {chapters.results.map(chapter=>
          <tr key = {chapter.id}>
          <td>{chapter.title}</td>
          <td>{chapter.description}</td>
          <td>
          <button className="btn btn-sm btn-primary mx-2"
            onClick={(e) => {
              Navigate("/manage-books/manage-chapters/"+chapter.id,{state:{id :id}}) ;
                  }}>
              Update
            </button>
            <button className="btn btn-sm btn-danger" 
            onClick={(e) => {
              deleteChapter(chapter.id);
                  }}>
              Delete
            </button>
          </td>
        </tr>
        )}
      </tbody>
      <div style={{marginBottom:"2px"}}>
      <button className="new-book btn btn-success m-2"
             onClick={(e) => {
              Navigate("/manage-books/manage-chapters/add",{state:{id :id}}) ;
                  }}>
            Add Chapter
            </button>
      </div>
    </Table>
        </div>
    );
};

export default ManageChapters;