
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';

import CrearUsuario from '../CrearUsuario/crearUsuario';
import AgregarProducto from '../AgregarProducto/AgregarProducto';
import ListaUsuarios from '../ListaUsuarios/ListaUsuarios';
import ListaCompras from '../listaCompra/listaCompra';

import './pantallaUsuario.css';


const PantallaUsuario = ({ user, compras }) => {

    const [showCreateUser, setShowCreateUser] = useState(false);
    const [showAddProduct, setShowAddProduct] = useState(false);
    const [showUserList, setShowUserList] = useState(false);
    const [showCompras, setShowCompras] = useState(false);

    const [users, setUsers] = useState([]);


    // ==========================================
    // CARGAR USUARIOS PARA ADMIN / VENDEDOR
    // ==========================================

    useEffect(() => {

        if (
            user &&
            (
                user.rango === 'admin' ||
                user.rango === 'vendedor'
            )
        ) {

            const accessToken =
                localStorage.getItem('accessToken');

            if (!accessToken) {

                console.error(
                    'No access token found'
                );

                return;
            }


            fetch(
                'http://localhost:8000/users',
                {
                    method: 'GET',

                    headers: {
                        Authorization:
                            `Bearer ${accessToken}`,
                    },
                }
            )
                .then(response => {

                    if (!response.ok) {
                        throw new Error(
                            response.statusText
                        );
                    }

                    return response.json();

                })
                .then(userData => {

                    setUsers(userData);

                })
                .catch(error => {

                    console.error(
                        'Error al cargar usuarios:',
                        error.message
                    );

                });

        }

    }, [user]);


    // ==========================================
    // USUARIO CREADO
    // ==========================================

    const handleUserCreated = (newUser) => {

        console.log(
            'Usuario creado:',
            newUser
        );

        setUsers([
            ...users,
            newUser
        ]);

    };


    // ==========================================
    // PRODUCTO AGREGADO
    // ==========================================

    const handleProductAdded = (newProduct) => {

        console.log(
            'Producto agregado:',
            newProduct
        );

    };


    // ==========================================
    // USUARIO NO AUTENTICADO
    // ==========================================

    if (!user) {

        return (

            <main className="user-page">

                <div className="user-auth-message">

                    <div className="user-auth-icon">
                        🔐
                    </div>

                    <h2>
                        No hay una sesión activa
                    </h2>

                    <p>
                        Iniciá sesión para acceder
                        a tu información personal
                        y a tu historial de compras.
                    </p>

                </div>

            </main>

        );

    }


    // ==========================================
    // RANGO DEL USUARIO
    // ==========================================

    const esAdmin =
        user.rango === 'admin';

    const esVendedor =
        user.rango === 'vendedor';

    const tienePermisos =
        esAdmin || esVendedor;


    return (

        <main className="user-page">

            <div className="user-page-container">


                {/* ================================= */}
                {/* HEADER */}
                {/* ================================= */}

                <header className="user-page-header">

                    <div className="user-page-title">

                        <div className="user-page-icon">
                            👤
                        </div>

                        <div>

                            <h1>
                                Mi cuenta
                            </h1>

                            <p>
                                Gestioná tu información
                                personal y tus compras.
                            </p>

                        </div>

                    </div>

                </header>


                {/* ================================= */}
                {/* INFORMACIÓN + COMPRAS */}
                {/* ================================= */}

                <section className="user-main-grid">


                    {/* ================================= */}
                    {/* INFORMACIÓN PERSONAL */}
                    {/* ================================= */}

                    <article className="user-info-card">

                        <div className="card-section-header">

                            <div className="card-section-icon">
                                👤
                            </div>

                            <div>

                                <h2>
                                    Información personal
                                </h2>

                                <p>
                                    Datos de tu cuenta
                                </p>

                            </div>

                        </div>


                        <div className="user-info-list">


                            <div className="user-info-item">

                                <span className="info-label">
                                    Nombre completo
                                </span>

                                <strong>
                                    {user.firstName}{' '}
                                    {user.lastName}
                                </strong>

                            </div>


                            <div className="user-info-item">

                                <span className="info-label">
                                    Nombre de usuario
                                </span>

                                <strong>
                                    @{user.username}
                                </strong>

                            </div>


                            <div className="user-info-item">

                                <span className="info-label">
                                    Correo electrónico
                                </span>

                                <strong className="user-email">
                                    {user.email}
                                </strong>

                            </div>


                            {tienePermisos && (

                                <div className="user-info-item">

                                    <span className="info-label">
                                        Tipo de cuenta
                                    </span>

                                    <span
                                        className={
                                            `user-role-badge ${esAdmin
                                                ? 'role-admin'
                                                : 'role-seller'
                                            }`
                                        }
                                    >
                                        {esAdmin
                                            ? 'Administrador'
                                            : 'Vendedor'}
                                    </span>

                                </div>

                            )}

                        </div>

                    </article>


                    {/* ================================= */}
                    {/* MIS COMPRAS */}
                    {/* ================================= */}

                    <article className="user-purchases-card">

                        <div className="card-section-header">

                            <div className="card-section-icon purchase-icon">
                                📦
                            </div>

                            <div>

                                <h2>
                                    Mis compras
                                </h2>

                                <p>
                                    Consultá tu historial
                                    de pedidos.
                                </p>

                            </div>

                        </div>


                        <div className="purchase-summary">

                            <div className="purchase-summary-number">
                                {compras.length}
                            </div>

                            <div>

                                <strong>
                                    {compras.length === 1
                                        ? 'Compra realizada'
                                        : 'Compras realizadas'}
                                </strong>

                                <span>
                                    Historial disponible
                                </span>

                            </div>

                        </div>


                        <Button
                            className="user-primary-button"
                            onClick={() =>
                                setShowCompras(
                                    !showCompras
                                )
                            }
                        >

                            <span>
                                {showCompras
                                    ? 'Ocultar mis compras'
                                    : 'Ver mis compras'}
                            </span>

                            <span className="button-arrow">
                                {showCompras
                                    ? '↑'
                                    : '→'}
                            </span>

                        </Button>

                    </article>

                </section>


                {/* ================================= */}
                {/* HISTORIAL DE COMPRAS */}
                {/* ================================= */}

                {showCompras && (

                    <section className="user-purchases-section">

                        <div className="section-title">

                            <div>

                                <span className="section-eyebrow">
                                    HISTORIAL
                                </span>

                                <h2>
                                    Mis compras
                                </h2>

                                <p>
                                    Aquí podés consultar
                                    todos tus pedidos
                                    realizados.
                                </p>

                            </div>

                        </div>


                        <div className="purchases-container">

                            <ListaCompras
                                compras={compras}
                            />

                        </div>

                    </section>

                )}


                {/* ================================= */}
                {/* ADMINISTRACIÓN */}
                {/* ================================= */}

                {tienePermisos && (

                    <section className="admin-section">

                        <div className="section-title">

                            <div>

                                <span className="section-eyebrow">
                                    {esAdmin
                                        ? 'ADMINISTRACIÓN'
                                        : 'GESTIÓN'}
                                </span>

                                <h2>
                                    Herramientas
                                </h2>

                                <p>
                                    Accedé a las funciones
                                    disponibles para tu
                                    cuenta.
                                </p>

                            </div>

                        </div>


                        <div className="admin-tools">


                            {/* ================================= */}
                            {/* LISTA USUARIOS */}
                            {/* ================================= */}

                            {esAdmin && (

                                <article className="admin-tool-card">

                                    <div className="admin-tool-icon">
                                        👥
                                    </div>

                                    <div className="admin-tool-content">

                                        <h3>
                                            Usuarios
                                        </h3>

                                        <p>
                                            Consultá y gestioná
                                            los usuarios registrados.
                                        </p>

                                    </div>

                                    <Button
                                        className="admin-tool-button"
                                        onClick={() =>
                                            setShowUserList(
                                                !showUserList
                                            )
                                        }
                                    >
                                        {showUserList
                                            ? 'Ocultar'
                                            : 'Ver usuarios'}
                                    </Button>

                                </article>

                            )}


                            {/* ================================= */}
                            {/* CREAR USUARIO */}
                            {/* ================================= */}

                            {esAdmin && (

                                <article className="admin-tool-card">

                                    <div className="admin-tool-icon">
                                        ➕
                                    </div>

                                    <div className="admin-tool-content">

                                        <h3>
                                            Crear usuario
                                        </h3>

                                        <p>
                                            Registrá un nuevo
                                            usuario en el sistema.
                                        </p>

                                    </div>

                                    <Button
                                        className="admin-tool-button"
                                        onClick={() =>
                                            setShowCreateUser(
                                                !showCreateUser
                                            )
                                        }
                                    >
                                        {showCreateUser
                                            ? 'Ocultar'
                                            : 'Crear usuario'}
                                    </Button>

                                </article>

                            )}


                            {/* ================================= */}
                            {/* AGREGAR PRODUCTO */}
                            {/* ================================= */}

                            <article className="admin-tool-card">

                                <div className="admin-tool-icon">
                                    🛒
                                </div>

                                <div className="admin-tool-content">

                                    <h3>
                                        Agregar producto
                                    </h3>

                                    <p>
                                        Incorporá nuevos productos
                                        al catálogo.
                                    </p>

                                </div>

                                <Button
                                    className="admin-tool-button"
                                    onClick={() =>
                                        setShowAddProduct(
                                            !showAddProduct
                                        )
                                    }
                                >
                                    {showAddProduct
                                        ? 'Ocultar'
                                        : 'Agregar producto'}
                                </Button>

                            </article>


                        </div>


                        {/* ================================= */}
                        {/* LISTA DE USUARIOS */}
                        {/* ================================= */}

                        {showUserList && esAdmin && (

                            <div className="admin-expanded-content">

                                <ListaUsuarios
                                    user={user}
                                />

                            </div>

                        )}


                        {/* ================================= */}
                        {/* CREAR USUARIO */}
                        {/* ================================= */}

                        {showCreateUser && esAdmin && (

                            <div className="admin-expanded-content">

                                <CrearUsuario
                                    onUserCreated={
                                        handleUserCreated
                                    }
                                />

                            </div>

                        )}


                        {/* ================================= */}
                        {/* AGREGAR PRODUCTO */}
                        {/* ================================= */}

                        {showAddProduct && (

                            <div className="admin-expanded-content">

                                <AgregarProducto
                                    onProductAdded={
                                        handleProductAdded
                                    }
                                />

                            </div>

                        )}

                    </section>

                )}

            </div>

        </main>

    );

};


PantallaUsuario.propTypes = {

    user: PropTypes.object,

    compras: PropTypes.array.isRequired,

};


export default PantallaUsuario;

