import React, { useState} from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemText,
  CssBaseline,
  useTheme,
  ThemeProvider,
  createTheme,
  useMediaQuery,
  Button
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Home from './components/home';
import Horario from './components/horario';
import RegistroHorarios from './components/registro';
import Turmas from './components/turma';
// Tema escuro harmonioso (mesmo do resto da app)
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#4db6ac', contrastText: '#ffffff' },
    secondary: { main: '#ff8a65', contrastText: '#212121' },
    background: { default: '#121212', paper: '#1e272c' },
    text: { primary: '#e0f7fa', secondary: '#b2dfdb' },
    action: { hover: 'rgba(77, 182, 172, 0.08)' }
  },
  shape: { borderRadius: 8 }
});

const navItems = [
  { text: 'Início', path: '/' },
  { text: 'Turmas', path: '/Turma' },
  { text: 'Professor', path: '/professor' },
  { text: 'Sala', path: '/sala' },
  { text: 'Lista Horários', path: '/horario' },
  { text: 'Registro Horários', path: '/registros' }
];

export default function App() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = () => setDrawerOpen(!drawerOpen);

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Router>
        <AppBar position="static" color="primary">
          <Toolbar>
            {isMobile && (
              <IconButton
                edge="start"
                color="inherit"
                aria-label="menu"
                onClick={toggleDrawer}
                sx={{ mr: 2 }}
              >
                <MenuIcon />
              </IconButton>
            )}
            <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
              <Box component={Link} to="/" sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
                <img src="/sistemalogo.png" alt="Logo IEMA" style={{ height: isMobile ? 30 : 50, marginRight: 12 }} />
                
              </Box>
            </Box>
            {!isMobile && (
              <Box sx={{ display: 'flex' }}>
                {navItems.map(item => (
                  <Button
                    key={item.text}
                    component={Link}
                    to={item.path}
                    color="inherit"
                    sx={{ ml: 1, textTransform: 'none' }}
                  >
                    {item.text}
                  </Button>
                ))}
              </Box>
            )}
          </Toolbar>
        </AppBar>

        <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer} sx={{ '& .MuiDrawer-paper': { bgcolor: 'background.paper' } }}>
          <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer} onKeyDown={toggleDrawer}>
            <List>
              {navItems.map(item => (
                <ListItem button key={item.text} component={Link} to={item.path}>
                  <ListItemText primary={item.text} sx={{ color: 'text.primary' }} />
                </ListItem>
              ))}
            </List>
          </Box>
        </Drawer>

        <Box sx={{ p: 3 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/horario" element={<Horario />} />
            <Route path="/registros" element={<RegistroHorarios />} />
            <Route path="/turma" element={<Turmas />} />
            <Route path="*" element={<Typography variant="h4" color="error">404 - Página não encontrada</Typography>} />
          </Routes>
        </Box>
      </Router>
    </ThemeProvider>
  );
}
