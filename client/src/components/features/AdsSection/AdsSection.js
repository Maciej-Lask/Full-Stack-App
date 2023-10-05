import { Container } from 'reactstrap';
import { useSelector } from 'react-redux';
// import { useDispatch } from 'react-redux';
import { Row, Col } from 'react-bootstrap';
// import { useEffect } from 'react';
import { API_URL } from '../../../config';
import { getAllAds } from '../../../redux/adsRedux';
// import { fetchAds } from '../../../redux/adsRedux';
import AdCard from '../../common/AdCard';


import './AdsSection.scss';

const AdsSection = () => {
    // const dispatch = useDispatch();

      // useEffect(() => {
      //   dispatch(fetchAds());
      // }, [dispatch]);



  const ads = useSelector(getAllAds);

  return (
    <section className="trending-box">
      <Container>
        <h2 className="pt-5">Ads Catalog</h2>
        <Row>
          {ads.map((ad) => (
            <Col key={ad._id} xs={12} md={6} lg={4}>
              <AdCard ad={ad} />
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
}

export default AdsSection;