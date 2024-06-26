import { Navbar, Nav, Form, FormControl } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const NavBar = ({ searchValue, setSearchValue }) => {
    return (
        <Navbar bg="dark" variant="dark" className="border-bottom border-body">
            <Navbar.Brand as={Link} to="/">Inicio</Navbar.Brand>
            <Nav className="mr-auto">
                <Nav.Link as={Link} to="/pantallaProduto">PRODUCTOS</Nav.Link>
                <Nav.Link as={Link} to="/pantallaUsuario">PERFIL</Nav.Link> 
            </Nav>
            <Form inline="true" className="ml-auto"> {/* Cambia aquí */}
                <FormControl 
                    type="text" 
                    placeholder="Buscar componente..." 
                    className="mr-sm-2" 
                    value={searchValue} 
                    onChange={(e) => setSearchValue(e.target.value)} 
                />
            </Form>
        </Navbar>
    );
};

NavBar.propTypes = {
    searchValue: PropTypes.string.isRequired,
    setSearchValue: PropTypes.func.isRequired,
};

export default NavBar;