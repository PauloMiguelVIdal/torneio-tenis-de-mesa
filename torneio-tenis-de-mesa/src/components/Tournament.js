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
    const [winnersGroup, setWinnersGroup] = useState([]);
    const [bracket, setBracket] = useState([]);
    const [finalMatch, setFinalMatch] = useState(null);

    useEffect(() => {
        if (participants.length > 1) {
            setupGroups(participants);
            setShowGroupStage(true);
        }
    }, [participants]);

    const setupGroups = (participants) => {
        const numParticipants = participants.length;
        let groupCount;

        if (numParticipants <= 3) groupCount = 1;
        else if (numParticipants <= 6) groupCount = 2;
        else if (numParticipants <= 12) groupCount = 3;
        else if (numParticipants <= 20) groupCount = 4;
        else groupCount = 6;

        const groupsObj = {};

        for (let i = 0; i < groupCount; i++) {
            const groupName = `group${String.fromCharCode(65 + i)}`;
            groupsObj[groupName] = [];
        }

        participants.forEach((participant, index) => {
            const groupIndex = index % groupCount;
            const groupName = `group${String.fromCharCode(65 + groupIndex)}`;
            groupsObj[groupName].push(participant.name);
        });

        setGroups(groupsObj);
    };

    const handleRecordGroupResults = (results) => {
        calculatePointsTable(results);
        determineWinners();
    };

    const determineWinners = () => {
        const winners = [];

        Object.keys(groups).forEach((groupKey) => {
            const group = groups[groupKey];
            const groupResults = pointsTable.filter((participant) => group.includes(participant.name));
            const sortedGroupResults = groupResults.sort((a, b) => {
                if (b.points !== a.points) return b.points - a.points;
                return (b.pointsMade - b.pointsAgainst) - (a.pointsMade - a.pointsAgainst);
            });

            if (sortedGroupResults.length >= 2) {
                winners.push(sortedGroupResults[0].name, sortedGroupResults[1].name);
            }
        });

        setWinnersGroup(winners);
        generateBracket(winners);
    };

    const generateBracket = (winners) => {
        const bracketRounds = [];
        for (let i = 0; i < winners.length; i += 2) {
            bracketRounds.push([winners[i], winners[i + 1]]);
        }
        setBracket([bracketRounds]);
    };

    const handleSubmitBracketResults = (roundIndex, results) => {
        const nextRound = results.map((result) => {
            const [participant1, participant2, scores1, scores2] = result;
            const winner = scores1.reduce((a, b) => a + b, 0) > scores2.reduce((a, b) => a + b, 0) ? participant1 : participant2;
            return winner;
        });

        if (nextRound.length === 1) {
            setFinalMatch(nextRound[0]);
        } else {
            setBracket((prev) => [...prev, nextRound]);
        }
    };

    return (
        <div >
            <h1  className="text-3xl font-bold underline">Torneio Tênis de Mesa</h1>
            {/* <label>
                Formato da Partida:
                <select value={matchFormat} onChange={(e) => changeMatchFormat(e.target.value)}>
                    <option value="MD1">MD1</option>
                    <option value="MD3">MD3</option>
                </select>
            </label> */}

            <ParticipantForm 
                addParticipant={addParticipant}
                participants={participants}
                updateParticipant={updateParticipant}
                removeParticipant={removeParticipant}
            />

            {showGroupStage && (
                <GroupStage
                    participants={participants}
                    groups={groups}
                    setGroups={setGroups}
                    recordGroupResults={handleRecordGroupResults}
                    matchFormat={matchFormat}
                />
            )}

            {winnersGroup.length > 0 && (
                <div>
                    <h2>Chaveamento - Mata-mata</h2>
                    {bracket.map((round, index) => (
                        <div key={index}>
                            <h3>Rodada {index + 1}</h3>
                            {round.map((match, i) => (
                                <div key={i}>
                                    <p>{match[0]} vs {match[1]}</p>
                                    {/* Adicione aqui os inputs para registrar os resultados da partida */}
                                </div>
                            ))}
                        </div>
                    ))}
                    {finalMatch && <h2>Vencedor: {finalMatch}</h2>}
                </div>
            )}
        </div>
    );
};

export default Tournament;
