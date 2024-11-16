import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate hook for navigation
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./calender.css";
import avatar from '../assets/avatar.jpg';

const CalendarPage = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const navigate = useNavigate(); // React Router hook for navigation

  const handleProfileClick = () => {
    navigate(-1); // Navigate to the previous page
  };

  // Event Arrays
  const authorEvents = [
    {
      title: "Book Signing: The Lost City",
      date: "August 15, 2024, 6:00 PM"
    },
    {
      title: "Author Talk: Writing Thrillers",
      date: "September 25, 2024, 7:00 PM"
    },
    {
      title: "Author Q&A: The Book Club",
      date: "October 10, 2024, 3:00 PM"
    },
    {
      title: "Writer's Workshop: World-Building",
      date: "November 16, 2024, 10:00 AM"
    },
    {
      title: "Literary Festival: Celebrating Diversity",
      date: "December 7-8, 2024"
    }
  ];

  const readingChallenges = [
    {
      title: "Yearly Reading Challenge Kickoff",
      date: "August 1, 2024",
    },
    {
      title: "Genre-Hopping Challenge",
      date: "September 1, 2024",
    },
    {
      title: "Book-a-Week Club",
      date: "October 1, 2024",
    },
    {
      title: "Series Marathon: The Hunger Games",
      date: "November 15, 2024",
    },
    {
      title: "Blind Date with a Book",
      date: "December 12, 2024",
    }
  ];

  const workshopEvents = [
    { title: "Workshop: Character Development", date: "2024-09-15T11:00:00" },
    { title: "Workshop: Poetry Writing", date: "2024-10-05T14:00:00" },
  ];

  // Parse event dates into JavaScript Date objects
  const parseEvents = (events) =>
    events.map((event) => ({
      ...event,
      parsedDate: new Date(event.date),
    }));

  // Parse each category of events
  const parsedAuthorEvents = parseEvents(authorEvents);
  const parsedReadingChallenges = parseEvents(readingChallenges);
  const parsedWorkshopEvents = parseEvents(workshopEvents);

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  // Check if a date has events in a specific array
  const hasEvents = (date, events) =>
    events.some((event) => event.parsedDate.toDateString() === date.toDateString());

  // Combine all events into one array for displaying details
  const getAllEventsForDate = (date) => {
    return [
      ...parsedAuthorEvents.filter((event) => event.parsedDate.toDateString() === date.toDateString()),
      ...parsedReadingChallenges.filter((event) => event.parsedDate.toDateString() === date.toDateString()),
      ...parsedWorkshopEvents.filter((event) => event.parsedDate.toDateString() === date.toDateString()),
    ];
  };

  return (
    <div className="calendar-page">
      <div id="user-navbar">
        <h2 id="title">Book Verse</h2>
        <a href="#profile" onClick={handleProfileClick}>
          <img src={avatar} alt="Profile" className="small-profile-pic" id="profile-pic" />
        </a>
      </div>
      
      <div className="title">Event Calendar</div>
      <div className="calendar-container">
        <Calendar
          onChange={handleDateChange}
          value={selectedDate}
          tileClassName={({ date, view }) => {
            if (view === "month") {
              if (hasEvents(date, parsedAuthorEvents)) return "author-event";
              if (hasEvents(date, parsedReadingChallenges)) return "reading-challenge";
              if (hasEvents(date, parsedWorkshopEvents)) return "workshop-event";
            }
            return null;
          }}
        />
        <div className="event-details">
          {getAllEventsForDate(selectedDate).length > 0 ? (
            getAllEventsForDate(selectedDate).map((event, index) => (
              <p key={index}>
                <strong>{event.title}</strong>
                <br />
                {new Date(event.date).toLocaleString()}
              </p>
            ))
          ) : (
            <p>No events for this date.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;
