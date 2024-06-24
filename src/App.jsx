import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NavBar from './components/NavBar/Navbar';
import Dashboard from './components/dashBoard/dashBoard';
import Login from './components/Login/Login';
import PantallaProduto from './components/Pantallas/pantallaProduto/pantallaProducto';
import PantallaUsuario from './components/Pantallas/pantallaUsuario/pantallaUsuario';

const App = () => {
    const [user, setUser] = useState(null);
    const [searchValue, setSearchValue] = useState('');

    useEffect(() => {
        // Recuperar el estado del usuario desde localStorage al montar el componente
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
    }, []);

    const handleLogin = (loggedInUser) => {
        setUser(loggedInUser);
        // Guardar el estado del usuario en localStorage
        localStorage.setItem('user', JSON.stringify(loggedInUser));
    };

    const handleLogout = () => {
        setUser(null);
        setSearchValue(''); // Limpiar el valor de búsqueda al cerrar sesión
        // Eliminar el estado del usuario de localStorage
        localStorage.removeItem('user');
    };

    return (
        <Router>
            {user && <NavBar searchValue={searchValue} setSearchValue={setSearchValue} />}
            <div className="container mt-3">
                <Routes>
                    <Route 
                        path="/" 
                        element={user ? <Dashboard user={user} onLogout={handleLogout} searchValue={searchValue} /> : <Login onLogin={handleLogin} />} 
                    />
                    <Route path="/pantallaProduto" element={<PantallaProduto />} />
                    <Route path="/pantallaUsuario" element={<PantallaUsuario user={user} />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;