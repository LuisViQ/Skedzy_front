import React, { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Button,
  CssBaseline,
  ThemeProvider
} from '@mui/material';
import { createTheme } from '@mui/material/styles';

// Reutiliza o mesmo tema escuro harmonioso
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#4db6ac', contrastText: '#ffffff' },
    secondary: { main: '#ff8a65', contrastText: '#212121' },
    background: {
      default: '#121212',
      paper: '#1e272c'
    },
    text: {
      primary: '#e0f7fa',
      secondary: '#b2dfdb'
    },
    action: {
      hover: 'rgba(77, 182, 172, 0.08)'
    }
  },
  shape: { borderRadius: 8 },
  typography: {
    fontFamily: 'Roboto, sans-serif'
  }
});

export default function ExportadorAlocacoes() {
  const [dados, setDados] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3030/api/visualizar')
      .then(res => res.json())
      .then(data => setDados(data))
      .catch(err => console.error('Erro ao carregar dados:', err));
  }, []);

  const exportarExcel = () => {
    const ws = XLSX.utils.json_to_sheet(dados);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Alocacoes');
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, 'alocacoes.xlsx');
  };

  // Agrupa alocações por turma
  const turmasAgrupadas = dados.reduce((acc, a) => {
    acc[a.turma] = acc[a.turma] || [];
    acc[a.turma].push(a);
    return acc;
  }, {});

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box sx={{ p: 3, bgcolor: 'background.default' }}>
        <Typography variant="h4" gutterBottom sx={{ color: 'primary.main' }}>
          Alocações Registradas
        </Typography>

        {Object.entries(turmasAgrupadas).map(([turma, items]) => (
          <Paper key={turma} elevation={4} sx={{ mb: 3, p: 2, bgcolor: 'background.paper' }}>
            <Typography variant="h6" sx={{ mb: 2, color: 'text.primary' }}>
              Turma: {turma}
            </Typography>

            <TableContainer sx={{ maxHeight: 300, borderRadius: 1 }}>
              <Table stickyHeader>
                <TableHead sx={{ backgroundColor: 'secondary.main' }}>
                  <TableRow>
                    {['ID', 'Disciplina', 'Professor', 'Sala', 'Início', 'Fim', 'Dia'].map(col => (
                      <TableCell key={col} sx={{ color: '#fff', fontWeight: 'bold', textAlign: 'center' }}>
                        {col}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {items.map(row => (
                    <TableRow key={row.id_alocacao} hover>
                      <TableCell align="center">{row.id_alocacao}</TableCell>
                      <TableCell align="center">{row.disciplina}</TableCell>
                      <TableCell align="center">{row.professor || '—'}</TableCell>
                      <TableCell align="center">{row.sala || '—'}</TableCell>
                      <TableCell align="center">{row.inicio}</TableCell>
                      <TableCell align="center">{row.fim}</TableCell>
                      <TableCell align="center">{row.dia_semana}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        ))}

        <Button
          variant="contained"
          color="primary"
          onClick={exportarExcel}
          sx={{ mt: 2, borderRadius: 2 }}
        >
          📁 Exportar para Excel
        </Button>
      </Box>
    </ThemeProvider>
  );
}
