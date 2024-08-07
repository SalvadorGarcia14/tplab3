import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Modal, Form, Button } from 'react-bootstrap';

const ModificarProducto = ({ producto, onSave }) => {
    const [showModal, setShowModal] = useState(false);
    const [editedProduct, setEditedProduct] = useState({
        id: producto.id,
        name: producto.name,
        precio: producto.precio,
        status: producto.status,
        imagen: producto.imagen,
        cantidad: producto.cantidad, // Incluir cantidad en el estado local
    });

    // Effect para actualizar el status basado en la cantidad y status
    useEffect(() => {
        if (editedProduct.cantidad > 0 && !editedProduct.status) {
            setEditedProduct((prevProduct) => ({
                ...prevProduct,
                status: true,
            }));
        } else if (editedProduct.cantidad <= 0 && editedProduct.status) {
            setEditedProduct((prevProduct) => ({
                ...prevProduct,
                status: false,
            }));
        }
    }, [editedProduct.cantidad, editedProduct.status]);

    const handleClose = () => setShowModal(false);
    const handleShow = () => setShowModal(true);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditedProduct((prevProduct) => ({
            ...prevProduct,
            [name]: name === 'precio' || name === 'cantidad' ? parseFloat(value) : value, // Parseo condicional
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const accessToken = localStorage.getItem('accessToken');
            const response = await fetch(`http://localhost:8000/Componentes/${editedProduct.id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(editedProduct),
            });

            if (!response.ok) {
                throw new Error('Error al actualizar el producto');
            }

            onSave(editedProduct);
            handleClose();
        } catch (error) {
            console.error('Error al actualizar el producto:', error);
        }
    };

    return (
        <>
            <Button variant="secondary" onClick={handleShow}>
                Modificar 
            </Button>

            <Modal show={showModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Modificar Producto</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="formNombre">
                            <Form.Label>Nombre</Form.Label>
                            <Form.Control
                                type="text"
                                name="name"
                                value={editedProduct.name}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Form.Group controlId="formPrecio">
                            <Form.Label>Precio</Form.Label>
                            <Form.Control
                                type="number"
                                step="0.01"
                                name="precio"
                                value={editedProduct.precio}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Form.Group controlId="formCantidad">
                            <Form.Label>Cantidad</Form.Label>
                            <Form.Control
                                type="number"
                                name="cantidad"
                                value={editedProduct.cantidad}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Form.Group controlId="formImagen">
                            <Form.Label>Imagen</Form.Label>
                            <Form.Control
                                type="text"
                                name="imagen"
                                value={editedProduct.imagen}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            Guardar cambios
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    );
};

ModificarProducto.propTypes = {
    producto: PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        precio: PropTypes.number.isRequired,
        status: PropTypes.bool.isRequired,
        imagen: PropTypes.string,
        cantidad: PropTypes.number.isRequired,
    }).isRequired,
    onSave: PropTypes.func.isRequired,
};

export default ModificarProducto;