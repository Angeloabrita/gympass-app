import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import api from '../services/api';
import useAuth from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const AuthForm = ({ isLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState(null);
  const { login } = useAuth();
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const payload = { email, password }

      if (!isLogin) {
        payload.name = name
      }
      const response = await api.post(isLogin ? '/auth/login' : '/auth/register', payload);
      login(response.data.user, response.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      {!isLogin && (
        <Form.Group>
          <Form.Label>Nome</Form.Label>
          <Form.Control type="text" placeholder="Nome" value={name} onChange={(e) => setName(e.target.value)} required />
        </Form.Group>
      )}
      <Form.Group>
        <Form.Label>Email</Form.Label>
        <Form.Control type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </Form.Group>
      <Form.Group>
        <Form.Label>Senha</Form.Label>
        <Form.Control type="password" placeholder="Senha" value={password} onChange={(e) => setPassword(e.target.value)} required />
      </Form.Group>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <Button variant="primary" type="submit" className="w-100 mt-3">
        {isLogin ? 'Login' : 'Cadastrar'}
      </Button>
    </Form>
  );
};

export default AuthForm;