import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Card, Button, Modal, Form, Alert } from 'react-bootstrap';

const ListaUsuarios = () => {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        username: '',
        email: '',
        rango: '', // Nuevo campo para el rango del usuario
        status: false, // Nuevo campo para el estado del usuario
    });
    const [alertMessage, setAlertMessage] = useState('');
    const [showAlert, setShowAlert] = useState(false);
    const [alertType, setAlertType] = useState('success'); // 'success' or 'danger'

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const accessToken = localStorage.getItem('accessToken');
                const response = await fetch('http://localhost:8000/users', {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });
                if (!response.ok) {
                    throw new Error('Error al obtener usuarios');
                }
                const data = await response.json();
                setUsers(data);
            } catch (error) {
                setError(error.message);
            }
        };

        fetchUsers();
    }, []);

    const handleDeleteUser = async (userId) => {
        try {
            const accessToken = localStorage.getItem('accessToken');
            const response = await fetch(`http://localhost:8000/users/${userId}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            if (!response.ok) {
                throw new Error('Error al eliminar usuario');
            }
            // Actualizar la lista de usuarios después de eliminar
            const deletedUser = users.find(user => user.id === userId);
            setUsers(users.filter(user => user.id !== userId));
            setAlertMessage(`Se eliminó "${deletedUser.username}" correctamente.`);
            setShowAlert(true);
            setAlertType('success');
        } catch (error) {
            setError(error.message);
            setAlertMessage('Error al eliminar usuario.');
            setShowAlert(true);
            setAlertType('danger');
        }
    };

    const handleModifyUser = (user) => {
        setSelectedUser(user);
        setFormData({
            firstName: user.firstName,
            lastName: user.lastName,
            username: user.username,
            email: user.email,
            rango: user.rango, // Actualizar el estado del formulario con el rango actual del usuario
            status: user.status, // Actualizar el estado del formulario con el estado actual del usuario
        });
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedUser(null);
        setFormData({
            firstName: '',
            lastName: '',
            username: '',
            email: '',
            rango: '', // Reiniciar el rango a su valor inicial
            status: false, // Reiniciar el estado a su valor inicial
        });
    };

    const handleChange = (e) => {
        if (e.target.name === 'status') {
            // Manejar cambios en el estado
            setFormData({
                ...formData,
                status: e.target.checked, // Guardar el estado como booleano
            });
        } else {
            // Otros cambios de formulario
            setFormData({
                ...formData,
                [e.target.name]: e.target.value,
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const accessToken = localStorage.getItem('accessToken');
            const response = await fetch(`http://localhost:8000/users/${selectedUser.id}`, {
                method: 'PATCH', // or 'PUT'
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify(formData),
            });
            if (!response.ok) {
                throw new Error('Error al modificar usuario');
            }
            // Actualizar la lista de usuarios después de modificar
            const updatedUser = await response.json();
            setUsers(users.map(user => user.id === updatedUser.id ? updatedUser : user));
            handleCloseModal();
            setAlertMessage(`Se modificó "${updatedUser.username}" correctamente.`);
            setShowAlert(true);
            setAlertType('success');
        } catch (error) {
            setError(error.message);
            setAlertMessage('Error al modificar usuario.');
            setShowAlert(true);
            setAlertType('danger');
        }
    };

    return (
        <div className="lista-usuarios-container">
            {error && <Alert variant="danger">{error}</Alert>}
            {showAlert && <Alert variant={alertType}>{alertMessage}</Alert>}
            {users.map((user) => (
                <Card key={user.id} style={{ width: '18rem', margin: '10px' }}>
                    <Card.Body>
                        <Card.Title>{user.firstName} {user.lastName}</Card.Title>
                        <Card.Text>
                            <strong>Username:</strong> {user.username} <br />
                            <strong>Email:</strong> {user.email} <br />
                            <strong>Rango:</strong> {user.rango} <br />
                            <strong>Status:</strong> {user.status ? 'Activo' : 'Inactivo'}
                        </Card.Text>
                        <Button variant="primary" onClick={() => handleDeleteUser(user.id)}>Eliminar</Button>
                        <Button variant="info" onClick={() => handleModifyUser(user)}>Modificar</Button>
                    </Card.Body>
                </Card>
            ))}

            {/* Modal para modificar usuario */}
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Modificar Usuario</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="formFirstName">
                            <Form.Label>First Name</Form.Label>
                            <Form.Control
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="formLastName">
                            <Form.Label>Last Name</Form.Label>
                            <Form.Control
                                type="text"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="formUsername">
                            <Form.Label>Username</Form.Label>
                            <Form.Control
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="formEmail">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="formRango">
                            <Form.Label>Rango</Form.Label>
                            <Form.Control
                                as="select"
                                name="rango"
                                value={formData.rango}
                                onChange={handleChange}
                                required
                            >
                                <option value="cliente">Cliente</option>
                                <option value="vendedor">Vendedor</option>
                                <option value="admin">Administrador</option>
                            </Form.Control>
                        </Form.Group>
                        <Form.Group controlId="formStatus">
                            <Form.Check
                                type="checkbox"
                                name="status"
                                label="Activo"
                                checked={formData.status}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit">Guardar Cambios</Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    );
};

ListaUsuarios.propTypes = {
    user: PropTypes.shape({
        id: PropTypes.number.isRequired,
        firstName: PropTypes.string.isRequired,
        lastName: PropTypes.string.isRequired,
        username: PropTypes.string.isRequired,
        email: PropTypes.string.isRequired,
        rango: PropTypes.string.isRequired,
        status: PropTypes.bool.isRequired,
    }),
};

export default ListaUsuarios;