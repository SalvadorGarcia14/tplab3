// ListaUsuarios.jsx

import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Card, Button } from 'react-bootstrap';

const ListaUsuarios = () => {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState(null);

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

    return (
        <div className="lista-usuarios-container">
            {error && <p>Error: {error}</p>}
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
                        {/* Botón de eliminar usuario solo si el usuario logueado es admin */}
                        {user.rango === 'admin' && (
                            <Button variant="danger">
                                Eliminar Usuario
                            </Button>
                        )}
                    </Card.Body>
                </Card>
            ))}
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
