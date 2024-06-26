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
            const response = await fetch('http://localhost:8000/users', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken}`, // Incluye el token en los encabezados
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ firstName, lastName, username, password, email, status }),
            });

            if (!response.ok) {
                throw new Error('Error al crear el usuario');
            }

            const data = await response.json();
            onUserCreated(data);

        } catch (error) {
            setError(error.message || 'Error al conectar con la API');
        }
    };

    return (
        <div className="crear-usuario-container">
            <h2>Crear Usuario</h2>
            {error && <Alert variant="danger">{error}</Alert>}
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