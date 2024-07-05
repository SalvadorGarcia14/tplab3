import { useState } from 'react';
import PropTypes from 'prop-types';
import { Card, Button, Alert, Image } from 'react-bootstrap';

const PantallaCarrito = ({ carrito, setCarrito, onCompraRealizada }) => {
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

    return (
        <Card style={{ width: '18rem', margin: '10px' }}>
            <Card.Body>
                <Card.Title>Carrito de Compras</Card.Title>
                {carrito.map(componente => (
                    <div key={componente.id}>
                        <Image src={componente.imagen} alt={componente.name} style={{ width: '50px', height: '50px' }} />
                        <p>{componente.name} ({componente.marca}) - Cantidad: {componente.cantidadEnCarrito || 1}</p>
                        <Button variant="secondary" onClick={() => handleDecrement(componente)}>-</Button>
                        <Button variant="secondary" onClick={() => handleIncrement(componente)}>+</Button>
                        <Button variant="danger" onClick={() => handleRemoveFromCart(componente)}>Eliminar</Button>
                    </div>
                ))}
                <p>Total: ${calcularPrecioTotal()}</p>
                <Button variant="success" onClick={handleComprar} disabled={carrito.length === 0}>Comprar</Button>
                {showCompraRealizada && carrito.length === 0 && (
                    <Alert variant="success" onClose={() => setShowCompraRealizada(false)} dismissible>
                        Gracias por su compra
                    </Alert>
                )}
            </Card.Body>
            {showAlert && (
                <Alert variant="warning" onClose={() => setShowAlert(false)} dismissible>
                    {alertMessage}
                </Alert>
            )}
        </Card>
    );
};

PantallaCarrito.propTypes = {
    carrito: PropTypes.array.isRequired,
    setCarrito: PropTypes.func.isRequired,
    onCompraRealizada: PropTypes.func.isRequired,
};

export default PantallaCarrito;
