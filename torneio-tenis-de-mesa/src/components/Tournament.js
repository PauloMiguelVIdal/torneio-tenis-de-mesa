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
    const [groups, setGroups] = useState([]);

    useEffect(() => {
        if (participants.length > 1) {
        setupGroups(participants);
        setShowGroupStage(true); // Mostrar a fase de grupos após a geração dos grupos
        }
        }, [participants]);
        
const setupGroups = (participants) => {
    const numParticipants = participants.length;
    let groupCount;

    // Definir o número de grupos
    if (numParticipants === 10) {
        groupCount = 2; // Força 2 grupos para 10 participantes
    } else if (numParticipants <= 5) {
        groupCount = 1;
    } else if (numParticipants <= 16) {
        groupCount = Math.ceil(numParticipants / 4);
    } else {
        groupCount = Math.ceil(numParticipants / 5);
    }

    // Cria o array de grupos com o número determinado
    const groupsArray = Array.from({ length: groupCount }, () => []);

    // Distribui os participantes entre os grupos
    participants.forEach((participant, index) => {
        groupsArray[index % groupCount].push(participant);
    });

    setGroups(groupsArray);
};

    
    

    const handleRecordGroupResults = (results) => {
        calculatePointsTable(results); // Atualizar a tabela de pontos com os resultados dos grupos
    };

    const handleFormatChange = (e) => {
        changeMatchFormat(e.target.value);
    };

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

            {pointsTable.length > 0 && (
                <div>
                    <h2>Tabela de Pontos</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>Participante</th>
                                <th>Pontos</th>
                                <th>Pontos Feitos</th>
                                <th>Pontos Sofridos</th>
                                <th>Vitórias</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pointsTable.map((row) => (
                                <tr key={row.name}>
                                    <td>{row.name}</td>
                                    <td>{row.points}</td>
                                    <td>{row.pointsMade}</td>
                                    <td>{row.pointsAgainst}</td>
                                    <td>{row.victories}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default Tournament;
