import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
// import Turmas from './components/turmas';
// import Professor from './components/professor';
// import Sala from './components/sala';
import Horario from './components/horario';
import Home from './components/home';
import RegistroHorarios from './components/registro';

function App() {
  // 1. Estados para detectar mobile e controlar abertura do menu
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [menuOpen, setMenuOpen] = useState(false);

  // 2. Listener de resize pra atualizar isMobile e fechar menu no desktop
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) setMenuOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 3. Estilos dinâmicos do <ul>
  const navListStyle = {
    listStyleType: 'none',
    display: !isMobile || menuOpen ? 'flex' : 'none',
    flexDirection: isMobile ? 'column' : 'row',
    justifyContent: 'space-around',
    margin: 0,
    padding: 0,
    flex: 1,
    backgroundColor: isMobile ? '#c4f2d0' : 'transparent', // opaco no mobile
  };

  return (
    <Router>
      <div>
        <nav
          style={{
            backgroundColor: '#c4f2d0',
            padding: '1rem',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <a href="/">
            <img
              src="/sistemalogo.png"
              alt="Logo IEMA"
              style={{ height: isMobile ? '20px' : '50px', marginRight: '1rem' }}
            />
          </a>

          {/* 4. Botão só aparece quando for mobile */}
          {isMobile && (
            <button
              onClick={() => setMenuOpen((prev) => !prev)}
              style={{
                marginLeft: 'auto',
                background: 'transparent',
                border: '1px solid #333',
                padding: '0.5rem 1rem',
                fontSize: '1rem',
                cursor: 'pointer',

              }}
            >
              {menuOpen ? 'Fechar' : 'Ver opções'}
            </button>
          )}

          {/* 5. Menu de links */}
          <ul style={navListStyle}>
            <li>
              <a
                href="/"
                style={{
                  color: 'black',
                  textDecoration: 'none',
                  fontSize: '1.2rem',
                  padding: isMobile ? '0.5rem 0' : '13px',
                  border: isMobile ? '0' : '1px solid #333',
                  borderRadius: '5px'
                }}
              >
                Início
              </a>
            </li>
            <li>
              <a
                href="/Turma"
                style={{
                  color: 'black',
                  textDecoration: 'none',
                  fontSize: '1.2rem',
                  padding: isMobile ? '0.5rem 0' : '13px',
                  border: isMobile ? '0' : '1px solid #333',
                  borderRadius: '5px'
                }}
              >
                Turmas
              </a>
            </li>
            <li>
              <a
                href="/professor"
                style={{
                  color: 'black',
                  textDecoration: 'none',
                  fontSize: '1.2rem',
                  padding: isMobile ? '0.5rem 0' : '13px',
                  border: isMobile ? '0' : '1px solid #333',
                  borderRadius: '5px'
                }}
              >
                Professor
              </a>
            </li>
            <li>
              <a
                href="/sala"
                style={{
                  color: 'black',
                  textDecoration: 'none',
                  fontSize: '1.2rem',
                  padding: isMobile ? '0.5rem 0' : '13px',
                  border: isMobile ? '0' : '1px solid #333',
                  borderRadius: '5px'
                }}
              >
                Sala
              </a>
            </li>
            <li>
              <a
                href="/horario"
                style={{
                  color: 'black',
                  textDecoration: 'none',
                  fontSize: '1.2rem',
                  padding: isMobile ? '0.5rem 0' : '13px',
                  border: isMobile? '0' :'1px solid #333',
                  borderRadius: '5px'
                }}
              >
                Lista de Horários
              </a>
            </li>
            <li>
              <a
                href="/registros"
                style={{
                  color: 'black',
                  textDecoration: 'none',
                  fontSize: '1.2rem',
                  padding: isMobile ? '0.5rem 0' : '13px',
                  border: isMobile ? '0' : '1px solid #333',
                  borderRadius: '5px'
                }}
              >
                Registro de Horários
              </a>
            </li>
          </ul>

          <img
            src="/logoiema.png"
            alt="Logo IEMA"
            style={{ height: isMobile ? '40px' : '75px', marginLeft: isMobile ? '0' : '1rem' }}
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
