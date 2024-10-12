import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, IconButton, Typography, TextField } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import './styles.css'; // Importa as cores personalizadas

const ContractList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  // Filtra os contratos com base no termo de busca
  const navigate = useNavigate();
  const contracts = [
    { name: 'Contrato A', description: 'Descrição do contrato A', createdAt: '2024-10-10' },
    { name: 'Contrato B', description: 'Descrição do contrato B', createdAt: '2024-10-11' },
    { name: 'Contrato C', description: 'Descrição do contrato C', createdAt: '2024-10-12' },
  ];
  const filteredContracts = contracts.filter(
    (contract) =>
      contract.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateContract = () => {
    // Lógica para criar um novo contrato
    navigate('/user/contracts/new');
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
        Criar Novo Contrato
      </Button>
      <TextField
        label="Filtrar contratos"
        variant="outlined"
        fullWidth
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ marginBottom: '24px' }}
        InputProps={{
          style: { color: 'var(--dark-brown)' },
        }}
        InputLabelProps={{
          style: { color: 'rgba(94, 94, 94, 0.712)' },
        }}
      />

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell style={{ color: 'var(--orange)', fontWeight: 'bold' }}>Nome</TableCell>
              <TableCell style={{ color: 'var(--orange)', fontWeight: 'bold' }}>Descrição</TableCell>
              <TableCell style={{ color: 'var(--orange)', fontWeight: 'bold' }}>Data de Criação</TableCell>
              <TableCell style={{ color: 'var(--orange)', fontWeight: 'bold' }}>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredContracts.map((contract, index) => (
              <TableRow key={index}>
                <TableCell style={{ color: 'var(--dark-brown)' }}>{contract.name}</TableCell>
                <TableCell style={{ color: 'var(--dark-brown)' }}>{contract.description}</TableCell>
                <TableCell style={{ color: 'var(--dark-brown)' }}>{contract.createdAt}</TableCell>
                <TableCell>
                  <IconButton aria-label="edit" style={{ color: 'var(--orange)' }}>
                    <EditIcon />
                  </IconButton>
                  <IconButton aria-label="delete" style={{ color: 'var(--dark-orange)' }}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default ContractList;
