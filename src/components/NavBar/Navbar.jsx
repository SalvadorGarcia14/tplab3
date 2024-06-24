import { Navbar, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const NavBar = () => {
    return (
        <Navbar bg="dark" variant="dark" className="border-bottom border-body">
            <Navbar.Brand as={Link} to="/">MiApp</Navbar.Brand>
            <Nav className="mr-auto">
                <Nav.Link as={Link} to="/">Inicio</Nav.Link>
                <Nav.Link as={Link} to="/pantallaProduto">Pantalla Producto</Nav.Link>
                <Nav.Link as={Link} to="/pantallaUsuario">Pantalla Usuario</Nav.Link>
            </Nav>
        </Navbar>
    );
};

export default NavBar;