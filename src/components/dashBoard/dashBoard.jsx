import { useEffect, useState } from "react";
import { Button, Col, Row } from 'react-bootstrap';

const Dashboard = ({ onLogout }) => {
    const [componentsList, setComponentsList] = useState([]);
    const [usersList, setUsersList] = useState([]);
    const [searchValue, setSearchValue] = useState("");

    useEffect(() => {
        // Fetch Components
        fetch("http://localhost:8000/Componentes", {
            headers: {
                accept: "application/json"
            }
        })
            .then((response) => response.json())
            .then((componentData) => {
                setComponentsList(componentData);
            })
            .catch((error) => {
                console.log(error);
            });

        // Fetch Users
        fetch("http://localhost:8000/users", {
            headers: {
                accept: "application/json"
            }
        })
            .then((response) => response.json())
            .then((userData) => {
                setUsersList(userData);
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);

    const saveComponentDataHandler = (componentData) => {
        const newComponentData = {
            ...componentData,
            id: Math.random().toString(),
        };

        fetch("http://localhost:8000/Componentes", {
            method: "POST",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify(componentData)
        })
            .then((response) => {
                if (response.ok) return response.json();
                else {
                    throw new Error("The response has some errors");
                }
            })
            .then(() => {
                const newComponentsArray = [newComponentData, ...componentsList];
                setComponentsList(newComponentsArray);
                alert("¡Componente agregado!");
            })
            .catch((error) => console.log(error));
    };

    const deleteComponentHandler = (id) => {
        fetch(`http://localhost:8000/Componentes/${id}`, {
            method: "DELETE",
        })
            .then((response) => {
                if (response.ok) {
                    const componentsFiltered = componentsList.filter(component => component.id !== id);
                    setComponentsList(componentsFiltered);
                    alert("¡Componente eliminado!");
                } else {
                    throw new Error("The response has some errors");
                }
            })
            .catch((error) => console.log(error));
    };

    const searchHandler = (searchQuery) => {
        setSearchValue(searchQuery);
        setComponentsList(componentsList.filter(c =>
            c.name.toUpperCase().includes(searchQuery.toUpperCase())));
    };

    return (
        <>
            <Row className="w-100">
                <Col />
                <Col className="d-flex justify-content-center" md={6}>
                    <h1>PC Componentes</h1>
                </Col>
                <Col className="d-flex justify-content-end align-items-center me-4 mt-2">
                    <Button onClick={onLogout}>Cerrar sesión </Button>
                </Col>
            </Row>
            <p>¡Quiero gestionar componentes!</p>
            {/* Aquí podrías añadir un componente similar a NewBook para añadir nuevos componentes */}
            {/* <NewComponent onComponentDataSaved={saveComponentDataHandler} /> */}

            {/* Lista de componentes */}
            <div>
                <input
                    type="text"
                    placeholder="Buscar componente..."
                    value={searchValue}
                    onChange={(e) => searchHandler(e.target.value)}
                />
                <ul>
                    {componentsList.map(component => (
                        <li key={component.id}>
                            {component.name} - {component.marca} - {component.precio}
                            <Button onClick={() => deleteComponentHandler(component.id)}>Eliminar</Button>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Lista de usuarios */}
            <div>
                <h2>Usuarios</h2>
                <ul>
                    {usersList.map(user => (
                        <li key={user.id}>
                            {user.firstName} {user.lastName} - {user.email}
                        </li>
                    ))}
                </ul>
            </div>
        </>
    );
};

export default Dashboard;
