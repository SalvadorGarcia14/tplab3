import { Card, Button } from 'react-bootstrap';
import PropTypes from 'prop-types';

const AgregarCarrito = ({ componentes, onAddToCart }) => {
    const handleAddToCart = (componente) => {
        if (componente.stock > 0) {
            onAddToCart(componente);
        } else {
            alert('Este producto está agotado.');
        }
    };

    return (
        <div>
            <h2>Productos Disponibles</h2>
            {componentes.map(componente => (
                <Card key={componente.id} style={{ width: '18rem', margin: '10px' }}>
                    <Card.Img variant="top" src={componente.imagen} />
                    <Card.Body>
                        <Card.Title>{componente.name}</Card.Title>
                        <Card.Text>Precio: ${componente.precio}</Card.Text>
                        <Button
                            variant="primary"
                            onClick={() => handleAddToCart(componente)}
                            disabled={componente.stock <= 0}
                        >
                            Agregar al carrito
                        </Button>
                    </Card.Body>
                </Card>
            ))}
        </div>
    );
};

AgregarCarrito.propTypes = {
    componentes: PropTypes.array.isRequired,
    onAddToCart: PropTypes.func.isRequired,
};

export default AgregarCarrito;
