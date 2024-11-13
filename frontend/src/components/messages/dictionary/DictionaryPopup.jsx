import React, { useState, useEffect, useRef } from 'react'
import { IoVolumeHighOutline } from 'react-icons/io5'
import { FiBook } from 'react-icons/fi'
import { BsTranslate } from 'react-icons/bs'
import { LuGraduationCap } from 'react-icons/lu'

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
            } catch (_error) {
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
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [word, onClose]);

    const playAudio = () => {
        if (audio) {
            new Audio(audio).play();
        }
    };

    return (
        <div
            ref={popupRef}
            style={{
                top: position.y,
                left: position.x,
            }}
            className="fixed bg-white rounded-xl shadow-xl border border-gray-100 w-[350px] max-h-[500px] overflow-auto z-50"
        >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 sticky top-0 border-b border-gray-100">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <FiBook className="w-5 h-5 text-blue-600" />
                        <h2 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                            Dictionary
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        ×
                    </button>
                </div>
            </div>

            <div className="p-4">
                {loading && (
                    <div className="flex flex-col items-center justify-center py-8 space-y-2">
                        <div className="w-8 h-8 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                        <p className="text-gray-500">Looking up definition...</p>
                    </div>
                )}

                {error && (
                    <div className="flex flex-col items-center justify-center py-8 space-y-2">
                        <BsTranslate className="w-8 h-8 text-gray-400" />
                        <p className="text-gray-500">{error}</p>
                    </div>
                )}

                {definition && (
                    <div className="space-y-4">
                        {/* Word and Pronunciation */}
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-2xl font-bold text-gray-800">{word}</h3>
                                {definition.phonetic && (
                                    <p className="text-gray-500">{definition.phonetic}</p>
                                )}
                            </div>
                            {audio && (
                                <button
                                    onClick={playAudio}
                                    className="p-2 bg-blue-50 hover:bg-blue-100 rounded-full transition-colors"
                                >
                                    <IoVolumeHighOutline className="w-6 h-6 text-blue-600" />
                                </button>
                            )}
                        </div>

                        {/* Origin */}
                        {definition.origin && (
                            <div className="bg-gray-50 p-3 rounded-lg">
                                <p className="text-sm text-gray-600">
                                    <span className="font-semibold">Origin: </span>
                                    {definition.origin}
                                </p>
                            </div>
                        )}

                        {/* Meanings */}
                        <div className="space-y-4">
                            {definition.meanings?.map((meaning, index) => (
                                <div key={index} className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <LuGraduationCap className="w-5 h-5 text-purple-600" />
                                        <h4 className="font-semibold text-purple-600">
                                            {meaning.partOfSpeech}
                                        </h4>
                                    </div>
                                    <ol className="list-decimal list-inside space-y-2 ml-2">
                                        {meaning.definitions.map((def, idx) => (
                                            <li key={idx} className="text-gray-700">
                                                <span>{def.definition}</span>
                                                {def.example && (
                                                    <p className="ml-6 mt-1 text-sm text-gray-500 italic">
                                                        "{def.example}"
                                                    </p>
                                                )}
                                            </li>
                                        ))}
                                    </ol>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default DictionaryPopup
