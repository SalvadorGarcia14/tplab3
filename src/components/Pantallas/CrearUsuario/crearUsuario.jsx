import { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Form, Alert } from 'react-bootstrap';

const CrearUsuario = ({ onUserCreated }) => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState(true); // Default to true
    const [rango, setRango] = useState('cliente'); // Default to 'cliente'
    const [error, setError] = useState(null);
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setShowAlert(false); // Ocultar cualquier alerta previa

        const accessToken = localStorage.getItem('accessToken'); // Obtén el token de acceso de localStorage

        if (!accessToken) {
            setError('No se encontró el token de acceso. Por favor, inicia sesión.');
            return;
        }

        try {
            const formData = {
                firstName,
                lastName,
                username,
                password,
                email,
                status,
                rango,
            };

            const response = await fetch('http://localhost:8000/users', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken}`, // Incluye el token en los encabezados
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error('Error al crear el usuario');
            }

            const data = await response.json();
            onUserCreated(data);

            // Mostrar la alerta de éxito
            setShowAlert(true);
            setAlertMessage(`Se agregó "${username}" correctamente.`);

            // Limpiar el formulario después de crear el usuario
            setFirstName('');
            setLastName('');
            setUsername('');
            setPassword('');
            setEmail('');
            setStatus(true);
            setRango('cliente');

        } catch (error) {
            setError(error.message || 'Error al conectar con la API');
        }
    };

    return (
        <div className="crear-usuario-container">
            <h2>Crear Usuario</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            {showAlert && <Alert variant="success">{alertMessage}</Alert>}
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formFirstName">
                    <Form.Label>Nombre</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Ingresa tu nombre"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                    />
                </Form.Group>
                <Form.Group controlId="formLastName">
                    <Form.Label>Apellido</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Ingresa tu apellido"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                    />
                </Form.Group>
                <Form.Group controlId="formUsername">
                    <Form.Label>Nombre de usuario</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Ingresa tu nombre de usuario"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </Form.Group>
                <Form.Group controlId="formPassword">
                    <Form.Label>Contraseña</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="Ingresa tu contraseña"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </Form.Group>
                <Form.Group controlId="formEmail">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        type="email"
                        placeholder="Ingresa tu email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </Form.Group>
                <Form.Group controlId="formStatus">
                    <Form.Label>Status</Form.Label>
                    <Form.Control
                        as="select"
                        value={status}
                        onChange={(e) => setStatus(e.target.value === 'true')}
                        required
                    >
                        <option value="true">Activo</option>
                        <option value="false">Inactivo</option>
                    </Form.Control>
                </Form.Group>
                <Form.Group controlId="formRango">
                    <Form.Label>Rango</Form.Label>
                    <Form.Control
                        as="select"
                        value={rango}
                        onChange={(e) => setRango(e.target.value)}
                        required
                    >
                        <option value="cliente">Cliente</option>
                        <option value="vendedor">Vendedor</option>
                    </Form.Control>
                </Form.Group>
                <Button variant="primary" type="submit">
                    Crear Usuario
                </Button>
            </Form>
        </div>
    );
};

CrearUsuario.propTypes = {
    onUserCreated: PropTypes.func.isRequired,
};

export default CrearUsuario;