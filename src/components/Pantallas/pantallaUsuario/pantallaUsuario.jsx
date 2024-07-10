import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';
import CrearUsuario from '../CrearUsuario/crearUsuario';
import AgregarProducto from '../AgregarProducto/AgregarProducto';
import ListaUsuarios from '../ListaUsuarios/ListaUsuarios';
import ListaCompras from '../listaCompra/listaCompra';

const PantallaUsuario = ({ user, compras }) => {
    const [showCreateUser, setShowCreateUser] = useState(false);
    const [showAddProduct, setShowAddProduct] = useState(false);
    const [showUserList, setShowUserList] = useState(false);
    const [showCompras, setShowCompras] = useState(false);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        if (user && (user.rango === 'admin' || user.rango === 'vendedor')) {
            const accessToken = localStorage.getItem('accessToken');
            if (!accessToken) {
                console.error('No access token found');
                return;
            }

            fetch('http://localhost:8000/users', {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error(response.statusText);
                    }
                    return response.json();
                })
                .then(userData => {
                    setUsers(userData);
                })
                .catch(error => {
                    console.error('Error al cargar usuarios:', error.message);
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
                    <Button onClick={() => setShowCompras(!showCompras)}>
                        {showCompras ? 'Ocultar Mis Compras' : 'Mostrar Mis Compras'}
                    </Button>
                    {showCompras && <ListaCompras compras={compras} />}
                    {user.rango === 'admin' && (
                        <>
                            <Button onClick={() => setShowUserList(!showUserList)}>
                                {showUserList ? 'Ocultar Lista de Usuarios' : 'Mostrar Lista de Usuarios'}
                            </Button>
                            {showUserList && <ListaUsuarios user={user} />}
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
                <p>No hay usuario autenticado</p>
            )}
        </div>
    );
};

PantallaUsuario.propTypes = {
    user: PropTypes.object,
    compras: PropTypes.array.isRequired,
};

export default PantallaUsuario;