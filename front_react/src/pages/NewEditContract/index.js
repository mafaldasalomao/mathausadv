import React, { useState } from 'react';
import {
  Container,
  Typography,
  List,
  ListItem,
  ListItemText,
  TextField,
  Button,
  Box
} from '@mui/material';
import './styles.css'; // Importa o arquivo CSS

const NewEditContract = () => {
  // Estado para os dados dos contratantes
  const [contratantes, setContratantes] = useState([]);

  // Estado para os dados do documento
  const [contract, setContract] = useState({
    name: '',
    description: ''
  });




  // Função para lidar com a mudança dos inputs do documento
  const handleContractChange = (e) => {
    const { name, value } = e.target;
    setContract({ ...contract, [name]: value });
  };

  // Função para lidar com a submissão do formulário do documento
  const handleSubmit = (e) => {
    e.preventDefault();
    // console.log('Contratantes:', contratantes);
    console.log('Contrato:', contract);
  };

  return (
    <Container className="container-contract">
      <Typography variant="h4" gutterBottom className="title">
        Novo Contrato
      </Typography>



      {contratantes.length === 0 ? (
        <></>
      ) : (
        <>
          <Typography variant="h6" gutterBottom className="subtitle">
            Dados das partes
          </Typography>
          <List className="list">
            {contratantes.map((cont, index) => (
              <ListItem key={index} className="list-item">
                <ListItemText
                  primary={`Nome: ${cont.nome || 'Não informado'}`}
                  secondary={`CPF: ${cont.cpf || 'Não informado'}, Email: ${cont.email || 'Não informado'}, Telefone: ${cont.telefone || 'Não informado'}`}
                  className="list-item-text"
                />
              </ListItem>
            ))}
          </List>
        </>
      )}




      {/* Formulário de Cadastro do Documento */}
      <Typography variant="h6" gutterBottom className="subtitle">
        Dados do Contrato
      </Typography>
      <form onSubmit={handleSubmit}>
        <Box mb={2}>
          <TextField
            label="Nome"
            name="name"
            value={contract.name}
            onChange={handleContractChange}
            fullWidth
            required
            className="input-field"
          />
        </Box>
        <Box mb={2}>
          <TextField
            label="Descrição"
            name="description"
            value={contract.description}
            onChange={handleContractChange}
            fullWidth
            required
            multiline
            rows={4}
            className="input-field"
          />
        </Box>
        <Button variant="contained" className="button-generate" type="submit">
          Gerar Contrato
        </Button>
      </form>
    </Container>
  );
};

export default NewEditContract;