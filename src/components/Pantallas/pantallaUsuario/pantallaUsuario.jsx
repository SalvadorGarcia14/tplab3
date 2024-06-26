import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Button, Card } from 'react-bootstrap';
import CrearUsuario from '../CrearUsuario/crearUsuario';
import AgregarProducto from '../AgregarProducto/AgregarProducto';

const PantallaUsuario = ({ user }) => {
    const [showCreateUser, setShowCreateUser] = useState(false);
    const [showAddProduct, setShowAddProduct] = useState(false);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        // Solo cargar datos de usuarios si el usuario actual es admin
        if (user && user.rango === 'admin') {
            fetch('http://localhost:8000/users')
                .then(response => response.json())
                .then(userData => {
                    setUsers(userData);
                })
                .catch(error => {
                    console.error('Error al cargar usuarios:', error);
                });
        }
    }, [user]);

    const handleUserCreated = (newUser) => {
        console.log('Usuario creado:', newUser);
        setUsers([...users, newUser]);
    };

    const handleProductAdded = (newProduct) => {
        console.log('Producto agregado:', newProduct);
    };

    const handleRemoveUser = (userId) => {
        // Eliminar usuario del backend y actualizar el estado local
        fetch(`http://localhost:8000/users/${userId}`, {
            method: 'DELETE',
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error al eliminar usuario');
                }
                // Filtrar los usuarios para quitar el usuario eliminado
                const updatedUsers = users.filter(u => u.id !== userId);
                setUsers(updatedUsers);
            })
            .catch(error => {
                console.error('Error al eliminar usuario:', error);
            });
    };

    return (
        <div>
            <h2>Pantalla de Usuario</h2>
            {user ? (
                <div>
                    <p>Nombre: {user.firstName} {user.lastName}</p>
                    <p>Username: {user.username}</p>
                    <p>Email: {user.email}</p>
                    {(user.rango === 'admin' || user.rango === 'vendedor') && (
                        <p>Rango: {user.rango}</p>
                    )}
                    {user.rango === 'admin' && (
                        <Card className="mt-3">
                            <Card.Header>Usuarios Registrados</Card.Header>
                            <Card.Body>
                                {users.map(u => (
                                    <Card key={u.id} className="mb-2">
                                        <Card.Body>
                                            <Card.Title>{u.firstName} {u.lastName}</Card.Title>
                                            <Card.Text>
                                                <strong>Username:</strong> {u.username}<br />
                                                <strong>Email:</strong> {u.email}<br />
                                                <strong>Status:</strong> {u.status ? 'Activo' : 'Inactivo'}
                                            </Card.Text>
                                            <Button variant="danger" onClick={() => handleRemoveUser(u.id)}>
                                                Eliminar Usuario
                                            </Button>
                                        </Card.Body>
                                    </Card>
                                ))}
                            </Card.Body>
                        </Card>
                    )}
                    {user.rango === 'admin' && (
                        <>
                            <Button onClick={() => setShowCreateUser(!showCreateUser)}>
                                {showCreateUser ? 'Ocultar Crear Usuario' : 'Crear Usuario'}
                            </Button>
                            {showCreateUser && <CrearUsuario onUserCreated={handleUserCreated} />}
                        </>
                    )}
                    {(user.rango === 'admin' || user.rango === 'vendedor') && (
                        <>
                            <Button onClick={() => setShowAddProduct(!showAddProduct)}>
                                {showAddProduct ? 'Ocultar Agregar Producto' : 'Agregar Producto'}
                            </Button>
                            {showAddProduct && <AgregarProducto onProductAdded={handleProductAdded} />}
                        </>
                    )}
                </div>
            ) : (
                <p>No hay usuario logueado.</p>
            )}
        </div>
    );
};

PantallaUsuario.propTypes = {
    user: PropTypes.object,
};

export default PantallaUsuario;
