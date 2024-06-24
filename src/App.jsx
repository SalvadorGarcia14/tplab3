import { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NavBar from './components/NavBar/Navbar';
import Dashboard from './components/dashBoard/dashBoard';
import Login from './components/Login/Login';
import PantallaProduto from './components/Pantallas/pantallaProduto/pantallaProducto';
import PantallaUsuario from './components/Pantallas/pantallaUsuario/pantallaUsuario';

const App = () => {
    const [user, setUser] = useState(null);

    const handleLogin = (loggedInUser) => {
        setUser(loggedInUser);
    };

    const handleLogout = () => {
        setUser(null);
    };

    return (
        <Router>
            <NavBar />
            <div className="container mt-3">
                <Routes>
                    <Route path="/" element={user ? <Dashboard user={user} onLogout={handleLogout} /> : <Login onLogin={handleLogin} />} />
                    <Route path="/pantallaProduto" element={<PantallaProduto />} />
                    <Route path="/pantallaUsuario" element={<PantallaUsuario user={user} />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;