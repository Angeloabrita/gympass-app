import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const GymCard = ({ gym }) => {
    return (
        <Card>
            <Card.Body>
                <Card.Title>{gym.name}</Card.Title>
                <Card.Text>{gym.description}</Card.Text>
                <Button variant="primary" as={Link} to={`/gyms/${gym.id}`}>Ver mais</Button>{/* link implementation in the button itself passing id and variant */}
            </Card.Body>
        </Card>
    );
};

export default GymCard;