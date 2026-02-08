import React, { useState, useEffect } from 'react';
import api from '../services/api';
import '../styles/MyBookings.css'; // Reuse styles for consistency

function MyVehicles() {
    const [vehicles, setVehicles] = useState([]);
    const [brands, setBrands] = useState([]);
    const [models, setModels] = useState([]);
    const [bodyTypes, setBodyTypes] = useState([]);
    const [showAddForm, setShowAddForm] = useState(false);
    const [loading, setLoading] = useState(true);

    const [newVehicle, setNewVehicle] = useState({
        registrationNumber: '',
        brandId: '',
        modelId: '',
        bodyTypeId: '',
        manufactureYear: '',
        color: '',
        mileage: ''
    });

    const fetchInitialData = async () => {
        try {
            setLoading(true);
            const [vehiclesRes, brandsRes, bodyTypesRes] = await Promise.all([
                api.vehicles.getMyVehicles(),
                api.vehicles.getBrands(),
                api.vehicles.getBodyTypes()
            ]);

            setVehicles(vehiclesRes.data.data);
            setBrands(brandsRes.data.data);
            setBodyTypes(bodyTypesRes.data.data);
        } catch (error) {
            console.error("Failed to fetch vehicle data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInitialData();
    }, []);

    useEffect(() => {
        if (newVehicle.brandId) {
            const fetchModels = async () => {
                try {
                    const response = await api.vehicles.getModelsByBrand(newVehicle.brandId);
                    setModels(response.data.data);
                } catch (error) {
                    console.error("Failed to fetch models:", error);
                }
            };
            fetchModels();
        } else {
            setModels([]);
        }
    }, [newVehicle.brandId]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewVehicle(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleAddVehicle = async (e) => {
        e.preventDefault();
        try {
            const vehicleData = {
                brandId: parseInt(newVehicle.brandId),
                modelId: parseInt(newVehicle.modelId),
                bodyTypeId: parseInt(newVehicle.bodyTypeId),
                registrationNumber: newVehicle.registrationNumber,
                manufactureYear: parseInt(newVehicle.manufactureYear),
                color: newVehicle.color,
                mileage: parseInt(newVehicle.mileage)
            };

            await api.vehicles.create(vehicleData);
            alert('Vehicle Added Successfully!');
            setShowAddForm(false);
            setNewVehicle({
                registrationNumber: '',
                brandId: '',
                modelId: '',
                bodyTypeId: '',
                manufactureYear: '',
                color: '',
                mileage: ''
            });
            fetchInitialData();
        } catch (error) {
            alert('Failed to add vehicle: ' + (error.response?.data?.error || error.message));
        }
    };

    if (loading) return <div className="loading">Loading vehicles...</div>;

    return (
        <div className="my-bookings-page">
            <div className="page-header">
                <h1>My Vehicles</h1>
                <p>Manage your registered vehicles for service bookings</p>
            </div>

            <div className="bookings-list-container">
                <div className="section-header">
                    <button className="btn btn-primary" onClick={() => setShowAddForm(!showAddForm)}>
                        {showAddForm ? 'Cancel' : '+ Add New Vehicle'}
                    </button>
                </div>

                {showAddForm && (
                    <div className="card add-form-container">
                        <h3>Add New Vehicle</h3>
                        <form onSubmit={handleAddVehicle} className="form-grid">
                            <div className="form-group">
                                <label>Registration Number *</label>
                                <input type="text" name="registrationNumber" placeholder="CAB-1234" value={newVehicle.registrationNumber} onChange={handleInputChange} required className="form-input" />
                            </div>

                            <div className="form-group">
                                <label>Brand *</label>
                                <select name="brandId" value={newVehicle.brandId} onChange={handleInputChange} required className="form-input">
                                    <option value="">Select Brand</option>
                                    {brands.map(b => (
                                        <option key={b.vehicleBrandId} value={b.vehicleBrandId}>{b.vehicleBrandName}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Model *</label>
                                <select name="modelId" value={newVehicle.modelId} onChange={handleInputChange} required className="form-input" disabled={!newVehicle.brandId}>
                                    <option value="">Select Model</option>
                                    {models.map(m => (
                                        <option key={m.vehicleModelId} value={m.vehicleModelId}>{m.vehicleModelName}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Body Type *</label>
                                <select name="bodyTypeId" value={newVehicle.bodyTypeId} onChange={handleInputChange} required className="form-input">
                                    <option value="">Select Body Type</option>
                                    {bodyTypes.map(bt => (
                                        <option key={bt.vehicleBodyTypeId} value={bt.vehicleBodyTypeId}>{bt.vehicleBodyTypeName}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Year *</label>
                                <input type="number" name="manufactureYear" placeholder="2022" value={newVehicle.manufactureYear} onChange={handleInputChange} required className="form-input" />
                            </div>

                            <div className="form-group">
                                <label>Color</label>
                                <input type="text" name="color" placeholder="Silver" value={newVehicle.color} onChange={handleInputChange} className="form-input" />
                            </div>

                            <div className="form-group">
                                <label>Mileage (km)</label>
                                <input type="number" name="mileage" placeholder="50000" value={newVehicle.mileage} onChange={handleInputChange} className="form-input" />
                            </div>

                            <div className="form-actions">
                                <button type="submit" className="btn btn-primary">Save Vehicle</button>
                            </div>
                        </form>
                    </div>
                )}

                {vehicles.length > 0 ? (
                    <div className="bookings-grid">
                        {vehicles.map(vehicle => (
                            <div key={vehicle.vehicleId} className="booking-card glass-panel">
                                <div className="booking-header">
                                    <span className="booking-id">{vehicle.vehicleRegistrationNumber}</span>
                                    <span className="status-badge status-confirmed">{vehicle.vehicleBrandName}</span>
                                </div>
                                <div className="booking-details">
                                    <div className="detail-row">
                                        <span className="label">Model:</span>
                                        <span className="value">{vehicle.vehicleModelName}</span>
                                    </div>
                                    <div className="detail-row">
                                        <span className="label">Year:</span>
                                        <span className="value">{vehicle.vehicleManufactureYear}</span>
                                    </div>
                                    <div className="detail-row">
                                        <span className="label">Color:</span>
                                        <span className="value">{vehicle.vehicleColor || 'N/A'}</span>
                                    </div>
                                    <div className="detail-row">
                                        <span className="label">Mileage:</span>
                                        <span className="value">{vehicle.vehicleMileage ? `${vehicle.vehicleMileage} km` : 'N/A'}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="no-bookings-state">
                        <span className="icon">🚗</span>
                        <h3>No Vehicles Found</h3>
                        <p>You haven't added any vehicles yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default MyVehicles;
