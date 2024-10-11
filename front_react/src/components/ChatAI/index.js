import React, { useContext, useEffect, useState } from 'react';
import { styled } from '@mui/system';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import Fab from '@mui/material/Fab';
import SendIcon from '@mui/icons-material/Send';

const useStyles = styled((theme) => ({
    chatSection: {
        width: '100%',
        height: '80vh'
    },
    headBG: {
        backgroundColor: '#e0e0e0'
    },
    borderRight500: {
        borderRight: '1px solid #e0e0e0'
    },
    messageArea: {
        height: '70vh',
        overflowY: 'auto'
    }
}));


const formatTime = (date) => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };
const ChatAI = () => {
    const classes = useStyles();
    const [data, setData] = useState([]);
    const [message, setMessage] = useState('');
    const [chat, setChat] = useState([
        { from: 'Chat-pdf', msg: 'Olá, me faça alguma pergunta relacionada ao conteúdo do seu PDF, tentarei ajudá-lo.', time: formatTime(new Date()) },
        // { from: 'EU', msg: 'Hey man, whatever', time: '10:01' },
        // { from: 'EU', msg: 'ok go away', time: '11:01' },
    ]);

    const handleChange = (event) => {
        setMessage(event.target.value);
    };

    const keyPress = (e) => {
        if (e.keyCode === 13) {
            addMessage('EU', message);
        }
    };

    const addMessage = (from, msg) => {
        if (msg.trim() === '') return;
        const time = new Date().toLocaleTimeString().slice(0, 5);
        setChat([...chat, { from, msg, time }]);
        fetchData(msg, time);
        setMessage('');
    };

       
    const fetchData = async (msg, time) => {
            const url = 'http://localhost:5000/api/v1/user/stream'; // URL da sua API Flask
            try {
                const response = await fetch(url, {
                method: 'POST',  // Define o método como POST
                headers: {
                    'Content-Type': 'application/json',  // Define o tipo de conteúdo como JSON
                },
                body: JSON.stringify({
                    // Inclua aqui os dados que deseja enviar no corpo da requisição
                    texto: msg
                })
                });
                
                const reader = response.body.getReader();
                const decoder = new TextDecoder();
        
                let receivedText = '';
                setChat(prevChat => [...prevChat, { from: 'Chat-pdf', msg: '', time }]);
                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;
                    
                    const chunk = decoder.decode(value, { stream: true });
                    receivedText += chunk;
            
                   // Atualiza a última mensagem no estado com o texto recebido
                    setChat(prevChat => {
                        const updatedChat = [...prevChat];
                        updatedChat[updatedChat.length - 1] = { from: 'Chat-pdf', msg: receivedText, time };
                        return updatedChat;
                    });
                    setData(receivedText);
                }
            } catch (error) {
                console.error('Erro ao consumir o stream:', error);
            }
        };

    return (
        <div>
            <Grid container>
                <Grid item xs={12}>
                    <Typography variant="h5" className="header-message">ChatPDF TJAC</Typography>
                </Grid>
            </Grid>
            <Grid container component={Paper} className={classes.chatSection}>
                <Grid item xs={12}>
                    <List className={classes.messageArea}>
                        {chat.map((c, i) => (
                            <ListItem key={i}>
                                <Grid container>
                                    <Grid item xs={12}>
                                        <ListItemText align={c.from === 'Chat-pdf' ? 'left' : 'right'} primary={c.msg}></ListItemText>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <ListItemText align={c.from === 'Chat-pdf' ? 'left' : 'right'} secondary={`${c.from} às ${c.time}`}></ListItemText>
                                    </Grid>
                                </Grid>
                            </ListItem>
                        ))}
                    </List>
                    <Divider />
                    <Grid container style={{ padding: '20px' }}>
                        <Grid item xs={11}>
                            <TextField 
                                id="outlined-basic-email" 
                                InputProps={{ disableUnderline: true }} 
                                onChange={handleChange} 
                                onKeyDown={keyPress} 
                                value={message} 
                                label="Digite sua pergunta...." 
                                fullWidth 
                            />
                            {/* <div>
                            <h1>Streaming de Dados</h1>
                                <ul>
                                    {data}
                                </ul>
                            </div> */}
                        </Grid>
                        <Grid item xs={1} align="right">
                            <Fab color="primary" onClick={() => addMessage('EU', message)} aria-label="add"><SendIcon /></Fab>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </div>
    );
};

export default ChatAI;
