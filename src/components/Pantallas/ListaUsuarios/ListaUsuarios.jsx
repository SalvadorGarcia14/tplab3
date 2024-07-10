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
        rango: '',
        status: false,
    });
    const [alertMessage, setAlertMessage] = useState('');
    const [showAlert, setShowAlert] = useState(false);
    const [alertType, setAlertType] = useState('success');

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const accessToken = localStorage.getItem('accessToken');
                if (!accessToken) {
                    throw new Error('No access token found');
                }

                const response = await fetch('http://localhost:8000/users', {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });
                if (!response.ok) {
                    throw new Error(response.statusText);
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
            rango: user.rango,
            status: user.status,
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
            rango: '',
            status: false,
        });
    };

    const handleChange = (e) => {
        if (e.target.name === 'status') {
            setFormData({
                ...formData,
                status: e.target.checked,
            });
        } else {
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
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify(formData),
            });
            if (!response.ok) {
                throw new Error('Error al modificar usuario');
            }
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
            {showAlert && <Alert variant={alertType} onClose={() => setShowAlert(false)} dismissible>{alertMessage}</Alert>}
            <h2>Lista de Usuarios</h2>
            {users.map(user => (
                <Card key={user.id} className="mb-3">
                    <Card.Body>
                        <Card.Title>{user.username}</Card.Title>
                        <Card.Text>
                            Nombre: {user.firstName} {user.lastName}<br />
                            Email: {user.email}<br />
                            Rango: {user.rango}<br />
                            Estado: {user.status ? 'Activo' : 'Inactivo'}
                        </Card.Text>
                        <Button variant="danger" onClick={() => handleDeleteUser(user.id)}>Eliminar</Button>
                        <Button variant="primary" onClick={() => handleModifyUser(user)}>Modificar</Button>
                    </Card.Body>
                </Card>
            ))}
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Modificar Usuario</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="formFirstName">
                            <Form.Label>Nombre</Form.Label>
                            <Form.Control
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="formLastName">
                            <Form.Label>Apellido</Form.Label>
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
                                <option value="admin">Admin</option>
                                <option value="vendedor">Vendedor</option>
                                <option value="cliente">Cliente</option>
                            </Form.Control>
                        </Form.Group>
                        <Form.Group controlId="formStatus">
                            <Form.Check
                                type="checkbox"
                                label="Activo"
                                name="status"
                                checked={formData.status}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            Guardar Cambios
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    );
};

ListaUsuarios.propTypes = {
    user: PropTypes.object,
};

export default ListaUsuarios;