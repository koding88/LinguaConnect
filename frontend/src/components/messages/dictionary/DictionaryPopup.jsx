import React, { useState, useEffect, useRef } from 'react'
import { IoVolumeHighOutline } from 'react-icons/io5'

const DictionaryPopup = ({ word, position, onClose }) => {
    const [definition, setDefinition] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [audio, setAudio] = useState(null);
    const popupRef = useRef(null);

    useEffect(() => {
        const fetchDefinition = async () => {
            try {
                const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch definition');
                }
                const data = await response.json();
                setDefinition(data[0]);
                setAudio(data[0].phonetics.find(p => p.audio)?.audio || null);
            } catch (err) {
                setError('No definition found');
            } finally {
                setLoading(false);
            }
        };

        fetchDefinition();

        const handleClickOutside = (event) => {
            if (popupRef.current && !popupRef.current.contains(event.target)) {
                onClose();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [word, onClose]);

    const playAudio = () => {
        if (audio) {
            new Audio(audio).play();
        }
    };

    const popupStyle = {
        position: 'absolute',
        top: position.y,
        left: position.x,
        backgroundColor: 'white',
        border: '1px solid #e0e0e0',
        borderRadius: '8px',
        padding: '16px',
        zIndex: 1000,
        width: '300px',
        maxHeight: '400px',
        overflow: 'auto',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    };

    const closeButtonStyle = {
        float: 'right',
        background: 'none',
        border: 'none',
        fontSize: '18px',
        cursor: 'pointer',
    };

    const audioButtonStyle = {
        background: 'none',
        border: 'none',
        cursor: 'pointer',
    };

    return (
        <div ref={popupRef} style={popupStyle}>
            <button onClick={onClose} style={closeButtonStyle}>×</button>
            {loading && <p>Loading...</p>}
            {error && <p>{error}</p>}
            {definition && (
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginRight: '8px' }}>{word}</h2>
                        {audio && (
                            <button onClick={playAudio} style={audioButtonStyle}>
                                <IoVolumeHighOutline size={24} />
                            </button>
                        )}
                    </div>
                    {definition.phonetic && <p style={{ color: '#666', marginBottom: '8px' }}>{definition.phonetic}</p>}
                    {definition.origin && (
                        <p style={{ fontSize: '14px', color: '#666', marginBottom: '16px' }}>
                            <strong>Origin:</strong> {definition.origin}
                        </p>
                    )}
                    {definition.meanings && definition.meanings.map((meaning, index) => (
                        <div key={index} style={{ marginBottom: '16px' }}>
                            <p style={{ fontWeight: 'bold', color: '#333', marginBottom: '8px' }}>{meaning.partOfSpeech}</p>
                            <ol style={{ paddingLeft: '20px' }}>
                                {meaning.definitions.map((def, idx) => (
                                    <li key={idx} style={{ marginBottom: '8px' }}>
                                        <p style={{ marginBottom: '4px' }}>{def.definition}</p>
                                        {def.example && <p style={{ fontStyle: 'italic', color: '#666' }}>&ldquo;{def.example}&rdquo;</p>}
                                    </li>
                                ))}
                            </ol>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default DictionaryPopup
