import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import api from '../services/api';
import useAuth from '../hooks/useAuth';
import LoadingSpinner from '../components/LoadingSpinner';

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
           const response = await api.get('/gyms', {query: '', page: 1});
           const gym = response.data?.gyms.find(gym => gym.id === parseInt(id));
          if(!gym) {
             navigate('/dashboard');
          }
          setGym(gym);
        } catch(err) {
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
    }

    if (loading) {
        return <LoadingSpinner/>;
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
                    {checkInError && <p style={{ color: 'red' }}>{checkInError}</p>}
                  <Button variant="primary" onClick={handleCheckIn}>
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