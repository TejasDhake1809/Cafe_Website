import React, { useEffect } from 'react';
// AOS is commented out for compilation in this environment. If you use AOS,
// ensure it's installed and configured correctly in your Vite project.
// import AOS from 'aos';
// import 'aos/dist/aos.css';

// Import the separate CSS file for this component
import './Events.css';

// Self-contained EventCard component (renamed and class names updated)
const EventCard = ({ title, content, photo }) => {
  return (
    <article className="event-card-wrapper" style={{ backgroundImage: `url(${photo})` }}>
      <div className="event-card-overlay">
        <div className="event-card-content">
          <h3 className="event-card-title"> {title} </h3>
          <p className="event-card-paragraph"> {content} </p>
        </div>
      </div>
    </article>
  );
};


function Events() {
  useEffect(() => {
    // If you enable AOS, uncomment this line and ensure AOS is installed.
    // AOS.init({ duration: 1000, once: true });
  }, []);

  // Dummy data for cafe-themed event cards
  const eventCardsData = [
    {
      title: "Acoustic Evenings",
      content: "Relax with a warm brew and enjoy soulful live acoustic music every Friday night.",
      photo: "https://placehold.co/800x600/6F4E37/F5F5DC?text=Acoustic+Night"
    },
    {
      title: "Poetry & Open Mic",
      content: "Share your verses or listen to local talent. A cozy atmosphere for creative expression.",
      photo: "https://placehold.co/800x600/4A2C2A/F5F5DC?text=Poetry+Mic"
    },
    {
      title: "Board Game Bonanza",
      content: "Gather your friends for an evening of strategy and fun. New games weekly!",
      photo: "https://placehold.co/800x600/8B4513/F5F5DC?text=Board+Games"
    },
    {
      title: "Coffee Brewing Workshop",
      content: "Learn the art of perfect coffee brewing from our expert baristas. Hands-on experience included.",
      photo: "https://placehold.co/800x600/A0522D/F5F5DC?text=Brewing+Workshop"
    },
    {
      title: "Local Art Showcase",
      content: "Discover local artists and their captivating works. New exhibits monthly.",
      photo: "https://placehold.co/800x600/708090/F5F5DC?text=Art+Showcase"
    },
    {
      title: "Jazz & Blues Night",
      content: "Unwind to the smooth sounds of jazz and blues. A perfect evening for connoisseurs.",
      photo: "https://placehold.co/800x600/2F4F4F/F5F5DC?text=Jazz+Blues"
    }
  ];

  return (
    <div className="events-page-container"> {/* Main container for the page */}
      {/* Hero Section for Events */}
      <section className="events-hero-section"
        style={{ backgroundImage: `url('https://placehold.co/1920x1080/D2B48C/5C4033?text=Cafe+Events')` }}>
        <div className="events-hero-overlay"></div>
        <div className="events-hero-content">
          <h1 className="events-hero-title">
            Events at Our Cozy Cafe
          </h1>
          <p className="events-hero-paragraph">
            Experience the vibrant atmosphere of live music, engaging workshops, and delightful gatherings.
            Join us for unforgettable moments over your favorite coffee.
          </p>
          <div className="events-hero-button-container">
            <button className="events-button">
              View All Events
            </button>
          </div>
        </div>
      </section>

      {/* Tagline Section */}
      <section className="events-tagline-section">
        <div className="events-tagline-content">
          <p className="events-tagline-text">Discover What's Happening</p>
        </div>
      </section>

      {/* Cards Container */}
      <section className="events-cards-section">
        <div className="events-cards-grid">
          {eventCardsData.map((event, index) => (
            <div key={index}>
              <EventCard
                title={event.title}
                content={event.content}
                photo={event.photo}
              />
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action / Visit Us Section */}
      <section className="events-cta-section">
        <div className="events-cta-content">
          <h2 className="events-cta-title">
            Plan Your Next Visit!
          </h2>
          <p className="events-cta-paragraph">
            Check out our full schedule and make sure you don't miss your favorite events.
          </p>
          <button className="events-button events-button-cta">
            Get Directions
          </button>
        </div>
      </section>
    </div>
  );
}

export default Events;
