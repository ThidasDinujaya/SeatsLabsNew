import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/ServiceCard.css';

function ServiceCard({ service, showButton = true }) {
  const navigate = useNavigate();

  const handleSelect = () => {
    navigate('/booking', { state: { selectedService: service } });
  };

  return (
    <div className="service-card">
      <div className="service-card-header">
        <h3 className="service-name">{service.name}</h3>
        <span className="service-duration">{service.duration}</span>
      </div>
      
      <p className="service-description">{service.description}</p>
      
      <div className="service-card-footer">
        <div className="service-price">
          <span className="price-label">Price</span>
          <span className="price-value">Rs. {service.price.toLocaleString()}</span>
        </div>
        
        {showButton && (
          <button className="select-btn" onClick={handleSelect}>
            Select
          </button>
        )}
      </div>
    </div>
  );
}

export default ServiceCard;
