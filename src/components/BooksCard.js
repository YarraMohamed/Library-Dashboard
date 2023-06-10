import React from "react";
import Card from 'react-bootstrap/Card';
import '../css/BookCard.css';
import { Link } from "react-router-dom";

const BooksCard =(props)=>{
    return(
        <div className="py-3">
        <Card>
        <Card.Img className="card-image" variant="top" src={props.img_url}/>
        <Card.Body>
          <Card.Title>{props.name}</Card.Title>
          <Card.Text>
            {props.description}
          </Card.Text>
          <Link className="btn btn-dark me-2" variant="primary" to={"/"+props.id}>Show Details</Link> 
         
        </Card.Body>
      </Card>
      </div>);
};

export default BooksCard;