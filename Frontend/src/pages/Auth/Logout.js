import React ,{useState,useEffect} from "react";
import { Link , useNavigate} from "react-router-dom";
import {removeAuthUser , getAuthUser} from "../../helper/Storage.js";
import axios from "axios";


const Logout = () => {
    const Auth = getAuthUser();
    const Navigate = useNavigate();

    const [logout,setLogout]=useState({
        loading : true,
        err : null,
      })

      useEffect(()=>{
        setLogout({...logout, loading:true})
        axios.put("http://localhost:4000/auth/logout",{
            Headers: {
                token : Auth.token,
            },
        })
        .then(resp =>{
          console.log(resp);
          setLogout({...logout ,loading : false , err : null });
          removeAuthUser();
          Navigate("/login");
        })
        .catch(err =>{
            console.log(err)
          setLogout({...logout, loading : false , err :"something went wrong , please try again later!" })
        })
      },[])
   
};

export default Logout;
