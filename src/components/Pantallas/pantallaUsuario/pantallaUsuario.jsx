
const pantallaUsuario = ({ user }) => {
    return (
        <div>
            <h2>Pantalla de Usuario</h2>
            {user ? (
                <div>
                    <p>Nombre: {user.firstName} {user.lastName}</p>
                    <p>Email: {user.email}</p>
                    {/* Aquí puedes agregar más detalles del usuario */}
                </div>
            ) : (
                <p>No hay usuario logueado.</p>
            )}
        </div>
    );
};

export default pantallaUsuario;