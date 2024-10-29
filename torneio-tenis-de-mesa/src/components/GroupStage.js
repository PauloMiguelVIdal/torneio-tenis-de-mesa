import React, { useState } from 'react';

const GroupStage = ({ groups, recordGroupResults, matchFormat }) => {
  const [scores, setScores] = useState({});
  const [error, setError] = useState(null);

  const handleScoreChange = (groupIndex, matchIndex, participant, scoreIndex, score) => {
    if (score < 0) {
      setError('Score não pode ser negativo.');
      return;
    }

    const matchKey = `${groupIndex}-${matchIndex}`;
    setScores((prevScores) => ({
      ...prevScores,
      [matchKey]: {
        ...prevScores[matchKey],
        [participant]: {
          ...(prevScores[matchKey]?.[participant] || []),
          [scoreIndex]: score || 0,
        },
      },
    }));
    setError(null);
  };

  const handleSubmitAllResults = () => {
    const allResults = [];

    for (const [matchKey, matchData] of Object.entries(scores)) {
      const [groupIndex, matchIndex] = matchKey.split('-').map(Number);
      const participants = Object.keys(matchData);
      const [participant1, participant2] = participants;

      if (!matchData[participant1] || !matchData[participant2]) {
        setError('Por favor, preencha todos os pontos antes de submeter.');
        return;
      }

      const points1 = matchData[participant1].reduce((sum, score) => sum + score, 0);
      const points2 = matchData[participant2].reduce((sum, score) => sum + score, 0);

      allResults.push({
        groupIndex,
        matchIndex,
        participant1,
        participant2,
        points1,
        points2,
      });
    }

    recordGroupResults(allResults);
    setError(null);
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
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {groups.map((group, groupIndex) => (
        <div key={groupIndex} className="group-container">
          <h3>Grupo {groupIndex + 1}</h3>
          <ul>
            {generateMatches(group).map((match, matchIndex) => (
              <li key={matchIndex}>
                <p>{match[0]} vs {match[1]}</p>
                
                {matchFormat === 'MD1' ? (
                  <>
                    <input
                      type="number"
                      placeholder={`Ponto de ${match[0]}`}
                      min="0"
                      onChange={(e) => handleScoreChange(groupIndex, matchIndex, match[0], 0, parseInt(e.target.value))}
                    />
                    <input
                      type="number"
                      placeholder={`Ponto de ${match[1]}`}
                      min="0"
                      onChange={(e) => handleScoreChange(groupIndex, matchIndex, match[1], 0, parseInt(e.target.value))}
                    />
                  </>
                ) : (
                  [0, 1, 2].map((scoreIndex) => (
                    <div key={scoreIndex}>
                      <input
                        type="number"
                        placeholder={`Ponto ${scoreIndex + 1} de ${match[0]}`}
                        min="0"
                        onChange={(e) => handleScoreChange(groupIndex, matchIndex, match[0], scoreIndex, parseInt(e.target.value))}
                      />
                      <input
                        type="number"
                        placeholder={`Ponto ${scoreIndex + 1} de ${match[1]}`}
                        min="0"
                        onChange={(e) => handleScoreChange(groupIndex, matchIndex, match[1], scoreIndex, parseInt(e.target.value))}
                      />
                    </div>
                  ))
                )}
              </li>
            ))}
          </ul>
        </div>
      ))}

      <button onClick={handleSubmitAllResults}>Submeter Todos os Resultados</button>
    </div>
  );
};

export default GroupStage;
