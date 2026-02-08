import React from 'react';
import '../styles/AdSidebar.css';

function AdSidebar({ position, ads }) {
    if (!ads || ads.length === 0) return null;

    return (
        <aside className={`ad-sidebar ad-${position}`}>
            <div className="ad-container">
                {ads.map((ad) => (
                    <div key={ad.id} className="ad-unit">
                        <div className="ad-content">
                            <h4>{ad.title}</h4>
                            <p>{ad.content}</p>
                            <button className="ad-cta">Learn More</button>
                        </div>
                        <div className="ad-label">Sponsored</div>
                    </div>
                ))}
                <div className="ad-placeholder">
                    <span>Ad Space Available</span>
                </div>
            </div>
        </aside>
    );
}

export default AdSidebar;
