// src/components/Tournament.js
import React from 'react';
import useTournament from '../hooks/useTournament';
import ParticipantForm from './ParticipantForm';

const Tournament = () => {
    const {
        participants,
        pointsTable,
        addParticipant,
        changeMatchFormat,
        calculatePointsTable,
    } = useTournament();

    const handleMatchResult = (match, score) => {
        // Adiciona o resultado da partida
        addResult(match, score);
        calculatePointsTable();
    };

    return (
        <div>
            <h1>Torneio de Tênis de Mesa</h1>
            <select onChange={(e) => changeMatchFormat(e.target.value)} value={matchFormat}>
                <option value="MD1">Melhor de 1</option>
                <option value="MD3">Melhor de 3</option>
            </select>
            <ParticipantForm
                addParticipant={addParticipant}
                participants={participants}
                // Adicione outras props necessárias
            />
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
                    {pointsTable.map((participant) => (
                        <tr key={participant.name}>
                            <td>{participant.name}</td>
                            <td>{participant.points}</td>
                            <td>{participant.pointsMade}</td>
                            <td>{participant.pointsAgainst}</td>
                            <td>{participant.victories}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Tournament;
