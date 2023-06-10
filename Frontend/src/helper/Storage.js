import axios from "axios";

export const setAuthUser = (data) => {
    localStorage.setItem("user", JSON.stringify(data));
  };
  
  export const getAuthUser = (data) => {
    if (localStorage.getItem("user")) {
      return JSON.parse(localStorage.getItem("user"));
    }
  };

  const auth = getAuthUser();
  
  export const removeAuthUser = () => {
    if (localStorage.getItem("user")) 
      localStorage.removeItem("user");
    
  };