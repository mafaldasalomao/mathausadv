import React, { useState } from 'react';
import {
  Container,
  Typography,
  List,
  ListItem,
  ListItemText,
  TextField,
  Button,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import './styles.css'; // Importa o arquivo CSS

const NewEditContract = () => {
  // Estado para os dados dos contratantes
  const [contratantes, setContratantes] = useState([]);

  // Estado para os dados do documento
  const [documento, setDocumento] = useState({
    servico: '',    
    honorarios: ''
  });




  // Função para lidar com a mudança dos inputs do documento
  const handleDocumentoChange = (e) => {
    const { name, value } = e.target;
    setDocumento({ ...documento, [name]: value });
  };

  // Função para lidar com a submissão do formulário do documento
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Contratantes:', contratantes);
    console.log('Documento:', documento);
  };

  return (
    <Container className="container">
      <Typography variant="h4" gutterBottom className="title">
        Novo Contrato
      </Typography>

      {/* Lista de Dados dos Contratantes */}
      <Typography variant="h6" gutterBottom className="subtitle">
        Dados das partes
      </Typography>
      {contratantes.length === 0 ? (
        <Typography variant="body1" sx={{ color: 'gray' }}>
          Não será possível gerar o documentos sem antes cadastrar as partes
        </Typography>
      ) : (
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
      )}


  

      {/* Formulário de Cadastro do Documento */}
      <Typography variant="h6" gutterBottom className="subtitle">
        Dados do Documento
      </Typography>
      <form onSubmit={handleSubmit}>
        <Box mb={2}>
          <TextField
            label="Serviço"
            name="servico"
            value={documento.servico}
            onChange={handleDocumentoChange}
            fullWidth
            required
            className="input-field"
          />
        </Box>
        <Box mb={2}>
          <TextField
            label="Honorários"
            name="honorarios"
            value={documento.honorarios}
            onChange={handleDocumentoChange}
            fullWidth
            required
            className="input-field"
          />
        </Box>
        <Button variant="contained" className="button-generate" type="submit">
          Gerar
        </Button>
      </form>
    </Container>
  );
};

export default NewEditContract;