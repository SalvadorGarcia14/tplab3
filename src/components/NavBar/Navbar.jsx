import { Navbar, Nav, Form, FormControl, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import "./Navbar.css";

const NavBar = ({ searchValue, setSearchValue, user, onLogout }) => {
    const navigate = useNavigate();

    const handleLoginRedirect = () => {
        navigate("/login");
    };

    return (
        <Navbar expand="lg" className="custom-navbar">

            <div className="navbar-container">

                <Navbar.Brand as={Link} to="/" className="navbar-logo">
                    PC<span>Componentes</span>
                </Navbar.Brand>

                <Form className="navbar-form">
                    <FormControl
                        type="search"
                        placeholder="Buscar componentes, notebooks, placas de video..."
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                    />
                </Form>

                <Nav className="navbar-links">

                    <Nav.Link as={Link} to="/pantallaUsuario">
                        Perfil
                    </Nav.Link>

                    <Nav.Link as={Link} to="/pantallaCarrito">
                        Carrito
                    </Nav.Link>

                    {user ? (
                        <Button
                            className="navbar-button"
                            onClick={onLogout}
                        >
                            Cerrar sesión
                        </Button>
                    ) : (
                        <Button
                            className="navbar-button"
                            onClick={handleLoginRedirect}
                        >
                            Iniciar sesión
                        </Button>
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