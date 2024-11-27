import React, { useState, useEffect } from 'react';

const EventModal = ({ isOpen, onClose, eventData, onAddEvent, onEditEvent, onDeleteEvent }) => {
    // Stato per gestire la modalità della finestra modale ('view', 'edit', 'add')
    const [mode, setMode] = useState('view'); // 'view' per visualizzare il riepilogo, 'edit' per la modifica
    // Stato per gestire i dati dell'evento
    const [title, setTitle] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    // useEffect che si attiva ogni volta che cambia eventData
    // Per impostare i valori dell'evento passato e la modalità di visualizzazione
    useEffect(() => {
        if (eventData) {
            // Se ci sono dati sull'evento, la modalità è 'view' per il riepilogo
            setMode('view');
            // Imposta il titolo, la data di inizio e la data di fine
            setTitle(eventData.title);
            setStartDate(eventData.start ? new Date(eventData.start).toISOString().slice(0, 16) : '');
            setEndDate(eventData.end ? new Date(eventData.end).toISOString().slice(0, 16) : '');
        } else {
            // Se non ci sono dati sull'evento, la modalità è 'add' per aggiungere un nuovo evento
            setMode('add');
            // Pulisce i valori degli input per un nuovo evento
            setTitle('');
            setStartDate('');
            setEndDate('');
        }
    }, [eventData]); // Dipende solo da eventData, non da altre variabili per evitare cicli infiniti

    // Funzione per aggiungere un nuovo evento
    const handleAddEvent = () => {
        // Controlla che tutti i campi siano compilati
        if (!title || !startDate || !endDate) {
            alert("Tutti i campi sono obbligatori!"); // Se manca un campo, mostra un avviso
            return;
        }
        // Crea un nuovo oggetto evento
        const newEvent = { title, start: startDate, end: endDate };
        onAddEvent(newEvent); // Passa il nuovo evento al componente genitore
        onClose(); // Chiudi la finestra modale
    };

    // Funzione per modificare un evento esistente
    const handleEditEvent = () => {
        // Controlla che tutti i campi siano compilati
        if (!title || !startDate || !endDate) {
            alert("Tutti i campi sono obbligatori!"); // Se manca un campo, mostra un avviso
            return;
        }
        // Crea un nuovo oggetto evento aggiornato, mantenendo l'ID dell'evento originale
        const updatedEvent = { ...eventData, title, start: startDate, end: endDate };
        onEditEvent(updatedEvent); // Passa l'evento aggiornato al componente genitore
        onClose(); // Chiudi la finestra modale
    };

    // Funzione per eliminare un evento
    const handleDeleteEvent = () => {
        onDeleteEvent(eventData._id); // Passa l'ID dell'evento da eliminare al genitore
        onClose(); // Chiudi la finestra modale
    };

    // Funzione per passare alla modalità di modifica (attiva i campi di input)
    const handleSwitchToEdit = () => {
        setMode('edit'); // Cambia la modalità a 'edit' per abilitare la modifica dei campi
    };

    // Funzione per renderizzare i pulsanti in base alla modalità
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
        // Condizione per renderizzare il modal solo se isOpen è vero
        isOpen && (
            <div className={`modal ${isOpen ? 'show' : ''}`}>
                <div className="modal-content">
                    {/* Titolo della modale che cambia in base alla modalità */}
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
                                onChange={(e) => setTitle(e.target.value)} // Gestisce il cambiamento del titolo
                                placeholder="Titolo dell'evento"
                            />
                            <input
                                type="datetime-local"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)} // Gestisce il cambiamento della data di inizio
                            />
                            <input
                                type="datetime-local"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)} // Gestisce il cambiamento della data di fine
                            />
                        </div>
                    ) : (
                        // Modalità "add" per aggiungere un nuovo evento
                        <div>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)} // Gestisce il cambiamento del titolo
                                placeholder="Titolo dell'evento"
                            />
                            <input
                                type="datetime-local"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)} // Gestisce il cambiamento della data di inizio
                            />
                            <input
                                type="datetime-local"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)} // Gestisce il cambiamento della data di fine
                            />
                        </div>
                    )}
                    {/* Renderizza i pulsanti in fondo alla modale */}
                    <div className="form-footer">
                        {renderButtons()}
                    </div>
                </div>
            </div>
        )
    );
};

export default EventModal;
