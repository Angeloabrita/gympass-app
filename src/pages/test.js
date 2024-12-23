import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import GymCard from '../components/GymCard';
import api from '../services/api';
import useAuth from '../hooks/useAuth';
import LoadingSpinner from '../components/LoadingSpinner';
import Pagination from '../components/Pagination';

const DashboardPage = () => {
    const [gyms, setGyms] = useState([]);
   const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
   const [totalPages, setTotalPages] = useState(1);
  const { user, isAuthenticated } = useAuth();

useEffect(() => {
    if (isAuthenticated){
         fetchGyms();
      } else {
        setLoading(false);
   }
  }, [currentPage, searchQuery, isAuthenticated, user]); //adiciona dependencia para ser chamado corretamente ao autenticar, mantendo um contexto estável na página
const fetchGyms = async () => {
  if(!isAuthenticated){
    setLoading(false);
   return; // Evitar busca sem autenticação
}
 setLoading(true);
 try {
     const response = await api.get('/gyms', { page: currentPage, query: searchQuery });
      setGyms(response?.data?.gyms || []);
       setTotalPages(response?.data?.totalPages || 1); // Set default totalPages in undefined case
} catch (error) {
     console.error('Erro ao buscar academias:', error);
 }
    setLoading(false);
 };

    const handleSearch = (e) => {
      e.preventDefault();
  setCurrentPage(1);
      fetchGyms();
    };

    const handlePageChange = (page) => {
    setCurrentPage(page);
 };

 if (loading) {
      return <LoadingSpinner/>;
  }

 return (
    <Container>
     <Row className="mt-4">
         <Col>
       <h1>Lista de Academias</h1>
          </Col>
            <Col md={4}>
            <Form onSubmit={handleSearch} className='d-flex'>
             <Form.Control
                  type="text"
               placeholder="Pesquisar por nome"
                   value={searchQuery}
                   onChange={(e) => setSearchQuery(e.target.value)}
             />
              <Button type='submit' variant="outline-primary" className='ms-2'>Pesquisar</Button>
       </Form>
       </Col>
   </Row>
     <Row>
     {gyms && Array.isArray(gyms) && gyms?.length > 0 ? (  // Check to see if is an valid array before using .map function and if not undefined to use
         gyms.map((gym) => (
           <Col md={4} key={gym.id} className="mt-3">
              <GymCard gym={gym}/>
               </Col>
               ))
                ) : <p>Não encontramos nenhuma academia com a busca realizada.</p>}
        </Row>
          <Row className="mt-3">
     <Col>
       <Pagination
             currentPage={currentPage}
        totalPages={totalPages}
           onPageChange={handlePageChange}
              />
         </Col>
        </Row>
  </Container>
    );
};

export default DashboardPage;