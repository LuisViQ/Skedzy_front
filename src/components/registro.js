import React, { useEffect, useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Select, MenuItem, Button, Dialog, DialogTitle, DialogContent, DialogActions,
  FormControl, InputLabel, Grid, Typography, Box, CssBaseline
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import axios from 'axios';
import * as XLSX from 'xlsx'; // Importa a biblioteca xlsx

// Tema escuro com paleta moderna e harmoniosa
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#4db6ac', contrastText: '#ffffff' },  // verde-água moderno
    secondary: { main: '#ff8a65', contrastText: '#212121' }, // coral suave
    background: {
      default: '#121212', // preto carvão
      paper: '#1e272c'    // cinza azulado escuro
    },
    text: {
      primary: '#e0f7fa', // azul claro suave
      secondary: '#b2dfdb' // verde-água claro
    },
    action: {
      hover: 'rgba(77, 182, 172, 0.08)' // leve sobreposição da cor primária
    }
  },
  shape: { borderRadius: 8 },
  typography: {
    fontFamily: 'Roboto, sans-serif',
    h6: { fontWeight: 500 },
    body1: { fontSize: '0.95rem' }
  }
});

export default function AllocationScheduler() {
  const [turmas, setTurmas] = useState([]);
  const [horarios, setHorarios] = useState([]);
  const [dias] = useState(['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']);
  const [disciplinas, setDisciplinas] = useState([]);
  const [professores, setProfessores] = useState([]);
  const [salas, setSalas] = useState([]);
  const [alocacoes, setAlocacoes] = useState([]);
  const [selectedTurma, setSelectedTurma] = useState('101'); // Inicializa com a turma 101
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ dia: '', horario: '', disciplina: '', professor: '', sala: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    const base = 'http://localhost:3030/api';
    Promise.all([
      axios.get(`${base}/turmas`),
      axios.get(`${base}/horario`),
      axios.get(`${base}/disciplina`),
      axios.get(`${base}/professor`),
      axios.get(`${base}/sala`),
      axios.get(`${base}/alocacao`),
    ]).then(([tRes, hRes, dRes, pRes, sRes, aRes]) => {
      setTurmas(tRes.data);
      setHorarios(hRes.data);
      setDisciplinas(dRes.data);
      setProfessores(pRes.data);
      setSalas(sRes.data);
      setAlocacoes(aRes.data);

      // Verifica se a turma 101 existe e a seleciona automaticamente
      const turma101 = tRes.data.find(t => t.id_turma === '101');
      if (turma101) {
        setSelectedTurma('101');
      } else if (tRes.data.length > 0) {
        setSelectedTurma(tRes.data[0].id_turma); // Seleciona a primeira turma disponível como fallback
      }
    });
  }, []);

  const calcDurationInMinutes = h => {
    const [hi, mi] = h.inicio.split(':').map(Number);
    const [hf, mf] = h.fim.split(':').map(Number);
    return (hf * 60 + mf) - (hi * 60 + mi);
  };

  const minutesToHoursAndMinutes = minutes => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const remainingMinutes = discId => {
    const disc = disciplinas.find(d => d.id_disciplina === discId);
    const total = (disc?.carga_horaria || 0) * 60;
    const used = alocacoes
      .filter(a => a.id_disciplina === discId && a.id_turma === selectedTurma)
      .reduce((sum, a) => {
        const h = horarios.find(h => h.id_horario === a.id_horario);
        return sum + (h ? calcDurationInMinutes(h) : 0);
      }, 0);
    return total - used;
  };

  const remainingHours = discId => {
    const minutes = remainingMinutes(discId);
    return minutesToHoursAndMinutes(minutes);
  };

  const getAllocationsForCell = (dia, horarioId) =>
    alocacoes.filter(a => a.dia_semana === dia && a.id_horario === horarioId && a.id_turma === selectedTurma);

  const handleCellClick = (dia, horarioId) => {
    if (!selectedTurma) return;
    setForm({ dia, horario: horarioId, disciplina: '', professor: '', sala: '' });
    setError('');
    setOpen(true);
  };

  const handleSave = () => {
    const { dia, horario, disciplina, professor, sala } = form;
    const reusableRooms = [2, 7];
    if (!disciplina) {
      setError('Selecione uma disciplina!');
      return;
    }

    // Verifica se a alocação vai deixar a carga horária negativa
    const h = horarios.find(h => h.id_horario === horario);
    const dur = h ? calcDurationInMinutes(h) : 0;
    if (remainingMinutes(disciplina) - dur < 0) {
      setError('Carga horária insuficiente para esta disciplina!');
      return;
    }

    if (professor && alocacoes.some(a => a.dia_semana === dia && a.id_horario === horario && a.id_professor === professor)) {
      setError('Professor já alocado neste horário!');
      return;
    }

    // Validação para sala
    if (
      sala &&
      !reusableRooms.includes(parseInt(sala)) &&
      alocacoes.some(a => a.dia_semana === dia && a.id_horario === horario && a.id_sala === sala)
    ) {
      setError('Sala já ocupada neste horário!');
      return;
    }

    // Envia a alocação para o backend
    axios.post('http://localhost:3030/api/alocacao', {
      id_turma: selectedTurma,
      id_disciplina: disciplina,
      id_professor: professor,
      id_sala: sala,
      id_horario: horario,
      dia_semana: dia,
    })
      .then(() => axios.get('http://localhost:3030/api/alocacao'))
      .then(res => {
        setAlocacoes(res.data);
        setOpen(false);
      })
      .catch(e => setError(e.response?.data?.error || 'Erro desconhecido'));
  };

  const exportToExcel = () => {
    if (!selectedTurma) {
      alert('Selecione uma turma para exportar!');
      return;
    }

    const data = alocacoes
      .filter(a => a.id_turma === selectedTurma)
      .map(a => {
        const horario = horarios.find(h => h.id_horario === a.id_horario);
        const disciplina = disciplinas.find(d => d.id_disciplina === a.id_disciplina);
        const professor = professores.find(p => p.id_professor === a.id_professor);
        const sala = salas.find(s => s.id_sala === a.id_sala);

        return {
          Dia: a.dia_semana,
          Horário: horario ? `${horario.inicio} - ${horario.fim}` : '',
          Disciplina: disciplina ? disciplina.nome : '',
          Professor: professor ? professor.nome : '',
          Sala: sala ? sala.nome : '',
        };
      });

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Alocações');

    XLSX.writeFile(workbook, `alocacoes_turma_${selectedTurma}.xlsx`);
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box>
        <Grid container spacing={3}>
          <Grid item xs={12} md={3}>
            <Paper elevation={4} sx={{ p: 2 }}>
              <FormControl fullWidth>
                <InputLabel>Turma</InputLabel>
                <Select value={selectedTurma} onChange={e => setSelectedTurma(e.target.value)}>
                  {turmas.map(t => <MenuItem key={t.id_turma} value={t.id_turma}>{t.nome}</MenuItem>)}
                </Select>
              </FormControl>
              <Button
                variant="contained"
                color="primary"
                onClick={exportToExcel}
                sx={{ mt: 2 }}
              >
                Exportar para Excel
              </Button>
              <Typography variant="h6" mt={3}>Disciplinas (h rest.)</Typography>
              <Box mt={1}>
                {disciplinas.map(d => (
                  <Typography key={d.id_disciplina} noWrap>
                    {d.nome}: {selectedTurma ? remainingHours(d.id_disciplina) : `${d.carga_horaria}h`}
                  </Typography>
                ))}
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} md={9}>
            <TableContainer component={Paper} elevation={4} sx={{ borderRadius: 2 }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: 'secundary.main' }}>
                    <TableCell sx={{ color: '#fff', fontWeight: 'bold', textAlign: 'center' }}>Horário</TableCell>
                    {dias.map(d => (
                      <TableCell key={d} sx={{ color: '#fff', fontWeight: 'bold', textAlign: 'center' }}>{d}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {horarios.map(h => (
                    <TableRow key={h.id_horario} hover>
                      <TableCell sx={{ textAlign: 'center', fontWeight: 'bold' }}>{`${h.inicio} - ${h.fim}`}</TableCell>
                      {dias.map(d => (
                        <TableCell key={`${d}-${h.id_horario}`} onClick={() => handleCellClick(d, h.id_horario)} sx={{ textAlign: 'center', cursor: 'pointer', backgroundColor: 'background.paper', '&:hover': { backgroundColor: 'action.hover' } }}>
                          {getAllocationsForCell(d, h.id_horario).map(a => (
                            <Typography key={a.id_alocacao} noWrap sx={{ fontSize: '0.875rem' }}>{a.disciplina} | {a.professor || '-'} | {a.sala || '-'}</Typography>
                          ))}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
        <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Nova Alocação</DialogTitle>
          <DialogContent>
            <FormControl fullWidth margin="dense">
              <InputLabel>Disciplina</InputLabel>
              <Select value={form.disciplina} onChange={e => setForm(f => ({ ...f, disciplina: e.target.value }))}>
                {disciplinas.map(d => <MenuItem key={d.id_disciplina} value={d.id_disciplina} disabled={selectedTurma && remainingHours(d.id_disciplina) <= 0}>{d.nome} ({remainingHours(d.id_disciplina)})</MenuItem>)}
              </Select>
            </FormControl>
            <FormControl fullWidth margin="dense">
              <InputLabel>Professor</InputLabel>
              <Select value={form.professor} onChange={e => setForm(f => ({ ...f, professor: e.target.value }))}>
                <MenuItem value="">Nenhum</MenuItem>
                {professores.map(p => <MenuItem key={p.id_professor} value={p.id_professor} disabled={alocacoes.some(a => a.dia_semana === form.dia && a.id_horario === form.horario && a.id_professor === p.id_professor)}>{p.nome}</MenuItem>)}
              </Select>
            </FormControl>
            <FormControl fullWidth margin="dense">
              <InputLabel>Sala</InputLabel>
              <Select value={form.sala} onChange={e => setForm(f => ({ ...f, sala: e.target.value }))}>
                <MenuItem value="">Nenhum</MenuItem>
                {salas.map(s => <MenuItem key={s.id_sala} value={s.id_sala}>{s.nome}</MenuItem>)}
              </Select>
            </FormControl>
            {error && <Typography color="error" mt={2}>{error}</Typography>}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)}>Cancelar</Button>
            <Button variant="contained" onClick={handleSave}>Salvar</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </ThemeProvider>
  );
}