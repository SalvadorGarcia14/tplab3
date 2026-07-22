import { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Form, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Registrar from '../Login/Registrar/Registrar'; // Importa el componente Registrar
import "./Login.css";

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
        // Puede guardar userData en tu estado local si lo necesitas
        console.log('Usuario registrado:', userData);
        navigate('/'); // Por ejemplo, navega al Dashboard después del registro exitoso
    };

    const accessToken = localStorage.getItem('accessToken');

    return (

        <section className="login-page">

            <div className="login-card">

                <div className="login-header">

                    <h2>Iniciar sesión</h2>

                    <p>
                        Accede a tu cuenta para comprar y administrar tus pedidos.
                    </p>

                </div>

                {error && (

                    <Alert
                        variant="danger"
                        className="login-alert"
                    >

                        {error}

                    </Alert>

                )}

                <Form
                    className="login-form"
                    onSubmit={handleSubmitLogin}
                >

                    <Form.Group className="form-group">

                        <Form.Label>

                            Nombre de usuario

                        </Form.Label>

                        <Form.Control
                            type="text"
                            placeholder="Ingresa tu usuario"
                            value={username}
                            onChange={(e) =>
                                setUsername(e.target.value)
                            }
                            required
                        />

                    </Form.Group>

                    <Form.Group className="form-group">

                        <Form.Label>

                            Contraseña

                        </Form.Label>

                        <Form.Control
                            type="password"
                            placeholder="Ingresa tu contraseña"
                            value={password}
                            onChange={(e) =>
                                setPassword(e.target.value)
                            }
                            required
                        />

                    </Form.Group>

                    <Button
                        type="submit"
                        className="login-button"
                    >

                        Iniciar sesión

                    </Button>

                </Form>

                <div className="register-section">

                    {accessToken ? (

                        <Registrar
                            accessToken={accessToken}
                            onUserRegistered={
                                handleUserRegistered
                            }
                        />

                    ) : (

                        <Alert
                            variant="warning"
                            className="register-alert"
                        >

                            Inicia sesión para registrar nuevos usuarios.

                        </Alert>

                    )}

                </div>

            </div>

        </section>

    );
};

Login.propTypes = {
    onLogin: PropTypes.func.isRequired,
};

export default Login;