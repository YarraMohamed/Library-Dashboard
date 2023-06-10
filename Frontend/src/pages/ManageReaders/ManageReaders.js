import React ,{useState,useEffect} from "react";
import { Link, useNavigate } from "react-router-dom";
import Table from 'react-bootstrap/Table';
import axios from "axios";
import "../../helper/Storage.js"
import { getAuthUser } from "../../helper/Storage.js";
import  Alert  from "react-bootstrap/Alert";
import history from "../Requests/RequestsHistory.js";

const ManageReaders=()=>{

  const Navigate = useNavigate();
  const Auth = getAuthUser();
    const [readers,setReaders] = useState ({
    loading : true,
    results : [],
    err : null,
    reload : 0
  })

  useEffect(()=>{
    setReaders({...readers, loading : true })
    axios.get("http://localhost:4000/readers",{
      headers :
      {
        tokens : Auth.tokens
      }
    })
    .then(resp =>{
      console.log(resp);
      setReaders({...readers , results :resp.data ,loading : false , err : null })

    })
    .catch(err =>{
      setReaders({...readers, loading : false , err :"something went wrong , please try again later!" })
    })
  },[readers.reload])

  const deleteReader = (id) => {
    axios
      .delete("http://localhost:4000/readers/" + id, {
        headers: {
          tokens: Auth.tokens,
        },
      })
      .then((resp) => {
        setReaders({ ...readers, reload: readers.reload + 1 });
      })
      .catch((err) => {
        <Alert variant="danger" className="p-1">
            {err}
        </Alert>
      });
  };
    return(
        <div> <br></br>       
    <Table class="rounded" striped bordered hover variant="dark">
    <thead>
        <tr>
         <td colSpan={5}><h4>Readers</h4></td>
        </tr>
      </thead>
      <thead>
        <tr >
         <td>Reader Name</td>
         <td>phone Number</td>
         <td>E-mail</td>
         <td>Status</td>
         <td>Action</td>
        </tr>
      </thead>
      <tbody>
      {readers.results.map(reader => 
        <tr key={reader.id}>
          <td>{reader.name}</td>
          <td>{reader.phone}</td>
          <td>{reader.email}</td>
          <td>{reader.status}</td>
          <td>
            <Link to={"/manage-readers/"+reader.id} className="btn btn-sm btn-primary mx-2">Update</Link>

            <button className="btn btn-sm btn-info mx-3"
             onClick={(e) => {
              Navigate("/manage-readers/history",{state:{user_name : reader.name,id : reader.id}}) ;
                  }}>
            Show History</button>
            
            <button className="btn btn-sm btn-danger"
             onClick={(e) => {
              deleteReader(reader.id);
                  }}>
            Delete</button>
          </td>
        </tr>
      )}
        
      </tbody>
      <div style={{marginBottom:"2px"}}>
      <Link to={"/manage-readers/add"} className="new-book btn btn-success m-2">Add New Reader</Link> 
      </div>
    </Table>
        </div>
    );
};

export default ManageReaders;