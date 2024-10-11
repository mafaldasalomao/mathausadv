import React, { useContext, useEffect,useState } from 'react';
import { useNavigate } from "react-router-dom";
import parse from 'html-react-parser';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Typography } from '@mui/material';
import Divider from '@mui/material/Divider';
import Legend from '../Legend';
import { PdfContext } from '../../contexts/PdfContext';
const FullText = () => {
    const navigate = useNavigate();
    const { file, fullText } = useContext(PdfContext);
    const [ner_text, setNerText] = useState('');
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        if (!file) {
            Swal.fire('Atenção', 'Selecione um arquivo em PDF para resumir!');
            navigate("/");
        }else if(fullText){
            // nerFetch();
        }
    }, [fullText]);

    const nerFetch = async () => {
        try {
          setLoading(true);
          const result_ner = await axios.post(
            'http://localhost:5000/api/v1/user/namedentityrecognizer',
            {"texto": fullText},
            {
              headers: {
                'Content-Type': 'application/json'
              },
            }
          );
          
          setNerText(result_ner.data.ner); 
          
        } catch (error) {
          console.error('Erro ao enviar o arquivo para a API:', error);
        } finally {
          setLoading(false); 
        }
        
      };
    return (
        <>
        <Typography variant="h4">Texto Completo</Typography>
        <Divider></Divider>
        <Typography variant="h6">Legenda</Typography>
        <Legend/>
        <Divider/>
        <Typography paragraph>
            {ner_text && <>
                {parse(ner_text)}
            </>}
            {!ner_text && <>
                {fullText}
            </>}
            
            
        </Typography>
        </>
    );
};

export default FullText;
