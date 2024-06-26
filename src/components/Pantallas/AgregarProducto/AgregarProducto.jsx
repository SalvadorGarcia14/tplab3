import { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Form, Alert } from 'react-bootstrap';

const AgregarProducto = ({ onProductAdded }) => {
    const [name, setName] = useState('');
    const [precio, setPrecio] = useState('');
    const [status, setStatus] = useState(true); // Default to available
    const [imagenUrl, setImagenUrl] = useState(''); // For image URL instead of file upload
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        const accessToken = localStorage.getItem('accessToken'); // Obtén el token de acceso de localStorage

        if (!accessToken) {
            setError('No se encontró el token de acceso. Por favor, inicia sesión.');
            return;
        }

        try {
            const formData = {
                name,
                precio,
                status,
                imagen: imagenUrl, // Use imagenUrl instead of formData for file upload
            };

            const response = await fetch('http://localhost:8000/Componentes', { // Ajuste aquí
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken}`, // Incluye el token en los encabezados
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error('Error al agregar el producto');
            }

            const data = await response.json();
            onProductAdded(data);

        } catch (error) {
            setError(error.message || 'Error al conectar con la API');
        }
    };

    return (
        <div className="agregar-producto-container">
            <h2>Agregar Producto</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formName">
                    <Form.Label>Nombre del producto</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Ingresa el nombre del producto"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </Form.Group>
                <Form.Group controlId="formPrecio">
                    <Form.Label>Precio</Form.Label>
                    <Form.Control
                        type="number"
                        placeholder="Ingresa el precio"
                        value={precio}
                        onChange={(e) => setPrecio(e.target.value)}
                        required
                    />
                </Form.Group>
                <Form.Group controlId="formStatus">
                    <Form.Check
                        type="checkbox"
                        label="Disponible"
                        checked={status}
                        onChange={(e) => setStatus(e.target.checked)}
                    />
                </Form.Group>
                <Form.Group controlId="formImagenUrl">
                    <Form.Label>URL de la imagen del producto</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Ingresa la URL de la imagen"
                        value={imagenUrl}
                        onChange={(e) => setImagenUrl(e.target.value)}
                        required
                    />
                </Form.Group>
                <Button variant="primary" type="submit">
                    Agregar Producto
                </Button>
            </Form>
        </div>
    );
};

AgregarProducto.propTypes = {
    onProductAdded: PropTypes.func.isRequired,
};

export default AgregarProducto;
