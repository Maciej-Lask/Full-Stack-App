import React from 'react';
import { Container, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Ad = () => {
  return (
    <Container className="d-flex flex-column align-items-center">
      <h2 className="pt-5">Ad deleted</h2>
      <Link to="/">
        <Button> Back to Home</Button>
      </Link>
    </Container>
  );
};

export default Ad;
