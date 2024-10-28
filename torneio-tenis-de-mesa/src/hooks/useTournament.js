import { useState } from 'react';

const useTournament = () => {
  const [participants, setParticipants] = useState([]);
  const [groups, setGroups] = useState([]);
  const [elimination, setElimination] = useState([]);
  const [groupResults, setGroupResults] = useState({});
  const [participantPoints, setParticipantPoints] = useState({});

  const addParticipant = (name) => {
    if (participants.includes(name)) {
      alert('Este participante já foi adicionado.');
      return;
    }
    setParticipants([...participants, name]);
  };

  const updateParticipant = (oldName, newName) => {
    const updatedParticipants = participants.map(participant => 
      participant === oldName ? newName : participant
    );
    setParticipants(updatedParticipants);
  };

  const removeParticipant = (name) => {
    setParticipants(participants.filter(participant => participant !== name));
  };

  const generateGroups = (numGroups) => {
    const shuffled = [...participants].sort(() => 0.5 - Math.random());
    const newGroups = [];
    const groupSize = Math.ceil(shuffled.length / numGroups);

    for (let i = 0; i < numGroups; i++) {
      newGroups.push(shuffled.slice(i * groupSize, (i + 1) * groupSize));
    }
    setGroups(newGroups);
  };

  const generateElimination = () => {
    const qualifiedParticipants = Object.values(groupResults).flat();
    if (qualifiedParticipants.length < 2) {
      throw new Error("Você precisa de pelo menos dois participantes para gerar a fase eliminatória.");
    }

    const matches = [];
    for (let i = 0; i < qualifiedParticipants.length; i += 2) {
      if (qualifiedParticipants[i + 1]) {
        matches.push([qualifiedParticipants[i], qualifiedParticipants[i + 1]]);
      }
    }
    setElimination(matches);
  };

  const recordGroupResult = (groupIndex, matchIndex, participant1, participant2, winner, points1, points2) => {
    const newGroupResults = { ...groupResults };
    const newParticipantPoints = { ...participantPoints };

    if (!newGroupResults[groupIndex]) {
      newGroupResults[groupIndex] = [];
    }

    // Atualiza o vencedor
    newGroupResults[groupIndex].push(winner);

    // Inicializa os pontos feitos/sofridos se não existirem
    if (!newParticipantPoints[participant1]) newParticipantPoints[participant1] = { feitos: 0, sofridos: 0 };
    if (!newParticipantPoints[participant2]) newParticipantPoints[participant2] = { feitos: 0, sofridos: 0 };

    // Atualiza pontos feitos e sofridos
    newParticipantPoints[participant1].feitos += points1;
    newParticipantPoints[participant1].sofridos += points2;
    newParticipantPoints[participant2].feitos += points2;
    newParticipantPoints[participant2].sofridos += points1;

    setGroupResults(newGroupResults);
    setParticipantPoints(newParticipantPoints);
  };

  const resetTournament = () => {
    setParticipants([]);
    setGroups([]);
    setElimination([]);
    setGroupResults({});
    setParticipantPoints({});
  };

  return {
    participants,
    groups,
    elimination,
    addParticipant,
    updateParticipant,
    removeParticipant,
    generateGroups,
    generateElimination,
    recordGroupResult,
    resetTournament,
    participantPoints, // Adicione aqui para acessar no GroupStage
  };
};

export default useTournament;
