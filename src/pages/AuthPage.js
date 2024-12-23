import React, { useState } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import AuthForm from '../components/AuthForm';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <Container>
      <Row className="justify-content-center mt-5">
        <Col md={6}>
          <h2>{isLogin ? 'Login' : 'Cadastro'}</h2>
          <AuthForm isLogin={isLogin} />
          <Button
            variant="link"
            onClick={() => setIsLogin(!isLogin)}
            className="mt-2"
          >
            {isLogin ? 'Não tem uma conta? Cadastre-se' : 'Já tem uma conta? Faça login'}
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default AuthPage;