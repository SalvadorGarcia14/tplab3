import { useState } from 'react';
import PropTypes from 'prop-types';
import { Card, Button, Alert, Image } from 'react-bootstrap';
import "./pantallaCarrito.css";

const PantallaCarrito = ({ user, carrito, setCarrito, onCompraRealizada }) => {
    const [showAlert, setShowAlert] = useState(false);
    const [showCompraRealizada, setShowCompraRealizada] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');

    const calcularPrecioTotal = () => {
        return carrito.reduce((total, componente) => total + componente.precio * (componente.cantidadEnCarrito || 1), 0);
    };

    const handleComprar = () => {
        // Verifica si hay suficiente stock
        const stockInsuficiente = carrito.some(componente => componente.cantidadEnCarrito > componente.cantidad);
        if (stockInsuficiente) {
            setAlertMessage('Algunos productos no tienen suficiente stock.');
            setShowAlert(true);
            return;
        }

        onCompraRealizada({ items: carrito, total: calcularPrecioTotal() });
        setCarrito([]);
        setShowCompraRealizada(true);
    };

    const handleRemoveFromCart = (componente) => {
        setCarrito(prevCarrito => prevCarrito.filter(item => item.id !== componente.id));
    };

    const handleIncrement = (componente) => {
        if (componente.cantidadEnCarrito < componente.cantidad) {
            setCarrito(prevCarrito => prevCarrito.map(item =>
                item.id === componente.id
                    ? { ...item, cantidadEnCarrito: item.cantidadEnCarrito + 1 }
                    : item
            ));
        } else {
            setAlertMessage('Alcanzado stock máximo.');
            setShowAlert(true);
        }
    };

    const handleDecrement = (componente) => {
        if (componente.cantidadEnCarrito > 1) {
            setCarrito(prevCarrito => prevCarrito.map(item =>
                item.id === componente.id
                    ? { ...item, cantidadEnCarrito: item.cantidadEnCarrito - 1 }
                    : item
            ));
        }
    };

    if (!user) {
        return <Alert variant="danger">No hay usuario autenticado</Alert>;
    }

    return (

        <section className="cart-page">

            <div className="cart-header">

                <h1>Carrito de Compras</h1>

                <p>
                    Revisá tus productos antes de finalizar la compra.
                </p>

            </div>

            {!user && (

                <Alert className="cart-alert-danger">

                    No hay usuario autenticado

                </Alert>

            )}

            {user && (

                <>

                    <div className="cart-products-grid">

                        {carrito.map((componente) => (

                            <Card
                                key={componente.id}
                                className="cart-item-card"
                            >

                                <div className="cart-item-image-container">

                                    <Image
                                        src={componente.imagen}
                                        alt={componente.name}
                                        className="cart-item-image"
                                    />

                                </div>

                                <Card.Body>

                                    <Card.Title
                                        className="cart-item-title"
                                    >

                                        {componente.name}

                                    </Card.Title>

                                    <div className="cart-item-brand">

                                        {componente.marca}

                                    </div>

                                    <div className="cart-item-price">

                                        $

                                        {(
                                            componente.precio *
                                            (componente.cantidadEnCarrito || 1)
                                        ).toLocaleString()}

                                    </div>

                                    <div className="cart-quantity">

                                        <span>

                                            Cantidad

                                        </span>

                                        <div className="quantity-controls">

                                            <Button
                                                className="quantity-btn"
                                                onClick={() =>
                                                    handleDecrement(componente)
                                                }
                                            >

                                                −

                                            </Button>

                                            <span>

                                                {componente.cantidadEnCarrito || 1}

                                            </span>

                                            <Button
                                                className="quantity-btn"
                                                onClick={() =>
                                                    handleIncrement(componente)
                                                }
                                            >

                                                +

                                            </Button>

                                        </div>

                                    </div>

                                    <Button
                                        className="remove-product-btn"
                                        onClick={() =>
                                            handleRemoveFromCart(componente)
                                        }
                                    >

                                        Eliminar

                                    </Button>

                                </Card.Body>

                            </Card>

                        ))}

                    </div>

                    <div className="cart-summary">

                        <h3>

                            Resumen de compra

                        </h3>

                        <div className="cart-total">

                            Total

                            <span>

                                $

                                {calcularPrecioTotal().toLocaleString()}

                            </span>

                        </div>

                        <Button
                            className="buy-button"
                            onClick={handleComprar}
                            disabled={carrito.length === 0}
                        >

                            Finalizar compra

                        </Button>

                    </div>

                    {showCompraRealizada && (

                        <Alert
                            variant="success"
                            dismissible
                            onClose={() =>
                                setShowCompraRealizada(false)
                            }
                        >

                            ¡Gracias por tu compra!

                        </Alert>

                    )}

                    {showAlert && (

                        <Alert
                            variant="warning"
                            dismissible
                            onClose={() =>
                                setShowAlert(false)
                            }
                        >

                            {alertMessage}

                        </Alert>

                    )}

                </>

            )}

        </section>

    );
};

PantallaCarrito.propTypes = {
    user: PropTypes.object,
    carrito: PropTypes.array.isRequired,
    setCarrito: PropTypes.func.isRequired,
    onCompraRealizada: PropTypes.func.isRequired,
};

export default PantallaCarrito;