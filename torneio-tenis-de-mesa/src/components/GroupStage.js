import React, { useState } from 'react';

const GroupStage = ({ participants, groups, setGroups, recordGroupResults, matchFormat }) => {
    const [scores, setScores] = useState({});
    const [error, setError] = useState(null);
    const [generated, setGenerated] = useState(false);
    const [groupWinners, setGroupWinners] = useState([]); // Armazena os vencedores de cada grupo
    const [bracket, setBracket] = useState([]); // Para armazenar o chaveamento

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

    const handleSubmitAllResults = () => {
        const allResults = [];
        const winners = []; // Para armazenar vencedores de cada grupo
    
        // Processa os resultados de cada grupo
        groups.forEach((group, groupIndex) => {
            const groupResults = {};
    
            generateMatches(group).forEach((match, matchIndex) => {
                const matchKey = `${groupIndex}-${matchIndex}`;
                const matchData = scores[matchKey];
                if (matchData) {
                    const participants = Object.keys(matchData);
                    const [participant1, participant2] = participants;
                    const points1 = matchData[participant1].reduce((sum, score) => sum + score, 0);
                    const points2 = matchData[participant2].reduce((sum, score) => sum + score, 0);
    
                    // Armazena o total de pontos para cada participante no grupo
                    if (!groupResults[participant1]) groupResults[participant1] = 0;
                    if (!groupResults[participant2]) groupResults[participant2] = 0;
    
                    groupResults[participant1] += points1;
                    groupResults[participant2] += points2;
    
                    // Adiciona o resultado da partida ao array allResults para registro detalhado
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
    
            // Determina o(s) vencedor(es) do grupo com base na lógica do tamanho do grupo
            const sortedParticipants = Object.entries(groupResults).sort((a, b) => b[1] - a[1]);
            if (group.length === 2 || group.length === 3) {
                winners.push(sortedParticipants[0][0]); // Apenas o primeiro passa
            } else if (group.length >= 4) {
                winners.push(sortedParticipants[0][0], sortedParticipants[1][0]); // Os dois primeiros passam
            }
        });

        // Garante que o número de vencedores seja par
        if (winners.length % 2 !== 0) {
            // Ordena os participantes de acordo com os pontos totais e encontra o próximo melhor
            const remainingParticipants = Object.entries(scores).flatMap(([_, matchData]) =>
                Object.keys(matchData).map((participant) => ({
                    participant,
                    totalPoints: Object.values(matchData[participant] || []).reduce((sum, score) => sum + score, 0),
                }))
            );
            
            // Ordena para encontrar o próximo melhor
            remainingParticipants.sort((a, b) => b.totalPoints - a.totalPoints);

            const nextBest = remainingParticipants.find(({ participant }) => !winners.includes(participant));
            if (nextBest) winners.push(nextBest.participant);
        }
    
        setGroupWinners(winners); // Atualiza o estado com os vencedores
        const newBracket = createBracket(winners); // Cria o chaveamento
        setBracket(newBracket); // Atualiza o estado com o chaveamento
        recordGroupResults(allResults); // Envia o resultado detalhado
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

    const createBracket = (winners) => {
        let rounds = [];
        while (winners.length > 1) {
            let currentRound = [];
            for (let i = 0; i < winners.length; i += 2) {
                if (i + 1 < winners.length) {
                    currentRound.push([winners[i], winners[i + 1]]);
                } else {
                    // Em caso de número ímpar, o último vencedor avança automaticamente
                    currentRound.push([winners[i], null]);
                }
            }
            rounds.push(currentRound);
            winners = currentRound.map(match => {
                // Simulação para determinar os vencedores das partidas, você deve adaptar isso
                const winner = simulateMatch(match[0], match[1]);
                return winner;
            }).filter(winner => winner !== null); // Remover as entradas nulas
        }
        return rounds;
    };

    const simulateMatch = (participant1, participant2) => {
        if (participant2 === null) {
            return participant1; // Avança automaticamente se não há oponente
        }
        // Simulação simplificada, adapte conforme necessário
        return Math.random() > 0.5 ? participant1 : participant2;
    };

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
                                
                                {matchFormat === 'MD1' ? (
                                    <>
                                        <input
                                            type="number"
                                            placeholder={`Ponto de ${match[0]}`}
                                            min="0"
                                            onChange={(e) => handleScoreChange(`${groupIndex}-${matchIndex}`, match[0], 0, parseInt(e.target.value) || 0)}
                                        />
                                        <input
                                            type="number"
                                            placeholder={`Ponto de ${match[1]}`}
                                            min="0"
                                            onChange={(e) => handleScoreChange(`${groupIndex}-${matchIndex}`, match[1], 0, parseInt(e.target.value) || 0)}
                                        />
                                    </>
                                ) : (
                                    [0, 1, 2].map((scoreIndex) => (
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
                                    ))
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            ))}

            {generated && <button onClick={handleSubmitAllResults}>Submeter Todos os Resultados</button>}

            {groupWinners.length > 0 && (
                <div>
                    <h3>Vencedores da Fase de Grupos</h3>
                    <ul>
                        {groupWinners.map((winner, index) => (
                            <li key={index}>{winner}</li>
                        ))}
                    </ul>
                </div>
            )}

            {bracket.length > 0 && (
                <div>
                    <h3>Chaveamento</h3>
                    {bracket.map((round, roundIndex) => (
                        <div key={roundIndex}>
                            <h4>Rodada {roundIndex + 1}</h4>
                            <ul>
                                {round.map((match, matchIndex) => (
                                    <li key={matchIndex}>
                                        {match[1] ? (
                                            <div>
                                                <p>{match[0]} vs {match[1]}</p>
                                                {matchFormat === 'MD1' ? (
                                                    <>
                                                        <input
                                                            type="number"
                                                            placeholder={`Ponto de ${match[0]}`}
                                                            min="0"
                                                            onChange={(e) => handleScoreChange(`bracket-${roundIndex}-${matchIndex}`, match[0], 0, parseInt(e.target.value) || 0)}
                                                        />
                                                        <input
                                                            type="number"
                                                            placeholder={`Ponto de ${match[1]}`}
                                                            min="0"
                                                            onChange={(e) => handleScoreChange(`bracket-${roundIndex}-${matchIndex}`, match[1], 0, parseInt(e.target.value) || 0)}
                                                        />
                                                    </>
                                                ) : (
                                                    [0, 1, 2].map((scoreIndex) => (
                                                        <div key={scoreIndex}>
                                                            <input
                                                                type="number"
                                                                placeholder={`Ponto ${scoreIndex + 1} de ${match[0]}`}
                                                                min="0"
                                                                onChange={(e) => handleScoreChange(`bracket-${roundIndex}-${matchIndex}`, match[0], scoreIndex, parseInt(e.target.value) || 0)}
                                                            />
                                                            <input
                                                                type="number"
                                                                placeholder={`Ponto ${scoreIndex + 1} de ${match[1]}`}
                                                                min="0"
                                                                onChange={(e) => handleScoreChange(`bracket-${roundIndex}-${matchIndex}`, match[1], scoreIndex, parseInt(e.target.value) || 0)}
                                                            />
                                                        </div>
                                                    ))
                                                )}
                                            </div>
                                        ) : (
                                            <p>{match[0]} avança automaticamente</p>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default GroupStage;
