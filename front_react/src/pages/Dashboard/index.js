import React from "react";
import "./styles.css";


import CardComponent from "../../components/CardComponent";
export default function Dashboard() {

      
    return (
        <>
            <div className="dashboard">
                {/* <h1>Dashboard</h1> */}
                <CardComponent  title={"Gerar pasta de Contrato"}
                                description={"Gere uma pasta pra um novo contrato e salve no GDrive"}
                                link_to={"/user/contracts/new"}/>
            </div>
        </>
    );
    
}