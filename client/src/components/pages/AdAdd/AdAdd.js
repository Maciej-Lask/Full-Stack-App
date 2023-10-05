import { Container } from 'reactstrap';
import { Button, Spinner, Alert, AlertHeading, Form } from 'react-bootstrap';
import { API_URL } from '../../../config';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';

const AdAdd = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null); 
  const [price, setPrice] = useState('');
  const [location, setLocation] = useState('');

  const [status, setStatus] = useState(null); // null, success, serverError, clientError, loginError, loading
  const [user, setUser] = useState(localStorage.getItem('user'));
  // console.log(user);
  const handlePostAd = () => {
    // Implement the logic to post the ad here
    const fd = new FormData();
    fd.append('title', title);
    fd.append('content', content);
    fd.append('image', image);
    fd.append('price', price);
    fd.append('location', location);
    fd.append('sellerInfo', user);
    console.log(fd);

    const options = {
      method: 'POST',
      credentials: 'include',
      body: fd,
    };

    setStatus('loading');
    fetch(`${API_URL}api/ads`, options)
      .then((res) => {
      if (res.status === 201) {
        setStatus('success');
        setTimeout(() => {
          navigate('/');
        }, 3000);
      } else if (res.status === 400) {
        setStatus('clientError');
      } else if (res.status === 401) {
        setStatus('loginError');
      } else {
        setStatus('serverError');
      }
      return res.json();
    });

    console.log('Posting ad:', fd);
  };
  return (
    <Container className="d-flex flex-column align-items-center">
      <h1>Post ad</h1>
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
            {' '}
            Successfully posted! You will be navigated to the main page in 3
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
          <p>Please check if you filled all the fields</p>
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
        <Form.Control
          type="text"
          placeholder="Title"
          className="mb-3"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <Form.Control
          as="textarea"
          rows={4}
          placeholder="Content"
          className="mb-3"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <Form.Control
          type="file"
          className="mb-3"
          onChange={(e) => setImage(e.target.files[0])}
        />
        <Form.Control
          type="number"
          placeholder="Price"
          className="mb-3"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
        <Form.Control
          type="text"
          placeholder="Location"
          className="mb-3"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
      </Form>
      <Button className="mb-3" variant="primary" onClick={handlePostAd}>
        Post ad
      </Button>

      <Button variant="secondary" onClick={() => navigate('/')}>
        Back to Home Now
      </Button>
    </Container>
  );
};

export default AdAdd;
