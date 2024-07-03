import { Card, ListGroup, ListGroupItem } from 'react-bootstrap';
import PropTypes from 'prop-types';

const PantallaCarrito = ({ carrito }) => {
    const totalPrice = carrito.reduce((total, componente) => total + componente.precio, 0);

    return (
        <Card style={{ width: '18rem', margin: '10px' }}>
            <Card.Header>Carrito de Compras</Card.Header>
            <ListGroup variant="flush">
                {carrito.map(componente => (
                    <ListGroupItem key={componente.id}>
                        {componente.name} - ${componente.precio}
                    </ListGroupItem>
                ))}
                <ListGroupItem>
                    <strong>Total: ${totalPrice}</strong>
                </ListGroupItem>
            </ListGroup>
        </Card>
    );
};

PantallaCarrito.propTypes = {
    carrito: PropTypes.array.isRequired,
};

export default PantallaCarrito;
