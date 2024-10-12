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

const NewEditDocument = () => {
  // Estado para os dados dos contratantes
  const [contratantes, setContratantes] = useState([]);

  // Estado para os dados do documento
  const [documento, setDocumento] = useState({
    servico: '',    
    honorarios: ''
  });

  // Estado para controlar a abertura do modal
  const [open, setOpen] = useState(false);

  // Estado para os dados do novo contratante
  const [novoContratante, setNovoContratante] = useState({
    nome: '',
    cpf: '',
    email: '',
    telefone: ''
  });

  // Função para lidar com a mudança dos inputs do novo contratante
  const handleNovoContratanteChange = (e) => {
    const { name, value } = e.target;
    setNovoContratante({ ...novoContratante, [name]: value });
  };

  // Função para adicionar um novo contratante
  const addContratante = () => {
    setContratantes([...contratantes, novoContratante]);
    setNovoContratante({ nome: '', cpf: '', email: '', telefone: '' }); // Limpar o estado do novo contratante
    setOpen(false); // Fechar o modal
  };

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
        Cadastro de Documento de Contrato
      </Typography>

      {/* Lista de Dados dos Contratantes */}
      <Typography variant="h6" gutterBottom className="subtitle">
        Dados dos Contratantes
      </Typography>
      {contratantes.length === 0 ? (
        <Typography variant="body1" sx={{ color: 'gray' }}>
          Adicione as partes do documento
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

      {/* Botão para abrir o modal de adicionar uma nova parte */}
      <Button variant="outlined" onClick={() => setOpen(true)} className="button-add">
        + Parte
      </Button>

      {/* Modal para adicionar novo contratante */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle className="dialog-title">Adicionar Novo Contratante</DialogTitle>
        <DialogContent className="dialog-content">
          <TextField
            label="Nome"
            name="nome"
            value={novoContratante.nome}
            onChange={handleNovoContratanteChange}
            fullWidth
            className="input-field"
          />
          <TextField
            label="CPF"
            name="cpf"
            value={novoContratante.cpf}
            onChange={handleNovoContratanteChange}
            fullWidth
            className="input-field"
          />
          <TextField
            label="Email"
            name="email"
            value={novoContratante.email}
            onChange={handleNovoContratanteChange}
            fullWidth
            className="input-field"
          />
          <TextField
            label="Telefone"
            name="telefone"
            value={novoContratante.telefone}
            onChange={handleNovoContratanteChange}
            fullWidth
            className="input-field"
          />
        </DialogContent>
        <DialogActions className="dialog-actions">
          <Button onClick={() => setOpen(false)} sx={{ color: 'var(--orange)' }}>
            Cancelar
          </Button>
          <Button onClick={addContratante} sx={{ color: 'var(--orange)' }}>
            Adicionar
          </Button>
        </DialogActions>
      </Dialog>

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

export default NewEditDocument;