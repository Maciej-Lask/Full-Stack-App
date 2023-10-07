import React from 'react';
import { Container, Card, Button, Spinner } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { json, useParams } from 'react-router-dom';
import { getAdById } from '../../../redux/adsRedux';
import { IMAGES_URL, API_URL } from '../../../config';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { fetchAds } from '../../../redux/adsRedux';
import { useState } from 'react';


const Ad = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  const ad = useSelector((state) => getAdById(state, id));
  const user = localStorage.getItem('user');
  let author = '';  
  // console.log(user);
  // console.log(JSON.stringify(ad.sellerInfo.login));
  if(ad){
    author = JSON.stringify(ad.sellerInfo.login);

  }
  const isAuthor = (user===author);
  console.log(isAuthor);
  
  const [status, setStatus] = useState(null); // null, success, serverError, clientError, loginError, loading

  const handleDelete = () => {
    console.log('delete');
      const options = {
        method: 'DELETE',
        credentials: 'include',
      };
      fetch(`${API_URL}api/ads/${id}`, options)
        .then ((res) => {
          console.log('Response:', res);
        })
        .then((res) => {
          if (res.status === 204) {
            setStatus('success');
            dispatch(fetchAds());
            setTimeout(() => navigate('/'), 3000);
          } else {
            setStatus('serverError');
          }
          // return res.json();
          
        })
        .catch((err) => {
          setStatus('serverError');
          console.error('Fetch error:', err);
        });
    // navigate(`/ad/delete/${ad._id}`);
  };

  return (
    <Container>
      <h2 className="pt-5">Ad Details</h2>
      {ad ? (
        <Card className="mt-4">
          <Card.Img
            variant="top"
            src={`${IMAGES_URL}/${ad.image}`}
            alt={ad.title}
          />
          <Card.Body>
            <Card.Title>{ad.title}</Card.Title>
            <Card.Text>{ad.content}</Card.Text>
            <Card.Text>Price: ${ad.price}</Card.Text>
            <Card.Text>Location: {ad.location}</Card.Text>
            {isAuthor && (
              <>
                <Link to={`/ad/edit/${ad._id}`}>
                  <Button variant="primary" className="mr-2">
                    Edit
                  </Button>
                </Link>
                <Button variant="danger" className="m-2" onClick={handleDelete}>
                  Delete
                </Button>
              </>
            )}
          </Card.Body>
        </Card>
      ) : (
        <Spinner
          color="primary"
          className="standard-box d-block me-auto ms-auto"
        />
      )}
    </Container>
  );
};

export default Ad;
