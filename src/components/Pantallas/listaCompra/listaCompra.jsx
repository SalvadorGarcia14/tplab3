
import PropTypes from "prop-types";
import "./listaCompra.css";

const ListaCompras = ({ compras }) => {

    // ==========================================
    // FORMATEAR PRECIOS
    // ==========================================

    const formatearPrecio = (precio) => {
        return Number(precio || 0).toLocaleString("es-AR");
    };

    // ==========================================
    // FORMATEAR FECHA
    // ==========================================

    const formatearFecha = (fecha) => {

        if (!fecha) {
            return "Fecha no disponible";
        }

        const fechaCompra = new Date(fecha);

        if (isNaN(fechaCompra.getTime())) {
            return "Fecha no disponible";
        }

        return fechaCompra.toLocaleDateString("es-AR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    // ==========================================
    // CARRITO VACÍO
    // ==========================================

    if (!compras || compras.length === 0) {

        return (

            <div className="lista-compras-empty">

                <div className="lista-compras-empty-icon">
                    🛍️
                </div>

                <h3>
                    Todavía no realizaste compras
                </h3>

                <p>
                    Cuando realices una compra,
                    aparecerá aquí.
                </p>

            </div>

        );
    }

    return (

        <section className="lista-compras">

            <div className="lista-compras-header">

                <div>

                    <h2>
                        Mis compras
                    </h2>

                    <p>
                        Historial de tus pedidos realizados.
                    </p>

                </div>

                <div className="lista-compras-count">

                    {compras.length}

                    {" "}

                    compra
                    {compras.length !== 1 ? "s" : ""}

                </div>

            </div>

            <div className="lista-compras-container">

                {compras.map((compra, index) => {

                    // ======================================
                    // DATOS DE LA COMPRA
                    // ======================================

                    const items = Array.isArray(compra.items)
                        ? compra.items
                        : [];

                    /*
                     * Compatibilidad con compras antiguas:
                     *
                     * Si la compra fue realizada antes de
                     * incorporar Checkout, puede no tener
                     * subtotal, envio o total.
                     */

                    const subtotal = compra.subtotal !== undefined
                        ? Number(compra.subtotal)
                        : items.reduce(
                            (total, item) =>
                                total +
                                Number(item.precio || 0) *
                                Number(item.cantidadEnCarrito || 0),
                            0
                        );

                    const envio = compra.envio !== undefined
                        ? Number(compra.envio)
                        : 0;

                    const total = compra.total !== undefined
                        ? Number(compra.total)
                        : subtotal + envio;

                    const datosEnvio =
                        compra.datosEnvio || null;

                    return (

                        <article
                            className="compra-card"
                            key={compra.id || index}
                        >

                            {/* ================================= */}
                            {/* HEADER DE LA COMPRA */}
                            {/* ================================= */}

                            <div className="compra-header">

                                <div className="compra-header-info">

                                    <div className="compra-icon">
                                        📦
                                    </div>

                                    <div>

                                        <h3>
                                            Pedido #
                                            {compra.id || index + 1}
                                        </h3>

                                        <span>
                                            {formatearFecha(
                                                compra.fecha
                                            )}
                                        </span>

                                    </div>

                                </div>

                                <div className="compra-status">
                                    Compra realizada
                                </div>

                            </div>

                            {/* ================================= */}
                            {/* PRODUCTOS */}
                            {/* ================================= */}

                            <div className="compra-section">

                                <div className="compra-section-title">

                                    <span>
                                        🛒
                                    </span>

                                    <h4>
                                        Productos
                                    </h4>

                                </div>

                                <div className="compra-productos">

                                    {items.map((item, itemIndex) => {

                                        const cantidad =
                                            Number(
                                                item.cantidadEnCarrito || 0
                                            );

                                        const precioUnitario =
                                            Number(
                                                item.precio || 0
                                            );

                                        const subtotalProducto =
                                            cantidad *
                                            precioUnitario;

                                        return (

                                            <div
                                                className="compra-producto"
                                                key={
                                                    item.id ||
                                                    itemIndex
                                                }
                                            >

                                                <div className="compra-producto-imagen">

                                                    {item.imagen ? (

                                                        <img
                                                            src={
                                                                item.imagen
                                                            }
                                                            alt={
                                                                item.name ||
                                                                "Producto"
                                                            }
                                                        />

                                                    ) : (

                                                        <span>
                                                            📦
                                                        </span>

                                                    )}

                                                </div>

                                                <div className="compra-producto-info">

                                                    <h5>
                                                        {item.name ||
                                                            "Producto sin nombre"}
                                                    </h5>

                                                    <p>
                                                        $
                                                        {formatearPrecio(
                                                            precioUnitario
                                                        )}

                                                        {" "}por unidad
                                                    </p>

                                                    <span>
                                                        Cantidad:{" "}
                                                        <strong>
                                                            {cantidad}
                                                        </strong>
                                                    </span>

                                                </div>

                                                <div className="compra-producto-total">

                                                    $
                                                    {formatearPrecio(
                                                        subtotalProducto
                                                    )}

                                                </div>

                                            </div>

                                        );

                                    })}

                                </div>

                            </div>

                            {/* ================================= */}
                            {/* INFORMACIÓN DE ENVÍO */}
                            {/* ================================= */}

                            {datosEnvio && (

                                <div className="compra-section">

                                    <div className="compra-section-title">

                                        <span>
                                            🚚
                                        </span>

                                        <h4>
                                            Datos de envío
                                        </h4>

                                    </div>

                                    <div className="datos-envio">

                                        <div className="dato-envio">

                                            <span>
                                                👤
                                            </span>

                                            <div>

                                                <small>
                                                    Destinatario
                                                </small>

                                                <strong>
                                                    {datosEnvio.nombre}{" "}
                                                    {datosEnvio.apellido}
                                                </strong>

                                            </div>

                                        </div>

                                        <div className="dato-envio">

                                            <span>
                                                📧
                                            </span>

                                            <div>

                                                <small>
                                                    Email
                                                </small>

                                                <strong>
                                                    {datosEnvio.email ||
                                                        "No especificado"}
                                                </strong>

                                            </div>

                                        </div>

                                        <div className="dato-envio">

                                            <span>
                                                📍
                                            </span>

                                            <div>

                                                <small>
                                                    Dirección
                                                </small>

                                                <strong>
                                                    {datosEnvio.direccion}
                                                </strong>

                                            </div>

                                        </div>

                                        <div className="dato-envio">

                                            <span>
                                                🏙️
                                            </span>

                                            <div>

                                                <small>
                                                    Ciudad
                                                </small>

                                                <strong>
                                                    {datosEnvio.ciudad}
                                                </strong>

                                            </div>

                                        </div>

                                        <div className="dato-envio">

                                            <span>
                                                🗺️
                                            </span>

                                            <div>

                                                <small>
                                                    Provincia
                                                </small>

                                                <strong>
                                                    {datosEnvio.provincia}
                                                </strong>

                                            </div>

                                        </div>

                                        <div className="dato-envio">

                                            <span>
                                                📮
                                            </span>

                                            <div>

                                                <small>
                                                    Código postal
                                                </small>

                                                <strong>
                                                    {datosEnvio.codigoPostal}
                                                </strong>

                                            </div>

                                        </div>

                                    </div>

                                </div>

                            )}

                            {/* ================================= */}
                            {/* RESUMEN ECONÓMICO */}
                            {/* ================================= */}

                            <div className="compra-resumen">

                                <div className="compra-resumen-row">

                                    <span>
                                        Subtotal de productos
                                    </span>

                                    <strong>
                                        $
                                        {formatearPrecio(
                                            subtotal
                                        )}
                                    </strong>

                                </div>

                                <div className="compra-resumen-row">

                                    <span>
                                        Envío
                                    </span>

                                    <strong
                                        className={
                                            envio === 0
                                                ? "envio-gratis"
                                                : ""
                                        }
                                    >

                                        {envio === 0
                                            ? "GRATIS"
                                            : `$${formatearPrecio(
                                                envio
                                            )}`}

                                    </strong>

                                </div>

                                <div className="compra-resumen-divider"></div>

                                <div className="compra-resumen-total">

                                    <span>
                                        Total pagado
                                    </span>

                                    <strong>
                                        $
                                        {formatearPrecio(
                                            total
                                        )}
                                    </strong>

                                </div>

                            </div>

                        </article>

                    );

                })}

            </div>

        </section>

    );
};

ListaCompras.propTypes = {

    compras: PropTypes.array.isRequired,

};

export default ListaCompras;
