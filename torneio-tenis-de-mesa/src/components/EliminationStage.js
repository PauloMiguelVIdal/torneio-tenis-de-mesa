import React, { useState } from 'react';
import useTournament from '../hooks/useTournament';
import ParticipantForm from './ParticipantForm';
import GroupStage from './GroupStage';
import EliminationStage from './EliminationStage';

const Tournament = () => {
  const { 
    participants, 
    groups, 
    elimination, 
    addParticipant, 
    updateParticipant,
    removeParticipant,
    generateGroups, 
    generateElimination, 
    recordGroupResult,  // use this function
  } = useTournament();


  return (
    <div>
      <h1>Torneio Tênis de Mesa</h1>

      <ParticipantForm 
        addParticipant={addParticipant} 
        participants={participants} 
        updateParticipant={updateParticipant}
        removeParticipant={removeParticipant}
      />

      <button onClick={() => generateGroups(numGroups)}>Gerar Grupos</button>
      {groups.length > 0 && <GroupStage groups={groups} recordGroupResult={recordGroupResult} />}
      {groups.length > 0 && (
        <button onClick={generateElimination}>Gerar Fase Eliminatória</button>
      )}
      {elimination.length > 0 && (
        <EliminationStage 
          elimination={elimination} 
          recordMatchResult={recordGroupResult} // Pass the function correctly here
        />
      )}
    </div>
  );
};

export default Tournament;
