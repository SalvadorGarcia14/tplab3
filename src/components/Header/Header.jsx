import { useState } from "react";
import { useHistory } from 'react-router-dom';
import "./Header.css";



function Header({ onSearch }) {
    const [searchTerm, setsearchTerm] = useState("");
    const history = useHistory;

    const handleSearchChange = (e) => {
        setsearchTerm(e.target.value);
    }

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        onSearch(searchTerm);
    }

    const goToHombe = () => {
        history.push("/profile");
    }



    return ( <
        header className = "header" >
        <
        div className = "header-container" >
        <
        button onClick = { goToHome }
        className = "nav-button" > Inicio < /button> <
        form onSubmit = { handleSearchSubmit }
        className = "search-form" >
        <
        input type = "text"
        value = { searchTerm }
        onChange = { handleSearchChange }
        placeholder = "Buscar productos..."
        className = "search-input" /
        >
        <
        button type = "submit"
        className = "search-button" > Buscar < /button> <
        /form> <
        button onClick = { goToProfile }
        className = "nav-button" > Perfil < /button> <
        /div> <
        /header>
    )

}


export default Header;