import PropTypes from 'prop-types';
import { Card, Image } from 'react-bootstrap';

const ListaCompras = ({ compras }) => {
    return (
        <div>
            <h3>Mis Compras</h3>
            {compras.length > 0 ? (
                compras.map((compra, index) => (
                    <Card key={index} style={{ marginBottom: '10px' }}>
                        <Card.Body>
                            <Card.Title>Compra #{compra.id}</Card.Title>
                            <Card.Text>
                                Fecha de Compra: {new Date(compra.createdAt).toLocaleDateString()}
                                <ul>
                                    {compra.items.map((item, idx) => (
                                        <li key={idx}>
                                            <Image src={item.imagen} alt={item.name} style={{ width: '50px', height: '50px' }} />
                                            {item.name} ({item.marca}) - Cantidad: {item.cantidadEnCarrito}
                                        </li>
                                    ))}
                                </ul>
                                Total: ${compra.total}
                            </Card.Text>
                        </Card.Body>
                    </Card>
                ))
            ) : (
                <p>No has realizado ninguna compra aún.</p>
            )}
        </div>
    );
};

ListaCompras.propTypes = {
    compras: PropTypes.array.isRequired,
};

export default ListaCompras;
