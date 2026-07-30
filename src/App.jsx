
import { useState, useEffect } from "react";
import {
    BrowserRouter as Router,
    Route,
    Routes,
} from "react-router-dom";

import NavBar from "./components/NavBar/Navbar";
import Dashboard from "./components/dashBoard/dashBoard";
import Login from "./components/Login/Login";
import PantallaUsuario from "./components/Pantallas/pantallaUsuario/pantallaUsuario";
import PantallaCarrito from "./components/Pantallas/pantallaCarrito/pantallaCarrito";

import "./App.css";

const App = () => {

    // ==========================================
    // ESTADOS PRINCIPALES
    // ==========================================

    const [user, setUser] = useState(null);

    const [searchValue, setSearchValue] = useState("");

    const [carrito, setCarrito] = useState([]);

    const [compras, setCompras] = useState([]);

    const [cartNotification, setCartNotification] = useState({
        visible: false,
        product: "",
    });


    // ==========================================
    // CARGAR USUARIO AL INICIAR LA APLICACIÓN
    // ==========================================

    useEffect(() => {

        const savedUser = localStorage.getItem("user");

        if (!savedUser) {
            return;
        }

        try {

            const parsedUser = JSON.parse(savedUser);

            setUser(parsedUser);

            // --------------------------------------
            // CARGAR CARRITO DEL USUARIO
            // --------------------------------------

            const savedCarrito = localStorage.getItem(
                `carrito_${parsedUser.username}`
            );

            setCarrito(
                savedCarrito
                    ? JSON.parse(savedCarrito)
                    : []
            );

            // --------------------------------------
            // CARGAR COMPRAS DEL USUARIO
            // --------------------------------------

            const savedCompras = localStorage.getItem(
                `compras_${parsedUser.username}`
            );

            setCompras(
                savedCompras
                    ? JSON.parse(savedCompras)
                    : []
            );

        } catch (error) {

            console.error(
                "Error al recuperar los datos del usuario:",
                error
            );

            localStorage.removeItem("user");

            setUser(null);
            setCarrito([]);
            setCompras([]);

        }

    }, []);


    // ==========================================
    // GUARDAR CARRITO EN LOCALSTORAGE
    // ==========================================

    useEffect(() => {

        if (!user) {
            return;
        }

        localStorage.setItem(
            `carrito_${user.username}`,
            JSON.stringify(carrito)
        );

    }, [carrito, user]);


    // ==========================================
    // GUARDAR COMPRAS EN LOCALSTORAGE
    // ==========================================

    useEffect(() => {

        if (!user) {
            return;
        }

        localStorage.setItem(
            `compras_${user.username}`,
            JSON.stringify(compras)
        );

    }, [compras, user]);


    // ==========================================
    // LOGIN
    // ==========================================

    const handleLogin = (loggedInUser) => {

        setUser(loggedInUser);

        localStorage.setItem(
            "user",
            JSON.stringify(loggedInUser)
        );

        // --------------------------------------
        // RECUPERAR CARRITO
        // --------------------------------------

        const savedCarrito = localStorage.getItem(
            `carrito_${loggedInUser.username}`
        );

        setCarrito(
            savedCarrito
                ? JSON.parse(savedCarrito)
                : []
        );

        // --------------------------------------
        // RECUPERAR COMPRAS
        // --------------------------------------

        const savedCompras = localStorage.getItem(
            `compras_${loggedInUser.username}`
        );

        setCompras(
            savedCompras
                ? JSON.parse(savedCompras)
                : []
        );

    };


    // ==========================================
    // LOGOUT
    // ==========================================

    const handleLogout = () => {

        setUser(null);

        setSearchValue("");

        localStorage.removeItem("user");

        setCarrito([]);

        setCompras([]);

        setCartNotification({
            visible: false,
            product: "",
        });

    };


    // ==========================================
    // AGREGAR PRODUCTO AL CARRITO
    // ==========================================

    const addToCartHandler = (componente) => {

        setCarrito((prevCarrito) => {

            const existingProduct = prevCarrito.find(
                (item) =>
                    item.id === componente.id
            );

            // --------------------------------------
            // PRODUCTO YA EXISTE
            // --------------------------------------

            if (existingProduct) {

                return prevCarrito.map((item) => {

                    if (item.id !== componente.id) {
                        return item;
                    }

                    const cantidadActual =
                        Number(
                            item.cantidadEnCarrito || 0
                        );

                    const stockDisponible =
                        Number(
                            componente.cantidad || 0
                        );

                    // No permitir superar stock
                    if (
                        cantidadActual >=
                        stockDisponible
                    ) {

                        return item;

                    }

                    return {
                        ...item,

                        cantidadEnCarrito:
                            cantidadActual + 1,

                    };

                });

            }

            // --------------------------------------
            // PRODUCTO NUEVO
            // --------------------------------------

            return [
                ...prevCarrito,

                {
                    ...componente,

                    cantidadEnCarrito: 1,
                },
            ];

        });


        // --------------------------------------
        // NOTIFICACIÓN
        // --------------------------------------

        setCartNotification({
            visible: true,
            product: componente.name,
        });


        setTimeout(() => {

            setCartNotification({
                visible: false,
                product: "",
            });

        }, 2200);

    };


    // ==========================================
    // ELIMINAR PRODUCTO DEL CARRITO
    // ==========================================

    const removeFromCartHandler = (componente) => {

        setCarrito((prevCarrito) =>
            prevCarrito.filter(
                (item) =>
                    item.id !== componente.id
            )
        );

    };


    // ==========================================
    // REALIZAR COMPRA
    // ==========================================

    const handleCompraRealizada = async (compra) => {

        try {

            // ======================================
            // VALIDACIONES
            // ======================================

            if (!compra) {
                throw new Error(
                    "No se recibió información de la compra."
                );
            }

            if (
                !compra.items ||
                !Array.isArray(compra.items) ||
                compra.items.length === 0
            ) {
                throw new Error(
                    "La compra no contiene productos."
                );
            }


            // ======================================
            // VERIFICAR STOCK NUEVAMENTE
            // ======================================

            /*
             * Aunque PantallaCarrito ya verifica
             * el stock, volvemos a comprobarlo
             * antes de guardar la compra.
             *
             * Esto evita vender un producto si
             * el stock cambió mientras el usuario
             * estaba completando Checkout.
             */

            const productosResponse = await fetch(
                "http://localhost:8000/Componentes"
            );

            if (!productosResponse.ok) {

                throw new Error(
                    "No se pudo verificar el stock actual."
                );

            }

            const productosActuales =
                await productosResponse.json();


            // ======================================
            // VALIDAR STOCK DE CADA PRODUCTO
            // ======================================

            for (const item of compra.items) {

                const productoActual =
                    productosActuales.find(
                        (producto) =>
                            producto.id === item.id
                    );

                if (!productoActual) {

                    throw new Error(
                        `El producto "${item.name}" ya no está disponible.`
                    );

                }

                const stockActual =
                    Number(
                        productoActual.cantidad || 0
                    );

                const cantidadSolicitada =
                    Number(
                        item.cantidadEnCarrito || 0
                    );

                if (
                    cantidadSolicitada <= 0
                ) {

                    throw new Error(
                        `Cantidad inválida para "${item.name}".`
                    );

                }

                if (
                    stockActual <
                    cantidadSolicitada
                ) {

                    throw new Error(
                        `No hay suficiente stock de "${item.name}". Stock disponible: ${stockActual}.`
                    );

                }

            }


            // ======================================
            // PREPARAR COMPRA
            // ======================================

            /*
             * Nos aseguramos de guardar números
             * correctamente.
             */

            const compraFinal = {

                ...compra,

                subtotal: Number(
                    compra.subtotal || 0
                ),

                envio: Number(
                    compra.envio || 0
                ),

                total: Number(
                    compra.total || 0
                ),

                fecha:
                    compra.fecha ||
                    new Date().toISOString(),

                userId:
                    compra.userId ||
                    user?.id ||
                    null,

                username:
                    compra.username ||
                    user?.username ||
                    null,

            };


            // ======================================
            // GUARDAR COMPRA EN BACKEND
            // ======================================

            const response = await fetch(
                "http://localhost:8000/compras",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json",
                    },

                    body: JSON.stringify(
                        compraFinal
                    ),
                }
            );


            if (!response.ok) {

                throw new Error(
                    "Error al almacenar la compra."
                );

            }


            const data =
                await response.json();


            // ======================================
            // ACTUALIZAR STOCK
            // ======================================

            /*
             * Actualizamos todos los productos
             * y esperamos a que terminen.
             */

            const actualizacionesStock =
                compraFinal.items.map(
                    async (item) => {

                        const productoActual =
                            productosActuales.find(
                                (producto) =>
                                    producto.id ===
                                    item.id
                            );

                        if (!productoActual) {
                            return;
                        }

                        const stockActual =
                            Number(
                                productoActual.cantidad ||
                                0
                            );

                        const cantidadComprada =
                            Number(
                                item.cantidadEnCarrito ||
                                0
                            );

                        const nuevoStock =
                            stockActual -
                            cantidadComprada;


                        const stockResponse =
                            await fetch(
                                `http://localhost:8000/Componentes/${item.id}`,
                                {
                                    method: "PATCH",

                                    headers: {
                                        "Content-Type":
                                            "application/json",
                                    },

                                    body: JSON.stringify({
                                        cantidad:
                                            nuevoStock,
                                    }),
                                }
                            );


                        if (!stockResponse.ok) {

                            throw new Error(
                                `No se pudo actualizar el stock de "${item.name}".`
                            );

                        }

                        return stockResponse.json();

                    }
                );


            await Promise.all(
                actualizacionesStock
            );


            // ======================================
            // GUARDAR COMPRA EN EL ESTADO
            // ======================================

            setCompras(
                (prevCompras) => [
                    ...prevCompras,
                    data,
                ]
            );


            // ======================================
            // ACTUALIZAR PRODUCTOS DEL CARRITO
            // ======================================

            /*
             * El carrito se vacía en PantallaCarrito
             * después de que esta función termina
             * correctamente.
             */


            console.log(
                "Compra realizada con éxito:",
                data
            );


            // ======================================
            // IMPORTANTE
            // ======================================

            /*
             * PantallaCarrito utiliza este return
             * para saber que todo terminó
             * correctamente.
             */

            return data;

        } catch (error) {

            console.error(
                "Error al realizar la compra:",
                error
            );

            /*
             * MUY IMPORTANTE:
             *
             * No ocultamos el error.
             *
             * PantallaCarrito recibirá el error
             * y NO vaciará el carrito.
             */

            throw error;

        }

    };


    // ==========================================
    // RENDER
    // ==========================================

    return (

        <Router>

            <div className="App">

                {/* ================================= */}
                {/* NAVBAR */}
                {/* ================================= */}

                <NavBar
                    searchValue={searchValue}
                    setSearchValue={setSearchValue}
                    user={user}
                    onLogout={handleLogout}
                    carrito={carrito}
                    cartNotification={
                        cartNotification
                    }
                />


                <div className="container mt-3">

                    <Routes>

                        {/* ================================= */}
                        {/* DASHBOARD */}
                        {/* ================================= */}

                        <Route
                            path="/"
                            element={

                                <div className="dashboard-container">

                                    <Dashboard
                                        user={user}
                                        searchValue={
                                            searchValue
                                        }
                                        addToCart={
                                            addToCartHandler
                                        }
                                    />

                                </div>

                            }
                        />


                        {/* ================================= */}
                        {/* LOGIN */}
                        {/* ================================= */}

                        <Route
                            path="/login"
                            element={
                                <Login
                                    onLogin={
                                        handleLogin
                                    }
                                />
                            }
                        />


                        {/* ================================= */}
                        {/* PERFIL */}
                        {/* ================================= */}

                        <Route
                            path="/pantallaUsuario"
                            element={

                                <PantallaUsuario
                                    user={user}
                                    compras={compras}
                                    carrito={carrito}
                                    setCarrito={
                                        setCarrito
                                    }
                                    removeFromCart={
                                        removeFromCartHandler
                                    }
                                    onCompraRealizada={
                                        handleCompraRealizada
                                    }
                                />

                            }
                        />


                        {/* ================================= */}
                        {/* CARRITO / CHECKOUT */}
                        {/* ================================= */}

                        <Route
                            path="/pantallaCarrito"
                            element={

                                <PantallaCarrito
                                    carrito={carrito}
                                    setCarrito={
                                        setCarrito
                                    }
                                    removeFromCart={
                                        removeFromCartHandler
                                    }
                                    onCompraRealizada={
                                        handleCompraRealizada
                                    }
                                    user={user}
                                />

                            }
                        />

                    </Routes>

                </div>

            </div>

        </Router>

    );

};

export default App;

