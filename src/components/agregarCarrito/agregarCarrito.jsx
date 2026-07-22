import { useState } from "react";
import PropTypes from "prop-types";
import { Button, Card } from "react-bootstrap";
import "./agregarCarrito.css";

const AgregarCarrito = ({ componente, onAddToCart }) => {

    const [quantity, setQuantity] = useState(1);

    const handleAddToCart = () => {

        if (quantity > 0) {

            onAddToCart(componente, quantity);

            setQuantity(1);

        }

    };

    const increaseQuantity = () => {

        if (quantity < componente.cantidad) {

            setQuantity(quantity + 1);

        }

    };

    const decreaseQuantity = () => {

        if (quantity > 1) {

            setQuantity(quantity - 1);

        }

    };

    return (

        <Card className="cart-product-card">

            <div className="cart-image-container">

                <Card.Img
                    src={componente.imagen}
                    className="cart-product-image"
                />

            </div>

            <Card.Body className="cart-product-body">

                <Card.Title className="cart-product-title">

                    {componente.name}

                </Card.Title>

                <div className="cart-price">

                    ${componente.precio.toLocaleString()}

                </div>

                <div className="cart-stock">

                    {componente.cantidad > 0
                        ? `En stock (${componente.cantidad})`
                        : "Sin stock"}

                </div>

                <div className="quantity-section">

                    <span className="quantity-label">

                        Cantidad

                    </span>

                    <div className="quantity-selector">

                        <Button
                            className="quantity-button"
                            onClick={decreaseQuantity}
                        >

                            −

                        </Button>

                        <span className="quantity-value">

                            {quantity}

                        </span>

                        <Button
                            className="quantity-button"
                            onClick={increaseQuantity}
                        >

                            +

                        </Button>

                    </div>

                </div>

                <Button
                    className="cart-add-button"
                    onClick={handleAddToCart}
                >

                    Agregar al carrito

                </Button>

            </Card.Body>

        </Card>

    );

};

AgregarCarrito.propTypes = {

    componente: PropTypes.object.isRequired,

    onAddToCart: PropTypes.func.isRequired,

};

export default AgregarCarrito;