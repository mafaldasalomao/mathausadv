import React from 'react';
import './styles.css'; // Criar um arquivo CSS separado para os estilos

const CardComponent = ({title, description}) => {
  return (
    <div className="card-container">
      <div className="card">
        <div className="card-icon">📄</div>
        <h3>{title}</h3>
        <p>
          {description}
        </p>
      </div>
    </div>
  );
};

export default CardComponent;