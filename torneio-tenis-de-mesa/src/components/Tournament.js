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
    recordGroupResult,
    resetTournament,
  } = useTournament();

  const [numGroups, setNumGroups] = useState(2);
  const [matchFormat, setMatchFormat] = useState('MD1');
  const [errorMessage, setErrorMessage] = useState('');

  const handleGenerateGroups = () => {
    if (participants.length < numGroups) {
      setErrorMessage('Número de participantes insuficiente para gerar grupos.');
      return;
    }
    setErrorMessage('');
    generateGroups(numGroups, matchFormat);
  };

  const handleGenerateElimination = () => {
    try {
      generateElimination();
      setErrorMessage('');
    } catch (error) {
      setErrorMessage(error.message);
    }
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

      <button onClick={handleGenerateGroups} disabled={participants.length < numGroups}>
        Gerar Grupos
      </button>
      
      {groups.length > 0 && <GroupStage groups={groups} recordGroupResult={recordGroupResult} matchFormat={matchFormat} />}

      {groups.length > 0 && (
        <button onClick={handleGenerateElimination} disabled={groups.length === 0}>
          Gerar Fase Eliminatória
        </button>
      )}

      {elimination.length > 0 && (
        <EliminationStage 
          elimination={elimination} 
          recordMatchResult={recordGroupResult} 
        />
      )}

      <button onClick={resetTournament}>Reiniciar Torneio</button>

      {/* Mensagem de erro */}
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
    </div>
  );
};

export default Tournament;
