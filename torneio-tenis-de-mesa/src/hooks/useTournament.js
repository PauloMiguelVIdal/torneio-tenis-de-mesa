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

    const calculatePointsTable = () => {
        const table = participants.map((participant) => ({
            name: participant,
            points: 0,
            pointsMade: 0,
            pointsAgainst: 0,
            victories: 0,
        }));

        for (const match in results) {
            const [player1, player2] = match.split('-');
            const scores = results[match].split(':').map(Number);
            const player1Stats = table.find((p) => p.name === player1);
            const player2Stats = table.find((p) => p.name === player2);

            if (matchFormat === 'MD3') {
                // Lógica para MD3
                const score1 = scores.reduce((acc, curr) => acc + (curr > scores[1] ? 1 : 0), 0);
                const score2 = 3 - score1; // Total de sets é 3

                player1Stats.pointsMade += score1;
                player2Stats.pointsMade += score2;

                if (score1 === 2) {
                    player1Stats.points += 3; // Vitória
                    player1Stats.victories += 1;
                } else if (score2 === 2) {
                    player2Stats.points += 3; // Vitória
                    player2Stats.victories += 1;
                } else {
                    player1Stats.points += 1; // Empate
                    player2Stats.points += 1; // Empate
                }
            } else {
                // Lógica para MD1
                const [score1, score2] = scores;

                player1Stats.pointsMade += score1;
                player2Stats.pointsMade += score2;

                if (score1 > score2) {
                    player1Stats.points += 3; // Vitória
                    player1Stats.victories += 1;
                } else if (score2 > score1) {
                    player2Stats.points += 3; // Vitória
                    player2Stats.victories += 1;
                } else {
                    player1Stats.points += 1; // Empate
                    player2Stats.points += 1; // Empate
                }
            }
        }

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
