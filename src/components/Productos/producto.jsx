
import { useState } from 'react';
import PropTypes from 'prop-types';
import { Card, Button } from 'react-bootstrap';

const Producto = ({ componente, onAddToCart }) => {
    const [isAdded, setIsAdded] = useState(false);

    const handleAddToCart = () => {
        setIsAdded(true);
        // Aquí podrías manejar la lógica para agregar al carrito, si es necesario
        onAddToCart(componente);
    };

    return (
        <Card style={{ width: '18rem', margin: '10px' }}>
            <Card.Img variant="top" src={componente.imagen} />
            <Card.Body>
                <Card.Title>{componente.name}</Card.Title>
                <Card.Text>
                    Precio: {componente.precio} <br />
                    Stock: {componente.stock ? 'Disponible' : 'Agotado'}
                </Card.Text>
                {!isAdded ? (
                    <Button variant="primary" onClick={handleAddToCart}>
                        Agregar al carrito
                    </Button>
                ) : (
                    <Button variant="success" disabled>
                        Agregado al carrito
                    </Button>
                )}
            </Card.Body>
        </Card>
    );
};

Producto.propTypes = {
    componente: PropTypes.shape({
        imagen: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        precio: PropTypes.number.isRequired,
        stock: PropTypes.bool.isRequired,
    }).isRequired,
    onAddToCart: PropTypes.func.isRequired,
};

export default Producto;