import { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Form, Alert } from 'react-bootstrap';

const Login = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        const credentials = btoa(`${username}:${password}`); // Codificar credenciales en base64

        try {
            const response = await fetch('http://localhost:8000/login', {
                method: 'POST',
                headers: {
                    'Authorization': `Basic ${credentials}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            if (!response.ok) {
                throw new Error('Nombre de usuario o contraseña incorrectos');
            }

            const data = await response.json();

            // Almacena el token de acceso en localStorage
            localStorage.setItem('accessToken', data.accessToken);

            // Realiza la solicitud GET a /users con el token de acceso
            const usersResponse = await fetch('http://localhost:8000/users', {
                headers: {
                    Authorization: `Bearer ${data.accessToken}`,
                },
            });

            if (!usersResponse.ok) {
                throw new Error('Error al obtener datos de usuarios');
            }

            const usersData = await usersResponse.json();
            // Aquí puedes manejar la respuesta de usuarios, por ejemplo, llamando a onLogin con los datos recibidos
            onLogin(usersData);

        } catch (error) {
            setError(error.message || 'Error al conectar con la API');
        }
    };

    return (
        <div className="login-container">
            <h2>Iniciar sesión</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={handleSubmit}>
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
                <Button variant="primary" type="submit">
                    Iniciar sesión
                </Button>
            </Form>
        </div>
    );
};

Login.propTypes = {
    onLogin: PropTypes.func.isRequired,
};

export default Login;