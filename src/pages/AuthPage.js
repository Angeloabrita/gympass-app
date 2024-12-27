import { Container, Row, Col, Button } from 'react-bootstrap';
import AuthForm from '../components/AuthForm';
import { useSearchParams, useNavigate } from 'react-router-dom';


const AuthPage = () => {
  const [searchParams] = useSearchParams(); //used params value for validation render conditional.
  const navigate = useNavigate()
  return (
    <Container>
      <Row className="justify-content-center mt-5">
        <Col md={6}>
          <h2>{searchParams.get('register') ? 'Cadastro' : 'Login'}</h2> { /* set dinamyc component title */}
          <AuthForm isLogin={!searchParams.get('register')} />{ /* check value state by params, ! mean (not = false) set auth mode form with params to send real value from props;*/}
          <Button
            variant="link"
            onClick={() => navigate(`/auth${!searchParams.get('register') ? '?register=true' : ''}`)}
          >
            {searchParams.get('register') ? 'Já tem uma conta? Faça login' : 'Não tem uma conta? Cadastre-se'}
          </Button>
        </Col>
      </Row>
    </Container>
  );
};
export default AuthPage;