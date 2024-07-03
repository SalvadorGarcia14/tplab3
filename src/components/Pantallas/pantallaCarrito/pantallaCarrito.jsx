import { useState } from 'react';
import PropTypes from 'prop-types';
import { Card, Button, Alert } from 'react-bootstrap';

const PantallaCarrito = ({ carrito, removeFromCart }) => {
    const [showAlert, setShowAlert] = useState(false);

    const calcularPrecioTotal = () => {
        return carrito.reduce((total, componente) => total + componente.precio * (componente.cantidadEnCarrito || 1), 0);
    };

    const handleComprar = () => {
        setShowAlert(true);
        // Aquí puedes agregar la lógica para procesar la compra
    };

    return (
        <Card style={{ width: '18rem', margin: '10px' }}>
            <Card.Body>
                <Card.Title>Carrito de Compras</Card.Title>
                {carrito.map(componente => (
                    <Card.Text key={componente.id}>
                        {componente.name} - Cantidad: {componente.cantidadEnCarrito || 1}
                        <Button variant="danger" onClick={() => removeFromCart(componente)}>Eliminar</Button>
                    </Card.Text>
                ))}
                <Card.Text>Total: ${calcularPrecioTotal()}</Card.Text>
                <Button variant="success" onClick={handleComprar}>Comprar</Button>
            </Card.Body>
            {showAlert && (
                <Alert variant="success" onClose={() => setShowAlert(false)} dismissible>
                    Compra realizada
                </Alert>
            )}
        </Card>
    );
};

PantallaCarrito.propTypes = {
    carrito: PropTypes.array.isRequired,
    removeFromCart: PropTypes.func.isRequired,
};

export default PantallaCarrito;