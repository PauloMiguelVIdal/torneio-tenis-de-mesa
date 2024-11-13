import React, { useState } from 'react';

const GroupStage = ({ participants, groups, setGroups, recordGroupResults, matchFormat }) => {
    const [scores, setScores] = useState({});
    const [error, setError] = useState(null);
    const [generated, setGenerated] = useState(false);
    const [groupWinners, setGroupWinners] = useState([]); 
    const [bracket, setBracket] = useState([]); 
    const [currentRound, setCurrentRound] = useState(0); // Controla a rodada atual do chaveamento
    const [finalWinner, setFinalWinner] = useState(null); // Novo estado para o vencedor final

    // Função para lidar com a alteração do score
    const handleScoreChange = (matchKey, participant, scoreIndex, score) => {
        if (score < 0) {
            setError('Score não pode ser negativo.');
            return;
        }

        setScores((prevScores) => ({
            ...prevScores,
            [matchKey]: {
                ...prevScores[matchKey],
                [participant]: [
                    ...((prevScores[matchKey]?.[participant] || []).slice(0, scoreIndex)),
                    score,
                    ...((prevScores[matchKey]?.[participant] || []).slice(scoreIndex + 1)),
                ],
            },
        }));
        setError(null);
    };

    // Função para registrar os resultados da fase de grupos
// Ajuste na função handleSubmitGroupResults para definir o vencedor da fase de grupos
const handleSubmitGroupResults = () => {
    const allResults = [];
    const groupPoints = {}; 

    groups.forEach((group, groupIndex) => {
        groupPoints[groupIndex] = {};

        generateMatches(group).forEach((match, matchIndex) => {
            const matchKey = `${groupIndex}-${matchIndex}`;
            const matchData = scores[matchKey];
            if (matchData) {
                const participants = Object.keys(matchData);
                const [participant1, participant2] = participants;
                const points1 = matchData[participant1].reduce((sum, score) => sum + score, 0);
                const points2 = matchData[participant2].reduce((sum, score) => sum + score, 0);

                groupPoints[groupIndex][participant1] = (groupPoints[groupIndex][participant1] || 0) + points1;
                groupPoints[groupIndex][participant2] = (groupPoints[groupIndex][participant2] || 0) + points2;

                allResults.push({
                    groupIndex,
                    matchIndex,
                    participant1,
                    participant2,
                    points1,
                    points2,
                });
            }
        });
    });

    const winners = [];

    Object.values(groupPoints).forEach((participants) => {
        const sortedParticipants = Object.entries(participants).sort((a, b) => b[1] - a[1]);
        winners.push(sortedParticipants[0][0]); 
    });

    setGroupWinners(winners); 
    recordGroupResults(allResults); 
    setError(null);
    setScores({}); // Limpa os scores para começar o chaveamento sem valores antigos
};

    // Função para registrar os resultados do chaveamento
   // Ajuste na função handleSubmitBracketResults
       // Função para registrar os resultados do chaveamento
       const handleSubmitBracketResults = () => {
        const updatedBracket = bracket[currentRound].map((match, matchIndex) => {
            const matchKey = `bracket-${currentRound}-${matchIndex}`;
            const matchData = scores[matchKey];
            if (matchData) {
                const participants = Object.keys(matchData);
                const [participant1, participant2] = participants;
                const points1 = matchData[participant1].reduce((sum, score) => sum + score, 0);
                const points2 = matchData[participant2].reduce((sum, score) => sum + score, 0);

                return points1 > points2 ? participant1 : participant2;
            }
            return null;
        }).filter(Boolean); // Filtra os matches válidos

        if (updatedBracket.length > 1) {
            setBracket(prevBracket => {
                const nextRound = createNextRound(updatedBracket);
                return [...prevBracket, nextRound];
            });
            setCurrentRound(currentRound + 1);
            setScores({}); // Limpa os scores ao iniciar a nova rodada
        } else {
            setFinalWinner(updatedBracket[0]); // Define o vencedor final
            console.log("Vencedor final:", updatedBracket[0]);
        }
    };

    // Função para criar a próxima rodada do chaveamento
    const createNextRound = (winners) => {
        let nextRound = [];
        for (let i = 0; i < winners.length; i += 2) {
            nextRound.push([winners[i], winners[i + 1]]);
        }
        return nextRound;
    };
    // Função para gerar os matches de um grupo
    const generateMatches = (group) => {
        const matches = [];
        for (let i = 0; i < group.length; i++) {
            for (let j = i + 1; j < group.length; j++) {
                matches.push([group[i], group[j]]);
            }
        }
        return matches;
    };

    // Função para criar o bracket inicial com os vencedores dos grupos
    const createBracket = (winners) => {
        let rounds = [];
        let currentRound = [];
        for (let i = 0; i < winners.length; i += 2) {
            currentRound.push([winners[i], winners[i + 1]]);
        }
        rounds.push(currentRound);
        return rounds;
    };

    // Função para gerar os grupos
    const handleGenerateGroups = () => {
        if (!Array.isArray(participants) || participants.length === 0) {
            setError('Nenhum participante para gerar grupos.');
            return;
        }

        const shuffledParticipants = [...participants].sort(() => Math.random() - 0.5);
        const groupSize = Math.ceil(shuffledParticipants.length / 4);
        const newGroups = [];

        for (let i = 0; i < shuffledParticipants.length; i += groupSize) {
            newGroups.push(shuffledParticipants.slice(i, i + groupSize));
        }

        setScores({});
        setGenerated(true);
        setGroups(newGroups);
    };

    return (
        <div>
            <h2>Fase de Grupos</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}

            <button onClick={handleGenerateGroups}>Gerar Fase de Grupos</button>

            {generated && groups.map((group, groupIndex) => (
                <div key={groupIndex} className="group-container">
                    <h3>Grupo {groupIndex + 1}</h3>
                    <ul>
                        {generateMatches(group).map((match, matchIndex) => (
                            <li key={matchIndex}>
                                <p>{match[0]} vs {match[1]}</p>
                                {[0, 1, 2].map((scoreIndex) => (
                                    <div key={scoreIndex}>
                                        <input
                                            type="number"
                                            placeholder={`Ponto ${scoreIndex + 1} de ${match[0]}`}
                                            min="0"
                                            onChange={(e) => handleScoreChange(`${groupIndex}-${matchIndex}`, match[0], scoreIndex, parseInt(e.target.value) || 0)}
                                        />
                                        <input
                                            type="number"
                                            placeholder={`Ponto ${scoreIndex + 1} de ${match[1]}`}
                                            min="0"
                                            onChange={(e) => handleScoreChange(`${groupIndex}-${matchIndex}`, match[1], scoreIndex, parseInt(e.target.value) || 0)}
                                        />
                                    </div>
                                ))}
                            </li>
                        ))}
                    </ul>
                </div>
            ))}

            {finalWinner ? (
                <div>
                    <h3>Vencedor Final</h3>
                    <p>{finalWinner}</p>
                </div>
            ) : (
                <>
                    {generated && <button onClick={handleSubmitGroupResults}>Submeter Todos os Resultados</button>}
                    {groupWinners.length > 0 && (
                        <div>
                            <h3>Vencedores da Fase de Grupos</h3>
                            <ul>
                                {groupWinners.map((winner, index) => (
                                    <li key={index}>{winner}</li>
                                ))}
                            </ul>
                            <button onClick={() => setBracket(createBracket(groupWinners))}>
                                Gerar Chaveamento
                            </button>
                        </div>
                    )}
                    {bracket.length > 0 && (
                        <div>
                            <h3>Chaveamento</h3>
                            {bracket[currentRound] && bracket[currentRound].map((match, matchIndex) => (
                                <div key={matchIndex}>
                                    <p>{match[0]} vs {match[1]}</p>
                                    {[0, 1, 2].map((scoreIndex) => (
                                        <div key={scoreIndex}>
                                            <input
                                                type="number"
                                                placeholder={`Ponto ${scoreIndex + 1} de ${match[0]}`}
                                                min="0"
                                                onChange={(e) => handleScoreChange(`bracket-${currentRound}-${matchIndex}`, match[0], scoreIndex, parseInt(e.target.value) || 0)}
                                            />
                                            <input
                                                type="number"
                                                placeholder={`Ponto ${scoreIndex + 1} de ${match[1]}`}
                                                min="0"
                                                onChange={(e) => handleScoreChange(`bracket-${currentRound}-${matchIndex}`, match[1], scoreIndex, parseInt(e.target.value) || 0)}
                                            />
                                        </div>
                                    ))}
                                </div>
                            ))}
                            {bracket[currentRound].length > 0 && (
                                <button onClick={handleSubmitBracketResults}>Submeter Resultados do Chaveamento</button>
                            )}
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default GroupStage;