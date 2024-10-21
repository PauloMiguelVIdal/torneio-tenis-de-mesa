import React, { useState } from 'react';

const EliminationStage = ({ elimination, recordMatchResult }) => {
  const [results, setResults] = useState({});

  const handleResultChange = (index, value) => {
    setResults({ ...results, [index]: value });
  };

  const handleSubmitResult = (index, participant1, participant2) => {
    const result = results[index];
    if (result) {
      recordMatchResult(index, participant1, participant2, result);
    } else {
      alert("Por favor, insira o vencedor.");
    }
  };

  return (
    <div>
      <h2>Fase Eliminatória</h2>
      {elimination.length > 0 ? (
        <ul>
          {elimination.map((match, idx) => (
            <li key={idx}>
              <p>{match[0]} vs {match[1]}</p>
              <input
                type="text"
                placeholder="Digite o vencedor"
                value={results[idx] || ''}
                onChange={(e) => handleResultChange(idx, e.target.value)}
              />
              <button onClick={() => handleSubmitResult(idx, match[0], match[1])}>
                Registrar Resultado
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>Nenhum jogo foi gerado ainda.</p>
      )}
    </div>
  );
};

export default EliminationStage;