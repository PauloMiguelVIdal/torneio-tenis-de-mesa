import React, { useState } from 'react';

const ParticipantForm = ({ addParticipant, participants, updateParticipant, removeParticipant }) => {
  const [name, setName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim() === '') {
      alert('Por favor, insira um nome válido.');
      return;
    }
    addParticipant(name);
    setName(''); // Limpa o campo de input após adicionar
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nome do Participante"
          required
        />
        <button type="submit">Adicionar Participante</button>
      </form>

      <h2>Participantes Inscritos</h2>
      <ul>
        {Array.isArray(participants) && participants.length > 0 ? (
          participants.map((participant, index) => (
            <li key={index}>
              {participant}
              <button onClick={() => {
                const newName = prompt("Digite o novo nome do participante:", participant);
                if (newName) updateParticipant(participant, newName);
              }}>
                Alterar
              </button>
              <button onClick={() => removeParticipant(participant)}>
                Excluir
              </button>
            </li>
          ))
        ) : (
          <p>Nenhum participante inscrito ainda.</p>
        )}
      </ul>
    </div>
  );
};

export default ParticipantForm;
