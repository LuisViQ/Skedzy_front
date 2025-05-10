import {
    Box,
    Typography,
    Grid,
    Card,
    CardContent,
    Container,
    CircularProgress
  } from '@mui/material';
  import { useEffect, useState } from 'react';
  import axios from 'axios';
  
  export default function Turmas() {
    const [turmas, setTurmas] = useState([]);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      const base = 'http://localhost:3030/api';
      axios.get(`${base}/turmas`)
        .then(response => {
          setTurmas(response.data);
          setLoading(false);
        })
        .catch(error => {
          console.error("Erro ao buscar turmas:", error);
          setLoading(false);
        });
    }, []);
  
    return (
      <Box sx={{ py: 8, bgcolor: 'background.default' }}>
        <Container>
          <Typography variant="h4" gutterBottom align="center">
            Nossas Turmas
          </Typography>
  
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Grid container spacing={4}>
              {turmas.map((turma) => (
                <Grid item key={turma.id} xs={12} sm={6} md={4}>
                  <Card sx={{ borderRadius: 4, boxShadow: 4 }}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Turma {turma.nome}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {turma.descricao}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Container>
      </Box>
    );
  }
  