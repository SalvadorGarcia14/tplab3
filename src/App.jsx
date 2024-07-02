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
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
    }, []); // Solo se ejecuta una vez al cargar la aplicación

    const handleLogin = (loggedInUser) => {
        setUser(loggedInUser);
        localStorage.setItem('user', JSON.stringify(loggedInUser));
    };

    const handleLogout = () => {
        setUser(null);
        setSearchValue('');
        localStorage.removeItem('user');
    };

    return (
        <Router>
            <NavBar 
                searchValue={searchValue} 
                setSearchValue={setSearchValue} 
                user={user} 
                onLogout={handleLogout} 
            />
            <div className="container mt-3">
                <Routes>
                    <Route 
                        path="/" 
                        element={<Dashboard user={user} searchValue={searchValue} />} 
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
                </Routes>
            </div>
        </Router>
    );
};

export default App;
