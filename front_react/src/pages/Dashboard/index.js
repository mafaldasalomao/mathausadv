import React from "react";
import "./styles.css";


import CardComponent from "../../components/CardComponent";
export default function Dashboard() {

      
    return (
        <>
            <div className="dashboard">
                {/* <h1>Dashboard</h1> */}
                <CardComponent  title={"Escrever um documento"}
                                description={"Gere um documento com os campos para assinatura no D4sign"}/>
            </div>
        </>
    );
    
}