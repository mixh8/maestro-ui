import { useState } from 'react';

interface PlaylistCheckboxesProps {
    playlists: string[];
    onSelectionChange: (selected: string[]) => void;
}

export default function PlaylistCheckboxes({ playlists, onSelectionChange }: PlaylistCheckboxesProps) {
    // State to manage selected checkboxes
    const [selectedPlaylists, setSelectedPlaylists] = useState<string[]>([]);

    // Handle checkbox toggle
    const handleCheckboxChange = (playlist: string) => {
        setSelectedPlaylists((prevSelected) => {
            let updatedSelected;
            if (prevSelected.includes(playlist)) {
                // Remove playlist if it's already selected
                updatedSelected = prevSelected.filter(p => p !== playlist);
            } else {
                // Add playlist if it's not selected
                updatedSelected = [...prevSelected, playlist];
            }

            // Notify the parent of the selection change
            onSelectionChange(updatedSelected);
            return updatedSelected;
        });
    };

    return (
        <div>
            {playlists.map(playlist => (
                <div key={playlist} className="flex items-center">
                    <input 
                        type="checkbox" 
                        id={`checkbox-${playlist}`}
                        checked={selectedPlaylists.includes(playlist)}
                        onChange={() => handleCheckboxChange(playlist)}
                        className="mr-2"
                    />
                    <label htmlFor={`checkbox-${playlist}`}>{playlist}</label>
                </div>
            ))}
        </div>
    );
}
