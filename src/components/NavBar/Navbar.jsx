import { Navbar, Nav, Form, FormControl, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import "./Navbar.css";

const NavBar = ({ searchValue, setSearchValue, user, onLogout, carrito, cartNotification }) => {
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

                    <div className="cart-wrapper">

                        <Nav.Link
                            as={Link}
                            to="/pantallaCarrito"
                            className={`cart-link ${cartNotification.visible ? "cart-bounce" : ""
                                }`}
                        >

                            🛒 Carrito

                            <span className="cart-count">

                                {carrito.length}

                            </span>

                            {
                                cartNotification.visible &&

                                <>

                                    <span className="sparkle sparkle-1">✨</span>

                                    <span className="sparkle sparkle-2">✨</span>

                                    <span className="sparkle sparkle-3">✨</span>

                                </>

                            }

                        </Nav.Link>

                        {

                            cartNotification.visible &&

                            <div className="cart-toast">

                                <strong>

                                    <span style={{ fontSize: "16px" }}>🛒</span>

                                    Agregado al carrito

                                </strong>

                                <span>

                                    {cartNotification.product}

                                </span>

                            </div>

                        }

                    </div>

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