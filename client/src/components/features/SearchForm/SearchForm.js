import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import {Container} from 'react-bootstrap';

const SearchForm = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSearch = () => {
    navigate(`/search/${searchTerm}`);
  };

  return (
    <Form className="d-flex flex-column  text-center mb-4">
      <Form.Group className="w-75 m-auto mb-2" controlId="searchTerm">
        <Form.Label>Search Ads</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter search term"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Form.Group>
      <Button className="w-75 m-auto" variant="primary" onClick={handleSearch}>
        Search
      </Button>
    </Form>
  );
};

export default SearchForm;
