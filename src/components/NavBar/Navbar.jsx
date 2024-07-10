import { Navbar, Nav, Form, FormControl, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import './Navbar.css';

const NavBar = ({ searchValue, setSearchValue, user, onLogout }) => {
    const navigate = useNavigate();

    const handleLoginRedirect = () => {
        navigate('/login');
    };

    return (
        <Navbar bg="dark" variant="dark" className="border-bottom border-body">
            <div className="navbar-container">
                <Navbar.Brand as={Link} to="/">PC Componentes</Navbar.Brand>
                <Form inline="true" className="navbar-form">
                    <FormControl
                        type="text"
                        placeholder="Buscar componente..."
                        className="mr-sm-2"
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                    />
                </Form>
                <Nav className="navbar-links">
                    <Nav.Link as={Link} to="/pantallaUsuario">PERFIL</Nav.Link>
                    <Nav.Link as={Link} to="/pantallaCarrito">Carrito</Nav.Link>
                    {user ? (
                        <Button variant="outline-light" onClick={onLogout}>Cerrar Sesión</Button>
                    ) : (
                        <Button variant="outline-light" onClick={handleLoginRedirect}>Iniciar Sesión</Button>
                    )}
                </Nav>
            </div>
        </Navbar>
    );
};

NavBar.propTypes = {
    searchValue: PropTypes.string.isRequired,
    setSearchValue: PropTypes.func.isRequired,
    user: PropTypes.object,
    onLogout: PropTypes.func.isRequired,
};

export default NavBar;