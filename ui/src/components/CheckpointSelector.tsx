import React from 'react';

interface Checkpoint {
    id: number;
    name: string;
    worker_count: number;
}

interface Props {
    checkpoints: Checkpoint[];
    selectedCheckpoint: number | null;
    setSelectedCheckpoint: (id: number | null) => void;
}

const CheckpointSelector: React.FC<Props> = ({
                                                 checkpoints, selectedCheckpoint, setSelectedCheckpoint
                                             }) => {
    return (
        <div>
            <h2>Select Checkpoint</h2>
            <select onChange={(e) => setSelectedCheckpoint(Number(e.target.value))} value={selectedCheckpoint || ''}>
                <option value=''>Select Checkpoint</option>
                {checkpoints.map(cp => (
                    <option key={cp.id} value={cp.id}>{cp.name}</option>
                ))}
            </select>
        </div>
    );
};

export default CheckpointSelector;
