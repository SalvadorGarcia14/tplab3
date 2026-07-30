
import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Card, Button, Form, Alert } from 'react-bootstrap';
import './ListaUsuarios.css';

const ListaUsuarios = () => {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState(null);

    // Usuario que se está modificando
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

    /* =====================================================
       CARGAR USUARIOS
    ===================================================== */

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const accessToken = localStorage.getItem('accessToken');

                if (!accessToken) {
                    throw new Error('No se encontró el token de acceso');
                }

                const response = await fetch(
                    'http://localhost:8000/users',
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                    }
                );

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


    /* =====================================================
       ELIMINAR USUARIO
    ===================================================== */

    const handleDeleteUser = async (userId) => {

        try {

            const accessToken =
                localStorage.getItem('accessToken');

            const response = await fetch(
                `http://localhost:8000/users/${userId}`,
                {
                    method: 'DELETE',
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );

            if (!response.ok) {
                throw new Error('Error al eliminar usuario');
            }

            const deletedUser =
                users.find(user => user.id === userId);

            setUsers(
                users.filter(user => user.id !== userId)
            );

            // Si justamente estaba siendo modificado,
            // cerramos el formulario.
            if (
                selectedUser &&
                selectedUser.id === userId
            ) {
                handleCloseModify();
            }

            setAlertMessage(
                `Se eliminó "${deletedUser.username}" correctamente.`
            );

            setShowAlert(true);
            setAlertType('success');

        } catch (error) {

            setError(error.message);

            setAlertMessage(
                'Error al eliminar usuario.'
            );

            setShowAlert(true);
            setAlertType('danger');
        }
    };


    /* =====================================================
       ABRIR MODIFICAR
    ===================================================== */

    const handleModifyUser = (user) => {

        // Si se vuelve a presionar "Modificar"
        // sobre el mismo usuario, cerramos.
        if (
            selectedUser &&
            selectedUser.id === user.id
        ) {
            handleCloseModify();
            return;
        }

        setSelectedUser(user);

        setFormData({
            firstName: user.firstName || '',
            lastName: user.lastName || '',
            username: user.username || '',
            email: user.email || '',
            rango: user.rango || '',
            status: user.status || false,
        });
    };


    /* =====================================================
       CERRAR MODIFICACIÓN
    ===================================================== */

    const handleCloseModify = () => {

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


    /* =====================================================
       CAMBIAR FORMULARIO
    ===================================================== */

    const handleChange = (e) => {

        const { name, value, type, checked } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox'
                ? checked
                : value,
        }));
    };


    /* =====================================================
       GUARDAR CAMBIOS
    ===================================================== */

    const handleSubmit = async (e) => {

        e.preventDefault();

        if (!selectedUser) {
            return;
        }

        try {

            const accessToken =
                localStorage.getItem('accessToken');

            const response = await fetch(
                `http://localhost:8000/users/${selectedUser.id}`,
                {
                    method: 'PATCH',

                    headers: {
                        'Content-Type': 'application/json',
                        Authorization:
                            `Bearer ${accessToken}`,
                    },

                    body: JSON.stringify(formData),
                }
            );

            if (!response.ok) {
                throw new Error(
                    'Error al modificar usuario'
                );
            }

            const updatedUser =
                await response.json();

            setUsers(prevUsers =>
                prevUsers.map(user =>
                    user.id === updatedUser.id
                        ? updatedUser
                        : user
                )
            );

            setAlertMessage(
                `Se modificó "${updatedUser.username}" correctamente.`
            );

            setShowAlert(true);
            setAlertType('success');

            handleCloseModify();

        } catch (error) {

            setError(error.message);

            setAlertMessage(
                'Error al modificar usuario.'
            );

            setShowAlert(true);
            setAlertType('danger');
        }
    };


    /* =====================================================
       RENDER
    ===================================================== */

    return (

        <div className="lista-usuarios-container">

            {/* ERROR */}

            {error && (
                <Alert
                    variant="danger"
                    onClose={() => setError(null)}
                    dismissible
                >
                    {error}
                </Alert>
            )}


            {/* FEEDBACK */}

            {showAlert && (
                <Alert
                    variant={alertType}
                    onClose={() => setShowAlert(false)}
                    dismissible
                >
                    {alertMessage}
                </Alert>
            )}


            {/* TITULO */}

            <div className="lista-usuarios-header">

                <div>
                    <h2>Lista de Usuarios</h2>

                    <p>
                        Administrá la información y el estado
                        de los usuarios registrados.
                    </p>
                </div>

                <span className="usuarios-count">
                    {users.length}{' '}
                    {users.length === 1
                        ? 'usuario'
                        : 'usuarios'}
                </span>

            </div>


            {/* LISTA */}

            <div className="usuarios-list">

                {users.map(user => {

                    const isEditing =
                        selectedUser?.id === user.id;

                    return (

                        <Card
                            key={user.id}
                            className={`usuario-card ${
                                isEditing
                                    ? 'usuario-card-editando'
                                    : ''
                            }`}
                        >

                            <Card.Body>

                                {/* =================================
                                   HEADER USUARIO
                                ================================= */}

                                <div className="usuario-card-header">

                                    <div className="usuario-identidad">

                                        <div className="usuario-avatar">
                                            {user.username
                                                ?.charAt(0)
                                                .toUpperCase()}
                                        </div>

                                        <div>

                                            <Card.Title>
                                                {user.username}
                                            </Card.Title>

                                            <span className="usuario-email">
                                                {user.email}
                                            </span>

                                        </div>

                                    </div>


                                    {/* ESTADO */}

                                    <span
                                        className={
                                            user.status
                                                ? 'usuario-status activo'
                                                : 'usuario-status inactivo'
                                        }
                                    >
                                        <span className="status-dot"></span>

                                        {user.status
                                            ? 'Activo'
                                            : 'Inactivo'}
                                    </span>

                                </div>


                                {/* =================================
                                   DATOS
                                ================================= */}

                                <Card.Text className="usuario-datos">

                                    <span>

                                        <small>
                                            Nombre completo
                                        </small>

                                        <strong>
                                            {user.firstName}{' '}
                                            {user.lastName}
                                        </strong>

                                    </span>


                                    <span>

                                        <small>
                                            Email
                                        </small>

                                        <strong>
                                            {user.email}
                                        </strong>

                                    </span>


                                    <span>

                                        <small>
                                            Rango
                                        </small>

                                        <strong className="usuario-rango">
                                            {user.rango}
                                        </strong>

                                    </span>


                                    <span>

                                        <small>
                                            Estado
                                        </small>

                                        <strong
                                            className={
                                                user.status
                                                    ? 'usuario-activo'
                                                    : 'usuario-inactivo'
                                            }
                                        >
                                            {user.status
                                                ? 'Activo'
                                                : 'Inactivo'}
                                        </strong>

                                    </span>

                                </Card.Text>


                                {/* =================================
                                   BOTONES
                                ================================= */}

                                <div className="usuario-actions">

                                    <Button
                                        variant="danger"
                                        className="btn-eliminar-usuario"
                                        onClick={() =>
                                            handleDeleteUser(user.id)
                                        }
                                    >
                                        🗑 Eliminar
                                    </Button>


                                    <Button
                                        variant="primary"
                                        className="btn-modificar-usuario"
                                        onClick={() =>
                                            handleModifyUser(user)
                                        }
                                    >
                                        {isEditing
                                            ? '✕ Cerrar'
                                            : '✎ Modificar'}
                                    </Button>

                                </div>


                                {/* =================================
                                   PANEL DE MODIFICACIÓN
                                ================================= */}

                                {isEditing && (

                                    <div className="usuario-edit-panel">

                                        {/* HEADER */}

                                        <div className="usuario-edit-header">

                                            <div className="usuario-edit-icon">
                                                ✎
                                            </div>

                                            <div>

                                                <h3>
                                                    Modificar usuario
                                                </h3>

                                                <p>
                                                    Editando información de{' '}
                                                    <strong>
                                                        {user.username}
                                                    </strong>
                                                </p>

                                            </div>

                                        </div>


                                        {/* FORMULARIO */}

                                        <Form
                                            className="usuario-edit-form"
                                            onSubmit={handleSubmit}
                                        >

                                            <div className="usuario-form-grid">

                                                {/* NOMBRE */}

                                                <Form.Group>
                                                    <Form.Label>
                                                        Nombre
                                                    </Form.Label>

                                                    <Form.Control
                                                        type="text"
                                                        name="firstName"
                                                        value={
                                                            formData.firstName
                                                        }
                                                        onChange={
                                                            handleChange
                                                        }
                                                        required
                                                    />
                                                </Form.Group>


                                                {/* APELLIDO */}

                                                <Form.Group>
                                                    <Form.Label>
                                                        Apellido
                                                    </Form.Label>

                                                    <Form.Control
                                                        type="text"
                                                        name="lastName"
                                                        value={
                                                            formData.lastName
                                                        }
                                                        onChange={
                                                            handleChange
                                                        }
                                                        required
                                                    />
                                                </Form.Group>


                                                {/* USERNAME */}

                                                <Form.Group>
                                                    <Form.Label>
                                                        Username
                                                    </Form.Label>

                                                    <Form.Control
                                                        type="text"
                                                        name="username"
                                                        value={
                                                            formData.username
                                                        }
                                                        onChange={
                                                            handleChange
                                                        }
                                                        required
                                                    />
                                                </Form.Group>


                                                {/* EMAIL */}

                                                <Form.Group>
                                                    <Form.Label>
                                                        Email
                                                    </Form.Label>

                                                    <Form.Control
                                                        type="email"
                                                        name="email"
                                                        value={
                                                            formData.email
                                                        }
                                                        onChange={
                                                            handleChange
                                                        }
                                                        required
                                                    />
                                                </Form.Group>


                                                {/* RANGO */}

                                                <Form.Group>

                                                    <Form.Label>
                                                        Rango
                                                    </Form.Label>

                                                    <Form.Select
                                                        name="rango"
                                                        value={
                                                            formData.rango
                                                        }
                                                        onChange={
                                                            handleChange
                                                        }
                                                        required
                                                    >

                                                        <option value="admin">
                                                            Administrador
                                                        </option>

                                                        <option value="vendedor">
                                                            Vendedor
                                                        </option>

                                                        <option value="cliente">
                                                            Cliente
                                                        </option>

                                                    </Form.Select>

                                                </Form.Group>


                                                {/* ESTADO */}

                                                <Form.Group className="usuario-status-field">

                                                    <Form.Label>
                                                        Estado de cuenta
                                                    </Form.Label>

                                                    <div className="usuario-checkbox">

                                                        <Form.Check
                                                            type="checkbox"
                                                            id={`status-${user.id}`}
                                                            name="status"
                                                            checked={
                                                                formData.status
                                                            }
                                                            onChange={
                                                                handleChange
                                                            }
                                                            label={
                                                                formData.status
                                                                    ? 'Usuario activo'
                                                                    : 'Usuario inactivo'
                                                            }
                                                        />

                                                    </div>

                                                </Form.Group>

                                            </div>


                                            {/* BOTONES FORMULARIO */}

                                            <div className="usuario-edit-actions">

                                                <Button
                                                    type="button"
                                                    className="btn-cancelar-edicion"
                                                    onClick={
                                                        handleCloseModify
                                                    }
                                                >
                                                    Cancelar
                                                </Button>


                                                <Button
                                                    type="submit"
                                                    className="btn-guardar-usuario"
                                                >
                                                    ✓ Guardar cambios
                                                </Button>

                                            </div>

                                        </Form>

                                    </div>

                                )}

                            </Card.Body>

                        </Card>

                    );
                })}

            </div>

        </div>
    );
};


ListaUsuarios.propTypes = {
    user: PropTypes.object,
};

export default ListaUsuarios;

