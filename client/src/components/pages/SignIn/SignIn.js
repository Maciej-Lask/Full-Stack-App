import { Container } from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Form, Button, Alert, Spinner, AlertHeading } from 'react-bootstrap';
import { API_URL } from '../../../config';
import { useDispatch } from 'react-redux';
import { logIn } from '../../../redux/usersRedux';

const SignIn = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');

  const [status, setStatus] = useState(null); // null, success, serverError, clientError, loginError, loading

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('submitted');
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ login, password }),
    };
    setStatus('loading');
    fetch(`${API_URL}auth/login`, options)
      .then((res) => {
        if (res.status === 200) {
          localStorage.setItem('user', JSON.stringify(login));
          
          setStatus('success');
          dispatch(logIn({ login }));
          setTimeout(() => {
            navigate('/');
          }, 3000);
        } else if (res.status === 400) {
          setStatus('clientError');
        } else {
          setStatus('serverError');
        }
      })
      .catch((err) => {
        setStatus('serverError');
      });
  };

  return (
    <Container className="d-flex flex-column align-items-center">
      <h1>Sign In Here</h1>

      {status === 'loading' && (
        <Spinner
          color="primary"
          className="standard-box d-block me-auto ms-auto"
        />
      )}

      {status === 'success' && (
        <Alert variant="success" className="rounded">
          <AlertHeading style={{ color: 'white' }}>Success!</AlertHeading>
          <p> Successfully logged in! You will be redirected to home page in 3 seconds</p>
        </Alert>
      )}

      {status === 'serverError' && (
        <Alert variant="danger" className="rounded">
          <AlertHeading style={{ color: 'white' }}>Error!</AlertHeading>
          <p>Something went wrong while logging. Please try again</p>
        </Alert>
      )}

      {status === 'clientError' && (
        <Alert variant="danger" className="rounded">
          <AlertHeading style={{ color: 'white' }}>Incorrect data</AlertHeading>
          <p>Wrong login or password</p>
        </Alert>
      )}
      <Form className="standard-box" onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="login">
          <Form.Label>Login</Form.Label>
          <Form.Control
            type="login"
            placeholder="Enter login"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
          />
        </Form.Group>
        <Form.Group
          className="mb-3"
          controlId="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        >
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" placeholder="Enter password" />
        </Form.Group>
        <Button variant="primary" type="submit">
          Sign In
        </Button>
      </Form>
    </Container>
  );
};

export default SignIn;
