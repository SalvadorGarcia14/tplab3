
import React, { useEffect, useState } from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import Producto from '../Productos/producto';

const Dashboard = ({ onLogout }) => {
    const [componentsList, setComponentsList] = useState([]);
    const [searchValue, setSearchValue] = useState("");

    useEffect(() => {
        // Fetch Components
        fetch("http://localhost:8000/Componentes", {
            headers: {
                accept: "application/json"
            }
        })
            .then((response) => response.json())
            .then((componentData) => {
                setComponentsList(componentData);
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);

    const saveComponentDataHandler = (componentData) => {
        // Función para guardar un nuevo componente
    };

    const addToCartHandler = (componente) => {
        // Aquí podrías manejar la lógica para agregar al carrito
        console.log(`Agregando al carrito: ${componente.name}`);
    };

    const searchHandler = (searchQuery) => {
        setSearchValue(searchQuery);
        setComponentsList(componentsList.filter(c =>
            c.name.toUpperCase().includes(searchQuery.toUpperCase())));
    };

    return (
        <>
            <Row className="w-100">
                <Col />
                <Col className="d-flex justify-content-center" md={6}>
                    <h1>PC Componentes</h1>
                </Col>
                <Col className="d-flex justify-content-end align-items-center me-4 mt-2">
                    <Button onClick={onLogout}>Cerrar sesión</Button>
                </Col>
            </Row>
            <p>¡Quiero gestionar componentes!</p>
            <div>
                <input
                    type="text"
                    placeholder="Buscar componente..."
                    value={searchValue}
                    onChange={(e) => searchHandler(e.target.value)}
                />
                <div className="d-flex flex-wrap">
                    {componentsList.map(componente => (
                        <Producto
                            key={componente.id}
                            componente={componente}
                            onAddToCart={addToCartHandler}
                        />
                    ))}
                </div>
            </div>
        </>
    );
};

export default Dashboard;