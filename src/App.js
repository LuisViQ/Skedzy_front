import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import React from 'react';
// import Turmas from './components/turmas';
// import Professor from './components/professor';
// import Sala from './components/sala';
import Horario from './components/horario';
import Home from './components/home';
import RegistroHorarios from './components/registro';
function App() {
  return (
    <Router>
      <div>
          <nav style={{ backgroundColor: '#c4f2d0', padding: '1rem', display: 'flex', alignItems: 'center' }}>
          <a href="/"><img 
              src="/sistemalogo.png" 
              alt="Logo IEMA" 
              style={{ height: '50px', marginRight: '1rem' }} 
            /></a>
            <ul style={{ listStyleType: 'none', display: 'flex', justifyContent: 'space-around', margin: 0, padding: 0, flex: 1 }}>
              <li><a href="/" style={{ color: 'black', textDecoration: 'none', fontSize: '1.2rem' }}>Início</a></li>
              <li><a href="/Turma" style={{ color: 'black', textDecoration: 'none', fontSize: '1.2rem' }}>Turmas</a></li>
              <li><a href="/professor" style={{ color: 'black', textDecoration: 'none', fontSize: '1.2rem' }}>Professor</a></li>
              <li><a href="/sala" style={{ color: 'black', textDecoration: 'none', fontSize: '1.2rem' }}>Sala</a></li>
              <li><a href="/horario" style={{ color: 'black', textDecoration: 'none', fontSize: '1.2rem' }}>Lista de Horários</a></li>
              <li><a href="/registros" style={{ color: 'black', textDecoration: 'none', fontSize: '1.2rem' }}>Gegistro de Horários</a></li>
            </ul>
            <img 
              src="/logoiema.png" 
              alt="Logo IEMA" 
              style={{ height: '75px', marginRight: '1rem' }} 
            />
          </nav>

          {/* Definição das rotas */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/horario" element={<Horario />} />
          {/* <Route path="/professor" element={<Professor />} />
          <Route path="/sala" element={<Sala />} />
          <Route path="/Turma" element={<Turmas />} /> */}
          <Route path="/registros" element={<RegistroHorarios />} />
          <Route path="*" element={<h1>404 - Página não encontrada</h1>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
