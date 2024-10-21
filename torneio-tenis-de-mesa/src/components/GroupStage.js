import React, { useState } from 'react';

const GroupStage = ({ groups, recordGroupResult }) => {
  const [results, setResults] = useState({});

  const handleScoreChange = (groupIndex, matchIndex, participant, score) => {
    setResults({
      ...results,
      [`${groupIndex}-${matchIndex}`]: {
        ...results[`${groupIndex}-${matchIndex}`],
        [participant]: score,
      },
    });
  };

  const handleSubmitResult = (groupIndex, matchIndex, participant1, participant2) => {
    const result = results[`${groupIndex}-${matchIndex}`];
    if (result && result[participant1] !== undefined && result[participant2] !== undefined) {
      const winner = result[participant1] > result[participant2] ? participant1 : participant2;
      recordGroupResult(groupIndex, matchIndex, participant1, participant2, winner);
    } else {
      alert("Por favor, insira os resultados de ambos os participantes.");
    }
  };

  // Gera os jogos para que ninguém jogue contra si mesmo
  const generateMatches = (group) => {
    const matches = [];
    for (let i = 0; i < group.length; i++) {
      for (let j = i + 1; j < group.length; j++) { // j sempre começa depois de i
        matches.push([group[i], group[j]]);
      }
    }
    return matches;
  };

  return (
    <div>
      <h2>Fase de Grupos</h2>
      {groups.map((group, groupIndex) => (
        <div key={groupIndex}>
          <h3>Grupo {groupIndex + 1}</h3>
          <ul>
            {generateMatches(group).map((match, matchIndex) => (
              <li key={matchIndex}>
                <p>{match[0]} vs {match[1]}</p>
                <input
                  type="number"
                  placeholder={`Pontos de ${match[0]}`}
                  value={results[`${groupIndex}-${matchIndex}`]?.[match[0]] || ''}
                  onChange={(e) => handleScoreChange(groupIndex, matchIndex, match[0], parseInt(e.target.value))}
                />
                <input
                  type="number"
                  placeholder={`Pontos de ${match[1]}`}
                  value={results[`${groupIndex}-${matchIndex}`]?.[match[1]] || ''}
                  onChange={(e) => handleScoreChange(groupIndex, matchIndex, match[1], parseInt(e.target.value))}
                />
                <button onClick={() => handleSubmitResult(groupIndex, matchIndex, match[0], match[1])}>
                  Registrar Resultado
                </button>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default GroupStage;
