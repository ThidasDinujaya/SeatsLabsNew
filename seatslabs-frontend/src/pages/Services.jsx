import React, { useState } from 'react';
import ServiceCard from '../components/ServiceCard';
import '../styles/Services.css';

function Services({ services }) {
  const [searchTerm, setSearchTerm] = useState('');

  // Filter services based on search
  const filteredServices = services.filter(service =>
    service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="services-page">
      {/* Page Header */}
      <div className="page-header">
        <h1>Our Services</h1>
        <p>Choose from our range of professional vehicle services</p>
      </div>

      {/* Search Bar */}
      <div className="search-container">
        <input
          type="text"
          className="search-input"
          placeholder="Search services..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <span className="search-icon">🔍</span>
      </div>

      {/* Services Grid */}
      <div className="services-container">
        {filteredServices.length > 0 ? (
          <div className="services-grid">
            {filteredServices.map(service => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        ) : (
          <div className="no-results">
            <span className="no-results-icon">😕</span>
            <p>No services found matching "{searchTerm}"</p>
            <button 
              className="btn btn-secondary"
              onClick={() => setSearchTerm('')}
            >
              Clear Search
            </button>
          </div>
        )}
      </div>

      {/* Info Section */}
      <div className="info-section">
        <div className="info-card">
          <h3>💡 Good to Know</h3>
          <ul>
            <li>All prices are estimates and may vary based on vehicle condition</li>
            <li>Duration includes inspection time</li>
            <li>We use genuine spare parts only</li>
            <li>Free vehicle wash with Full Service</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Services;
