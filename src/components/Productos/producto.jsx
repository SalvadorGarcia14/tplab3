import { useState } from 'react';
import PropTypes from 'prop-types';
import { Card, Button } from 'react-bootstrap';
import ModificarProducto from '../Productos/ModificarProducto/modificarProducto';

const Producto = ({ componente, onAddToCart, isAdminOrVendedor, onRemoveProduct }) => {
    const [isAdded, setIsAdded] = useState(false);

    const handleAddToCart = () => {
        setIsAdded(true);
        onAddToCart(componente);
    };

    const handleRemoveProduct = () => {
        onRemoveProduct(componente.id);
    };

    const handleSaveChanges = (editedProduct) => {
        console.log('Guardar cambios:', editedProduct);
        const updatedProduct = {
            ...componente,
            name: editedProduct.name,
            precio: editedProduct.precio,
            status: editedProduct.status,
            imagen: editedProduct.imagen,
        };
        onRemoveProduct(updatedProduct);
    };

    return (
        <Card style={{ width: '18rem', margin: '10px' }}>
            <Card.Img variant="top" src={componente.imagen} />
            <Card.Body>
                <Card.Title>{componente.name}</Card.Title>
                <Card.Text>
                    Precio: {componente.precio} <br />
                    Stock: {componente.status ? 'Disponible' : 'Agotado'}
                    {isAdminOrVendedor && <span>Cantidad: {componente.cantidad}</span>}
                </Card.Text>
                {componente.status ? (
                    <>
                        {!isAdded ? (
                            <Button variant="primary" onClick={handleAddToCart}>
                                Agregar al carrito
                            </Button>
                        ) : (
                            <Button variant="success" disabled>
                                Agregado al carrito
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
                    </>
                ) : (
                    <Button variant="secondary" disabled>
                        No disponible
                    </Button>
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
};

export default Producto;