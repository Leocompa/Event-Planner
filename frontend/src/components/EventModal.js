import React, { useState, useEffect } from 'react';

const EventModal = ({ isOpen, onClose, eventData, onAddEvent, onEditEvent, onDeleteEvent }) => {
    const [mode, setMode] = useState('view'); // 'view' per visualizzare il riepilogo, 'edit' per la modifica
    const [title, setTitle] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    // Selezione dell'evento: imposta i valori se l'evento è passato
    useEffect(() => {
        if (eventData) {
            setMode('view');
            setTitle(eventData.title);
            setStartDate(eventData.start ? new Date(eventData.start).toISOString().slice(0, 16) : '');
            setEndDate(eventData.end ? new Date(eventData.end).toISOString().slice(0, 16) : '');
        } else {
            setMode('add');
            setTitle('');
            setStartDate('');
            setEndDate('');
        }
    }, [eventData]); // Dipende solo da eventData, non da altre variabili che potrebbero causare un ciclo infinito
    

    // Aggiungi un nuovo evento
    const handleAddEvent = () => {
        if (!title || !startDate || !endDate) {
            alert("Tutti i campi sono obbligatori!");
            return;
        }
        const newEvent = { title, start: startDate, end: endDate };
        onAddEvent(newEvent); // Passa il nuovo evento al genitore
        onClose(); // Chiudi la finestra modale
    };

    // Modifica un evento esistente
    const handleEditEvent = () => {
        if (!title || !startDate || !endDate) {
            alert("Tutti i campi sono obbligatori!");
            return;
        }
        const updatedEvent = { ...eventData, title, start: startDate, end: endDate };
        onEditEvent(updatedEvent); // Passa l'evento aggiornato al genitore
        onClose(); // Chiudi la finestra modale
    };

    // Elimina un evento
    const handleDeleteEvent = () => {
        onDeleteEvent(eventData._id); // Passa l'ID dell'evento da eliminare
        onClose(); // Chiudi la finestra modale
    };

    // Passa alla modalità modifica
    const handleSwitchToEdit = () => {
        setMode('edit'); // Modifica la modalità a 'edit' per abilitare i campi
    };

    // Renderizza i pulsanti in base alla modalità
    const renderButtons = () => {
        if (mode === 'view') {
            // Modalità di visualizzazione (riepilogo)
            return (
                <>
                    <button className="edit" onClick={handleSwitchToEdit}>Modifica Evento</button>
                    <button className="close" onClick={onClose}>Chiudi</button>
                </>
            );
        }
        if (mode === 'edit') {
            // Modalità di modifica
            return (
                <>
                    <button className="save" onClick={handleEditEvent}>Salva</button>
                    <button className="delete" onClick={handleDeleteEvent}>Elimina</button>
                    <button className="close" onClick={onClose}>Chiudi</button>
                </>
            );
        }
        return (
            <>
                <button className="add" onClick={handleAddEvent}>Aggiungi</button>
                <button className="close" onClick={onClose}>Chiudi</button>
            </>
        );
    };

    return (
        isOpen && (
            <div className={`modal ${isOpen ? 'show' : ''}`}>
                <div className="modal-content">
                    <h2>{mode === 'add' ? 'Aggiungi Evento' : mode === 'edit' ? 'Modifica Evento' : 'Dettagli Evento'}</h2>
                    {mode === 'view' ? (
                        // Modalità "view" per visualizzare il riepilogo
                        <div>
                            <p><strong>Evento:</strong> {eventData.title}</p>
                            <p><strong>Data e Ora Inizio:</strong> {new Date(eventData.start).toLocaleString()}</p>
                            <p><strong>Data e Ora Fine:</strong> {new Date(eventData.end).toLocaleString()}</p>
                        </div>
                    ) : mode === 'edit' ? (
                        // Modalità "edit" per modificare l'evento
                        <div>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Titolo dell'evento"
                            />
                            <input
                                type="datetime-local"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                            />
                            <input
                                type="datetime-local"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                            />
                        </div>
                    ) : (
                        // Modalità "add" per aggiungere un nuovo evento
                        <div>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Titolo dell'evento"
                            />
                            <input
                                type="datetime-local"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                            />
                            <input
                                type="datetime-local"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                            />
                        </div>
                    )}
                    <div className="form-footer">
                        {renderButtons()}
                    </div>
                </div>
            </div>
        )
    );
};

export default EventModal;
