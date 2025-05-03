import React, { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const ExportadorAlocacoes = () => {
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

  // Função para agrupar as alocações por turma
  const agruparPorTurma = () => {
    return dados.reduce((acc, alocacao) => {
      if (!acc[alocacao.turma]) {
        acc[alocacao.turma] = [];
      }
      acc[alocacao.turma].push(alocacao);
      return acc;
    }, {});
  };

  const turmasAgrupadas = agruparPorTurma();

  return (
    <div style={{ padding: '16px' }}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '16px' }}>Alocações Registradas</h2>

      {Object.keys(turmasAgrupadas).map((turma) => (
        <div key={turma} style={{ marginBottom: '32px' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '12px' }}>Turma: {turma}</h3>

          <div style={{ overflow: 'auto', maxHeight: '400px', marginBottom: '16px', border: '1px solid #ccc', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
              <thead style={{ backgroundColor: '#f4f4f4' }}>
                <tr>
                  <th style={{ padding: '8px', border: '1px solid #ddd' }}>ID</th>
                  <th style={{ padding: '8px', border: '1px solid #ddd' }}>Disciplina</th>
                  <th style={{ padding: '8px', border: '1px solid #ddd' }}>Professor</th>
                  <th style={{ padding: '8px', border: '1px solid #ddd' }}>Sala</th>
                  <th style={{ padding: '8px', border: '1px solid #ddd' }}>Início</th>
                  <th style={{ padding: '8px', border: '1px solid #ddd' }}>Fim</th>
                  <th style={{ padding: '8px', border: '1px solid #ddd' }}>Dia</th>
                </tr>
              </thead>
              <tbody>
                {turmasAgrupadas[turma].map((linha) => (
                  <tr key={linha.id_alocacao} style={{ textAlign: 'center', borderBottom: '1px solid #ddd' }}>
                    <td style={{ padding: '8px' }}>{linha.id_alocacao}</td>
                    <td style={{ padding: '8px' }}>{linha.disciplina}</td>
                    <td style={{ padding: '8px' }}>{linha.professor || '—'}</td>
                    <td style={{ padding: '8px' }}>{linha.sala || '—'}</td>
                    <td style={{ padding: '8px' }}>{linha.inicio}</td>
                    <td style={{ padding: '8px' }}>{linha.fim}</td>
                    <td style={{ padding: '8px' }}>{linha.dia_semana}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}

      <button
        onClick={exportarExcel}
        style={{
          backgroundColor: '#4CAF50',
          color: 'white',
          padding: '10px 20px',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '1rem'
        }}
      >
        📁 Exportar para Excel
      </button>
    </div>
  );
};

export default ExportadorAlocacoes;
