import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NavBar from './components/NavBar/Navbar';
import Dashboard from './components/dashBoard/dashBoard';
import Login from './components/Login/Login';
import PantallaProduto from './components/Pantallas/pantallaProduto/pantallaProducto';
import PantallaUsuario from './components/Pantallas/pantallaUsuario/pantallaUsuario';
import PantallaCarrito from './components/Pantallas/pantallaCarrito/pantallaCarrito';

const App = () => {
    const [user, setUser] = useState(null);
    const [searchValue, setSearchValue] = useState('');
    const [carrito, setCarrito] = useState([]);

    useEffect(() => {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
    }, []);

    const handleLogin = (loggedInUser) => {
        setUser(loggedInUser);
        localStorage.setItem('user', JSON.stringify(loggedInUser));
    };

    const handleLogout = () => {
        setUser(null);
        setSearchValue('');
        localStorage.removeItem('user');
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
        const updatedCarrito = carrito.filter(item => item.id !== componente.id);
        setCarrito(updatedCarrito);
    };

    return (
        <Router>
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
                        element={<Dashboard user={user} searchValue={searchValue} addToCart={addToCartHandler} />} 
                    />
                    <Route path="/login" element={<Login onLogin={handleLogin} />} />
                    <Route 
                        path="/pantallaProduto" 
                        element={<PantallaProduto />} 
                    />
                    <Route 
                        path="/pantallaUsuario" 
                        element={<PantallaUsuario user={user}/>} 
                    />
                    <Route 
                        path="/pantallaCarrito" 
                        element={<PantallaCarrito carrito={carrito} removeFromCart={removeFromCartHandler} />} 
                    />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
