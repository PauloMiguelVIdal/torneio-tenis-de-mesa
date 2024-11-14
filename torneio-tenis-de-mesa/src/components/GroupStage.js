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
        }).filter(Boolean) // Filtra os matches válidos

    // Verifica se há uma nova rodada
    if (updatedBracket.length > 1) {
        setBracket(prevBracket => {
            const nextRound = createNextRound(updatedBracket);
            return [...prevBracket, nextRound];
        });
        setCurrentRound(currentRound + 1);
        setScores({}); // Zera os scores para limpar os inputs
    } else {
        console.log("Vencedor final:", updatedBracket[0]);
        setFinalWinner(updatedBracket[0]); // Define o vencedor final
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
        const numGroups = 4; // Número de grupos desejado
        const baseGroupSize = Math.floor(shuffledParticipants.length / numGroups); // Tamanho base do grupo
        const remainder = shuffledParticipants.length % numGroups; // Participantes "extras"
    
        const newGroups = [];
        let startIndex = 0;
    
        for (let i = 0; i < numGroups; i++) {
            // Adiciona um participante extra nos primeiros grupos, se houver "remainder"
            const currentGroupSize = baseGroupSize + (i < remainder ? 1 : 0);
            newGroups.push(shuffledParticipants.slice(startIndex, startIndex + currentGroupSize));
            startIndex += currentGroupSize;
        }
    
        setScores({});
        setGenerated(true);
        setGroups(newGroups);
    };
    
    return (
        <div>
            <h2 className='text-[30px] text-[#350973] font-bold text-center '>Fase de Grupos</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}

            <button  className='border-[#6411D9] border-2  rounded-[20px] mb-[10px] pl-[10px] pr-[10px] pb-[2px] text-center bg-[#350973] text-white text-[20px]' onClick={handleGenerateGroups}>Gerar Fase de Grupos</button>

            {generated && groups.map((group, groupIndex) => (
                <div key={groupIndex} className="group-container text-center">
                    <h3 className='font-bold mt-[30px] mb-[30px]' >Grupo {groupIndex + 1}</h3>
                    <ul>
                        {generateMatches(group).map((match, matchIndex) => (
                            <li key={matchIndex}>
                                <p className='text-[#350973] mt-[10px] mb-[10px]'>{match[0]} vs {match[1]}</p>
                                {[0, 1, 2].map((scoreIndex) => (
                                    <div key={scoreIndex}>
                                        <input className='border-[#6411D9] border-2  rounded-l-lg mt-[4px] p-[3px]  text-center focus:outline-none ' 
                                            type="number"
                                            placeholder={`Ponto ${scoreIndex + 1} de ${match[0]}`}
                                            min="0"
                                            onChange={(e) => handleScoreChange(`${groupIndex}-${matchIndex}`, match[0], scoreIndex, parseInt(e.target.value) || 0)}
                                        />
                                        <input className='border-[#6411D9] border-2  rounded-r-lg mt-[4px] p-[3px]  text-center focus:outline-none ' 
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
                <div className='text-center'>
                    <h3 className='font-bold pt-[20px] pb-[20px] text-[40px]'>Vencedor Final</h3>
                    <p className='font-bold pt-[20px] pb-[60px] text-[80px] text-[#ffd700]'>{finalWinner}</p>
                </div>
            ) : (
                <>
                    {generated && <button onClick={handleSubmitGroupResults} className='mt-[30px] border-[#6411D9] border-2  rounded-[20px] mb-[10px] pl-[10px] pr-[10px] pb-[2px] text-center bg-[#350973] text-white text-[20px] '>Submeter Todos os Resultados</button>}
                    {groupWinners.length > 0 && (
                        <div>
                            <h3 className='font-bold text-[40px]'>Vencedores da Fase de Grupos</h3>
                            <ul className='text-[#6411D9] text-[30px]'>
                                {groupWinners.map((winner, index) => (
                                    <li key={index}>{winner}</li>
                                ))}
                            </ul>
                            <button className='mt-[30px] border-[#6411D9]  border-2  rounded-[20px] mb-[10px] pl-[10px] pr-[10px] pb-[2px] text-center bg-[#350973] text-[#daa520]  text-[20px] ' onClick={() => setBracket(createBracket(groupWinners))}>
                                Gerar Chaveamento
                            </button>
                        </div>
                    )}
                    {bracket.length > 0 && (
                        <div>
                            <h3 className='font-bold text-[40px] text-center'>Chaveamento</h3>
                            {bracket[currentRound] && bracket[currentRound].map((match, matchIndex) => (
                                <div className='text-center' key={matchIndex}>
                                    <p className='text-[#6411D9]'>{match[0]} vs {match[1]}</p>
                                    {[0, 1, 2].map((scoreIndex) => (
                                        <div key={scoreIndex}>
                                            <input
                                             className='border-[#6411D9] border-2  rounded-l-lg mt-[4px] p-[3px]  text-center focus:outline-none '
                                                type="number"
                                                placeholder={`Ponto ${scoreIndex + 1} de ${match[0]}`}
                                                min="0"
                                                onChange={(e) => handleScoreChange(`bracket-${currentRound}-${matchIndex}`, match[0], scoreIndex, parseInt(e.target.value) || 0)}
                                            />
                                            <input
                                            className='border-[#6411D9] border-2  rounded-r-lg mt-[4px] p-[3px]  text-center focus:outline-none '
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
                                <button onClick={handleSubmitBracketResults} className='mt-[30px] border-[#6411D9] border-2  rounded-[20px] mb-[10px] pl-[10px] pr-[10px] pb-[2px] text-center bg-[#350973] text-white text-[20px] '>Submeter Resultados do Chaveamento</button>
                            )}
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default GroupStage;