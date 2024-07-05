import { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Form, Alert } from 'react-bootstrap';

const AgregarProducto = ({ onProductAdded }) => {
    const [name, setName] = useState('');
    const [precio, setPrecio] = useState('');
    const [status, setStatus] = useState(true); // Default to available
    const [imagenUrl, setImagenUrl] = useState(''); // For image URL instead of file upload
    const [componente, setComponente] = useState('');
    const [marca, setMarca] = useState('');
    const [cantidad, setCantidad] = useState('');
    const [error, setError] = useState(null);
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');

    // Opciones de marca por componente
    const marcaOptions = {
        cpu: ['AMD', 'Intel'],
        mother: ['ASUS', 'Asrock'],
        memoriaram: ['Patriot', 'Team'],
        gpu: ['Nvidia', 'AMD'],
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setShowAlert(false); // Ocultar cualquier alerta previa

        const accessToken = localStorage.getItem('accessToken');

        if (!accessToken) {
            setError('No se encontró el token de acceso. Por favor, inicia sesión.');
            return;
        }

        try {
            const formData = {
                name,
                precio: Number(precio), // Convert to number
                status,
                imagen: imagenUrl,
                componente,
                marca,
                cantidad: Number(cantidad), // Convert to number
            };

            const response = await fetch('http://localhost:8000/Componentes', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error('Error al agregar el producto');
            }

            const data = await response.json();
            onProductAdded(data);

            // Mostrar la alerta de éxito
            setShowAlert(true);
            setAlertMessage(`Se agregó "${name}" correctamente.`);

            // Limpiar el formulario después de agregar el producto
            setName('');
            setPrecio('');
            setStatus(true);
            setImagenUrl('');
            setComponente('');
            setMarca('');
            setCantidad('');

        } catch (error) {
            setError(error.message || 'Error al conectar con la API');
        }
    };

    return (
        <div className="agregar-producto-container">
            <h2>Agregar Producto</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            {showAlert && <Alert variant="success">{alertMessage}</Alert>}
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
                <Form.Group controlId="formComponente">
                    <Form.Label>Componente</Form.Label>
                    <Form.Control
                        as="select"
                        value={componente}
                        onChange={(e) => {
                            setComponente(e.target.value);
                            setMarca('');
                        }}
                        required
                    >
                        <option value="">Selecciona un componente</option>
                        <option value="cpu">CPU</option>
                        <option value="mother">Motherboard</option>
                        <option value="memoriaram">Memoria RAM</option>
                        <option value="gpu">GPU</option>
                    </Form.Control>
                </Form.Group>
                {componente && (
                    <Form.Group controlId="formMarca">
                        <Form.Label>Marca</Form.Label>
                        <Form.Control
                            as="select"
                            value={marca}
                            onChange={(e) => setMarca(e.target.value)}
                            required
                        >
                            <option value="">Selecciona una marca</option>
                            {marcaOptions[componente].map((marcaOption) => (
                                <option key={marcaOption} value={marcaOption}>{marcaOption}</option>
                            ))}
                        </Form.Control>
                    </Form.Group>
                )}
                <Form.Group controlId="formCantidad">
                    <Form.Label>Cantidad en stock</Form.Label>
                    <Form.Control
                        type="number"
                        placeholder="Ingresa la cantidad en stock"
                        value={cantidad}
                        onChange={(e) => setCantidad(e.target.value)}
                        required
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