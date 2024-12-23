import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, ListGroup } from 'react-bootstrap';
import api from '../services/api';
import useAuth from '../hooks/useAuth';
import LoadingSpinner from '../components/LoadingSpinner';

const ProfilePage = () => {
  const [userProfile, setUserProfile] = useState(null);
  const [checkIns, setCheckIns] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchProfile();
    fetchCheckIns();
  }, []);


  const fetchProfile = async () => {
     setLoading(true);
      try {
          const response = await api.get('/me', { userId: user.id });
          setUserProfile(response.data);
      } catch(err) {
         console.error(err)
      }
      setLoading(false);
  };


  const fetchCheckIns = async () => {
      try {
        const response = await api.get('/check-ins', { userId: user.id });
          setCheckIns(response.data);
      } catch(err) {
        console.error(err)
      }
  }

    if (loading) {
      return <LoadingSpinner/>;
    }


  return (
    <Container>
      <Row className="justify-content-center mt-4">
        <Col md={8}>
          {userProfile && (
            <Card>
              <Card.Body>
                <Card.Title>Meu Perfil</Card.Title>
                <Card.Text>
                  <strong>Nome:</strong> {userProfile.name}
                </Card.Text>
                <Card.Text>
                  <strong>Email:</strong> {userProfile.email}
                </Card.Text>
                <Card.Title className='mt-3'>Meus Check-ins</Card.Title>
                  <ListGroup>
                    {checkIns?.map(checkIn => {
                      return <ListGroup.Item key={checkIn.id}>Data: {new Date(checkIn.date).toLocaleDateString()} </ListGroup.Item>
                    })}
                     {checkIns?.length === 0 && <p>Você não fez nenhum check-in ainda.</p>}
                  </ListGroup>
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default ProfilePage;