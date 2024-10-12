import React from 'react';
import { Link } from 'react-router-dom'; // Certifique-se de que o Link esteja importado
import { IoMdDocument } from "react-icons/io";
import './styles.css'; // Criar um arquivo CSS separado para os estilos

const CardComponent = ({title, description}) => {
  return (
      <div className="card-container">
          <Link to="/user/documents/new" className="link-no-underline">
              <div className="card">
                  <div className="card-icon">
                      <IoMdDocument style={{ color: "#262f4d", fontSize: "2.5em" }} />
                  </div>
                  <h3>{title}</h3>
                  <p>{description}</p>
              </div>
          </Link>
      </div>
  );
};

export default CardComponent;