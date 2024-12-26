import React from 'react';
import { Navbar, Nav, NavDropdown, Button } from 'react-bootstrap';
import useAuth from '../hooks/useAuth';
import { Link, useNavigate } from 'react-router-dom';

const AppNavbar = () => {
   const { user, isAuthenticated, logout } = useAuth();
   console.log(user);
   const navigate = useNavigate();
   const handleLogout = () => {
      logout();
      navigate('/auth')
   };


   return (
      <Navbar bg="light" expand="lg">
         <Navbar.Brand as={Link} to="/dashboard">Gympass App</Navbar.Brand>
         <Navbar.Toggle aria-controls="basic-navbar-nav" />
         <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
               {isAuthenticated ? (
                  <>
                     <NavDropdown align="end" title={user?.name || 'Usuário'} id="basic-nav-dropdown">
                        <NavDropdown.Item as={Link} to="/profile">Meu Perfil</NavDropdown.Item>
                        {user?.role === 'admin' && ( //show register if its a admin
                           <NavDropdown.Item as={Link} to="/gyms/create">Cadastrar Academia</NavDropdown.Item>
                        )}
                        <NavDropdown.Divider />
                        <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
                     </NavDropdown>
                  </>
               ) : (
                  <Button as={Link} to="/auth" variant="outline-primary">Login</Button>
               )}
            </Nav>
         </Navbar.Collapse>
      </Navbar>
   );
};

export default AppNavbar;