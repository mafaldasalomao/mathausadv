import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Typography,
    Button,
    List,
    ListItem,
    ListItemText,
    Select,
    MenuItem,
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
import CreateIcon from '@mui/icons-material/Create';
import EditIcon from '@mui/icons-material/Edit';
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
    const [showProgress, setShowProgress] = useState(false);
    const [currentDocument, setCurrentDocument] = useState('');
    const [open, setOpen] = useState(false);
    const [openPopupStatus, setOpenPopupStatus] = useState(false);
    const [newStatus, setNewStatus] = useState();
    const handleOpenPopupStatus = () => setOpenPopupStatus(true);
    const handleClosePopupStatus = () => setOpenPopupStatus(false);

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
            setNewStatus(response.data.status);
            setParts(response.data.clients || []);
            setDocuments(response.data.documents || []);
            setIsLoading(false);
        } catch (error) {
            console.error('Erro ao buscar os detalhes do contrato:', error);
            setIsLoading(false);
        }
    };

    const handleChangeStatus = (event) => {
        setNewStatus(event.target.value);
    };

    const handleSaveStatus = async () => {
        // Atualiza o status do contrato
        try {
            const formData = new FormData();
            formData.append('status', newStatus);
            formData.append('name', contract.name);
            formData.append('description', contract.description);
            handleClosePopupStatus();
            Swal.showLoading();
            if (newStatus === 'CANCELADO') {
                const response = await apiPrivate.patch(`/contract/${contract_id}`,
                    {
                        headers: { 'Content-Type': 'application/json' },
                        withCredentials: true
                    }
                );
                if (response.status === 200) {
                    setContract(prevContract => ({ ...prevContract, status: newStatus }));
                }
            } else {
                const response = await apiPrivate.put(`/contract/${contract_id}`, formData,
                    {
                        headers: { 'Content-Type': 'application/json' },
                        withCredentials: true
                    }
                );
                if (response.status === 200) {
                    setContract(prevContract => ({ ...prevContract, status: newStatus }));
                }
            }
            

           
        } catch (error) {
            console.error('Erro ao atualizar o status do contrato:', error);
        }

        Swal.close();

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

    const handleSendToSign = async () => {
        Swal.fire({
            title: 'Deseja enviar para assinatura?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: 'var(--orange)',
            cancelButtonColor: 'var(--deep-black)',
            confirmButtonText: 'Sim',
            cancelButtonText: 'Cancelar'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await apiPrivate.post(`/contract/${contract_id}/sendtosigner`,
                        {},
                        {
                            headers: { 'Content-Type': 'application/json' },
                            withCredentials: true
                        }
                    );


                    if (response.status === 200) {
                        Swal.fire({
                            title: 'Enviado para assinatura',
                            icon: 'success',
                            confirmButtonColor: 'var(--orange)',
                            confirmButtonText: 'Ok'
                        });
                        fetchContractDetails();
                    }
                } catch (error) {
                    console.error('Erro ao enviar o documento para assinatura:', error);
                    fetchContractDetails();
                }
            }

        })
    };

    const handleUploadDocument = () => {
        navigate("documents/new");
    };

    const handleDeleteAllDocuments = async () => {
        try {
            // Confirmação inicial do usuário
            const result = await Swal.fire({
                title: 'Deseja deletar todos os documentos?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: 'var(--orange)',
                cancelButtonColor: 'var(--deep-black)',
                confirmButtonText: 'Sim',
                cancelButtonText: 'Cancelar'
            });

            if (result.isConfirmed) {
                Swal.fire({
                    title: 'Aguarde...',
                    html: `Deletando documentos</b>`,
                    allowOutsideClick: false,
                    didOpen: () => {
                        Swal.showLoading(); // Mostra o indicador de carregamento
                    }
                });
                // Deleta os documentos um por um
                for (const [index, document] of documents.entries()) {
                    try {
                        await apiPrivate.delete(`/document/${document.document_id}`, {
                            headers: { 'Content-Type': 'application/json' },
                            withCredentials: true
                        });
                    } catch (error) {
                        console.error(`Erro ao deletar o documento ${document.id}:`, error);
                    }
                }

                // Atualiza a lista de documentos no estado
                fetchContractDetails();
                // Exibe uma mensagem de sucesso
                Swal.fire({
                    title: 'Documentos deletados com sucesso!',
                    icon: 'success',
                    confirmButtonColor: 'var(--orange)',
                    confirmButtonText: 'Ok'
                });
            }
        } catch (error) {
            console.error('Erro ao deletar os documentos:', error);

            // Exibe uma mensagem de erro
            Swal.fire({
                title: 'Ocorreu um erro ao deletar os documentos.',
                icon: 'error',
                confirmButtonColor: 'var(--orange)',
                confirmButtonText: 'Ok'
            });
        }
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
                await fetchContractDetails();
            } else {
                await apiPrivate.post(`/contract/${contract_id}/client/${client_id}/responsable`, novoContratante);
                await fetchContractDetails();
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
                {contract.name} - {contract.created_at} - {contract.status}
            </Typography>
            {(contract.status === 'EXECUÇÃO DO SERVIÇO' || contract.status === 'ADITIVO' || contract.status === 'REVISÃO CONTRATUAL') && (
                <Grid item xs={4} style={{ textAlign: 'right' }}>

                    <Button
                        variant="outlined"
                        color="secondary"
                        startIcon={<EditIcon />}
                        onClick={() => handleOpenPopupStatus()}

                    >
                        Alterar Status
                    </Button>


                </Grid>
            )}



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
                                    {contract.status === 'CONTRATAÇÃO' && (
                                        <Grid item xs={4} style={{ textAlign: 'right' }}>
                                            {!part.responsible && (
                                                <Button
                                                    variant="outlined"
                                                    color="secondary"
                                                    startIcon={<AddIcon />}
                                                    onClick={() => handleAddPart(part.client_id)}

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
                                    )}

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

                {contract.status === 'CONTRATAÇÃO' && (

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
                )}


            </List>


            <Typography variant="h6" style={{ color: 'var(--orange)', marginBottom: '8px' }}>
                Documentos
            </Typography>
            {/* {showProgress && (
                <Box display="flex" alignItems="center" mt={2}>
                    <CircularProgress size={24} color="primary" /> }
                    <Typography variant="body2" style={{ marginLeft: '8px' }}>
                        {currentDocument}
                    </Typography>
                </Box>
            )} */}
            {parts.length > 0 ? (
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
                                {documents.length > 0 && (
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
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <ListItem>
                        {parts.length > 0 && (
                            <Stack spacing={1}> {/* Adiciona espaçamento entre os botões */}
                                {contract.documents && contract.documents.length > 0 ? (
                                    <>
                                        {/* <Button
                                        variant="outlined"
                                        startIcon={<AddIcon />}
                                        onClick={() => handleUploadDocument()}
                                        className="button-add"
                                    >
                                        Gerar Novamente
                                    </Button> */}


                                        {contract.status === 'CONTRATAÇÃO' && (
                                            <>
                                                <Button
                                                    variant="outlined"
                                                    startIcon={<CreateIcon />}
                                                    style={{ margin: '10px', color: '#fff', textAlign: 'right' }}
                                                    onClick={() => handleSendToSign()}
                                                    className="button-add"
                                                >
                                                    Enviar para Assinatura
                                                </Button>
                                                <Button
                                                    variant="contained"
                                                    color="secondary"
                                                    onClick={() => handleDeleteAllDocuments()}
                                                    style={{ margin: '10px', backgroundColor: 'var(--dark-orange)', color: '#fff', textAlign: 'right' }}
                                                >
                                                    Deletar Todos Documentos
                                                </Button>
                                            </>
                                        )}

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
            ) : (
                <Typography variant="body2" style={{ padding: '16px' }}>
                    Nenhum documento cadastrado.
                </Typography>
            )}

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
            <Dialog open={openPopupStatus} onClose={handleClosePopupStatus} maxWidth="sm"  fullWidth >
                <DialogTitle>Alterar Status do Contrato</DialogTitle>
                <DialogContent>
                    <Select
                        value={newStatus}
                        onChange={handleChangeStatus}
                        fullWidth
                        style={{ marginBottom: '16px' }}    
                    >
                        <MenuItem value="EXECUÇÃO DO SERVIÇO">EXECUÇÃO DO SERVIÇO</MenuItem>
                        <MenuItem value="ADITIVO">ADITIVO</MenuItem>
                        <MenuItem value="REVISÃO CONTRATUAL">REVISÃO CONTRATUAL</MenuItem>
                        <MenuItem value="ENCERRAMENTO">ENCERRAMENTO</MenuItem>
                        <MenuItem value="CANCELADO">CANCELADO</MenuItem>
                    </Select>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClosePopupStatus} color="primary">
                        Cancelar
                    </Button>
                    <Button onClick={handleSaveStatus} color="primary" variant="contained">
                        Salvar
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default Contract;
