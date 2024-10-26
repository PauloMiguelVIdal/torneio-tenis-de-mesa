// GroupStage.js
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
    if (!result) return;

    if (matchFormat === 'MD1') {
      const winner = result[participant1] > result[participant2] ? participant1 : participant2;
      recordGroupResult(groupIndex, matchIndex, participant1, participant2, winner);
    } else if (matchFormat === 'MD3') {
      const totalPoints1 = result[participant1].reduce((sum, score) => sum + score, 0);
      const totalPoints2 = result[participant2].reduce((sum, score) => sum + score, 0);
      const winner = totalPoints1 > totalPoints2 ? participant1 : participant2;
      recordGroupResult(groupIndex, matchIndex, participant1, participant2, winner);
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
                
                {matchFormat === 'MD1' ? (
                  <>
                    <input
                      type="number"
                      placeholder={`Ponto de ${match[0]}`}
                      onChange={(e) => handleScoreChange(groupIndex, matchIndex, match[0], 0, parseInt(e.target.value))}
                    />
                    <input
                      type="number"
                      placeholder={`Ponto de ${match[1]}`}
                      onChange={(e) => handleScoreChange(groupIndex, matchIndex, match[1], 0, parseInt(e.target.value))}
                    />
                  </>
                ) : (
                  [0, 1, 2].map(scoreIndex => (
                    <div key={scoreIndex}>
                      <input
                        type="number"
                        placeholder={`Ponto ${scoreIndex + 1} de ${match[0]}`}
                        onChange={(e) => handleScoreChange(groupIndex, matchIndex, match[0], scoreIndex, parseInt(e.target.value))}
                      />
                      <input
                        type="number"
                        placeholder={`Ponto ${scoreIndex + 1} de ${match[1]}`}
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

      <button onClick={() => {
        groups.forEach((group, groupIndex) => {
          generateMatches(group).forEach((match, matchIndex) => {
            handleSubmitResult(groupIndex, matchIndex, match[0], match[1]);
          });
        });
      }}>
        Submeter Resultados
      </button>
    </div>
  );
};

export default GroupStage;
