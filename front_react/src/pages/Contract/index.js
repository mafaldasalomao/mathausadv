import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Typography,
    Button,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    IconButton,
    CircularProgress,
    Paper,
    Dialog,
    DialogTitle,
    DialogContent,
    TextField,
    DialogActions,
    Box,
    Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow,
    Stack,
    Grid
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DriveIcon from '@mui/icons-material/DriveFileMove';
import DeleteIcon from '@mui/icons-material/Delete';
import { Divider } from '@mui/material'
import './styles.css';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import Swal from 'sweetalert2';
const Contract = () => {
    const { contract_id } = useParams();
    const navigate = useNavigate();
    const apiPrivate = useAxiosPrivate();

    const [contract, setContract] = useState(null);
    const [client_id, setClientId] = useState(null);
    const [parts, setParts] = useState([]);
    const [documents, setDocuments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [open, setOpen] = useState(false);

    const [novoContratante, setNovoContratante] = useState({
        name: '',
        cpf_cnpj: '',
        email: '',
        phone: '',
        address: '',
        responsible_id: null,
        responsible: null
    });

    const fetchContractDetails = async () => {
        try {
            const response = await apiPrivate.get(`/contract/${contract_id}`);
            setContract(response.data);
            setParts(response.data.clients || []);
            setDocuments(response.data.documents || []);
            setIsLoading(false);
        } catch (error) {
            console.error('Erro ao buscar os detalhes do contrato:', error);
            setIsLoading(false);
        }
    };

    const handleAddPart = (client_id) => {
        setClientId(client_id);
        setOpen(true);
    };

    const handleCloseModal = () => {
        setOpen(false);
        setNovoContratante({
            name: '',
            cpf_cnpj: '',
            email: '',
            phone: '',
            address: '',
            responsible_id: null,
            responsible: null
        });
    };

    useEffect(() => {
        fetchContractDetails();
    }, [contract_id]);

    const handleNovoContratanteChange = (event) => {
        const { name, value } = event.target;
        setNovoContratante((prev) => ({
            ...prev,
            [name]: value,
        }));
    };


    // const sendDocument = async (type) => {
    //     try {
    //         const formData = new FormData();
    //         formData.append('service', 'vazio');
    //         formData.append('fees', 'vazio');
    //         formData.append('description', 'vazio');
    //         formData.append('document_type', type);
    //         formData.append('contract_id', contract_id);
    //         const response = await apiPrivate.post('/documents', formData, {
    //             withCredentials: true
    //         });
    //         setDocuments([...documents, response.data]);
    //     } catch (error) {        
    //         console.error('Erro ao enviar o documento:', error);
    //     }

    // }
    const handleUploadDocument = () => {
        navigate("documents/new");
    };

    const areFieldsFilled = () => {
        return (
            novoContratante.name &&
            novoContratante.cpf_cnpj &&
            novoContratante.email &&
            novoContratante.phone &&
            novoContratante.address
        );
    };

    const addContratante = async () => {
        if (!areFieldsFilled()) {
            alert('Por favor, preencha todos os campos.');
            return;
        }
        setOpen(false);

        // Mostrar tela de carregamento
        const loadingSwal = Swal.fire({
            title: 'Aguarde...',
            text: 'Estamos adicionando ...',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading(); // Mostra o indicador de loading
            }
        });
        try {
            if (!client_id) {
                await apiPrivate.post(`/contract/${contract_id}/clients`, novoContratante);
                setParts((prev) => [...prev, novoContratante]);
            } else {
                await apiPrivate.post(`/contract/${contract_id}/client/${client_id}/responsable`, novoContratante);
                await fetchContractDetails()
            }
            loadingSwal.close();
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Ocorreu um erro ao adicionar o contratante.',
            })
            loadingSwal.close();
        }

        setClientId(null);

        handleCloseModal();
    };

    const handleDeletePart = async (clientId) => {
        try {
            Swal.fire({
                title: 'Deseja deletar este contratante?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: 'var(--orange)',
                cancelButtonColor: 'var(--deep-black)',
                confirmButtonText: 'Sim',
                cancelButtonText: 'Cancelar'
            }).then(async (result) => {
                if (result.isConfirmed) {
                    const loadingSwal = Swal.fire({
                        title: 'Aguarde...',
                        text: 'Estamos excluindo ...',
                        allowOutsideClick: false,
                        didOpen: () => {
                            Swal.showLoading(); // Mostra o indicador de loading
                        }
                    });
                    const response = await apiPrivate.delete(`/client/${clientId}`);
                    if (response.status === 200) {
                        fetchContractDetails();
                        loadingSwal.close();
                        Swal.fire({
                            title: 'Contratante excluído com sucesso!',
                            icon: 'success',
                            confirmButtonColor: 'var(--orange)',
                            confirmButtonText: 'OK'
                        });

                    } else {
                        loadingSwal.close();
                        Swal.fire({
                            title: 'Ocorreu um erro ao excluir o contratante.',
                            icon: 'error',
                            confirmButtonColor: 'var(--orange)',
                            confirmButtonText: 'OK'
                        });
                    }
                }
            }).catch((error) => {

                Swal.fire({
                    title: 'Ocorreu um erro ao excluir o contratante.',
                    icon: 'error',
                    confirmButtonColor: 'var(--orange)',
                    confirmButtonText: 'OK'
                })
            })
        } catch (error) {
            console.error('Erro ao excluir o contratante:', error);
        }
    };

    if (isLoading) {
        return <CircularProgress style={{ display: 'block', margin: 'auto', marginTop: '20px' }} />;
    }

    return (
        <div style={{ padding: '16px' }}>
            <Typography variant="h4" style={{ color: 'var(--orange)', marginBottom: '16px' }}>
                {contract.name} - {contract.created_at}
            </Typography>

            <Typography variant="h6" style={{ color: 'var(--orange)', marginBottom: '8px' }}>
                Dados das Partes
            </Typography>
            <List component={Paper} style={{ marginBottom: '24px' }}>
                {parts.length > 0 ? (
                    parts.map((part, index) => (
                        <div key={index}>
                            <ListItem>
                                <Grid container spacing={2} alignItems="center">
                                    {/* Coluna de Dados do Contratante */}
                                    <Grid item xs={4}>
                                        <ListItemText
                                            primary={<>{part.name} - Contratante</>}
                                            secondary={
                                                <>
                                                    <div>{part.cpf_cnpj.length === 11 ? "CPF" : "CNPJ"}: {part.cpf_cnpj}</div>
                                                    <div>Email: {part.email}</div>
                                                    <div>Telefone: {part.phone}</div>
                                                    <div>Endereço: {part.address}</div>
                                                </>
                                            }
                                        />
                                    </Grid>

                                    {/* Coluna de Dados do Responsável (se houver) */}
                                    <Grid item xs={4}>
                                        {part.responsible ? (
                                            <ListItemText
                                                primary={<>{part.responsible.name} - Responsável</>}
                                                secondary={
                                                    <>
                                                        <div>CPF: {part.responsible.cpf_cnpj}</div>
                                                        <div>Email: {part.responsible.email}</div>
                                                        <div>Telefone: {part.responsible.phone}</div>
                                                        <div>Endereço: {part.responsible.address}</div>
                                                    </>
                                                }
                                            />
                                        ) : (
                                            <Typography variant="body2" color="textSecondary">
                                                Sem responsável
                                            </Typography>
                                        )}
                                    </Grid>

                                    {/* Coluna de Ações */}
                                    <Grid item xs={4} style={{ textAlign: 'right' }}>
                                        {!part.responsible && (
                                            <Button
                                                variant="outlined"
                                                startIcon={<AddIcon />}
                                                onClick={() => handleAddPart(part.client_id)}
                                                className="button-add"
                                            >
                                                Responsável
                                            </Button>
                                        )}

                                        <Button
                                            variant="outlined"
                                            color="secondary"
                                            onClick={() => handleDeletePart(part.client_id)}
                                            style={{ marginLeft: '8px' }}
                                        >
                                            <DeleteIcon />
                                        </Button>
                                    </Grid>
                                </Grid>
                            </ListItem>
                            {index < parts.length - 1 && <Divider />}
                        </div>
                    ))
                ) : (
                    <Typography variant="body2" style={{ padding: '16px' }}>
                        Nenhuma parte cadastrada.
                    </Typography>
                )}

                <ListItem>
                    <Button
                        variant="outlined"
                        startIcon={<AddIcon />}
                        onClick={() => handleAddPart(null)}
                        className="button-add"
                    >
                        Novo Contratante
                    </Button>
                </ListItem>
            </List>


            <Typography variant="h6" style={{ color: 'var(--orange)', marginBottom: '8px' }}>
                Documentos
            </Typography>
            <List component={Paper}>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Nome</TableCell>
                                <TableCell>Google Drive</TableCell>
                                <TableCell>Data de Assinatura</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {documents.length > 0 ? (
                                documents.map((document, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{document.name}</TableCell>
                                        <TableCell>
                                            <a href={`https://drive.google.com/uc?id=${document.gdrive_id}`} target="_blank" rel="noopener noreferrer">
                                                <DriveIcon />
                                            </a>
                                        </TableCell>
                                        <TableCell>{document.signed_at || 'Não assinada'}</TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={8} align="center">
                                        <Typography variant="body2" style={{ padding: '16px' }}>
                                            Nenhum documento cadastrado.
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                <ListItem>
                    {parts.length > 0 && (
                        <Stack spacing={2}> {/* Adiciona espaçamento entre os botões */}
                            {contract.documents && contract.documents.length > 0 ? (
                                <>
                                    <Button
                                        variant="outlined"
                                        startIcon={<AddIcon />}
                                        onClick={() => handleUploadDocument()}
                                        className="button-add"
                                    >
                                        Gerar Novamente
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        startIcon={<AddIcon />}
                                        onClick={() => handleUploadDocument()}
                                        className="button-add"
                                    >
                                        Enviar para Assinatura
                                    </Button>
                                </>
                            ) : (
                                <Button
                                    variant="outlined"
                                    startIcon={<AddIcon />}
                                    onClick={() => handleUploadDocument()}
                                    className="button-add"
                                >
                                    Gerar Documentos
                                </Button>
                            )}
                        </Stack>
                    )}

                </ListItem>
            </List>

            <Dialog open={open} onClose={handleCloseModal} maxWidth="lg" fullWidth>
                <DialogTitle className="dialog-title">Adicionar Novo {client_id ? 'Responsável' : 'Contratante'}</DialogTitle>
                <DialogContent className="dialog-content">
                    <Box mb={2}>
                        <TextField
                            mb={2}
                            label="Nome"
                            name="name"
                            className='input-field'
                            value={novoContratante.name}
                            onChange={handleNovoContratanteChange}
                            fullWidth
                        />
                    </Box>
                    <Box mb={2}>
                        <TextField
                            label="CPF/CNPJ"
                            name="cpf_cnpj"
                            className='input-field'
                            value={novoContratante.cpf_cnpj}
                            onChange={handleNovoContratanteChange}
                            fullWidth
                        />
                    </Box>
                    <Box mb={2}>
                        <TextField
                            label="Email"
                            name="email"
                            className='input-field'
                            value={novoContratante.email}
                            onChange={handleNovoContratanteChange}
                            fullWidth
                        />
                    </Box>
                    <Box mb={2}>
                        <TextField
                            label="Telefone"
                            name="phone"
                            className='input-field'
                            value={novoContratante.phone}
                            onChange={handleNovoContratanteChange}
                            fullWidth
                        />
                    </Box>
                    <Box mb={2}>
                        <TextField
                            label="Endereço"
                            name="address"
                            className='input-field'
                            value={novoContratante.address}
                            onChange={handleNovoContratanteChange}
                            fullWidth
                            multiline
                            rows={4}
                        />
                    </Box>
                    {/* <Box mb={2}>
                        <FormControl fullWidth>
                            <InputLabel id="signer_type-label">Tipo</InputLabel>
                            <Select
                                labelId="signer_type-label"
                                className='input-field'
                                value={novoContratante.signer_type}
                                onChange={handleNovoContratanteChange}
                                name="signer_type"
                            >
                                <MenuItem value="Contratante">Contratante</MenuItem>
                                <MenuItem value="Responsável">Responsável</MenuItem>
                            </Select>
                        </FormControl>
                    </Box> */}
                </DialogContent>
                <DialogActions className="dialog-actions">
                    <Button onClick={handleCloseModal} color="primary">
                        Cancelar
                    </Button>
                    <Button onClick={addContratante} color="primary">
                        Adicionar
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default Contract;
