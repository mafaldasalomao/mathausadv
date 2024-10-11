import React from 'react';
import { Box, Typography } from '@mui/material';

const Legend = () => {
  const items = [
    { color: '#4fc3f7', label: 'Localização' },
    { color: '#ffd54f', label: 'Pessoa' },
    { color: '#c24ff7', label: 'Diversos' }
  ];

  return (
    <Box display="flex" flexDirection="column" alignItems="flex-start">
      {items.map((item, index) => (
        <Box key={index} display="flex" alignItems="center" mb={1}>
          <Box width={20} height={20} bgcolor={item.color} mr={1} />
          <Typography>{item.label}</Typography>
        </Box>
      ))}
    </Box>
  );
};

export default Legend;