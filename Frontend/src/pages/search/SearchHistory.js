import React , {useState,useEffect}from "react";
import { Link , useParams,useLocation} from "react-router-dom";
import Table from 'react-bootstrap/Table';
import { getAuthUser } from "../../helper/Storage.js";
import axios from "axios";
import  Alert  from "react-bootstrap/Alert";

const SearchHistory = () => {

    const Auth = getAuthUser();
    const [history,setHistory] = useState ({
        loading : true,
        results : [],
        err : null,
        reload : 0
      })

      useEffect(()=>{
        setHistory({...history, loading : true })
        axios.get("http://localhost:4000/books/search/history",{
          headers :
          {
            tokens : Auth.tokens
          }
        })
        .then(resp =>{
          console.log(resp);
          setHistory({...history , results :resp.data ,loading : false , err : null })
    
        })
        .catch(err =>{
          setHistory({...history, loading : false , err :"something went wrong , please try again later!" })
        })
      },[history.reload])

    return (
        <div>
         {history.results.length===0 &&(
            <Alert variant="info" className="p-1 mt-3"  >
                No Searches Yet
            </Alert>
          )}
          <br></br>

          <Table class="rounded" striped bordered hover variant="dark" >
    <thead>
        <tr>
         <td colSpan={3} ><h4>{Auth.name}'s (Search History)</h4></td>
        </tr>
      </thead>
      <thead>
        <tr>
        <td>#</td>
         <td>Names</td>
        </tr>
      </thead>
      <tbody>
      {history.results.map(h=>
        <tr key={h.id}>
        <td>#</td>
          <td>{h.search}</td>
        </tr>
      )}
      </tbody>
    </Table>
        </div>
    );
};

export default SearchHistory;