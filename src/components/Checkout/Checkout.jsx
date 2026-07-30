import { useState } from "react";
import PropTypes from "prop-types";
import { Button, Form, Alert } from "react-bootstrap";
import "./Checkout.css";

const COSTOS_ENVIO = {
    "Santa Fe": 4500,
    "Buenos Aires": 7500,
    "Córdoba": 6500,
    "Entre Ríos": 5500,
    "Mendoza": 8500,
    "Tucumán": 9500,
    "Salta": 9500,
    "Jujuy": 10500,
    "Chaco": 8500,
    "Corrientes": 8500,
    "Misiones": 9500,
    "Formosa": 9500,
    "Santiago del Estero": 8500,
    "Catamarca": 9000,
    "La Rioja": 9000,
    "San Juan": 9000,
    "San Luis": 8000,
    "La Pampa": 8000,
    "Neuquén": 10000,
    "Río Negro": 10500,
    "Chubut": 12000,
    "Santa Cruz": 14000,
    "Tierra del Fuego": 16000,
};

const ENVIO_GRATIS_DESDE = 200000;

const Checkout = ({ carrito, onCompraRealizada, onCancelar, user }) => {

    const [formData, setFormData] = useState({
        nombre: user?.firstName || "",
        apellido: user?.lastName || "",
        email: user?.email || "",
        direccion: "",
        ciudad: "",
        provincia: "",
        codigoPostal: "",
    });

    const [error, setError] = useState("");
    const [procesando, setProcesando] = useState(false);

    // ------------------------------------------
    // CALCULAR SUBTOTAL
    // ------------------------------------------

    const calcularSubtotal = () => {
        return carrito.reduce((total, item) => {
            return total + Number(item.precio) * Number(item.cantidadEnCarrito);
        }, 0);
    };

    const subtotal = calcularSubtotal();

    // ------------------------------------------
    // CALCULAR ENVÍO
    // ------------------------------------------

    const calcularEnvio = () => {

        // Envío gratis desde determinado monto
        if (subtotal >= ENVIO_GRATIS_DESDE) {
            return 0;
        }

        // Si todavía no seleccionó provincia
        if (!formData.provincia) {
            return 0;
        }

        // Buscar costo de la provincia
        return COSTOS_ENVIO[formData.provincia] || 12000;
    };

    const costoEnvio = calcularEnvio();

    const total = subtotal + costoEnvio;

    // ------------------------------------------
    // FORMATEAR PRECIOS
    // ------------------------------------------

    const formatearPrecio = (precio) => {
        return Number(precio).toLocaleString("es-AR");
    };

    // ------------------------------------------
    // CAMBIAR DATOS DEL FORMULARIO
    // ------------------------------------------

    const handleChange = (e) => {

        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        setError("");
    };

    // ------------------------------------------
    // CONFIRMAR COMPRA
    // ------------------------------------------

    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");

        // Validar carrito
        if (!carrito || carrito.length === 0) {
            setError("No hay productos en el carrito.");
            return;
        }

        // Validar campos
        const camposObligatorios = [
            "nombre",
            "apellido",
            "email",
            "direccion",
            "ciudad",
            "provincia",
            "codigoPostal",
        ];

        const camposVacios = camposObligatorios.some(
            (campo) => !formData[campo].trim()
        );

        if (camposVacios) {
            setError("Completá todos los datos de envío.");
            return;
        }

        try {

            setProcesando(true);

            // Crear objeto final de compra
            const compra = {
                userId: user?.id || null,
                username: user?.username || null,

                items: carrito,

                subtotal: subtotal,

                envio: costoEnvio,

                total: total,

                datosEnvio: {
                    nombre: formData.nombre,
                    apellido: formData.apellido,
                    email: formData.email,
                    direccion: formData.direccion,
                    ciudad: formData.ciudad,
                    provincia: formData.provincia,
                    codigoPostal: formData.codigoPostal,
                },

                fecha: new Date().toISOString(),
            };

            await onCompraRealizada(compra);

        } catch (error) {

            console.error("Error al confirmar compra:", error);

            setError(
                "Ocurrió un error al procesar la compra. Intentá nuevamente."
            );

        } finally {

            setProcesando(false);

        }
    };

    return (

        <section className="checkout-page">

            <div className="checkout-container">

                {/* -------------------------------- */}
                {/* ENCABEZADO */}
                {/* -------------------------------- */}

                <div className="checkout-header">

                    <h1>Finalizar compra</h1>

                    <p>
                        Completá tus datos para recibir tu pedido.
                    </p>

                </div>

                {error && (

                    <Alert
                        variant="danger"
                        className="checkout-alert"
                    >
                        {error}
                    </Alert>

                )}

                <div className="checkout-grid">

                    {/* ================================= */}
                    {/* DATOS DE ENVÍO */}
                    {/* ================================= */}

                    <div className="checkout-form-card">

                        <div className="checkout-card-header">

                            <span className="checkout-icon">
                                📦
                            </span>

                            <div>
                                <h2>Datos de envío</h2>

                                <p>
                                    Indicá dónde querés recibir tu pedido.
                                </p>
                            </div>

                        </div>

                        <Form onSubmit={handleSubmit}>

                            <div className="checkout-form-row">

                                <Form.Group className="checkout-form-group">

                                    <Form.Label>
                                        Nombre
                                    </Form.Label>

                                    <Form.Control
                                        type="text"
                                        name="nombre"
                                        value={formData.nombre}
                                        onChange={handleChange}
                                        placeholder="Tu nombre"
                                    />

                                </Form.Group>

                                <Form.Group className="checkout-form-group">

                                    <Form.Label>
                                        Apellido
                                    </Form.Label>

                                    <Form.Control
                                        type="text"
                                        name="apellido"
                                        value={formData.apellido}
                                        onChange={handleChange}
                                        placeholder="Tu apellido"
                                    />

                                </Form.Group>

                            </div>

                            <Form.Group className="checkout-form-group">

                                <Form.Label>
                                    Correo electrónico
                                </Form.Label>

                                <Form.Control
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="ejemplo@gmail.com"
                                />

                            </Form.Group>

                            <Form.Group className="checkout-form-group">

                                <Form.Label>
                                    Dirección
                                </Form.Label>

                                <Form.Control
                                    type="text"
                                    name="direccion"
                                    value={formData.direccion}
                                    onChange={handleChange}
                                    placeholder="Ej: Av. Pellegrini 1234"
                                />

                            </Form.Group>

                            <div className="checkout-form-row">

                                <Form.Group className="checkout-form-group">

                                    <Form.Label>
                                        Ciudad
                                    </Form.Label>

                                    <Form.Control
                                        type="text"
                                        name="ciudad"
                                        value={formData.ciudad}
                                        onChange={handleChange}
                                        placeholder="Ej: Rosario"
                                    />

                                </Form.Group>

                                <Form.Group className="checkout-form-group">

                                    <Form.Label>
                                        Código postal
                                    </Form.Label>

                                    <Form.Control
                                        type="text"
                                        name="codigoPostal"
                                        value={formData.codigoPostal}
                                        onChange={handleChange}
                                        placeholder="Ej: 2000"
                                    />

                                </Form.Group>

                            </div>

                            <Form.Group className="checkout-form-group">

                                <Form.Label>
                                    Provincia
                                </Form.Label>

                                <Form.Select
                                    name="provincia"
                                    value={formData.provincia}
                                    onChange={handleChange}
                                >

                                    <option value="">
                                        Seleccioná una provincia
                                    </option>

                                    {Object.keys(COSTOS_ENVIO).map(
                                        (provincia) => (

                                            <option
                                                key={provincia}
                                                value={provincia}
                                            >
                                                {provincia}
                                            </option>

                                        )
                                    )}

                                </Form.Select>

                            </Form.Group>

                            {/* MENSAJE ENVÍO GRATIS */}

                            {subtotal >= ENVIO_GRATIS_DESDE && (

                                <div className="free-shipping-message">

                                    <span>🎉</span>

                                    <div>

                                        <strong>
                                            ¡Tenés envío gratis!
                                        </strong>

                                        <p>
                                            Tu compra supera los $
                                            {formatearPrecio(
                                                ENVIO_GRATIS_DESDE
                                            )}.
                                        </p>

                                    </div>

                                </div>

                            )}

                            {/* BOTONES */}

                            <div className="checkout-actions">

                                {onCancelar && (

                                    <Button
                                        type="button"
                                        className="checkout-cancel-button"
                                        onClick={onCancelar}
                                        disabled={procesando}
                                    >
                                        Volver al carrito
                                    </Button>

                                )}

                                <Button
                                    type="submit"
                                    className="checkout-confirm-button"
                                    disabled={procesando}
                                >

                                    {procesando
                                        ? "Procesando..."
                                        : "Confirmar compra"}

                                </Button>

                            </div>

                        </Form>

                    </div>

                    {/* ================================= */}
                    {/* RESUMEN DE COMPRA */}
                    {/* ================================= */}

                    <div className="checkout-summary-card">

                        <div className="checkout-card-header">

                            <span className="checkout-icon">
                                🛒
                            </span>

                            <div>

                                <h2>
                                    Resumen de compra
                                </h2>

                                <p>
                                    {carrito.length} producto
                                    {carrito.length !== 1 ? "s" : ""}
                                </p>

                            </div>

                        </div>

                        {/* PRODUCTOS */}

                        <div className="checkout-products">

                            {carrito.map((item) => {

                                const precioProducto =
                                    Number(item.precio) *
                                    Number(item.cantidadEnCarrito);

                                return (

                                    <div
                                        className="checkout-product"
                                        key={item.id}
                                    >

                                        <div className="checkout-product-image-container">

                                            <img
                                                src={item.imagen}
                                                alt={item.name}
                                                className="checkout-product-image"
                                            />

                                        </div>

                                        <div className="checkout-product-info">

                                            <h3>
                                                {item.name}
                                            </h3>

                                            <span>
                                                Cantidad:{" "}
                                                {item.cantidadEnCarrito}
                                            </span>

                                        </div>

                                        <strong>
                                            $
                                            {formatearPrecio(
                                                precioProducto
                                            )}
                                        </strong>

                                    </div>

                                );

                            })}

                        </div>

                        {/* SEPARADOR */}

                        <div className="checkout-divider"></div>

                        {/* TOTALES */}

                        <div className="checkout-price-row">

                            <span>
                                Subtotal
                            </span>

                            <strong>
                                ${formatearPrecio(subtotal)}
                            </strong>

                        </div>

                        <div className="checkout-price-row">

                            <span>
                                Envío
                            </span>

                            <strong
                                className={
                                    costoEnvio === 0
                                        ? "shipping-free"
                                        : ""
                                }
                            >

                                {costoEnvio === 0
                                    ? "GRATIS"
                                    : `$${formatearPrecio(costoEnvio)}`}

                            </strong>

                        </div>

                        <div className="checkout-divider"></div>

                        <div className="checkout-total-row">

                            <span>
                                Total
                            </span>

                            <strong>
                                ${formatearPrecio(total)}
                            </strong>

                        </div>

                        {/* INFORMACIÓN */}

                        <div className="checkout-security">

                            <span>
                                🔒
                            </span>

                            <p>
                                Tu información se utilizará
                                únicamente para procesar y enviar
                                tu pedido.
                            </p>

                        </div>

                    </div>

                </div>

            </div>

        </section>

    );
};

Checkout.propTypes = {

    carrito: PropTypes.array.isRequired,

    onCompraRealizada: PropTypes.func.isRequired,

    onCancelar: PropTypes.func,

    user: PropTypes.object,

};

export default Checkout;