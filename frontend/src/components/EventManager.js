const API_URL = "http://localhost:5001/events"; // URL del backend (cambiare se necessario)

const EventManager = {
  // Ottieni tutti gli eventi
  getEvents: async () => {
    try {
      const response = await fetch(API_URL);
      
      // Verifica se la risposta è ok
      if (!response.ok) {
        throw new Error(`Failed to fetch events: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching events:", error);
      throw error; // Propaga l'errore
    }
  },

  // Aggiungi un nuovo evento
  addEvent: async (event) => {
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(event),
      });

      // Verifica se la risposta è ok
      if (!response.ok) {
        throw new Error(`Failed to add event: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error adding event:", error);
      throw error;
    }
  },

  // Modifica un evento esistente
  updateEvent: async (event) => {
    try {
      const response = await fetch(`${API_URL}/${event.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(event),
      });

      // Verifica se la risposta è ok
      if (!response.ok) {
        throw new Error(`Failed to update event: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error updating event:", error);
      throw error;
    }
  },

  // Elimina un evento
  deleteEvent: async (eventId) => {
    try {
      const response = await fetch(`${API_URL}/${eventId}`, {
        method: "DELETE",
      });

      // Verifica se la risposta è ok
      if (!response.ok) {
        throw new Error(`Failed to delete event: ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error deleting event:", error);
      throw error;
    }
  },
};

export default EventManager;
