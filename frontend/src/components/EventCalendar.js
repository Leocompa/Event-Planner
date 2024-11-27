import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';  // Importa i componenti per il modale e i bottoni
import { Calendar, momentLocalizer } from 'react-big-calendar';  // Importa il calendario
import moment from 'moment';  // Per la gestione delle date
import 'react-big-calendar/lib/css/react-big-calendar.css';  // Stili per il calendario
import axios from 'axios';  // Per effettuare le richieste HTTP
import DatePicker from 'react-datepicker';  // Per il picker delle date
import 'react-datepicker/dist/react-datepicker.css';  // Stili per il datepicker

// Inizializza il localizer per il calendario usando moment.js
const localizer = momentLocalizer(moment);

const EventCalendar = () => {
  // Stati per gestire gli eventi, il modale, la selezione e i dati dell'evento
  const [events, setEvents] = useState([]);  // Lista degli eventi
  const [showModal, setShowModal] = useState(false);  // Stato per il controllo della visibilità del modale
  const [selectedEvent, setSelectedEvent] = useState(null);  // Evento selezionato per modifiche
  const [newEvent, setNewEvent] = useState({
    title: '',
    start: new Date(),
    end: new Date(),
  });  // Dati per il nuovo evento
  const [isEditing, setIsEditing] = useState(false);  // Stato per tracciare se siamo in modalità di modifica o creazione

  const API_URL = 'http://localhost:5001/api/events';  // URL API per ottenere e gestire gli eventi

  // Effettua la richiesta per ottenere gli eventi dal server al primo caricamento del componente
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const token = localStorage.getItem('token');  // Ottiene il token di autorizzazione salvato localmente
        const response = await axios.get(API_URL, {
          headers: {
            Authorization: `Bearer ${token}`,  // Aggiunge il token alle intestazioni della richiesta
          },
        });

        // Converte tutte le date da stringa a oggetto Date
        const formattedEvents = response.data.map(event => ({
          ...event,
          start: new Date(event.start),  // Converte la data di inizio in un oggetto Date
          end: new Date(event.end),      // Converte la data di fine in un oggetto Date
        }));

        setEvents(formattedEvents);  // Imposta gli eventi nello stato
      } catch (error) {
        console.error("Error fetching events", error);  // Gestisce gli errori nella richiesta
      }
    };
    fetchEvents();
  }, []);

  // Funzione per gestire i cambiamenti nelle date (inizio e fine) per la creazione o la modifica dell'evento
  const handleDateChange = (date, field) => {
    if (selectedEvent) {
      setSelectedEvent({ ...selectedEvent, [field]: date });
    } else {
      setNewEvent({ ...newEvent, [field]: date });
    }
  };

  // Funzione per aggiungere un nuovo evento
  const handleAddEvent = async () => {
    if (!newEvent.title || !newEvent.start || !newEvent.end) {
      console.error("Missing data");  // Controlla se i campi obbligatori sono compilati
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        API_URL,
        {
          ...newEvent,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,  // Aggiunge il token di autorizzazione
          },
        }
      );

      // Converte le date nella risposta in oggetti Date
      const addedEvent = {
        ...response.data,
        start: new Date(response.data.start),
        end: new Date(response.data.end),
      };

      // Aggiunge il nuovo evento alla lista degli eventi esistenti
      setEvents([...events, addedEvent]);
      setShowModal(false);  // Chiude il modale
      setNewEvent({
        title: '',
        start: new Date(),
        end: new Date(),
      });  // Resetta i campi per il nuovo evento
    } catch (error) {
      console.error("Error adding event", error);  // Gestisce gli errori nell'aggiunta dell'evento
    }
  };

  // Funzione per modificare un evento esistente
  const handleEditEvent = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `${API_URL}/${selectedEvent._id}`,
        {
          ...selectedEvent,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,  // Aggiunge il token di autorizzazione
          },
        }
      );

      // Converte le date nella risposta in oggetti Date
      const updatedEvent = {
        ...response.data,
        start: new Date(response.data.start),
        end: new Date(response.data.end),
      };

      // Aggiorna l'evento nella lista esistente
      const updatedEvents = events.map(event =>
        event._id === selectedEvent._id ? updatedEvent : event
      );

      setEvents(updatedEvents);  // Imposta gli eventi aggiornati nello stato
      setShowModal(false);  // Chiude il modale
      setSelectedEvent(null);  // Resetta l'evento selezionato
    } catch (error) {
      console.error("Error editing event", error);  // Gestisce gli errori nella modifica
    }
  };

  // Funzione per eliminare un evento
  const handleDeleteEvent = async () => {
    if (!selectedEvent || !selectedEvent._id) {
      console.error("No event selected or event ID is missing.");
      return;
    }

    if (window.confirm("Are you sure you want to delete this event?")) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`${API_URL}/${selectedEvent._id}`, {
          headers: {
            Authorization: `Bearer ${token}`,  // Aggiunge il token di autorizzazione
          },
        });
        setEvents(events.filter(event => event._id !== selectedEvent._id));  // Rimuove l'evento dalla lista
        setShowModal(false);  // Chiude il modale
        setSelectedEvent(null);  // Resetta l'evento selezionato
      } catch (error) {
        console.error("Error deleting event", error);  // Gestisce gli errori nell'eliminazione
      }
    }
  };

  // Funzione per gestire il click su un evento esistente (per modificarlo)
  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setShowModal(true);  // Mostra il modale con i dettagli dell'evento
    setIsEditing(false);  // Modalità lettura (non modifica)
  };

  // Funzione per aprire il modale per creare un nuovo evento
  const handleNewEventClick = () => {
    setSelectedEvent(null);  // Rimuove l'evento selezionato
    setNewEvent({
      title: '',
      start: new Date(),
      end: new Date(),
    });  // Resetta i campi del nuovo evento
    setShowModal(true);  // Mostra il modale
    setIsEditing(true);  // Modalità creazione evento
  };

  return (
    <div>
      {/* Pulsante per aggiungere un nuovo evento */}
      <Button onClick={handleNewEventClick}>Add Event</Button>

      {/* Calendario */}
      <Calendar
        localizer={localizer}  // Imposta il localizer di moment.js
        events={events}  // Passa la lista degli eventi
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}  // Imposta l'altezza del calendario
        onSelectEvent={handleEventClick}  // Gestisce il click su un evento
        views={['month', 'week', 'day', 'agenda']}  // Aggiunge diverse viste (mese, settimana, giorno, agenda)
        defaultView="month"  // Imposta la vista di default sul mese
        step={15}  // Intervalli di 15 minuti
        timeslots={4}  // 4 slot per ogni ora (ogni 15 minuti)
        showMultiDayTimes={true}  // Mostra gli eventi multi-giorno
      />

      {/* Modale per aggiungere/modificare un evento */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{selectedEvent ? 'Event Details' : 'Add Event'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Campo per il titolo dell'evento */}
          <input
            type="text"
            value={selectedEvent ? selectedEvent.title : newEvent.title}
            onChange={(e) =>
              selectedEvent
                ? setSelectedEvent({ ...selectedEvent, title: e.target.value })
                : setNewEvent({ ...newEvent, title: e.target.value })
            }
            placeholder="Event Title"
            className="form-control"
            disabled={!isEditing}  // Disabilita l'input se non in modalità modifica
          />
          <label>Start Date and Time</label>
          <DatePicker
            selected={selectedEvent ? selectedEvent.start : newEvent.start}
            onChange={(date) => handleDateChange(date, 'start')}
            showTimeSelect
            dateFormat="Pp"
            timeIntervals={15}
            className="form-control"
            disabled={!isEditing}  // Disabilita il picker se non in modalità modifica
          />
          <label>End Date and Time</label>
          <DatePicker
            selected={selectedEvent ? selectedEvent.end : newEvent.end}
            onChange={(date) => handleDateChange(date, 'end')}
            showTimeSelect
            dateFormat="Pp"
            timeIntervals={15}
            className="form-control"
            disabled={!isEditing}  // Disabilita il picker se non in modalità modifica
          />
        </Modal.Body>
        <Modal.Footer>
          {/* Mostra i pulsanti per la gestione dell'evento */}
          {selectedEvent && !isEditing && (
            <>
              <Button variant="danger" onClick={handleDeleteEvent}>Delete Event</Button>
              <Button variant="primary" onClick={() => setIsEditing(true)}>Edit Event</Button>
            </>
          )}
          {selectedEvent && isEditing && (
            <Button variant="primary" onClick={handleEditEvent}>Save Changes</Button>
          )}
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
          {/* Se non c'è un evento selezionato, consente l'aggiunta di un nuovo evento */}
          {!selectedEvent && isEditing && (
            <Button variant="primary" onClick={handleAddEvent}>Add Event</Button>
          )}
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default EventCalendar;
