import React, { useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Slider from '@mui/material/Slider';
import Skeleton from '@mui/material/Skeleton';
import CircularProgress from '@mui/material/CircularProgress';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Typography } from '@mui/material';
import { PdfContext } from '../../contexts/PdfContext';
const ExtractiveSummary = () => {
    const [data, setData] = useState([]);
    const navigate = useNavigate();
    const { fullText, extractive_summary, setExtractiveSummary } = useContext(PdfContext);
    const [totalPhrases, setTotalPhrases] = useState(5);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        if (!fullText) {
            Swal.fire('Atenção', 'Selecione um arquivo em PDF para resumir!');
            navigate("/");
        }else if(!extractive_summary){
            summaryFetch(totalPhrases);
        }
    }, [fullText]);


    useEffect(() => {
      const url = 'http://localhost:5000/api/v1/user/stream'; // URL da sua API Flask
      const fetchData = async () => {
        try {
          const response = await fetch(url, {
            method: 'POST',  // Define o método como POST
            headers: {
              'Content-Type': 'application/json',  // Define o tipo de conteúdo como JSON
            },
            body: JSON.stringify({
              // Inclua aqui os dados que deseja enviar no corpo da requisição
              texto: 'O que aconteceu com o réu?'
            })
          });
          
          const reader = response.body.getReader();
          const decoder = new TextDecoder();
  
          let receivedText = '';
  
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            
            const chunk = decoder.decode(value, { stream: true });
            receivedText += chunk;
  
            setData(receivedText);
          }
        } catch (error) {
          console.error('Erro ao consumir o stream:', error);
        }
      };
  
      fetchData();
    }, []);

    const summaryFetch = async (newValue) => {
        try {
          setLoading(true);
          const result_extractive_summ = await axios.post(
            'http://localhost:5000/api/v1/user/extractivesummarization',
            {"texto": fullText, "sentences_count": newValue},
            {
              headers: {
                'Content-Type': 'application/json'
              },
            }
          );
          
          setExtractiveSummary(result_extractive_summ.data.extractive_summarization); 
          
        } catch (error) {
          console.error('Erro ao enviar o arquivo para a API:', error);
        } finally {
          setLoading(false); 
        }
        
      };

    const handleSliderChange = (event, newValue) => {
      setTotalPhrases(newValue);
      summaryFetch(newValue);
    };
    return (
        <>
        <Grid container spacing={2}>
        <Grid item xs={12}>
          <Paper elevation={3} style={{ padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
            <Typography variant="h4">Sumarização Extrativa</Typography>
            <Grid container spacing={2}>
              <Grid item xs={3}>
                <Paper elevation={0} style={{ padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                  <Box>
                    <Typography id="input-slider" gutterBottom>
                      Quantidade de Frases
                    </Typography>
                  </Box>
                  <Slider
                        aria-label="Temperature"
                        defaultValue={totalPhrases}
                        onChange={handleSliderChange}
                        valueLabelDisplay="auto"
                        shiftStep={1}
                        step={1}
                        marks
                        min={1}
                        max={10}
                    />
                </Paper>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
            <Grid container spacing={2} >
              <Grid item spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
                

              </Grid>
              <Grid item xs={8} sm={8} md={12}>
                {/* <Typography variant="h4">Sumarização Extrativa</Typography> */}
                <Paper elevation={3} style={{ padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>

                  {loading && <>
                      <CircularProgress style={{ marginBottom: '16px' }}/>
                      <Skeleton animation="wave" style={{ width: '100%', marginBottom: '8px' }}/>
                      <Skeleton animation="wave" style={{ width: '100%', marginBottom: '8px' }}/>
                      <Skeleton animation="wave" style={{ width: '100%', marginBottom: '8px' }}/>
                  </>}

                    {!loading && <>
                      <Typography paragraph>
                        {extractive_summary}
                        <div>
                          <h1>Streaming de Dados</h1>
                          <ul>
                            {data}
                          </ul>
                        </div>
                      </Typography>
                    </>}
                </Paper>
              </Grid>
            </Grid>
        </>
    );
};

export default ExtractiveSummary;
