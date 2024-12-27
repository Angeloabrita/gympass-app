import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import AuthForm from '../components/AuthForm';
import { useSearchParams, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';


const AuthPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();



  useEffect(() => {// verify user for avoid navigate routes, on local states without correct user information from context state;
    if (isAuthenticated && user) {

      navigate('/dashboard');
    }


  }, [isAuthenticated, user, navigate]);



  return (
    <Container>
      <Row className="justify-content-center mt-5">
        <Col md={6}>
          <h2>{searchParams.get('register') ? 'Cadastro' : 'Login'}</h2>
          <AuthForm isLogin={!searchParams.get('register')} />
          <Button
            variant="link"
            onClick={() => navigate(`/auth${!searchParams.get('register') ? '?register=true' : ''}`)} //  with parameters based by a toggle for register route, and if that don`t exist or undefined to login ; using template string instead "" + "".  This link handle also local store and render and change routes using react router libs correctly as planne in the action from  props;
            className="mt-2"
          >
            {searchParams.get('register') ? 'Já tem uma conta? Faça login' : 'Não tem uma conta? Cadastre-se'}
          </Button>
        </Col>
      </Row>
    </Container>
  );
};
export default AuthPage;