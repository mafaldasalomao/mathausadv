import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Table, TableBody, TableCell, TableContainer, FormControl, InputLabel, Select, TableHead, MenuItem, TableRow, Paper, Button, IconButton, Typography, TextField, CircularProgress, Icon } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import Pagination from '@mui/material/Pagination';
import VisibilityIcon from '@mui/icons-material/Visibility';
import './styles.css'; // Importa as cores personalizadas
import useAxiosPrivate from '../../hooks/useAxiosPrivate';

const ContractList = () => {

  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const apiPrivate = useAxiosPrivate();
  const [contracts, setContracts] = useState([]);
  // Filtra os contratos com base no termo de busca


  const [filters, setFilters] = useState({ name: '', description: '', status: '' });
  const statuses = ['CONTRATAÇÃO', 'PRÉ-EXECUÇÃO', 'EXECUÇÃO DO SERVIÇO', 'ADITIVO', 'REVISÃO CONTRATUAL', 'ENCERRAMENTO'];



  const navigate = useNavigate();


  useEffect(() => {
    const fetchContracts = async () => {
      try {
        setIsLoading(true);
        const queryParams = new URLSearchParams({
          page,
          per_page: 10,
          ...filters,
        }).toString();
        const response = await apiPrivate.get(`/contracts?${queryParams}`);
        setContracts(response.data.contracts);
        setTotalPages(response.data.total_pages);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        console.error('Erro ao buscar os contratos:', error);
      }
    };
    fetchContracts();
  }, [page, filters]);
  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };



  const handleCreateContract = () => {
    // Lógica para criar um novo contrato
    navigate('/user/contracts/new');
  };
  const getStatusIcon = (status) => {
    switch (status) {
      case 'CONTRATAÇÃO':
        return '📝'; // Ícone de documento
      case 'PRÉ-EXECUÇÃO':
        return '✍️'; // Ícone de assinatura
      case 'EXECUÇÃO DO SERVIÇO':
        return '⚙️'; // Ícone de engrenagem
      case 'ADITIVO':
        return '🔄'; // Ícone de alteração
      case 'REVISÃO CONTRATUAL':
        return '⚠️'; // Ícone de alerta
      case 'ENCERRAMENTO':
        return '✔️'; // Ícone de check
      default:
        return '❓'; // Ícone padrão para desconhecido
    }
  };
  const getStatusColor = (status) => {
    switch (status) {
      case 'CONTRATAÇÃO':
        return '#D97C2B'; // Laranja
      case 'PRÉ-EXECUÇÃO':
        return '#4A90E2'; // Azul Claro
      case 'EXECUÇÃO DO SERVIÇO':
        return '#4CAF50'; // Verde
      case 'ADITIVO':
        return '#f3a600'; // Amarelo
      case 'REVISÃO CONTRATUAL':
        return '#F44336'; // Vermelho
      case 'ENCERRAMENTO':
        return '#9E9E9E'; // Cinza
      default:
        return 'var(--dark-brown)'; // Cor padrão
    }
  };
  return (
    <div>
      <Typography variant="h4" style={{ color: 'var(--orange)', marginBottom: '16px' }}>
        Lista de Contratos
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={handleCreateContract}
        style={{ marginBottom: '16px', backgroundColor: 'var(--orange)', color: 'white' }}
      >
        <AddIcon sx={{ marginRight: '8px' }} />
        Novo Contrato
      </Button>

      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
        <TextField
          label="Nome"
          variant="outlined"
          value={filters.name}
          onChange={(e) => handleFilterChange('name', e.target.value)}
          fullWidth
        />
        <TextField
          label="Descrição"
          variant="outlined"
          value={filters.description}
          onChange={(e) => handleFilterChange('description', e.target.value)}
          fullWidth
        />
        <FormControl fullWidth>
          <InputLabel>Status</InputLabel>
          <Select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
          >
            <MenuItem value="">Todos</MenuItem>
            {statuses.map((status, index) => (
              <MenuItem key={index} value={status}>{status}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell style={{ color: 'var(--orange)', fontWeight: 'bold' }}>Nome</TableCell>
              <TableCell style={{ color: 'var(--orange)', fontWeight: 'bold' }}>Descrição</TableCell>
              <TableCell style={{ color: 'var(--orange)', fontWeight: 'bold' }}>Data de Criação</TableCell>
              <TableCell style={{ color: 'var(--orange)', fontWeight: 'bold' }}>Status</TableCell>
              <TableCell style={{ color: 'var(--orange)', fontWeight: 'bold' }}>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : (
              contracts.map((contract, index) => (
                <TableRow key={index}>
                  <TableCell style={{ color: 'var(--dark-brown)' }}>{contract.name}</TableCell>
                  <TableCell style={{ color: 'var(--dark-brown)' }}>{contract.description}</TableCell>
                  <TableCell style={{ color: 'var(--dark-brown)' }}>{contract.created_at}</TableCell>
                  <TableCell style={{ color: getStatusColor(contract.status) }}>
                    {getStatusIcon(contract.status)} {contract.status}
                  </TableCell>
                  <TableCell>
                    {/* <IconButton aria-label="edit" style={{ color: 'var(--orange)' }}>
                      <EditIcon />
                    </IconButton>
                    <IconButton aria-label="delete" style={{ color: 'var(--dark-orange)' }}>
                      <DeleteIcon />
                    </IconButton> */}
                    <IconButton aria-label="view" style={{ color: 'var(--orange)' }} onClick={() => navigate(`/user/contracts/${contract.contract_id}`)}>
                      <VisibilityIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}

          </TableBody>
        </Table>
      </TableContainer>
      {/* Pagination Component Separado da Tabela */}
      {!isLoading &&
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '16px' }}>
          <Pagination
            count={totalPages}  // Número total de páginas
            page={page}  // Página atual
            onChange={handlePageChange}  // Função chamada quando a página é alterada
            color="primary"
          />
        </div>
      }

    </div>
  );
};

export default ContractList;
