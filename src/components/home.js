import {
  Box,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Button,
  Container,
  Avatar,
  Link,
  IconButton
} from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import EmailIcon from '@mui/icons-material/Email';

export default function Home() {
  return (
    <Box sx={{ bgcolor: 'background.default', color: 'text.primary' }}>
      {/* Hero Section */}
      <Box
        sx={{
          minHeight: '80vh',
          background: `url('/images/hero-bg.jpg') center/cover no-repeat`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          
        }}
      >
        <Container maxWidth="md">
          <Typography
            variant="h1"
            sx={{
              color: '#fff',
              fontWeight: 800,
              mb: 2,
              fontSize: 'clamp(2rem, 8vw, 4rem)'
            }}
          >
            Gestão de Horários
          </Typography>
          <Typography
            variant="h5"
            sx={{
              color: 'rgba(255,255,255,0.85)',
              mb: 4,
              fontSize: 'clamp(1rem, 4vw, 1.5rem)'
            }}
          >
            Algo nosso, feito por nós – IEMA Presidente Dutra
          </Typography>
          <Button variant="contained" size="large" href="#iemapk">
            Sobre o IEMA Presidente Dutra
          </Button>
        </Container>
      </Box>

      {/* IEMA Section */}
      <Box id="iemapk" sx={{ py: { xs: 6, md: 10 }, px: 2 }}>
        <Container>
          <Grid container spacing={4} justifyContent="center">
            <Grid item xs={12} md={8}>
              <Card sx={{ borderRadius: 4, boxShadow: 6 }}>
                <CardMedia
                  component="img"
                  image="/uppk.jpg"
                  alt="IEMA Presidente Dutra"
                  sx={{
                    width: '100%',
                    height: { xs: 240, sm: 300, md: 400 },
                    objectFit: 'cover'
                  }}
                />
                <CardContent>
                  <Typography
                    variant="h5"
                    sx={{ fontWeight: 600, fontSize: 'clamp(1.3rem, 4vw, 2rem)', mb: 2 }}
                  >
                    IEMA Presidente Dutra
                  </Typography>
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{ fontSize: 'clamp(0.95rem, 2vw, 1.2rem)', lineHeight: 1.6 }}
                  >
                    Inaugurado em 17 de julho de 2020, o Instituto Estadual de Educação, Ciência e
                    Tecnologia do Maranhão (IEMA) – Unidade Plena de Presidente Dutra – é um centro
                    de ensino técnico de tempo integral que atende jovens de toda a região central
                    do estado. A escola oferece cursos técnicos integrados ao ensino médio nas áreas
                    de Administração, Química, Serviços Jurídicos e Manutenção e Suporte em
                    Informática. Com infraestrutura moderna, incluindo 12 salas de aula, seis
                    laboratórios, biblioteca, auditório e quadra poliesportiva, o IEMA proporciona
                    uma formação de qualidade, preparando os estudantes para o mercado de trabalho e
                    o ensino superior.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Footer */}
      <Box sx={{ bgcolor: 'background.paper', py: 6 }}>
        <Container maxWidth="sm" sx={{ textAlign: 'center' }}>
          <Avatar
            sx={{ width: 80, height: 80, mx: 'auto', mb: 2 }}
            src="/images/dev-avatar.jpg"
          />
          <Typography variant="h6" sx={{ fontSize: 'clamp(1rem, 3vw, 1.5rem)' }}>
            Luis Felipe Queiroz
          </Typography>
          <Box>
            <IconButton component={Link} href="mailto:fileps2009@gmail.com">
              <EmailIcon />
            </IconButton>
            <IconButton
              component={Link}
              href="https://github.com/Luisgato21"
              target="_blank"
              rel="noopener"
            >
              <GitHubIcon />
            </IconButton>
          </Box>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mt: 1, fontSize: 'clamp(0.8rem, 2vw, 1rem)' }}
          >
            &copy; {new Date().getFullYear()} Luis Felipe Queiroz
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}
