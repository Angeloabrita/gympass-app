import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const GymCard = ({ gym }) => {
    return (
        <Card>
          <Card.Body>
            <Card.Title>{gym.name}</Card.Title>
            <Card.Text>{gym.description}</Card.Text>
            <Button as={Link} to={`/gyms/${gym.id}`} variant="primary">Ver mais</Button>
          </Card.Body>
        </Card>
      );
}

export default GymCard;