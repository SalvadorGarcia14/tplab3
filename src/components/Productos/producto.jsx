import 'bootstrap/dist/css/bootstrap.min.css';

const Producto = ({ producto }) => {
  return (
    <div className="card" style={{ width: '18rem' }}>
      <img src={producto.imagen} className="card-img-top" alt={producto.name} />
      <div className="card-body">
        <h5 className="card-title">{producto.name}</h5>
        <p className="card-text">Marca: {producto.marca}</p>
        <p className="card-text">Precio: ${producto.precio.toLocaleString()}</p>
        <p className="card-text">Status: {producto.status ? "En stock" : "Agotado"}</p>
        <button className="btn btn-primary">Agregar al carrito</button>
      </div>
    </div>
  );
};

export default Producto;