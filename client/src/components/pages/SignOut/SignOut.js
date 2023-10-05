import { Container } from 'reactstrap';
import { Button } from 'react-bootstrap';
import { API_URL } from '../../../config';
import { useNavigate } from 'react-router-dom';
import { logOut } from '../../../redux/usersRedux';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
const SignOut = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    fetch(`${API_URL}auth/logout`, options).then(() => {
      dispatch(logOut());
      localStorage.removeItem('user');
      setTimeout(() => {
        navigate('/');
      }, 3000);
    });
  }, [dispatch]);
  // return (
  //   <Container className="d-flex flex-column align-items-center">
  //     <h1>Sign Out Here</h1>
  //     <Button variant="primary">Sign Out</Button>
  //   </Container>
  // );
  return (
    <Container className="d-flex flex-column align-items-center">
      <h1>You have been signed out</h1>
      <h5 className='mb-5'>You will be redirected to the homepage in 3 seconds</h5>
      <Button variant="primary" onClick={() => navigate('/')}>Back to Home Now</Button>
    </Container>
  );
};

export default SignOut;
