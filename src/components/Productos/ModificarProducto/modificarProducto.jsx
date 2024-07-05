import { useState } from 'react';
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
        componente: producto.componente || '', // Asegúrate de manejar valores nulos
        marca: producto.marca || '', // Asegúrate de manejar valores nulos
    });

    // Opciones de marca por componente
    const marcaOptions = {
        cpu: ['AMD', 'Intel'],
        mother: ['ASUS', 'Asrock'],
        memoriaram: ['Patriot', 'Team'],
        gpu: ['Nvidia', 'AMD'],
    };

    const handleClose = () => setShowModal(false);
    const handleShow = () => setShowModal(true);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditedProduct({
            ...editedProduct,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const accessToken = localStorage.getItem('accessToken');
            const response = await fetch(`http://localhost:8000/Componentes/${editedProduct.id}`, {
                method: 'PUT', // Método PUT para actualizar el producto
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(editedProduct),
            });

            if (!response.ok) {
                throw new Error('Error al actualizar el producto');
            }

            // Actualizar localmente el producto modificado
            onSave(editedProduct);

            handleClose();
        } catch (error) {
            console.error('Error al actualizar el producto:', error);
        }
    };

    return (
        <>
            <Button variant="primary" onClick={handleShow}>
                Modificar Producto
            </Button>

            <Modal show={showModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Modificar Producto</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="formName">
                            <Form.Label>Nombre</Form.Label>
                            <Form.Control
                                type="text"
                                name="name"
                                value={editedProduct.name}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="formComponente">
                            <Form.Label>Componente</Form.Label>
                            <Form.Control
                                as="select"
                                name="componente"
                                value={editedProduct.componente}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Selecciona un componente</option>
                                <option value="cpu">CPU</option>
                                <option value="mother">Motherboard</option>
                                <option value="memoriaram">Memoria RAM</option>
                                <option value="gpu">GPU</option>
                            </Form.Control>
                        </Form.Group>
                        {editedProduct.componente && (
                            <Form.Group controlId="formMarca">
                                <Form.Label>Marca</Form.Label>
                                <Form.Control
                                    as="select"
                                    name="marca"
                                    value={editedProduct.marca}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Selecciona una marca</option>
                                    {marcaOptions[editedProduct.componente].map((marcaOption) => (
                                        <option key={marcaOption} value={marcaOption}>{marcaOption}</option>
                                    ))}
                                </Form.Control>
                            </Form.Group>
                        )}
                        <Form.Group controlId="formPrecio">
                            <Form.Label>Precio</Form.Label>
                            <Form.Control
                                type="number"
                                name="precio"
                                value={editedProduct.precio}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="formStatus">
                            <Form.Check
                                type="checkbox"
                                label="Disponible"
                                checked={editedProduct.status}
                                onChange={(e) =>
                                    setEditedProduct({
                                        ...editedProduct,
                                        status: e.target.checked,
                                    })
                                }
                            />
                        </Form.Group>
                        <Form.Group controlId="formImagen">
                            <Form.Label>URL de Imagen</Form.Label>
                            <Form.Control
                                type="text"
                                name="imagen"
                                value={editedProduct.imagen}
                                onChange={handleChange}
                                required
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
        imagen: PropTypes.string.isRequired,
        componente: PropTypes.string,
        marca: PropTypes.string,
    }).isRequired,
    onSave: PropTypes.func.isRequired,
};

export default ModificarProducto;