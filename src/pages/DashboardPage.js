import React, { useState, useEffect, useCallback } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
    import GymCard from '../components/GymCard';
  import api from '../services/api';
  import useAuth from '../hooks/useAuth';
 import LoadingSpinner from '../components/LoadingSpinner';
import Pagination from '../components/Pagination';
  import { useNavigate } from 'react-router-dom';

const DashboardPage = () => {
   const [gyms, setGyms] = useState(null);
   const [loading, setLoading] = useState(true);
 const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
      const [totalPages, setTotalPages] = useState(1);
  const { user, isAuthenticated } = useAuth();
    const navigate = useNavigate();

   const fetchGyms = useCallback(async () => {
    if (!isAuthenticated) {
            setLoading(false);
              return;
          }
     setLoading(true);
       try {
        const response = await api.get('/gyms', { page: currentPage, query: searchQuery });
     console.log( 'Response  Gyms =>' , response?.data?.gyms,  '   Loading  =>', loading)

    setGyms(response?.data?.gyms || null) // if res does not exit send a null as a fallback
           setTotalPages(response?.data?.totalPages || 1);
      } catch (error) {
          console.error('Erro ao buscar academias:', error);
      }
    setLoading(false);
 }, [currentPage, isAuthenticated, searchQuery]);
    useEffect(() => {
       fetchGyms();
  }, [fetchGyms,isAuthenticated]);
   const handleSearch = (e) => {
     e.preventDefault();
       setCurrentPage(1);
          fetchGyms();
  };
    const handlePageChange = (page) => {
        setCurrentPage(page);
   };
   const handleLogout = () => {
      localStorage.removeItem('token');
         navigate('/auth');
      };


      if (loading) {
       return <LoadingSpinner />;
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
              {gyms ?  ( // check valid list not undefined using logical opetaror or state with an default null value
                 gyms && Array.isArray(gyms) && gyms.length > 0 ? ( // Check to see if is a valid list using a logical gate on an array prop that exists ( avoiding render undefined item and crashing)
                gyms.map((gym) => (
                       <Col md={4} key={gym.id} className="mt-3">
                         <GymCard gym={gym} />
                     </Col>
                         ))
              ) : (
           <Col className="mt-3"><p>Nenhuma academia encontrada com a busca realizada</p></Col>
            )
           ) :  (
              <Col className="mt-3"><p>Carregando Academias...</p></Col> // loading message fallback before receive response
          )}
       </Row>
            <Row className="mt-3">
             <Col className="d-flex align-items-center justify-content-between">
                <Pagination
                        currentPage={currentPage}
                  totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
                <Button variant='outline-danger' onClick={handleLogout}>Logout</Button>
                  </Col>
                 </Row>
           </Container>
     );
  };

    export default DashboardPage;