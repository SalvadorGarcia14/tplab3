import { useState } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';
import CrearUsuario from '../CrearUsuario/crearUsuario';
import AgregarProducto from '../AgregarProducto/AgregarProducto';

const PantallaUsuario = ({ user }) => {
    const [showCreateUser, setShowCreateUser] = useState(false);
    const [showAddProduct, setShowAddProduct] = useState(false);

    const handleUserCreated = (newUser) => {
        console.log('Usuario creado:', newUser);
    };

    const handleProductAdded = (newProduct) => {
        console.log('Producto agregado:', newProduct);
    };

    return (
        <div>
            <h2>Pantalla de Usuario</h2>
            {user ? (
                <div>
                    <p>Nombre: {user.firstName} {user.lastName}</p>
                    <p>Email: {user.email}</p>
                    <p>Rango: {user.rango}</p> {/* Mostrar el rango del usuario */}
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
