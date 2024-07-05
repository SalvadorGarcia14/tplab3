import { useState } from 'react';
import PropTypes from 'prop-types';
import { Card, Button } from 'react-bootstrap';
import ModificarProducto from '../Productos/ModificarProducto/modificarProducto';

const Producto = ({ componente, onAddToCart, isAdminOrVendedor, onRemoveProduct, user }) => {
    const [isAdded, setIsAdded] = useState(false);

    const handleAddToCart = () => {
        if (componente.cantidad > 0) {
            setIsAdded(true);
            onAddToCart(componente);
        }
    };

    const handleRemoveProduct = () => {
        onRemoveProduct(componente.id);
    };

    const handleSaveChanges = (editedProduct) => {
        const updatedProduct = {
            ...componente,
            name: editedProduct.name,
            precio: editedProduct.precio,
            status: editedProduct.status,
            imagen: editedProduct.imagen,
            cantidad: editedProduct.cantidad
        };
        onRemoveProduct(updatedProduct);
    };

    if (componente.cantidad === 0 && componente.status) {
        const updatedProduct = {
            ...componente,
            status: false
        };
        handleSaveChanges(updatedProduct);
    }

    return (
        <Card style={{ width: '18rem', margin: '10px' }}>
            <Card.Img variant="top" src={componente.imagen} />
            <Card.Body>
                <Card.Title>{componente.name}</Card.Title>
                <Card.Text>
                    Precio: ${componente.precio} <br />
                    Stock: {componente.cantidad > 0 ? 'Disponible' : 'Agotado'}
                    {isAdminOrVendedor && <span>Cantidad: {componente.cantidad}</span>}
                </Card.Text>
                {!isAdded && componente.cantidad > 0 && user && (
                    <Button variant="primary" onClick={handleAddToCart}>
                        Agregar al carrito
                    </Button>
                )}
                {isAdminOrVendedor && (
                    <>
                        <ModificarProducto producto={componente} onSave={handleSaveChanges} />
                        <Button variant="danger" onClick={handleRemoveProduct}>
                            Quitar producto
                        </Button>
                    </>
                )}
            </Card.Body>
        </Card>
    );
};

Producto.propTypes = {
    componente: PropTypes.shape({
        id: PropTypes.number.isRequired,
        imagen: PropTypes.string,
        name: PropTypes.string.isRequired,
        precio: PropTypes.number.isRequired,
        status: PropTypes.bool.isRequired,
        cantidad: PropTypes.number.isRequired,
    }).isRequired,
    onAddToCart: PropTypes.func.isRequired,
    isAdminOrVendedor: PropTypes.bool.isRequired,
    onRemoveProduct: PropTypes.func.isRequired,
    user: PropTypes.object, // Agregar el usuario a las propTypes
};

export default Producto;
