import React, { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  CircularProgress
} from '@mui/material';
import './styles.css'; // Importa o arquivo CSS
import Swal from 'sweetalert2';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
const NewEditDocument = () => {
  const { contract_id } = useParams();
  const [loading, setLoading] = useState(false);
  const [msgLoading, setMsgLoading] = useState('Aguarde, estamos gerando o contrato...');
  const navigate = useNavigate();
  // const queryParams = new URLSearchParams(location.search);
  // const document_type = queryParams.get('type');
  const apiPrivate = useAxiosPrivate();
  // Estado para os dados do documento
  const [documento, setDocumento] = useState({
    service: '',
    fees: '',
    description: '',
    document_type: 'contrato',
    contract_id: contract_id
  });




  // Função para lidar com a mudança dos inputs do documento
  const handleDocumentoChange = (e) => {
    const { name, value } = e.target;
    setDocumento({ ...documento, [name]: value });
  };

  // Função para lidar com a submissão do formulário do documento
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await apiPrivate.post('/documents', documento, {
        withCredentials: true
      });
      setMsgLoading('Aguarde, estamos gerando a declaração de hipossuficiência...');
      const document_dh = {
        ...documento,
        document_type: 'dh' // Muda o tipo de documento para 'dh'
      };
      const response_dh = await apiPrivate.post('/documents', document_dh, {
        withCredentials: true
      });
      setMsgLoading('Aguarde, estamos gerando a procuração...');
      const document_procuracao = {
        ...documento,
        document_type: 'procuracao' // Muda o tipo de documento para 'dh'
      };
      const response_procuracao = await apiPrivate.post('/documents', document_procuracao, {
        withCredentials: true
      });

      if (response.status !== 201) {
        Swal.fire({
          icon: 'error',
          title: 'Erro',
          text: 'Ocorreu um erro ao criar os documentos.',
          confirmButtonText: 'Ok',
        });
        return;
      }

      Swal.fire({
        icon: 'success',
        title: 'Documentos criados!',
        text: 'Todos os documentos foram criados com sucesso!',
        confirmButtonText: 'Ok',
      });

      navigate(`/user/contracts/${contract_id}`);
      // console.log('Documento:', documento);
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Erro',
        text: 'Ocorreu um erro ao criar os documentos.',
        confirmButtonText: 'Ok',
      });
    } finally {
      setLoading(false); // Desativa o loading
    }
  };

  return (
    <Container className="container">
      <Typography variant="h4" gutterBottom className="title">
        Gerar Documentos Principais
      </Typography>


      {loading ? (
        <Box textAlign="center" mt={4}>
          <CircularProgress />
          <Typography variant="body1" mt={2}>
            {msgLoading}
          </Typography>
        </Box>
      ) : (
        <>
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
            <Button variant="contained" className="button-generate" type="submit" disabled={loading}>
              Gerar
            </Button>
          </form>
        </>
      )}
    </Container>
  );
};

export default NewEditDocument;