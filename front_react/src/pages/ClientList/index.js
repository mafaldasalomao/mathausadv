import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Table, TableBody, TableCell, TableContainer, FormControl, InputLabel, Select, TableHead, MenuItem, TableRow, Paper, Button, IconButton, Typography, TextField, CircularProgress, Icon } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import Pagination from '@mui/material/Pagination';
import VisibilityIcon from '@mui/icons-material/Visibility';
import './styles.css'; // Importa as cores personalizadas
import useAxiosPrivate from '../../hooks/useAxiosPrivate';

const ClientList = () => {

  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const apiPrivate = useAxiosPrivate();
  const [clients, setClients] = useState([]);
  // Filtra os contratos com base no termo de busca

  const [searchQueryName, setSearchQueryName] = useState('');
  const [searchQueryEmail, setSearchQueryEmail] = useState('');
  const [searchQueryPhone, setSearchQueryPhone] = useState('');
  const [searchQueryCpf_cnpj, setSearchQueryCpf_cnpj] = useState('');
  const [appliedFilters, setAppliedFilters] = useState({});




  const navigate = useNavigate();


  useEffect(() => {
    const fetchClients = async () => {
      try {
        setIsLoading(true);
        const queryParams = new URLSearchParams({
          page,
          per_page: 10,
          ...appliedFilters, 
        }).toString();
        const response = await apiPrivate.get(`/allclients?${queryParams}`);
        setClients(response.data.clients);
        setTotalPages(response.data.total_pages);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        console.error('Erro ao buscar os contratos:', error);
      }
    };
    fetchClients();
  }, [page, appliedFilters]);
  const handlePageChange = (event, value) => {
    setPage(value);
  };


  const handleApplyFilters = () => {
    setAppliedFilters({
      name: searchQueryName,
      email: searchQueryEmail,
      cpf_cnpj: searchQueryCpf_cnpj,
      phone: searchQueryPhone
    });
    setPage(1); 
  };

  return (
    <div>
      <Typography variant="h4" style={{ color: 'var(--orange)', marginBottom: '16px' }}>
        Lista de Clientes
      </Typography>
     

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
        <TextField
          label="Nome"
          variant="outlined"
          value={searchQueryName}
          onChange={(e) => setSearchQueryName(e.target.value)}
          style={{ flex: 1 }}
        />
        <TextField
          label="Email"
          variant="outlined"
          value={searchQueryEmail}
          onChange={(e) => setSearchQueryEmail(e.target.value)}
          style={{ flex: 1 }}
        />
        <TextField
          label="CPF/CNPJ"
          variant="outlined"
          value={searchQueryCpf_cnpj}
          onChange={(e) => setSearchQueryCpf_cnpj(e.target.value)}
          style={{ flex: 1 }}
        />
        <TextField
          label="Telefone"
          variant="outlined"
          value={searchQueryPhone}
          onChange={(e) => setSearchQueryPhone(e.target.value)}
          style={{ flex: 1 }}
        />
        
        <Button
          variant="contained"
          color="primary"
          onClick={handleApplyFilters}
          style={{ backgroundColor: 'var(--orange)', color: 'white' }}
        >
          Aplicar Filtros
        </Button>
      </div>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell style={{ color: 'var(--orange)', fontWeight: 'bold' }}>Nome</TableCell>
              <TableCell style={{ color: 'var(--orange)', fontWeight: 'bold' }}>CPF/CNPJ</TableCell>
              <TableCell style={{ color: 'var(--orange)', fontWeight: 'bold' }}>Email</TableCell>
              <TableCell style={{ color: 'var(--orange)', fontWeight: 'bold' }}>Telefone</TableCell>
              <TableCell style={{ color: 'var(--orange)', fontWeight: 'bold' }}>Responsável</TableCell>
              <TableCell style={{ color: 'var(--orange)', fontWeight: 'bold' }}>Endereço</TableCell>
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
              clients.map((client, index) => (
                <TableRow key={index}>
                  <TableCell style={{ color: 'var(--dark-brown)' }}>{client.name}</TableCell>
                  <TableCell style={{ color: 'var(--dark-brown)' }}>{client.cpf_cnpj}</TableCell>
                  <TableCell style={{ color: 'var(--dark-brown)' }}>{client.email}</TableCell>
                  <TableCell style={{ color: 'var(--dark-brown)' }}>{client.phone}</TableCell>
                  <TableCell style={{ color: 'var(--dark-brown)' }}>{client.responsible ? client.responsible.name : 'Sem responsável'}</TableCell>
                  <TableCell style={{ color: 'var(--dark-brown)' }}>{client.address}</TableCell>
                  
                  <TableCell>

                    <IconButton aria-label="view" style={{ color: 'var(--orange)' }} onClick={() => navigate(`/user/contracts/${client.contract_id}`)}>
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

export default ClientList;
