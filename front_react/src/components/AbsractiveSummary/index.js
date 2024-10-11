import React, { useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import Paper from '@mui/material/Paper';
import Skeleton from '@mui/material/Skeleton';
import CircularProgress from '@mui/material/CircularProgress';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Typography } from '@mui/material';
import { PdfContext } from '../../contexts/PdfContext';
const AbsractiveSummary = () => {
    const navigate = useNavigate();
    const { fullText, abstractive_summary, setAbstractiveSummary } = useContext(PdfContext);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        if (!fullText) {
            Swal.fire('Atenção', 'Selecione um arquivo em PDF para resumir!');
            navigate("/");
        }else if(!abstractive_summary){
            summaryFetch();
        }
    }, [fullText]);
    const summaryFetch = async () => {
        try {
          setLoading(true);
          const result_absractive_summ = await axios.post(
            'http://localhost:5000/api/v1/user/abstractivesummarization',
            {"texto": fullText},
            {
              headers: {
                'Content-Type': 'application/json'
              },
            }
          );
          
          setAbstractiveSummary(result_absractive_summ.data.abstractive_summarization); 
          
        } catch (error) {
          console.error('Erro ao enviar o arquivo para a API:', error);
        } finally {
          setLoading(false); 
        }
        
      };
    return (
        <>
        <Typography variant="h4">Sumarização Abstrativa</Typography>
        <Paper elevation={3} style={{ padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>

          {!abstractive_summary && <>
              <CircularProgress style={{ marginBottom: '16px' }}/>
              <Skeleton animation="wave" style={{ width: '100%', marginBottom: '8px' }}/>
              <Skeleton animation="wave" style={{ width: '100%', marginBottom: '8px' }}/>
              <Skeleton animation="wave" style={{ width: '100%', marginBottom: '8px' }}/>
          </>}

            <Typography paragraph>
                {abstractive_summary}
            </Typography>
        </Paper>
        </>
    );
};

export default AbsractiveSummary;
