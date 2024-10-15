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
    Checkbox,
    FormControlLabel,
    Box,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import './styles.css';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';

const Contract = () => {
    const { id } = useParams(); // Obtém o ID do contrato da URL
    const navigate = useNavigate();
    const apiPrivate = useAxiosPrivate();
    
    const [contract, setContract] = useState(null);
    const [parts, setParts] = useState([]);
    const [documents, setDocuments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [open, setOpen] = useState(false); // Estado do modal
    const [novoContratante, setNovoContratante] = useState({
        nome: '',
        cpf: '',
        email: '',
        telefone: '',
        responsavel: false
    });

    // Função para buscar os detalhes do contrato na API
    const fetchContractDetails = async () => {
        try {
            const response = await apiPrivate.get(`/contract/1`); // Substitua pela sua URL de API
            setContract(response.data);
            setParts(response.data.parts || []); // Supondo que a API retorne uma lista de partes
            setDocuments(response.data.documents || []); // Supondo que a API retorne uma lista de documentos
            setIsLoading(false);
        } catch (error) {
            console.error('Erro ao buscar os detalhes do contrato:', error);
            setIsLoading(false);
        }
    };

    const handleAddPart = () => {
        setOpen(true); // Abre o modal
    };
    const handleCloseModal = () => {
        setOpen(false);
        setNovoContratante({ // Reseta os campos do novo contratante
            nome: '',
            cpf: '',
            email: '',
            telefone: '',
            responsavel: false,
        });
    };

    useEffect(() => {
        fetchContractDetails();
    }, [id]);
    const handleNovoContratanteChange = (event) => {
        const { name, value, type, checked } = event.target;
        setNovoContratante((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };
    const handleUploadDocument = () => {
        // Lógica para enviar um novo documento
        console.log('Enviar novo documento');
        // Por exemplo, redirecionar para uma página ou abrir um modal
    };

    const addContratante = () => {
        // Lógica para adicionar o novo contratante
        console.log('Adicionar novo contratante:', novoContratante);
        // Aqui você pode fazer a chamada para a API para adicionar a parte
        // Após adicionar, você pode fechar o modal e atualizar a lista de partes
        setParts((prev) => [...prev, novoContratante]); // Exemplo de atualização local
        handleCloseModal(); // Fecha o modal
    };
    
    if (isLoading) {
        return <CircularProgress style={{ display: 'block', margin: 'auto', marginTop: '20px' }} />; // Exibe um carregando
    }

    return (
        <div style={{ padding: '16px' }}>
            <Typography variant="h4" style={{ color: 'var(--orange)', marginBottom: '16px' }}>
                {contract.name} - {new Date(contract.created_at).toLocaleDateString('pt-BR')}
            </Typography>

            <Typography variant="h6" style={{ color: 'var(--orange)', marginBottom: '8px' }}>
                Dados das Partes
            </Typography>
            <List component={Paper} style={{ marginBottom: '24px' }}>
                {parts.length > 0 ? (
                    parts.map((part, index) => (
                        <ListItem key={index}>
                            <ListItemText primary={part.name} />
                            <ListItemSecondaryAction>
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
            {/* Modal para Adicionar Nova Parte */}
            <Dialog open={open} onClose={handleCloseModal} maxWidth="lg" fullWidth>
                <DialogTitle className="dialog-title">Adicionar Novo Contratante</DialogTitle>
                <DialogContent className="dialog-content">
                    <Box mb={2}>
                        <TextField
                            mb={2}
                            label="Nome"
                            name="nome"
                            value={novoContratante.nome}
                            onChange={handleNovoContratanteChange}
                            fullWidth
                        />
                    </Box>
                    <Box mb={2}>
                        <TextField
                            label="CPF"
                            name="cpf"
                            value={novoContratante.cpf}
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
                            name="telefone"
                            value={novoContratante.telefone}
                            onChange={handleNovoContratanteChange}
                            fullWidth
                        />
                    </Box>
                    <Box mb={2}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={novoContratante.responsavel}
                                    onChange={handleNovoContratanteChange}
                                    name="responsavel"
                                />
                            }
                            label="Responsável legal"
                        />
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
