import { Navbar, Nav, Form, FormControl, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

const NavBar = ({ searchValue, setSearchValue, user, onLogout }) => {
    const navigate = useNavigate();

    const handleLoginRedirect = () => {
        navigate('/login');
    };

    return (
        <Navbar bg="dark" variant="dark" className="border-bottom border-body">
            <Navbar.Brand as={Link} to="/">PC Componentes</Navbar.Brand>
            <Nav className="mr-auto">
                <Nav.Link as={Link} to="/pantallaUsuario">PERFIL</Nav.Link>            
                <Nav.Link as={Link} to="/pantallaProduto">PRODUCTOS</Nav.Link>
            </Nav>
            <Form inline className="ml-auto d-flex align-items-center">
                <FormControl
                    type="text"
                    placeholder="Buscar componente..."
                    className="mr-sm-2"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                />
                {user ? (
                    <Button variant="outline-light" onClick={onLogout}>Cerrar Sesión</Button>
                ) : (
                    <Button variant="outline-light" onClick={handleLoginRedirect}>Iniciar Sesión</Button>
                )}
            </Form>
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
