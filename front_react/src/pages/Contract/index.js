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
    FormControl,
    InputLabel,
    Select,
    MenuItem 
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import './styles.css';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';

const Contract = () => {
    const { contract_id } = useParams(); 
    const navigate = useNavigate();
    const apiPrivate = useAxiosPrivate();
    
    const [contract, setContract] = useState(null);
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
        responsavel: ''
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

    const handleAddPart = () => {
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
            signer_type: '',
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

    const handleUploadDocument = () => {
        console.log('Enviar novo documento');
    };

    const areFieldsFilled = () => {
        return (
            novoContratante.name &&
            novoContratante.cpf_cnpj &&
            novoContratante.email &&
            novoContratante.phone &&
            novoContratante.address &&
            novoContratante.signer_type
        );
    };

    const addContratante = () => {
        if (!areFieldsFilled()) {
            alert('Por favor, preencha todos os campos.');
            return;
        }
        try {
            apiPrivate.post(`/contract/${contract_id}/parts`, novoContratante);
        } catch (error) {
            console.error('Erro ao adicionar novo contratante:', error);
        }
        setParts((prev) => [...prev, novoContratante]); 
        handleCloseModal(); 
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
                        <ListItem key={index}>
                            <ListItemText
                                primary={<>{part.name} - {part.signer_type}</>}
                                secondary={
                                    <>
                                        <div>CPF: {part.cpf_cnpj}</div>
                                        <div>Email: {part.email}</div>
                                        <div>Telefone: {part.phone}</div>
                                        <div>Endereço: {part.address}</div>
                                    </>
                                }
                            />
                            <ListItemSecondaryAction>
                                {/* Aqui você pode adicionar botões adicionais, se necessário */}
                            </ListItemSecondaryAction>
                        </ListItem>
                    ))
                ) : (
                    <Typography variant="body2" style={{ padding: '16px' }}>Nenhuma parte cadastrada.</Typography>
                )}
                <ListItem>
                    <Button
                        variant="outlined"
                        startIcon={<AddIcon />}
                        onClick={handleAddPart}
                        className="button-add"
                    >
                        Adicionar Nova Parte
                    </Button>
                </ListItem>
            </List>

            <Typography variant="h6" style={{ color: 'var(--orange)', marginBottom: '8px' }}>
                Documentos
            </Typography>
            <List component={Paper}>
                {documents.length > 0 ? (
                    documents.map((document, index) => (
                        <ListItem key={index}>
                            <ListItemText primary={document.name} />
                            <ListItemSecondaryAction>
                                {/* Aqui você pode adicionar botões adicionais, se necessário */}
                            </ListItemSecondaryAction>
                        </ListItem>
                    ))
                ) : (
                    <Typography variant="body2" style={{ padding: '16px' }}>Nenhum documento cadastrado.</Typography>
                )}
                <ListItem>
                    <Button
                        variant="outlined"
                        startIcon={<CloudUploadIcon />}
                        onClick={handleUploadDocument}
                        className="button-add"
                    >
                        Enviar Novo Documento
                    </Button>
                </ListItem>
            </List>

            <Dialog open={open} onClose={handleCloseModal} maxWidth="lg" fullWidth>
                <DialogTitle className="dialog-title">Adicionar Novo Contratante</DialogTitle>
                <DialogContent className="dialog-content">
                    <Box mb={2}>
                        <TextField
                            mb={2}
                            label="Nome"
                            name="name"
                            value={novoContratante.name}
                            onChange={handleNovoContratanteChange}
                            fullWidth
                        />
                    </Box>
                    <Box mb={2}>
                        <TextField
                            label="CPF/CNPJ"
                            name="cpf_cnpj"
                            value={novoContratante.cpf_cnpj}
                            onChange={handleNovoContratanteChange}
                            fullWidth
                        />
                    </Box>
                    <Box mb={2}>
                        <TextField
                            label="Email"
                            name="email"
                            value={novoContratante.email}
                            onChange={handleNovoContratanteChange}
                            fullWidth
                        />
                    </Box>
                    <Box mb={2}>
                        <TextField
                            label="Telefone"
                            name="phone"
                            value={novoContratante.phone}
                            onChange={handleNovoContratanteChange}
                            fullWidth
                        />
                    </Box>
                    <Box mb={2}>
                        <TextField
                            label="Endereço"
                            name="address"
                            value={novoContratante.address}
                            onChange={handleNovoContratanteChange}
                            fullWidth
                            multiline
                            rows={4}
                        />
                    </Box>
                    <Box mb={2}>
                        <FormControl fullWidth>
                            <InputLabel id="responsavel-label">Tipo</InputLabel>
                            <Select
                                labelId="responsavel-label"
                                value={novoContratante.signer_type}
                                onChange={handleNovoContratanteChange}
                                name="responsavel"
                            >
                                <MenuItem value="contratante">Contratante</MenuItem>
                                <MenuItem value="responsavel">Responsável</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
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
