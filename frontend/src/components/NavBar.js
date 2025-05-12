import React from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  IconButton,
  Box,
  useTheme
} from '@mui/material';
import { Link } from 'react-router-dom';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

const NavBar = ({ toggleColorMode }) => {
  const theme = useTheme();
  
  return (
    <AppBar position="sticky" elevation={1}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ 
          flexGrow: 1,
          fontWeight: 'bold',
          letterSpacing: '0.5px'
        }}>
          Dhruv Task Manager
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Button 
            color="inherit" 
            component={Link} 
            to="/"
            sx={{ mx: 1 }}
          >
            Tasks
          </Button>
          <Button 
            color="inherit" 
            component={Link} 
            to="/tasks/new"
            sx={{ mx: 1 }}
          >
            Add Task
          </Button>
          
          <IconButton 
            onClick={toggleColorMode} 
            color="inherit"
            sx={{ ml: 2 }}
            aria-label="toggle theme"
          >
            {theme.palette.mode === 'dark' ? (
              <Brightness7Icon />
            ) : (
              <Brightness4Icon />
            )}
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;