// URL del backend per accedere agli eventi (modificare se necessario)
const API_URL = "http://localhost:5001/events";

// Oggetto EventManager che gestisce le operazioni sugli eventi tramite il backend
const EventManager = {
  // Ottieni tutti gli eventi
  getEvents: async () => {
    try {
      // Effettua una richiesta GET al backend per ottenere tutti gli eventi
      const response = await fetch(API_URL);

      // Verifica se la risposta è positiva (status HTTP 200-299)
      if (!response.ok) {
        // Se la risposta non è positiva, lancia un errore con il messaggio di stato
        throw new Error(`Failed to fetch events: ${response.statusText}`);
      }

      // Converte la risposta in formato JSON e la restituisce
      return await response.json();
    } catch (error) {
      // Gestisce gli errori durante la richiesta (sia di rete che di status)
      console.error("Error fetching events:", error);
      // Propaga l'errore per poterlo gestire altrove se necessario
      throw error;
    }
  },

  // Aggiungi un nuovo evento
  addEvent: async (event) => {
    try {
      // Effettua una richiesta POST al backend per aggiungere un nuovo evento
      const response = await fetch(API_URL, {
        method: "POST", // Specifica che la richiesta è di tipo POST
        headers: {
          "Content-Type": "application/json", // Indica che il corpo della richiesta è in formato JSON
        },
        // Invia l'evento come corpo della richiesta in formato JSON
        body: JSON.stringify(event),
      });

      // Verifica se la risposta è positiva
      if (!response.ok) {
        // Se la risposta non è positiva, lancia un errore con il messaggio di stato
        throw new Error(`Failed to add event: ${response.statusText}`);
      }

      // Converte la risposta in formato JSON e la restituisce (evento aggiunto)
      return await response.json();
    } catch (error) {
      // Gestisce gli errori durante l'aggiunta dell'evento
      console.error("Error adding event:", error);
      // Propaga l'errore per poterlo gestire altrove se necessario
      throw error;
    }
  },

  // Modifica un evento esistente
  updateEvent: async (event) => {
    try {
      // Effettua una richiesta PUT al backend per aggiornare l'evento esistente
      const response = await fetch(`${API_URL}/${event.id}`, {
        method: "PUT", // Specifica che la richiesta è di tipo PUT (aggiornamento)
        headers: {
          "Content-Type": "application/json", // Indica che il corpo della richiesta è in formato JSON
        },
        // Invia l'evento modificato come corpo della richiesta in formato JSON
        body: JSON.stringify(event),
      });

      // Verifica se la risposta è positiva
      if (!response.ok) {
        // Se la risposta non è positiva, lancia un errore con il messaggio di stato
        throw new Error(`Failed to update event: ${response.statusText}`);
      }

      // Converte la risposta in formato JSON e la restituisce (evento aggiornato)
      return await response.json();
    } catch (error) {
      // Gestisce gli errori durante l'aggiornamento dell'evento
      console.error("Error updating event:", error);
      // Propaga l'errore per poterlo gestire altrove se necessario
      throw error;
    }
  },

  // Elimina un evento
  deleteEvent: async (eventId) => {
    try {
      // Effettua una richiesta DELETE al backend per eliminare l'evento specificato
      const response = await fetch(`${API_URL}/${eventId}`, {
        method: "DELETE", // Specifica che la richiesta è di tipo DELETE
      });

      // Verifica se la risposta è positiva
      if (!response.ok) {
        // Se la risposta non è positiva, lancia un errore con il messaggio di stato
        throw new Error(`Failed to delete event: ${response.statusText}`);
      }
    } catch (error) {
      // Gestisce gli errori durante l'eliminazione dell'evento
      console.error("Error deleting event:", error);
      // Propaga l'errore per poterlo gestire altrove se necessario
      throw error;
    }
  },
};

// Esporta l'oggetto EventManager per utilizzarlo in altri moduli
export default EventManager;
