import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const localizer = momentLocalizer(moment);

const EventCalendar = () => {
  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [newEvent, setNewEvent] = useState({
    title: '',
    start: new Date(),
    end: new Date(),
  });
  const [isEditing, setIsEditing] = useState(false);  // Track if we are editing the event

  const API_URL = 'http://localhost:5001/api/events';

  // Fetch events from backend
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(API_URL, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Ensure all dates are converted to JavaScript Date objects
        const formattedEvents = response.data.map(event => ({
          ...event,
          start: new Date(event.start), // Convert to Date object
          end: new Date(event.end),    // Convert to Date object
        }));

        setEvents(formattedEvents);
      } catch (error) {
        console.error("Error fetching events", error);
      }
    };
    fetchEvents();
  }, []);

  // Handle date changes
  const handleDateChange = (date, field) => {
    if (selectedEvent) {
      setSelectedEvent({ ...selectedEvent, [field]: date });
    } else {
      setNewEvent({ ...newEvent, [field]: date });
    }
  };

  // Add a new event
  const handleAddEvent = async () => {
    if (!newEvent.title || !newEvent.start || !newEvent.end) {
      console.error("Missing data");
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
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Ensure the response is formatted correctly
      const addedEvent = {
        ...response.data,
        start: new Date(response.data.start), // Convert to Date object
        end: new Date(response.data.end),    // Convert to Date object
      };

      setEvents([...events, addedEvent]);
      setShowModal(false);
      setNewEvent({
        title: '',
        start: new Date(),
        end: new Date(),
      });
    } catch (error) {
      console.error("Error adding event", error);
    }
  };

  // Edit an existing event
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
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Ensure the response is formatted correctly
      const updatedEvent = {
        ...response.data,
        start: new Date(response.data.start), // Convert to Date object
        end: new Date(response.data.end),    // Convert to Date object
      };

      const updatedEvents = events.map(event =>
        event._id === selectedEvent._id ? updatedEvent : event
      );

      setEvents(updatedEvents);
      setShowModal(false);
      setSelectedEvent(null);
    } catch (error) {
      console.error("Error editing event", error);
    }
  };

  // Delete an event
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
            Authorization: `Bearer ${token}`,
          },
        });
        setEvents(events.filter(event => event._id !== selectedEvent._id));
        setShowModal(false);
        setSelectedEvent(null);
      } catch (error) {
        console.error("Error deleting event", error);
      }
    }
  };

  // Handle event click
  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setShowModal(true);
    setIsEditing(false);  // Default is read-only mode
  };

  // Handle click to create a new event
  const handleNewEventClick = () => {
    setSelectedEvent(null);
    setNewEvent({
      title: '',
      start: new Date(),
      end: new Date(),
    });
    setShowModal(true);
    setIsEditing(true);  // Modal for creating new event
  };

  return (
    <div>
      {/* Add Event Button */}
      <Button onClick={handleNewEventClick}>Add Event</Button>

      {/* Calendar */}
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
        onSelectEvent={handleEventClick}
        views={['month', 'week', 'day', 'agenda']} // Adds agenda view
        defaultView="month" // Set default view to month
        step={15} // 15-minute intervals
        timeslots={4} // 4 time slots per hour (15 minutes each)
        showMultiDayTimes={true} // Display multi-day events
      />

      {/* Add/Edit Event Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{selectedEvent ? 'Event Details' : 'Add Event'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
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
            disabled={!isEditing} // Disable input if not editing
          />
          <label>Start Date and Time</label>
          <DatePicker
            selected={selectedEvent ? selectedEvent.start : newEvent.start}
            onChange={(date) => handleDateChange(date, 'start')}
            showTimeSelect
            dateFormat="Pp"
            timeIntervals={15}
            className="form-control"
            disabled={!isEditing} // Disable date picker if not editing
          />
          <label>End Date and Time</label>
          <DatePicker
            selected={selectedEvent ? selectedEvent.end : newEvent.end}
            onChange={(date) => handleDateChange(date, 'end')}
            showTimeSelect
            dateFormat="Pp"
            timeIntervals={15}
            className="form-control"
            disabled={!isEditing} // Disable date picker if not editing
          />
        </Modal.Body>
        <Modal.Footer>
          {selectedEvent && !isEditing && (
            <>
              <Button variant="danger" onClick={handleDeleteEvent}>
                Delete Event
              </Button>
              <Button variant="primary" onClick={() => setIsEditing(true)}>
                Edit Event
              </Button>
            </>
          )}
          {selectedEvent && isEditing && (
            <Button variant="primary" onClick={handleEditEvent}>
              Save Changes
            </Button>
          )}
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          {/* Add Event */}
          {!selectedEvent && isEditing && (
            <Button variant="primary" onClick={handleAddEvent}>
              Add Event
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default EventCalendar;
