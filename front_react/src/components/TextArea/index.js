import React from 'react';
import { TextField } from '@mui/material';

const TextArea = ({ label, value, onChange, rows, readOnly=false }) => {
  return (
    <TextField
      label={label}
      multiline
      rows={rows}
      variant="outlined"
      value={value}
      onChange={onChange}
      fullWidth
      InputProps={{
        readOnly: readOnly,
        style: { backgroundColor: '#f5f5f5', /* adiciona estilos extras se desejar */ }
    }}
    />
  );
};

export default TextArea;