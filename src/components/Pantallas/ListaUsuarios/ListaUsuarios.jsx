import PropTypes from 'prop-types';
import { Table } from 'react-bootstrap';

const ListaUsuarios = ({ users }) => {
    return (
        <div>
            <h3>Usuarios Registrados</h3>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Email</th>
                        <th>Estado</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user.id}>
                            <td>{user.id}</td>
                            <td>{user.firstName} {user.lastName}</td>
                            <td>{user.email}</td>
                            <td>{user.status ? 'Activo' : 'No activo'}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
};

ListaUsuarios.propTypes = {
    users: PropTypes.array.isRequired,
};

export default ListaUsuarios;
