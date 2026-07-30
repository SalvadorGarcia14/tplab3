import { useState } from "react";
import PropTypes from "prop-types";
import { Button, Alert } from "react-bootstrap";
import Checkout from "../../Checkout/Checkout";
import "./pantallaCarrito.css";

const PantallaCarrito = ({
    carrito,
    setCarrito,
    removeFromCart,
    onCompraRealizada,
    user,
}) => {

    const [mostrarCheckout, setMostrarCheckout] = useState(false);
    const [error, setError] = useState("");

    // ==========================================
    // CALCULAR SUBTOTAL
    // ==========================================

    const calcularPrecioTotal = () => {
        return carrito.reduce((total, item) => {
            return (
                total +
                Number(item.precio) *
                Number(item.cantidadEnCarrito)
            );
        }, 0);
    };

    // ==========================================
    // FORMATEAR PRECIO
    // ==========================================

    const formatearPrecio = (precio) => {
        return Number(precio).toLocaleString("es-AR");
    };

    // ==========================================
    // ELIMINAR PRODUCTO
    // ==========================================

    const handleRemoveProduct = (producto) => {

        removeFromCart(producto);

        setError("");

    };

    // ==========================================
    // IR AL CHECKOUT
    // ==========================================

    const handleContinuarCompra = async () => {

        setError("");

        if (!user) {
            setError(
                "Debés iniciar sesión para realizar una compra."
            );

            return;
        }

        if (!carrito || carrito.length === 0) {
            setError(
                "El carrito está vacío."
            );

            return;
        }

        // ======================================
        // VERIFICAR STOCK ACTUAL
        // ======================================

        try {

            const response = await fetch(
                "http://localhost:8000/Componentes"
            );

            if (!response.ok) {
                throw new Error(
                    "No se pudo verificar el stock."
                );
            }

            const productosActuales = await response.json();

            for (const item of carrito) {

                const productoActual = productosActuales.find(
                    (producto) =>
                        producto.id === item.id
                );

                if (!productoActual) {

                    setError(
                        `El producto "${item.name}" ya no está disponible.`
                    );

                    return;
                }

                const stockActual = Number(
                    productoActual.cantidad
                );

                if (
                    stockActual <
                    Number(item.cantidadEnCarrito)
                ) {

                    setError(
                        `No hay suficiente stock de "${item.name}". Stock disponible: ${stockActual}.`
                    );

                    return;
                }
            }

            // Si todo está correcto,
            // mostramos Checkout

            setMostrarCheckout(true);

        } catch (error) {

            console.error(
                "Error al verificar stock:",
                error
            );

            setError(
                "No se pudo verificar el stock. Intentá nuevamente."
            );

        }
    };

    // ==========================================
    // VOLVER AL CARRITO
    // ==========================================

    const handleCancelarCheckout = () => {

        setMostrarCheckout(false);

        setError("");

    };

    // ==========================================
    // COMPRA CONFIRMADA
    // ==========================================

    const handleCompraConfirmada = async (compra) => {

        try {

            /*
             * En este punto Checkout ya calculó:
             *
             * subtotal
             * envio
             * total
             * datosEnvio
             *
             * Ahora enviamos todo a App.jsx
             */

            await onCompraRealizada(compra);

            // Vaciar carrito después
            // de confirmar la compra

            setCarrito([]);

            // Ocultar checkout

            setMostrarCheckout(false);

            setError("");

        } catch (error) {

            console.error(
                "Error al confirmar la compra:",
                error
            );

            throw error;

        }
    };

    // ==========================================
    // SI ESTAMOS EN CHECKOUT
    // ==========================================

    if (mostrarCheckout) {

        return (

            <Checkout
                carrito={carrito}
                user={user}
                onCompraRealizada={
                    handleCompraConfirmada
                }
                onCancelar={
                    handleCancelarCheckout
                }
            />

        );
    }

    // ==========================================
    // CARRITO VACÍO
    // ==========================================

    if (!carrito || carrito.length === 0) {

        return (

            <section className="cart-page">

                <div className="empty-cart">

                    <div className="empty-cart-icon">
                        🛒
                    </div>

                    <h2>
                        Tu carrito está vacío
                    </h2>

                    <p>
                        Agregá productos para comenzar
                        tu compra.
                    </p>

                </div>

            </section>

        );
    }

    // ==========================================
    // CARRITO
    // ==========================================

    const subtotal = calcularPrecioTotal();

    return (

        <section className="cart-page">

            <div className="cart-container">

                {/* ================================= */}
                {/* ENCABEZADO */}
                {/* ================================= */}

                <div className="cart-header">

                    <div>

                        <h1>
                            Mi carrito
                        </h1>

                        <p>
                            Revisá tus productos antes
                            de continuar.
                        </p>

                    </div>

                    <div className="cart-items-count">

                        {carrito.length}

                        {" "}

                        producto
                        {carrito.length !== 1
                            ? "s"
                            : ""}

                    </div>

                </div>

                {/* ================================= */}
                {/* ERROR */}
                {/* ================================= */}

                {error && (

                    <Alert
                        variant="danger"
                        className="cart-alert"
                        onClose={() =>
                            setError("")
                        }
                        dismissible
                    >

                        {error}

                    </Alert>

                )}

                {/* ================================= */}
                {/* PRODUCTOS */}
                {/* ================================= */}

                <div className="cart-content">

                    <div className="cart-products-grid">

                        {carrito.map((producto) => {

                            const precioTotalProducto =
                                Number(
                                    producto.precio
                                ) *
                                Number(
                                    producto.cantidadEnCarrito
                                );

                            return (

                                <div
                                    key={producto.id}
                                    className="cart-product-item"
                                >

                                    {/* IMAGEN */}

                                    <div className="cart-product-image-container">

                                        <img
                                            src={
                                                producto.imagen
                                            }
                                            alt={
                                                producto.name
                                            }
                                            className="cart-product-image"
                                        />

                                    </div>

                                    {/* INFORMACIÓN */}

                                    <div className="cart-product-info">

                                        <h3>
                                            {
                                                producto.name
                                            }
                                        </h3>

                                        <p className="cart-product-unit-price">

                                            $
                                            {
                                                formatearPrecio(
                                                    producto.precio
                                                )
                                            }

                                            {" "}por unidad

                                        </p>

                                        <div className="cart-product-quantity">

                                            Cantidad:

                                            <strong>
                                                {" "}
                                                {
                                                    producto.cantidadEnCarrito
                                                }
                                            </strong>

                                        </div>

                                    </div>

                                    {/* PRECIO */}

                                    <div className="cart-product-total">

                                        <strong>

                                            $
                                            {
                                                formatearPrecio(
                                                    precioTotalProducto
                                                )
                                            }

                                        </strong>

                                    </div>

                                    {/* ELIMINAR */}

                                    <Button
                                        className="remove-product-btn"
                                        onClick={() =>
                                            handleRemoveProduct(
                                                producto
                                            )
                                        }
                                    >

                                        Eliminar

                                    </Button>

                                </div>

                            );

                        })}

                    </div>

                    {/* ================================= */}
                    {/* RESUMEN */}
                    {/* ================================= */}

                    <aside className="cart-summary">

                        <h2>
                            Resumen
                        </h2>

                        <div className="cart-summary-row">

                            <span>
                                Productos
                            </span>

                            <strong>
                                $
                                {
                                    formatearPrecio(
                                        subtotal
                                    )
                                }
                            </strong>

                        </div>

                        <div className="cart-summary-row">

                            <span>
                                Envío
                            </span>

                            <span className="shipping-calculated-text">
                                Se calcula en el checkout
                            </span>

                        </div>

                        <div className="cart-summary-divider"></div>

                        <div className="cart-summary-total">

                            <span>
                                Subtotal
                            </span>

                            <strong>
                                $
                                {
                                    formatearPrecio(
                                        subtotal
                                    )
                                }
                            </strong>

                        </div>

                        <Button
                            className="buy-button"
                            onClick={
                                handleContinuarCompra
                            }
                        >

                            Continuar con la compra

                        </Button>

                        <p className="cart-shipping-info">

                            📦 El costo de envío se
                            calculará automáticamente
                            según tu provincia.

                        </p>

                    </aside>

                </div>

            </div>

        </section>

    );
};

PantallaCarrito.propTypes = {

    carrito: PropTypes.array.isRequired,

    setCarrito: PropTypes.func.isRequired,

    removeFromCart: PropTypes.func.isRequired,

    onCompraRealizada: PropTypes.func.isRequired,

    user: PropTypes.object,

};

export default PantallaCarrito;

