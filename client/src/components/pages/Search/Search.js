import React, { useEffect, useState } from 'react';
import { Container, Card, Row , Col, Spinner } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { API_URL } from '../../../config';
import AdCard from '../../common/AdCard';

const Search = () => {
  const { searchPhrase } = useParams();
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}api/ads/search/${searchPhrase}`)
      .then((response) => response.json())
      .then((data) => {
        setSearchResults(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Wystąpił błąd podczas pobierania danych:', error);
        setLoading(false);
      });
  }, [searchPhrase]);

  return (
    <Container>
      <h1>Search Results for: {searchPhrase}</h1>
      {loading ? (
        <Spinner
          color="primary"
          className="standard-box d-block me-auto ms-auto"
        />
      ) : (
        <div className="search-results">
          <Row>
            {searchResults.map((ad) => (
              <Col key={ad._id} xs={12} md={6} lg={4}>
                <AdCard ad={ad} />
              </Col>
            ))}
          </Row>
        </div>
      )}
    </Container>
  );
};

export default Search;
