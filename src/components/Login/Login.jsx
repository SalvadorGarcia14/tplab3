import { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Form, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Registrar from '../Login/Registrar/Registrar'; // Importa el componente Registrar

const Login = ({ onLogin }) => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);

    const handleSubmitLogin = async (e) => {
        e.preventDefault();
        setError(null);

        const credentials = btoa(`${username}:${password}`);

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
            localStorage.setItem('accessToken', data.accessToken);

            const usersResponse = await fetch('http://localhost:8000/users', {
                headers: {
                    'Authorization': `Bearer ${data.accessToken}`,
                },
            });

            if (!usersResponse.ok) {
                throw new Error('Error al obtener datos de usuarios');
            }

            const usersData = await usersResponse.json();
            const user = usersData.find(u => u.username === username);

            if (!user) {
                throw new Error('Usuario no encontrado');
            }

            if (!user.status) {
                throw new Error('Usuario no activado. Por favor, contacta al administrador.');
            }

            onLogin(user, data.accessToken); // Pasa el usuario y el token de acceso a onLogin
            navigate('/'); // Navegar al Dashboard después del login exitoso

        } catch (error) {
            setError(error.message || 'Error al conectar con la API');
        }
    };

    const handleUserRegistered = async (userData) => {
        // Aquí puedes implementar la lógica para manejar el registro de usuario
        // Puedes guardar userData en tu estado local si lo necesitas
        console.log('Usuario registrado:', userData);
        // Opcionalmente, puedes redirigir al usuario después de registrarse
        navigate('/'); // Por ejemplo, navega al Dashboard después del registro exitoso
    };

    return (
        <div className="login-container">
            <h2>Iniciar sesión</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={handleSubmitLogin}>
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
            <Registrar accessToken={localStorage.getItem('accessToken')} onUserRegistered={handleUserRegistered} />
            {/* Pasa accessToken y la función handleUserRegistered a Registrar */}
        </div>
    );
};

Login.propTypes = {
    onLogin: PropTypes.func.isRequired,
};

export default Login;