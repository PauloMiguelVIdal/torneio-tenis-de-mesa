// src/hooks/useTournament.js
import { useState } from 'react';

const useTournament = () => {
    const [participants, setParticipants] = useState([]);
    const [results, setResults] = useState({});
    const [pointsTable, setPointsTable] = useState([]);
    const [matchFormat, setMatchFormat] = useState('MD1'); // Estado para o formato da partida

    const addParticipant = (name) => {
        if (!participants.includes(name)) {
            setParticipants((prev) => [...prev, name]);
        }
    };

    const updateParticipant = (oldName, newName) => {
        setParticipants((prev) =>
            prev.map((participant) => (participant === oldName ? newName : participant))
        );
    };

    const removeParticipant = (name) => {
        setParticipants((prev) => prev.filter((participant) => participant !== name));
    };

    const addResult = (match, score) => {
        setResults((prev) => ({
            ...prev,
            [match]: score,
        }));
    };

    const calculatePointsTable = (results) => {
        const table = participants.map((participant) => ({
            name: participant,
            points: 0,
            pointsMade: 0,
            pointsAgainst: 0,
            victories: 0,
            goalDifference: 0, // Saldo de pontos inicializado
        }));

        results.forEach((result) => {
            const { participant1, participant2, points1, points2 } = result;

            const player1Stats = table.find((p) => p.name === participant1);
            const player2Stats = table.find((p) => p.name === participant2);

            // Atualiza pontos feitos e sofridos
            player1Stats.pointsMade += points1;
            player1Stats.pointsAgainst += points2;
            player2Stats.pointsMade += points2;
            player2Stats.pointsAgainst += points1;

            // Calcula vitórias, derrotas e empates
            if (points1 > points2) {
                player1Stats.points += 3;
                player1Stats.victories += 1;
            } else if (points2 > points1) {
                player2Stats.points += 3;
                player2Stats.victories += 1;
            } else {
                player1Stats.points += 1;
                player2Stats.points += 1;
            }
        });

        // Calcular saldo de pontos para cada jogador
        table.forEach((player) => {
            player.goalDifference = player.pointsMade - player.pointsAgainst; // Saldo de pontos
        });

        setPointsTable(table);
    };

    const changeMatchFormat = (format) => {
        setMatchFormat(format);
    };

    return {
        participants,
        results,
        pointsTable,
        matchFormat, // Expondo o formato da partida
        addParticipant,
        updateParticipant,
        removeParticipant,
        addResult,
        calculatePointsTable,
        changeMatchFormat, // Função para alterar o formato da partida
    };
};

export default useTournament;
