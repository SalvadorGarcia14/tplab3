import React from 'react';
import Dashboard from './components/dashBoard/dashBoard';

const App = () => {
    const handleLogout = () => {
        // Función para manejar el cierre de sesión
        console.log('Cerrar sesión');
    };

    return (
        <div className="container">
            <Dashboard onLogout={handleLogout} />
        </div>
    );
};

export default App;