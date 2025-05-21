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
  
  export default function Sala() {
    const [salas, setSalas] = useState([]);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      const base = 'http://localhost:3030/api';
      axios.get(`${base}/sala`)
        .then(response => {
          setSalas(response.data);
          setLoading(false);
        })
        .catch(error => {
          console.error("Erro ao buscar salas:", error);
          setLoading(false);
        });
    }, []);
  
    return (
      <Box sx={{ py: 8, bgcolor: 'background.default' }}>
        <Container>
          <Typography variant="h4" gutterBottom align="center">
            Nossas Salas
          </Typography>
  
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Grid container spacing={4}>
              {salas.map((sala) => (
                <Grid item key={sala.id_sala} xs={12} sm={6} md={4}>
                  <Card sx={{ borderRadius: 4, boxShadow: 4 }}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        {sala.nome}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        ID: {sala.id_sala}
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
  