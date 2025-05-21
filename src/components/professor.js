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
  
  export default function Professor() {
    const [professores, setProfessores] = useState([]);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      const base = 'http://localhost:3030/api';
      axios.get(`${base}/professor`)
        .then(response => {
          setProfessores(response.data);
          setLoading(false);
        })
        .catch(error => {
          console.error("Erro ao buscar professores:", error);
          setLoading(false);
        });
    }, []);
  
    return (
      <Box sx={{ py: 8, bgcolor: 'background.default' }}>
        <Container>
          <Typography variant="h4" gutterBottom align="center">
            Nossos Professores
          </Typography>
  
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Grid container spacing={4}>
              {professores.map((professor) => (
                <Grid item key={professor.id_professor} xs={12} sm={6} md={4}>
                  <Card sx={{ borderRadius: 4, boxShadow: 4 }}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        {professor.nome}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        ID: {professor.id_professor}
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
  