import React, { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box
} from '@mui/material';
import './styles.css'; // Importa o arquivo CSS
import Swal from 'sweetalert2';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
const NewEditDocument = () => {
  const { contract_id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const document_type = queryParams.get('type');
  const apiPrivate = useAxiosPrivate();
  // Estado para os dados do documento
  const [documento, setDocumento] = useState({
    service: '',    
    fees: '',
    description: '',
    document_type: document_type,
    contract_id: contract_id
  });




  // Função para lidar com a mudança dos inputs do documento
  const handleDocumentoChange = (e) => {
    const { name, value } = e.target;
    setDocumento({ ...documento, [name]: value });
  };

  // Função para lidar com a submissão do formulário do documento
  const handleSubmit = async(e) => {
    e.preventDefault();
    const response = await apiPrivate.post('/documents', documento, {
      withCredentials: true
    })

    if (response.status !== 201) {
      Swal.fire({
        icon: 'error',
        title: 'Erro',
        text: 'Ocorreu um erro ao criar o documento.',
        confirmButtonText: 'Ok',
      })
      return;
    }
    Swal.fire({
      icon: 'success',
      title: 'Sucesso',
      text: 'Documento criado com sucesso!',
      confirmButtonText: 'Ok',
    })

    navigate(`user/contracts/${contract_id}`);
    console.log('Documento:', documento);
  };

  return (
    <Container className="container">
      <Typography variant="h4" gutterBottom className="title">
        Geração do Documento de Contrato
      </Typography>

    

      {/* Formulário de Cadastro do Documento */}
      <Typography variant="h6" gutterBottom className="subtitle">
        Dados do Documento
      </Typography>
      <form onSubmit={handleSubmit}>
        <Box mb={2}>
          <TextField
            label="Serviço"
            name="service"
            value={documento.service}
            onChange={handleDocumentoChange}
            fullWidth
            required
            className="input-field"
          />
        </Box>
        <Box mb={2}>
          <TextField
            label="Honorários"
            name="fees"
            value={documento.fees}
            onChange={handleDocumentoChange}
            fullWidth
            multiline
            rows={4}
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