import React from 'react';
import { Link } from 'react-router-dom';
import ServiceCard from '../components/ServiceCard';
import '../styles/Home.css';

function Home({ services }) {
  // Show only first 3 services on home page
  const featuredServices = services.slice(0, 3);

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">
            Skip the Wait,<br />
            <span className="highlight">Book Your Slot</span>
          </h1>
          <p className="hero-subtitle">
            Professional vehicle servicing at Auto M Pvt Ltd. 
            Book your appointment online and arrive on time.
          </p>
          <div className="hero-buttons">
            <Link to="/booking" className="btn btn-primary">
              Book Now
            </Link>
            <Link to="/services" className="btn btn-secondary">
              View Services
            </Link>
          </div>
        </div>
        <div className="hero-image">
          <div className="hero-graphic">
            <span className="graphic-icon">🚗</span>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="feature-card">
          <span className="feature-icon">📅</span>
          <h3>Easy Booking</h3>
          <p>Book your service slot online in just a few clicks</p>
        </div>
        <div className="feature-card">
          <span className="feature-icon">⏰</span>
          <h3>No Waiting</h3>
          <p>Arrive at your scheduled time, no more long queues</p>
        </div>
        <div className="feature-card">
          <span className="feature-icon">🔔</span>
          <h3>Get Reminders</h3>
          <p>Receive notifications before your appointment</p>
        </div>
      </section>

      {/* Featured Services */}
      <section className="featured-services">
        <div className="section-header">
          <h2>Our Services</h2>
          <Link to="/services" className="view-all">View All →</Link>
        </div>
        <div className="services-grid">
          {featuredServices.map(service => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <div className="cta-content">
          <h2>Ready to Book Your Service?</h2>
          <p>Choose your preferred date and time slot</p>
          <Link to="/booking" className="btn btn-primary btn-large">
            Book Appointment
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-brand">
            <span className="logo-icon">🔧</span>
            <span className="logo-text">SeatsLabs</span>
            <p>Auto M Pvt Ltd, Colombo, Sri Lanka</p>
          </div>
          <div className="footer-contact">
            <h4>Contact Us</h4>
            <p>📞 011-2345678</p>
            <p>📧 info@autom.lk</p>
          </div>
          <div className="footer-hours">
            <h4>Working Hours</h4>
            <p>Monday - Saturday</p>
            <p>7:00 AM - 7:00 PM</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2025 SeatsLabs - Auto M Pvt Ltd. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default Home;
