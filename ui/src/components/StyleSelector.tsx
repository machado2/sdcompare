import React from 'react';
import {Style} from "./SimpleTypes";

interface Props {
    styles: Style[];
    selectedStyle: number | null;
    setSelectedStyle: (id: number | null) => void;
}

const StyleSelector: React.FC<Props> = ({
                                            styles, selectedStyle, setSelectedStyle
                                        }) => {
    return (
        <div>
            <h2>Select Style</h2>
            <select onChange={(e) => setSelectedStyle(Number(e.target.value))} value={selectedStyle || ''}>
                <option value=''>Select Checkpoint</option>
                {styles.map(cp => (
                    <option key={cp.id} value={cp.id}>{cp.name}</option>
                ))}
            </select>
        </div>
    );
};

export default StyleSelector;
