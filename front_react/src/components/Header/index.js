import React from 'react';
import { AppBar, Toolbar, Typography } from '@mui/material';

const Header = () => {
  return (
    <AppBar position="static" sx={{ backgroundColor: '#a11a29' }}>
      <Toolbar>
        <Typography variant="h6" >
          Sumarizador do Tribunal de Justiça do Estado do Acre
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default Header;