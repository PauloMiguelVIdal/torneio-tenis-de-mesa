import React, { useState } from 'react';

const ParticipantForm = ({ addParticipant }) => {
  const [name, setName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    addParticipant(name);
    setName('');
  };

  return (
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
  );
};

export default ParticipantForm;
