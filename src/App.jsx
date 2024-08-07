import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NavBar from './components/NavBar/Navbar';
import Dashboard from './components/dashBoard/dashBoard';
import Login from './components/Login/Login';
import PantallaUsuario from './components/Pantallas/pantallaUsuario/pantallaUsuario';
import PantallaCarrito from './components/Pantallas/pantallaCarrito/pantallaCarrito';
import './App.css';

const App = () => {
    const [user, setUser] = useState(null);
    const [searchValue, setSearchValue] = useState('');
    const [carrito, setCarrito] = useState([]);
    const [compras, setCompras] = useState([]);

    useEffect(() => {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            const parsedUser = JSON.parse(savedUser);
            setUser(parsedUser);
            const savedCarrito = localStorage.getItem(`carrito_${parsedUser.username}`);
            const savedCompras = localStorage.getItem(`compras_${parsedUser.username}`);
            setCarrito(savedCarrito ? JSON.parse(savedCarrito) : []);
            setCompras(savedCompras ? JSON.parse(savedCompras) : []);
        }
    }, []);

    useEffect(() => {
        if (user) {
            localStorage.setItem(`carrito_${user.username}`, JSON.stringify(carrito));
        }
    }, [carrito, user]);

    useEffect(() => {
        if (user) {
            localStorage.setItem(`compras_${user.username}`, JSON.stringify(compras));
        }
    }, [compras, user]);

    const handleLogin = (loggedInUser) => {
        setUser(loggedInUser);
        localStorage.setItem('user', JSON.stringify(loggedInUser));
        const savedCarrito = localStorage.getItem(`carrito_${loggedInUser.username}`);
        const savedCompras = localStorage.getItem(`compras_${loggedInUser.username}`);
        setCarrito(savedCarrito ? JSON.parse(savedCarrito) : []);
        setCompras(savedCompras ? JSON.parse(savedCompras) : []);
    };

    const handleLogout = () => {
        setUser(null);
        setSearchValue('');
        localStorage.removeItem('user');
        setCarrito([]);
        setCompras([]);
    };

    const addToCartHandler = (componente) => {
        setCarrito(prevCarrito => {
            const existingProduct = prevCarrito.find(item => item.id === componente.id);
            if (existingProduct) {
                return prevCarrito.map(item =>
                    item.id === componente.id
                        ? { ...item, cantidadEnCarrito: item.cantidadEnCarrito + 1 }
                        : item
                );
            } else {
                return [...prevCarrito, { ...componente, cantidadEnCarrito: 1 }];
            }
        });
    };

    const removeFromCartHandler = (componente) => {
        setCarrito(prevCarrito => prevCarrito.filter(item => item.id !== componente.id));
    };

    const handleCompraRealizada = async (compra) => {
        try {
            const response = await fetch('http://localhost:8000/compras', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(compra),
            });

            if (!response.ok) {
                throw new Error('Error al almacenar la compra');
            }

            const data = await response.json();
            setCompras(prevCompras => [...prevCompras, data]);

            compra.items.forEach(async item => {
                try {
                    const response = await fetch(`http://localhost:8000/Componentes/${item.id}`, {
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ cantidad: item.cantidad - item.cantidadEnCarrito }),
                    });

                    if (!response.ok) {
                        throw new Error('Error al actualizar stock del producto');
                    }

                    // Actualizar state o base de datos local aquí si es necesario
                } catch (error) {
                    console.error(`Error al actualizar stock del producto con id ${item.id}:`, error);
                }
            });

            console.log('Compra realizada con éxito:', data);
        } catch (error) {
            console.error('Error al realizar la compra:', error);
        }
    };

    return (
        <Router>
            <div className="App">
                <NavBar
                    searchValue={searchValue}
                    setSearchValue={setSearchValue}
                    user={user}
                    onLogout={handleLogout}
                    carrito={carrito}
                />
                <div className="container mt-3">
                    <Routes>
                        <Route
                            path="/"
                            element={
                                <div className="dashboard-container">
                                    <Dashboard user={user} searchValue={searchValue} addToCart={addToCartHandler} />
                                </div>
                            }
                        />
                        <Route
                            path="/login"
                            element={<Login onLogin={handleLogin} />}
                        />
                        <Route
                            path="/pantallaUsuario"
                            element={
                                <PantallaUsuario
                                    user={user}
                                    compras={compras}
                                    carrito={carrito}
                                    setCarrito={setCarrito}
                                    removeFromCart={removeFromCartHandler}
                                    onCompraRealizada={handleCompraRealizada}
                                />
                            }
                        />
                        <Route
                            path="/pantallaCarrito"
                            element={
                                <PantallaCarrito
                                    carrito={carrito}
                                    setCarrito={setCarrito}
                                    removeFromCart={removeFromCartHandler}
                                    onCompraRealizada={handleCompraRealizada}
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
