import React , {useState,useEffect}from "react";
import { Link , useParams,useLocation} from "react-router-dom";
import Table from 'react-bootstrap/Table';
import { getAuthUser } from "../../helper/Storage.js";
import axios from "axios";
import  Alert  from "react-bootstrap/Alert";

const RequestsHistory = () => {

    const { state } = useLocation();
    const {user_name}= state
    const{id}=state
    console.log(state);
    const Auth = getAuthUser();

    const [requests,setRequests] = useState ({
        loading : true,
        results : [],
        err : null,
        reload : 0
      })

      useEffect(()=>{
        setRequests({...requests, loading : true })
        axios.get("http://localhost:4000/books/requests/"+id,{
          headers :
          {
            tokens : Auth.tokens
          }
        })
        .then(resp =>{
          console.log(resp);
          setRequests({...requests , results :resp.data ,loading : false , err : null })
    
        })
        .catch(err =>{
          setRequests({...requests, loading : false , err :"something went wrong , please try again later!" })
        })
      },[requests.reload])

    return (

        <div>

{requests.results.length===0 &&(
        <Alert variant="info" className="p-1 mt-3"  >
            No Requests Yet
        </Alert>
      )}
                <br></br>
    <Table class="rounded" striped bordered hover variant="dark">
    <thead>
        <tr>
         <td colSpan={3} ><h4>{user_name}'s (Requests History)</h4></td>
         <tr>
         </tr>
        </tr>
      </thead>
      <thead>
        <tr>
        <td>#</td>
         <td>Book Name</td>
         <td>Request Status</td>
        </tr>
      </thead>
      <tbody>
      {requests.results.map(request=>
        <tr key={request.id}>
        <td>#</td>
          <td>{request.book_name}</td>
          <td>{request.request}</td>
        </tr>
      )}
      </tbody>
    </Table>
        </div>
    )
};

export default RequestsHistory;