import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Col, Row } from 'react-bootstrap';
import Producto from '../Productos/producto';

const Dashboard = ({ user, onLogout, searchValue }) => {
    const [componentsList, setComponentsList] = useState([]);

    useEffect(() => {
        fetch('http://localhost:8000/Componentes')
            .then(response => response.json())
            .then(componentData => {
                setComponentsList(componentData);
            })
            .catch(error => {
                console.error('Error al cargar componentes:', error);
            });
    }, []);

    const addToCartHandler = (componente) => {
        console.log(`Agregando al carrito: ${componente.name}`);
        // Aquí puedes manejar la lógica para agregar al carrito
    };

    const filteredComponents = componentsList.filter(c =>
        c.name.toUpperCase().includes(searchValue.toUpperCase())
    );

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
            <p>Bienvenido, {user.firstName}!</p>
            <div className="d-flex flex-wrap">
                {filteredComponents.map(componente => (
                    <Producto
                        key={componente.id}
                        componente={componente}
                        onAddToCart={addToCartHandler}
                    />
                ))}
            </div>
        </>
    );
};

Dashboard.propTypes = {
    user: PropTypes.object.isRequired,
    onLogout: PropTypes.func.isRequired,
    searchValue: PropTypes.string.isRequired,
};

export default Dashboard;