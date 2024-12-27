import React from 'react';
import { Container, Row, Col, Button, Image } from 'react-bootstrap';
import { Link } from 'react-router-dom';
const HomePage = () => {
    return (
        <Container className="mt-5">
            <Row>
                <Col md={6} className="d-flex align-items-center justify-content-center  flex-column text-center">
                    <Image src="https://loremflickr.com/200/200?random=1" fluid className=" w-50" alt="Gym Illustration" />{/* Responsive and centered with margin bottom */}
                    <h1>Bem-vindo ao Gympass App</h1>
                    <p className="lead">Encontre as melhores academias perto de você e mantenha seu corpo ativo!</p>
                </Col>
                <Col md={6} className="d-flex align-items-center justify-content-center flex-column text-center ">
                    <Button as={Link} to="/auth" variant="primary" className="mb-2 w-50">
                        Login
                    </Button>
                    <Button as={Link} to="/auth?register=true" variant="outline-primary" className="w-50"> {/* send new user path when clicked on link ( with params ? ) */}
                        Cadastrar
                    </Button>
                </Col>
            </Row>
        </Container>
    );
};

export default HomePage;