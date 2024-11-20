import React from "react";
import "./styles.css";


import CardComponent from "../../components/CardComponent";
export default function Dashboard() {


    return (
        <>
            <div className="dashboard">
                {/* <h1>Dashboard</h1> */}
                <CardComponent title={"Gerar pasta de Contrato"}
                    description={"Gere uma pasta de contrato"}
                    link_to={"/user/contracts/new"} />
                <CardComponent title={"Lista de Contratos"}
                    description={"Ir para listagem de contratos"}
                    link_to={"/user/contracts"} />
                <CardComponent title={"Lista de Clientes"}
                    description={"Ir para listagem de clientes"}
                    link_to={"/user/clients"} />
            </div>
        </>
    );

}