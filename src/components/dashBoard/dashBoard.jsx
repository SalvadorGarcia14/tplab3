import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Col, Row } from 'react-bootstrap';
import Producto from '../Productos/producto';
import AgregarCarrito from '../agregarCarrito/agregarCarrito';
import PantallaCarrito from '../Pantallas/pantallaCarrito/pantallaCarrito';

const Dashboard = ({ user, searchValue }) => {
    const [componentsList, setComponentsList] = useState([]);
    const [carrito, setCarrito] = useState([]); // Estado del carrito

    useEffect(() => {
        fetch('http://localhost:8000/Componentes')
            .then(response => response.json())
            .then(componentData => {
                // Filtrar solo los componentes con status: true
                const filteredComponents = componentData.filter(componente => componente.status);
                setComponentsList(filteredComponents);
            })
            .catch(error => {
                console.error('Error al cargar componentes:', error);
            });
    }, []);

    const addToCartHandler = (componente) => {
        setCarrito(prevCarrito => [...prevCarrito, componente]); // Agregar componente al carrito
    };

    const handleRemoveProduct = async (productId) => {
        const accessToken = localStorage.getItem('accessToken');

        try {
            const response = await fetch(`http://localhost:8000/Componentes/${productId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Error al eliminar el producto');
            }

            const updatedComponents = componentsList.filter(c => c.id !== productId);
            setComponentsList(updatedComponents);

        } catch (error) {
            console.error('Error al eliminar el producto:', error);
        }
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
                <Col />
            </Row>
            {user && <p>Bienvenido, {user.firstName}!</p>}
            <div className="d-flex flex-wrap">
                {filteredComponents.map(componente => (
                    <Producto
                        key={componente.id}
                        componente={componente}
                        onAddToCart={addToCartHandler}
                        isAdminOrVendedor={user && (user.rango === 'admin' || user.rango === 'vendedor')}
                        onRemoveProduct={handleRemoveProduct}
                    />
                ))}
            </div>
            <Row>
                <Col>
                    <AgregarCarrito componentes={filteredComponents} onAddToCart={addToCartHandler} />
                </Col>
                <Col>
                    <PantallaCarrito carrito={carrito} />
                </Col>
            </Row>
        </>
    );
};

Dashboard.propTypes = {
    user: PropTypes.object,
    searchValue: PropTypes.string.isRequired,
};

export default Dashboard;
