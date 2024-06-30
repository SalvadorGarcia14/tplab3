import { useState, useEffect } from 'react';
import { Card } from 'react-bootstrap';
import PropTypes from 'prop-types';

const ListaUsuarios = ({ user }) => {
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

    return (
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
                            {/* Aquí puedes agregar más detalles si es necesario */}
                        </Card.Body>
                    </Card>
                ))}
            </Card.Body>
        </Card>
    );
};

ListaUsuarios.propTypes = {
    user: PropTypes.shape({
        rango: PropTypes.string.isRequired,
    }).isRequired,
};

export default ListaUsuarios;
