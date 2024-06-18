import { useState } from 'react'
import './App.css'

import "./components/Header/Header"

function App() {
    const handleSearch = (searchTerm) => {
        // Implementa la lógica de búsqueda aquí
        console.log(`Buscando productos con el término: ${searchTerm}`);
    };

    return ( <
        Router >
        <
        AuthProvider >
        <
        Header onSearch = { handleSearch } > < /Header> <
        switch >

        <
        /switch> <
        /AuthProvider>

        <
        /Router>
    )
}

export default App