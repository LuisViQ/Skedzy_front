import React, { useEffect, useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Select, MenuItem, Button, Dialog, DialogTitle, DialogContent, DialogActions,
  FormControl, InputLabel, Grid, Typography
} from '@mui/material';
import axios from 'axios';

export default function AllocationScheduler() {
  const [turmas, setTurmas] = useState([]);
  const [horarios, setHorarios] = useState([]);
  const [dias] = useState(['segunda', 'terça', 'quarta', 'quinta', 'sexta']);
  const [disciplinas, setDisciplinas] = useState([]);
  const [professores, setProfessores] = useState([]);
  const [salas, setSalas] = useState([]);
  const [alocacoes, setAlocacoes] = useState([]);
  const [selectedTurma, setSelectedTurma] = useState('');
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ dia: '', horario: '', disciplina: '', professor: '', sala: '' });
  const [error, setError] = useState('');

  // Carrega dados iniciais
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
    });
  }, []);

 // Função para calcular a duração de um horário em minutos
const calcDurationInMinutes = h => {
    const [hi, mi] = h.inicio.split(':').map(Number);
    const [hf, mf] = h.fim.split(':').map(Number);
    return ((hf * 60 + mf) - (hi * 60 + mi)); // Retorna a duração em minutos
  };
  
  // Função para converter minutos em horas e minutos
  const minutesToHoursAndMinutes = minutes => {
    const hours = Math.floor(minutes / 60); // Divisão para horas inteiras
    const mins = minutes % 60; // Resto da divisão, que são os minutos restantes
    return `${hours}h ${mins}m`; // Retorna no formato 'Xh Ym'
  };
  
  // Função para calcular as horas restantes para uma disciplina em formato 'hh:mm'
  const remainingHours = (discId) => {
    const disc = disciplinas.find(d => d.id_disciplina === discId);
    const total = disc?.carga_horaria || 0; // Total de carga horária da disciplina
    const totalMinutes = total * 60; // Converte carga horária total para minutos
    const used = alocacoes
      .filter(a => a.id_disciplina === discId) // Filtra alocações apenas pela disciplina
      .reduce((sum, a) => {
        const h = horarios.find(h => h.id_horario === a.id_horario);
        return sum + (h ? calcDurationInMinutes(h) : 0);
      }, 0);
    
    const remainingMinutes = totalMinutes - used; // Calcula os minutos restantes
    return minutesToHoursAndMinutes(remainingMinutes); // Retorna a carga horária restante no formato 'Xh Ym'
  };
  
  // Função para calcular a duração da aula em horas e minutos (formato 'hh:mm')
  const calcDuration = h => {
    const durationInMinutes = calcDurationInMinutes(h); // Calcula a duração em minutos
    return minutesToHoursAndMinutes(durationInMinutes); // Retorna a duração no formato 'Xh Ym'
  };
  
  // Teste com um horário de exemplo
  const horarioExemplo = { inicio: '07:35', fim: '08:25' };
  console.log(calcDuration(horarioExemplo)); // Exemplo: retorna "0h 50m"
  

  // Filtra alocações para célula específica
  const getAllocationsForCell = (dia, horarioId) =>
    alocacoes.filter(a => a.dia_semana === dia && a.id_horario === horarioId && a.id_turma === selectedTurma);

  // Abre modal ao clicar na célula
  const handleCellClick = (dia, horarioId) => {
    if (!selectedTurma) return;
    setForm({ dia, horario: horarioId, disciplina: '', professor: '', sala: '' });
    setError('');
    setOpen(true);
  };

  // Salvar alocação
  const handleSave = () => {
    const { dia, horario, disciplina, professor, sala } = form;
    // Valida carga horária
    if (remainingHours(disciplina) <= 0) {
      setError('Carga horária da disciplina excedida!');
      return;
    }
    // Conflito professor
    if (professor && alocacoes.some(a => a.dia_semana === dia && a.id_horario === horario && a.id_professor === professor)) {
      setError('Professor já alocado neste horário!');
      return;
    }
    // Conflito sala
    if (sala && alocacoes.some(a => a.dia_semana === dia && a.id_horario === horario && a.id_sala === sala)) {
      setError('Sala já ocupada neste horário!');
      return;
    }
    // Envia para backend
    axios.post('http://localhost:3030/api/alocacao', {
      id_turma: selectedTurma,
      id_disciplina: disciplina,
      id_professor: professor || null,
      id_sala: sala || null,
      id_horario: horario,
      dia_semana: dia,
    }).then(() => axios.get('http://localhost:3030/api/alocacao'))
      .then(res => {
        setAlocacoes(res.data);
        setOpen(false);
      }).catch(e => setError(e.response?.data?.error || 'Erro desconhecido'));
  };

  return (
    <Grid container spacing={2}>
      {/* Seleção de turma e cargas restantes */}
      <Grid item xs={12} md={3}>
        <FormControl fullWidth>
          <InputLabel>Turma</InputLabel>
          <Select
            value={selectedTurma}
            onChange={e => setSelectedTurma(e.target.value)}
          >
            {turmas.map(t => (
              <MenuItem key={t.id_turma} value={t.id_turma}>{t.nome}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <Typography variant="h6" mt={2}>Disciplinas (h rest.)</Typography>
        {disciplinas.map(d => (
          <Typography key={d.id_disciplina} noWrap>
            {d.nome}: {selectedTurma ? remainingHours(d.id_disciplina) : d.carga_horaria}h
          </Typography>
        ))}
      </Grid>

      {/* Grade de horários */}
      <Grid item xs={12} md={9}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Horário</TableCell>
                {dias.map(d => <TableCell key={d}>{d}</TableCell>)}
              </TableRow>
            </TableHead>
            <TableBody>
              {horarios.map(h => (
                <TableRow key={h.id_horario} hover>
                  <TableCell>{`${h.inicio} - ${h.fim}`}</TableCell>
                  {dias.map(d => (
                    <TableCell
                      key={`${d}-${h.id_horario}`}
                      onClick={() => handleCellClick(d, h.id_horario)}
                    >
                      {getAllocationsForCell(d, h.id_horario).map(a => (
                        <Typography key={a.id_alocacao} noWrap>
                          {a.disciplina} | {a.professor || '-'} | {a.sala || '-'}
                        </Typography>
                      ))}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>

      {/* Modal de alocação */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Nova Alocação</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="dense">
            <InputLabel>Disciplina</InputLabel>
            <Select
              value={form.disciplina}
              onChange={e => setForm(f => ({ ...f, disciplina: e.target.value }))}
            >
              {disciplinas.map(d => (
                <MenuItem
                  key={d.id_disciplina}
                  value={d.id_disciplina}
                  disabled={selectedTurma && remainingHours(d.id_disciplina) <= 0}
                >
                  {d.nome} ({remainingHours(d.id_disciplina)}h rest.)
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="dense">
            <InputLabel>Professor</InputLabel>
            <Select
              value={form.professor}
              onChange={e => setForm(f => ({ ...f, professor: e.target.value }))}
            >
              <MenuItem value="">Nenhum</MenuItem>
              {professores.map(p => (
                <MenuItem
                  key={p.id_professor}
                  value={p.id_professor}
                  disabled={alocacoes.some(a => a.dia_semana === form.dia && a.id_horario === form.horario && a.id_professor === p.id_professor)}
                >
                  {p.nome}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="dense">
            <InputLabel>Sala</InputLabel>
            <Select
              value={form.sala}
              onChange={e => setForm(f => ({ ...f, sala: e.target.value }))}
            >
              <MenuItem value="">Nenhum</MenuItem>
              {salas.map(s => (
                <MenuItem
                  key={s.id_sala}
                  value={s.id_sala}
                  disabled={alocacoes.some(a => a.dia_semana === form.dia && a.id_horario === form.horario && a.id_sala === s.id_sala)}
                >
                  {s.nome}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {error && <Typography color="error">{error}</Typography>}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleSave}>Salvar</Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
}
