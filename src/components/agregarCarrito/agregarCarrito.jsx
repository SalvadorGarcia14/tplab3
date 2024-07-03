//Eliminar...
import { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Card } from 'react-bootstrap';

const AgregarCarrito = ({ componente, onAddToCart }) => {
    const [quantity, setQuantity] = useState(1);

    const handleAddToCart = () => {
        if (quantity > 0) {
            onAddToCart(componente, quantity);
            setQuantity(1); // Reset quantity after adding to cart
        }
    };

    return (
        <Card style={{ width: '18rem', margin: '10px' }}>
            <Card.Img variant="top" src={componente.imagen} />
            <Card.Body>
                <Card.Title>{componente.name}</Card.Title>
                <Card.Text>
                    Marca: {componente.marca}<br />
                    Precio: ${componente.precio}<br />
                    Cantidad disponible: {componente.cantidad}
                </Card.Text>
                <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value))}
                    min={1}
                    max={componente.cantidad}
                />
                <Button variant="primary" onClick={handleAddToCart}>
                    Agregar al carrito
                </Button>
            </Card.Body>
        </Card>
    );
};

AgregarCarrito.propTypes = {
    componente: PropTypes.object.isRequired,
    onAddToCart: PropTypes.func.isRequired,
};

export default AgregarCarrito;