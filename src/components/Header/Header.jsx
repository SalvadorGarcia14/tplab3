
import "../Header/Header"

//Arreglar

const Header = () => {
  const goToApp = () => {
    window.location.href = '/app'; // Cambia '/app' a la ruta correspondiente de tu aplicación
  };

  const goToProfile = () => {
    window.location.href = '/profile'; // Cambia '/profile' a la ruta correspondiente de tu aplicación
  };

  const handleSearch = (event) => {
    event.preventDefault();
    const query = event.target.search.value;
    // Implementa la lógica de búsqueda aquí
    console.log('Buscando:', query);
  };

  return (
    <header className="header">
      <button className="header-button" onClick={goToApp}>
        Ir a la App
      </button>
      <form className="search-form" onSubmit={handleSearch}>
        <input
          type="text"
          name="search"
          placeholder="Buscar producto"
          className="search-input"
        />
        <button type="submit" className="search-button">
          Buscar
        </button>
      </form>
      <button className="header-button" onClick={goToProfile}>
        Perfil
      </button>
    </header>
  );
};

export default Header;