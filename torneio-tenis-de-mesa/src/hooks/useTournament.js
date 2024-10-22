import { useState } from 'react';

const useTournament = () => {
  const [participants, setParticipants] = useState([]);
  const [groups, setGroups] = useState([]);
  const [elimination, setElimination] = useState([]);
  const [groupResults, setGroupResults] = useState({});

  const addParticipant = (name) => {
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

  const generateGroups = (numGroups, matchFormat) => {
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
      alert("Você precisa de pelo menos dois participantes para gerar a fase eliminatória.");
      return;
    }

    const matches = [];
    for (let i = 0; i < qualifiedParticipants.length; i += 2) {
      if (qualifiedParticipants[i + 1]) {
        matches.push([qualifiedParticipants[i], qualifiedParticipants[i + 1]]);
      }
    }
    setElimination(matches);
  };

  const recordGroupResult = (groupIndex, matchIndex, participant1, participant2, winner) => {
    const newGroupResults = { ...groupResults };
    if (!newGroupResults[groupIndex]) {
      newGroupResults[groupIndex] = [];
    }

    newGroupResults[groupIndex].push(winner);
    setGroupResults(newGroupResults);
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
  };
};

export default useTournament;
