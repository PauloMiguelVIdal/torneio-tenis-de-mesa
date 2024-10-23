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
    recordGroupResultsAutomatically,
  } = useTournament();

  const [numGroups, setNumGroups] = useState(2);
  const [matchFormat, setMatchFormat] = useState('MD1'); // Estado para formato do jogo

  const handleGenerateGroups = () => {
    generateGroups(numGroups, matchFormat); // Passa o formato do jogo
  };

  const handleGenerateElimination = () => {
    recordGroupResultsAutomatically(); // Registrar os resultados automaticamente
    generateElimination(); // Gerar a fase de eliminação somente após registrar os resultados
  };

  return (
    <div>
      <h1>Torneio Tênis de Mesa</h1>

      <ParticipantForm 
        addParticipant={addParticipant} 
        participants={participants} 
        updateParticipant={updateParticipant}
        removeParticipant={removeParticipant}
      />

      {/* Seleção do formato do jogo */}
      <div>
        <label>
          Formato do Jogo:
          <select value={matchFormat} onChange={(e) => setMatchFormat(e.target.value)}>
            <option value="MD1">Melhor de 1 (MD1)</option>
            <option value="MD3">Melhor de 3 (MD3)</option>
          </select>
        </label>
      </div>

      <button onClick={handleGenerateGroups}>Gerar Grupos</button>
      {groups.length > 0 && (
        <>
          <GroupStage groups={groups} matchFormat={matchFormat} />
          <button onClick={handleGenerateElimination}>Gerar Fase Eliminatória</button>
        </>
      )}

      {elimination.length > 0 && (
        <EliminationStage 
          elimination={elimination} 
          recordMatchResult={recordGroupResultsAutomatically} // Função para registrar automaticamente
        />
      )}
    </div>
  );
};

export default Tournament;
