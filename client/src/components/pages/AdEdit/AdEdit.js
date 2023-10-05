import React from 'react';
import {
  Container,
  Form,
  Button,
  Alert,
  AlertHeading,
  Spinner,
} from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getAdById } from '../../../redux/adsRedux';
import { IMAGES_URL, API_URL } from '../../../config';
import { fetchAds } from '../../../redux/adsRedux';

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';

const Ad = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const ad = useSelector((state) => getAdById(state, id));

  const [title, setTitle] = useState(ad ? ad.title : '');
  const [content, setContent] = useState(ad ? ad.content : '');
  const [image, setImage] = useState(null);
  const [price, setPrice] = useState(ad ? ad.price : '');
  const [location, setLocation] = useState(ad ? ad.location : '');
  const [status, setStatus] = useState(null); // null, success, serverError, clientError, loginError, loading

  if (!ad) {
    return (
      <Spinner
        color="primary"
        className="standard-box d-block me-auto ms-auto"
      />
    );
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('submitted');
    const fd = new FormData();
    fd.append('title', title);
    fd.append('content', content);
    fd.append('price', price);
    fd.append('location', location);
    // fd.append('image', image);
    if (image) {
      fd.append('image', image);
    }
    fd.append('user', ad.user);
    // fd.append('publishDate', ad.publishDate);
    const options = {
      method: 'PUT',
      body: fd,
      credentials: 'include',
    };

    fetch(`${API_URL}api/ads/${id}`, options)
      .then((res) => {
        console.log('Response:', res);
        if (res.status === 200) {
          setStatus('success');
          setTimeout(() => navigate('/'), 3000);
          dispatch(fetchAds());
        } else if (res.status === 400) {
          setStatus('clientError');
        }
        else {
          setStatus('serverError');
        }
        return res.json();
      })
      .catch((err) => {
        setStatus('serverError');
        console.error('error:', err);
      });
  };

  return (
    <Container className="d-flex flex-column align-items-center">
      <h2 className="pt-5">Edit Ad</h2>
      {status === 'loading' && (
        <Spinner
          color="primary"
          className="standard-box d-block me-auto ms-auto"
        />
      )}
      {status === 'success' && (
        <Alert variant="success" className="rounded">
          <AlertHeading style={{ color: 'white' }}>Success!</AlertHeading>
          <p>
            Successfully edited! You will be navigated to the main page in 3
            seconds
          </p>
        </Alert>
      )}
      {status === 'serverError' && (
        <Alert variant="danger" className="rounded">
          <Alert.Heading style={{ color: 'white' }}>
            Something went wrong!
          </Alert.Heading>
          <p>Please try again</p>
        </Alert>
      )}
      {status === 'clientError' && (
        <Alert variant="danger" className="rounded">
          <Alert.Heading style={{ color: 'white' }}>
            Something went wrong!
          </Alert.Heading>
          <p>Wrong file type</p>
        </Alert>
      )}
      {status === 'loginError' && (
        <Alert variant="danger" className="rounded">
          <Alert.Heading style={{ color: 'white' }}>
            Something went wrong!
          </Alert.Heading>
          <p>It looks like you are not logged in</p>
        </Alert>
      )}
      <Form className="d-flex flex-column align-items-center">
        <Form.Label>Title</Form.Label>
        <Form.Control
          type="text"
          placeholder="Title"
          className="mb-3"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <Form.Label>Content</Form.Label>

        <Form.Control
          as="textarea"
          rows={4}
          placeholder="Content"
          className="mb-3"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <Form.Label>New Image (optional)</Form.Label>
        <Form.Control
          type="file"
          className="mb-3"
          onChange={(e) => setImage(e.target.files[0])}
        />
        <Form.Label>Price</Form.Label>
        <Form.Control
          type="number"
          placeholder="Price"
          className="mb-3"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
        <Form.Label>Location</Form.Label>
        <Form.Control
          type="text"
          placeholder="Location"
          className="mb-3"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
      </Form>
      <Button className="mb-3" variant="primary" onClick={handleSubmit}>
        Submit
      </Button>

      <Button variant="secondary" onClick={() => navigate('/')}>
        Back to Home Now
      </Button>
    </Container>
  );
};

export default Ad;
