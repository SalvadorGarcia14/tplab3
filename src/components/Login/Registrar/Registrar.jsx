import { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Modal, Form, Alert } from 'react-bootstrap';

const Registrar = ({ onUserRegistered, accessToken }) => {
    const [showModal, setShowModal] = useState(false);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        try {
            // Obtener todos los usuarios para verificar duplicados
            const usersResponse = await fetch('http://localhost:8000/users', {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
            });

            if (!usersResponse.ok) {
                throw new Error('Error al obtener usuarios existentes');
            }

            const users = await usersResponse.json();

            // Verificar si el username o email ya existen
            const isUsernameTaken = users.some(user => user.username === username);
            const isEmailTaken = users.some(user => user.email === email);

            if (isUsernameTaken) {
                setError(`Usuario ya registrado con ese username: ${username}`);
                return;
            }

            if (isEmailTaken) {
                setError(`Email ya registrado con ese email: ${email}`);
                return;
            }

            // Si no hay duplicados, registrar al nuevo usuario
            const response = await fetch('http://localhost:8000/users', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    firstName,
                    lastName,
                    username,
                    email,
                    password,
                    status: true,
                    rango: 'cliente',
                }),
            });

            if (!response.ok) {
                throw new Error('Error al registrar usuario');
            }

            const userData = await response.json();
            onUserRegistered(userData);
            setShowModal(false);
        } catch (error) {
            setError(error.message || 'Error al conectar con la API');
        }
    };

    return (
        <>
            <Button variant="primary" onClick={() => setShowModal(true)}>
                Registrarse
            </Button>

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Registrarse</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="formFirstName">
                            <Form.Label>Nombre</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Ingrese su nombre"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="formLastName">
                            <Form.Label>Apellido</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Ingrese su apellido"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="formUsername">
                            <Form.Label>Nombre de usuario</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Ingrese su nombre de usuario"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="formEmail">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Ingrese su email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="formPassword">
                            <Form.Label>Contraseña</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Ingrese su contraseña"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            Registrar
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    );
};

Registrar.propTypes = {
    onUserRegistered: PropTypes.func.isRequired,
    accessToken: PropTypes.string.isRequired,
};

export default Registrar;