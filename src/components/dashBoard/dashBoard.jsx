import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Col, Row } from 'react-bootstrap';
import Producto from '../Productos/producto';

const Dashboard = ({ user, searchValue, addToCart }) => {
    const [componentsList, setComponentsList] = useState([]);

    useEffect(() => {
        fetch('http://localhost:8000/Componentes')
            .then(response => response.json())
            .then(componentData => {
                const filteredComponents = componentData.map(componente => ({
                    ...componente,
                    cantidad: parseInt(componente.cantidad, 10), // Parse cantidad como entero
                    precio: parseFloat(componente.precio), // Parse precio como float
                    status: parseInt(componente.cantidad, 10) > 0, // Actualizar estado en función de la cantidad
                }));
                setComponentsList(filteredComponents);
            })
            .catch(error => {
                console.error('Error al cargar componentes:', error);
            });
    }, []);

    const addToCartHandler = (componente) => {
        addToCart(componente);
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

    const handleUpdateProduct = async (updatedProduct) => {
        const accessToken = localStorage.getItem('accessToken');

        try {
            const response = await fetch(`http://localhost:8000/Componentes/${updatedProduct.id}`, {
                method: 'PUT', // or PATCH
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedProduct),
            });

            if (!response.ok) {
                throw new Error('Error al actualizar el producto');
            }

            const updatedComponents = componentsList.map(c => 
                c.id === updatedProduct.id ? updatedProduct : c
            );
            setComponentsList(updatedComponents);

        } catch (error) {
            console.error('Error al actualizar el producto:', error);
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
                        onUpdateProduct={handleUpdateProduct}
                        user={user} // Pasar el usuario al componente Producto
                    />
                ))}
            </div>
        </>
    );
};

Dashboard.propTypes = {
    user: PropTypes.object,
    searchValue: PropTypes.string.isRequired,
    addToCart: PropTypes.func.isRequired,
};

export default Dashboard;