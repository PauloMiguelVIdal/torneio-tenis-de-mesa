import React, { useState, useEffect } from 'react';
import useTournament from '../hooks/useTournament';
import ParticipantForm from './ParticipantForm';
import GroupStage from './GroupStage';

const Tournament = () => {
    const {
        participants,
        pointsTable,
        addParticipant,
        updateParticipant,
        removeParticipant,
        calculatePointsTable,
        matchFormat,
        changeMatchFormat,
    } = useTournament();

    const [showGroupStage, setShowGroupStage] = useState(false);
    const [groups, setGroups] = useState({});
    const [winnersGroup, setWinnersGroup] = useState([]); // Adicionando estado para os vencedores

    useEffect(() => {
        if (participants.length > 1) {
            setupGroups(participants);
            setShowGroupStage(true); // Mostrar a fase de grupos após a geração dos grupos
        }
    }, [participants]);

    const setupGroups = (participants) => {
        const numParticipants = participants.length;
        let groupCount;
    
        // Definindo o número de grupos com base nas regras especificadas
        if (numParticipants <= 3) {
            groupCount = 1;
        } else if (numParticipants <= 6) {
            groupCount = 2;
        } else if (numParticipants <= 12) {
            groupCount = 3; // Ajustado para incluir 10 participantes com 3 grupos
        } else if (numParticipants <= 20) {
            groupCount = 4;
        } else {
            groupCount = 6;
        }
    
        const groupsObj = {};
    
        // Inicializando os arrays dos grupos (A, B, C, etc.)
        for (let i = 0; i < groupCount; i++) {
            const groupName = `group${String.fromCharCode(65 + i)}`;
            groupsObj[groupName] = [];
        }
    
        // Distribuindo participantes de forma cíclica conforme o índice
        participants.forEach((participant, index) => {
            const groupIndex = index % groupCount;
            const groupName = `group${String.fromCharCode(65 + groupIndex)}`;
            groupsObj[groupName].push(participant.name);
        });
    
        setGroups(groupsObj);
    };
    
    
    
    
    

    const handleRecordGroupResults = (results) => {
        calculatePointsTable(results); // Atualizar a tabela de pontos com os resultados dos grupos
        determineWinners(); // Chama a função para determinar os vencedores após calcular a tabela de pontos
    };

    const determineWinners = () => {
        const winners = [];
    
        Object.keys(groups).forEach((groupKey) => {
            const group = groups[groupKey];
            const groupResults = pointsTable.filter((participant) => group.includes(participant.name));
            const sortedGroupResults = groupResults.sort((a, b) => {
                if (b.points !== a.points) {
                    return b.points - a.points;
                }
                return (b.pointsMade - b.pointsAgainst) - (a.pointsMade - a.pointsAgainst);
            });
    
            if (sortedGroupResults.length === 2 || sortedGroupResults.length === 3) {
                winners.push(sortedGroupResults[0].name);
            } else if (sortedGroupResults.length === 4) {
                winners.push(sortedGroupResults[0].name, sortedGroupResults[1].name);
            }
        });
    
        setWinnersGroup(winners);
    };
    

    const handleFormatChange = (e) => {
        changeMatchFormat(e.target.value);
    };

    // Ordenar a tabela de pontos por pontos e depois pelo saldo de pontos
    const sortedPointsTable = [...pointsTable].sort((a, b) => {
        // Primeiro critério: pontos
        if (b.points !== a.points) {
            return b.points - a.points;
        }
        // Segundo critério: saldo de pontos
        const goalDifferenceA = a.pointsMade - a.pointsAgainst;
        const goalDifferenceB = b.pointsMade - b.pointsAgainst;
        return goalDifferenceB - goalDifferenceA;
    });

    return (
        <div>
            <h1>Torneio</h1>
            <label>
                Formato da Partida:
                <select value={matchFormat} onChange={handleFormatChange}>
                    <option value="MD1">MD1</option>
                    <option value="MD3">MD3</option>
                </select>
            </label>

            <ParticipantForm
                addParticipant={addParticipant}
                participants={participants}
                updateParticipant={updateParticipant}
                removeParticipant={removeParticipant}
            />

            {showGroupStage && (
                <GroupStage
                    participants={participants}
                    groups={groups} // Passa os grupos gerados
                    setGroups={setGroups} // Passa setGroups para o GroupStage
                    recordGroupResults={handleRecordGroupResults}
                    matchFormat={matchFormat}
                />
            )}

            {sortedPointsTable.length > 0 && (
                <div>
                    <h2>Tabela de Pontos</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>Participante</th>
                                <th>Pontos</th>
                                <th>Pontos Feitos</th>
                                <th>Pontos Sofridos</th>
                                <th>Saldo de Pontos</th> {/* Adicionado para o saldo de pontos */}
                                <th>Vitórias</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedPointsTable.map((row) => (
                                <tr key={row.name}>
                                    <td>{row.name}</td>
                                    <td>{row.points}</td>
                                    <td>{row.pointsMade}</td>
                                    <td>{row.pointsAgainst}</td>
                                    <td>{row.pointsMade - row.pointsAgainst}</td> {/* Exibe o saldo de pontos */}
                                    <td>{row.victories}</td> {/* Caso não haja dados de vitórias, exibe 0 */}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {winnersGroup.length > 0 && ( // Exibe os vencedores da fase de grupos
                <div>
                    <h2>Vencedores da Fase de Grupos</h2>
                    <ul>
                        {winnersGroup.map((winner, index) => (
                            <li key={index}>{winner}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default Tournament;
