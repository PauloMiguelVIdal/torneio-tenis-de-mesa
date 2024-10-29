// src/components/ParticipantForm.js
import React, { useState } from 'react';

const ParticipantForm = ({ addParticipant, participants, updateParticipant, removeParticipant }) => {
    const [newParticipant, setNewParticipant] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        addParticipant(newParticipant);
        setNewParticipant('');
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input 
                    type="text" 
                    placeholder="Nome do participante" 
                    value={newParticipant}
                    onChange={(e) => setNewParticipant(e.target.value)}
                />
                <button type="submit">Adicionar Participante</button>
            </form>

            <ul>
                {participants.map((participant) => (
                    <li key={participant}>
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
                ))}
            </ul>
        </div>
    );
};

export default ParticipantForm;
