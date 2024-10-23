import React, { useState } from 'react';

const GroupStage = ({ groups, recordGroupResult, matchFormat }) => {
  const [scores, setScores] = useState({});

  const handleScoreChange = (groupIndex, matchIndex, participant, scoreIndex, score) => {
    const matchKey = `${groupIndex}-${matchIndex}`;
    const updatedScores = {
      ...scores,
      [matchKey]: {
        ...scores[matchKey],
        [participant]: {
          ...(scores[matchKey]?.[participant] || []),
          [scoreIndex]: score || 0,
        },
      },
    };
    setScores(updatedScores);
  };

  const handleSubmitResult = (groupIndex, matchIndex, participant1, participant2) => {
    const result = scores[`${groupIndex}-${matchIndex}`];
    
    // Verifica o formato do jogo (MD1 ou MD3)
    if (matchFormat === 'MD1') {
      // Se o formato for MD1, verifica os pontos de cada jogador e define o vencedor
      if (result && result[participant1] !== undefined && result[participant2] !== undefined) {
        const winner = result[participant1] > result[participant2] ? participant1 : participant2;
        recordGroupResult(groupIndex, matchIndex, participant1, participant2, winner);
      }
    } else if (matchFormat === 'MD3') {
      // Para MD3, precisamos verificar as 3 rodadas e somar os pontos
      if (result && result[participant1] && result[participant2]) {
        const scores1 = result[participant1] || [];
        const scores2 = result[participant2] || [];

        if (scores1.length >= 3 && scores2.length >= 3) {
          const totalPoints1 = scores1.reduce((sum, score) => sum + (score || 0), 0);
          const totalPoints2 = scores2.reduce((sum, score) => sum + (score || 0), 0);
          const winner = totalPoints1 > totalPoints2 ? participant1 : participant2;
          recordGroupResult(groupIndex, matchIndex, participant1, participant2, winner);
        }
      }
    }
  };

  const generateMatches = (group) => {
    const matches = [];
    for (let i = 0; i < group.length; i++) {
      for (let j = i + 1; j < group.length; j++) {
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
                
                {/* Verifica o formato do jogo e gera os inputs necessários */}
                {matchFormat === 'MD1' ? (
                  <>
                    <input
                      type="number"
                      placeholder={`Ponto de ${match[0]}`}
                      onChange={(e) => handleScoreChange(groupIndex, matchIndex, match[0], 0, parseInt(e.target.value) || 0)}
                    />
                    <input
                      type="number"
                      placeholder={`Ponto de ${match[1]}`}
                      onChange={(e) => handleScoreChange(groupIndex, matchIndex, match[1], 0, parseInt(e.target.value) || 0)}
                    />
                  </>
                ) : (
                  [0, 1, 2].map(scoreIndex => (
                    <div key={scoreIndex}>
                      <input
                        type="number"
                        placeholder={`Ponto ${scoreIndex + 1} de ${match[0]}`}
                        onChange={(e) => handleScoreChange(groupIndex, matchIndex, match[0], scoreIndex, parseInt(e.target.value) || 0)}
                      />
                      <input
                        type="number"
                        placeholder={`Ponto ${scoreIndex + 1} de ${match[1]}`}
                        onChange={(e) => handleScoreChange(groupIndex, matchIndex, match[1], scoreIndex, parseInt(e.target.value) || 0)}
                      />
                    </div>
                  ))
                )}
              </li>
            ))}
          </ul>
        </div>
      ))}
      
      {/* Botão para registrar todos os resultados de uma vez */}
      <button onClick={() => {
        groups.forEach((group, groupIndex) => {
          generateMatches(group).forEach((match, matchIndex) => {
            handleSubmitResult(groupIndex, matchIndex, match[0], match[1]);
          });
        });
      }}>
        Registrar Resultados
      </button>
    </div>
  );
};

export default GroupStage;
