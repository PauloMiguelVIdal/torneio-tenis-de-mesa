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
            <form className='mb-[10px] mt-[10px]' onSubmit={handleSubmit} >
                <input className='border-[#6411D9] border-2  rounded-l-lg mt-[4px] p-[3px]  text-center focus:outline-none ' 
                    type="text" 
                    placeholder="Nome do participante" 
                    value={newParticipant}
                    onChange={(e) => setNewParticipant(e.target.value)}
                />
                <button className='bg-[#F28705] p-[5px] rounded-r-lg text-white ' type="submit">Adicionar Participante</button>
            </form>

            <ul>
                {participants.map((participant) => (
                    <li className='text-[22px] text-[#350973]' key={participant}>
                        {participant}
                        <button onClick={() => {
                            const newName = prompt("Digite o novo nome do participante:", participant);
                            if (newName) updateParticipant(participant, newName);
                        }}>
                            <img src='../icon/editar.png' className="w-[20px] h-[20px] ml-[20px] mr-[20px] rounded-[5px] p-[4px] bg-[#F28705]"/>
                        </button>
                        <button onClick={() => removeParticipant(participant)}>
                            <img src='../icon/excluir.png' className="w-[20px] h-[20px]  mr-[0px] rounded-[5px] p-[4px] bg-[#F28705]"/>
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ParticipantForm;
