//Componente no ubicado en el navbar

import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'react-bootstrap';
import Producto from '../../Productos/producto';

const PantallaProducto = ({ user }) => {
    const [componentes, setComponentes] = useState([]);

    useEffect(() => {
        fetch('http://localhost:8000/Componentes')
            .then(response => response.json())
            .then(data => {
                setComponentes(data);
            })
            .catch(error => {
                console.error('Error al cargar componentes:', error);
            });
    }, []);

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

            const updatedComponents = componentes.filter(c => c.id !== productId);
            setComponentes(updatedComponents);

        } catch (error) {
            console.error('Error al eliminar el producto:', error);
        }
    };

    return (
        <>
            <Row className="w-100">
                <Col />
                <Col className="d-flex justify-content-center" md={6}>
                    <h1>Productos</h1>
                </Col>
                <Col />
            </Row>
            <div className="d-flex flex-wrap">
                {componentes.map(componente => (
                    <Producto
                        key={componente.id}
                        componente={componente}
                        isAdminOrVendedor={user && (user.rango === 'admin' || user.rango === 'vendedor')}
                        onRemoveProduct={handleRemoveProduct}
                    />
                ))}
            </div>
        </>
    );
};

PantallaProducto.propTypes = {
    user: PropTypes.object,
};

export default PantallaProducto;
