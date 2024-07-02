// Carrito.jsx

import PropTypes from 'prop-types';
import { Card, Button } from 'react-bootstrap';

const Carrito = ({ cartItems }) => {
    const handleBuy = () => {
        alert('Compra realizada exitosamente');
        // Aquí puedes realizar la lógica para enviar la orden de compra al backend si fuera necesario
    };

    return (
        <div className="mt-4">
            <h2>Carrito de Compras</h2>
            {cartItems.length === 0 ? (
                <p>El carrito está vacío.</p>
            ) : (
                cartItems.map(item => (
                    <Card key={item.id} style={{ width: '18rem', margin: '10px' }}>
                        <Card.Img variant="top" src={item.imagen} />
                        <Card.Body>
                            <Card.Title>{item.name}</Card.Title>
                            <Card.Text>
                                Precio: {item.precio} <br />
                                Cantidad: 1 {/* Puedes ajustar la cantidad según necesites */}
                            </Card.Text>
                        </Card.Body>
                    </Card>
                ))
            )}
            {cartItems.length > 0 && (
                <Button variant="primary" onClick={handleBuy}>
                    Comprar
                </Button>
            )}
        </div>
    );
};

Carrito.propTypes = {
    cartItems: PropTypes.array.isRequired,
};

export default Carrito;
