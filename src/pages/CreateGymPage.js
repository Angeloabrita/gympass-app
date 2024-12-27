import React, { useState } from 'react';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import api from '../services/api';
import useAuth from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Corrige o bug do ícone ausente do Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const CreateGymPage = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [phone, setPhone] = useState('');
  const [position, setPosition] = useState(null);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  const LocationMarker = () => {
    const map = useMapEvents({
      locationfound(e) {
        if (!map._locationFound) {
          map._locationFound = true;
          setPosition(e.latlng);
          map.flyTo(e.latlng, map.getZoom());
        }
      },
      click(e) {
        setPosition(e.latlng);
        map.flyTo(e.latlng, map.getZoom());
      },
    });
    map.locate();
    return position === null ? null : <Marker position={position} />;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      if (!position) {
        setError('Você deve marcar um ponto no mapa!');
        return;
      }
      const gym = await api.post('/gyms', {
        name,
        description,
        phone,
        latitude: position.lat,
        longitude: position.lng,
        userId: user?.id,
      });

      alert(`Academia "${gym?.data?.name}" cadastrada com sucesso!`);
      navigate(`/gyms/${gym?.data?.id}`);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Container className="mt-5">
      <h1>Cadastrar Academia</h1>
      <Form onSubmit={handleSubmit}>
        <Form.Group>
          <Form.Label>Nome</Form.Label>
          <Form.Control
            type="text"
            placeholder="Nome da academia"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Descrição</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            placeholder="Descrição da academia"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Telefone</Form.Label>
          <Form.Control
            type="text"
            placeholder="Telefone da academia"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </Form.Group>
        <div style={{ height: '400px', marginBottom: '3rem' }}>
          <p>Marque no mapa a locação da academia</p>
          <MapContainer
            center={[-23.5489, -46.6388]}
            zoom={13}
            scrollWheelZoom={false}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <LocationMarker />
          </MapContainer>
        </div>

        {error && <Alert variant="danger">{error}</Alert>}


        <Button variant="primary" type="submit" className='w-100 mb-2'>
          Cadastrar
        </Button>

      </Form>
    </Container>
  );
};

export default CreateGymPage;
