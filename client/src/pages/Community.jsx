import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./styles/Community.css";

const Community = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [events, setEvents] = useState([]);
  const [date, setDate] = useState(new Date());

  // Sample data for announcements and events
  const sampleAnnouncements = [
    { title: "New Yoga Classes Available!", message: "Our new yoga sessions start this week. Join us for relaxation and strength.", date: "2025-04-10" },
    { title: "Spring Offer: 20% Off Membership", message: "Get 20% off your membership for a limited time. Offer ends April 30.", date: "2025-04-05" },
    { title: "Personal Training Sessions", message: "Book a personal trainer for customized workout plans!", date: "2025-04-12" },
  ];

  const sampleEvents = [
    { eventTitle: "Yoga Class", eventDate: "2025-04-10" },
    { eventTitle: "HIIT Bootcamp", eventDate: "2025-04-15" },
    { eventTitle: "Pilates Session", eventDate: "2025-04-18" },
  ];

  useEffect(() => {
    setAnnouncements(sampleAnnouncements);
    setEvents(sampleEvents);
  }, []);

  // Filter events for the selected date
  const filteredEvents = events.filter((event) => {
    const eventDate = new Date(event.eventDate);
    return eventDate.toLocaleDateString() === date.toLocaleDateString();
  });

  const handleDateChange = (newDate) => {
    setDate(newDate);
  };

  return (
    <div className="community-page">
      <h1 className="coming-soon-title">Fitness Community</h1>
      <p className="coming-soon-subtext">
        Join our vibrant fitness community for classes, events, and exclusive offers!
      </p>

      <div className="community-container">
        {/* Calendar Section */}
        <div className="calendar-section">
          <h2>Events Calendar</h2>
          <Calendar
            onChange={handleDateChange}
            value={date}
            className="calendar"
          />
          <p>Selected Date: {date.toLocaleDateString()}</p>
        </div>

        {/* Announcements Section */}
        <div className="announcements-section">
          <h2> Latest Announcements</h2>
          {announcements.length === 0 ? (
            <p>No announcements yet. Check back later!</p>
          ) : (
            <ul className="announcement-list">
              {announcements.map((a, index) => (
                <li key={index} className="announcement-item">
                  <h4>{a.title}</h4>
                  <p>{a.message}</p>
                  <span className="announcement-date">
                    {new Date(a.date).toLocaleDateString()}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Events Section */}
        <div className="events-section">
          <h2> Upcoming Events</h2>
          {filteredEvents.length === 0 ? (
            <p>No events on this date. Check back later!</p>
          ) : (
            <ul className="event-list">
              {filteredEvents.map((event, index) => (
                <li key={index} className="event-item">
                  <h4>{event.eventTitle}</h4>
                  <p>Event Date: {new Date(event.eventDate).toLocaleDateString()}</p>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Challenge and Tips Section */}
        <div className="challenges-tips-section">
          <h2>Weekly Fitness Challenge</h2>
          <p>Take part in this week's challenge: "100 Squats a Day"! Share your progress and win a free class.</p>
          <h2>Pro Tip</h2>
          <p>Consistency is key! Set a routine and stick to it, even when motivation is low.</p>
        </div>
      </div>
    </div>
  );
};

export default Community;
