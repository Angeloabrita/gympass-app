import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import api from '../services/api';
import useAuth from '../hooks/useAuth';
import LoadingSpinner from '../components/LoadingSpinner';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';


//fix map bug by setting global L as global variable (needed due  to an icon missing bug from react leaflet);
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});

const GymDetailPage = () => {
  const { id } = useParams();
  const [gym, setGym] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();
  const [checkInError, setCheckInError] = useState(null);

  useEffect(() => {
    fetchGym();
  }, [id]);

  const fetchGym = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/gyms/${id}`);
      console.log('get gym id detail from page =>', response?.data, 'params =>', id) // view responses from server API layer;

      if (!response.data) {
        navigate('/dashboard');
        return;
      }

      setGym(response?.data)

    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };


  const handleCheckIn = async () => {
    setCheckInError(null);
    try {
      await api.post('/check-ins', { gymId: gym.id, userId: user.id });
      alert('Check-in realizado com sucesso!')
      navigate('/profile');
    } catch (err) {
      setCheckInError(err.message)
    }
  };


  if (loading) {
    return <LoadingSpinner />;
  }


  return (
    <Container>
      <Row className="justify-content-center mt-4">
        <Col md={8}>
          {gym && (
            <Card>
              <Card.Body>
                <Card.Title>{gym.name}</Card.Title>
                <Card.Text>
                  <strong>Descrição:</strong> {gym.description}
                </Card.Text>
                <Card.Text>
                  <strong>Telefone:</strong> {gym.phone}
                </Card.Text>
                <Card.Text>
                  <strong>Latitude:</strong> {gym.latitude}
                </Card.Text>
                <Card.Text>
                  <strong>Longitude:</strong> {gym.longitude}
                </Card.Text>
                <div style={{ height: '300px', width: '100%' }}>
                  <MapContainer
                    center={[gym?.latitude, gym?.longitude]}  // set dynamic data of position to component leaflet  through props and ensure exist or use defaults in coordenades 
                    zoom={13}
                    scrollWheelZoom={false}
                    style={{ height: '100%', width: '100%' }} // setting correct position ( important css inline ) and aspect ratios  by component properties;
                  >
                    <TileLayer
                      attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker position={[gym?.latitude, gym?.longitude]} />{/* Set dynamically market with coordinates by Leaflet component props on  dynamic state value in data fetch*/}

                  </MapContainer>
                </div>

                {checkInError && <p style={{ color: 'red' }}>{checkInError}</p>}
                <Button variant="primary" onClick={handleCheckIn}  size="lg" className="w-100 mt-3">
                  Realizar Check-in
                </Button>
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>
    </Container>
  );
};
export default GymDetailPage;