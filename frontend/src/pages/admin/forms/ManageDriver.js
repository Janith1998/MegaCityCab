import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DataTable from 'react-data-table-component';
import { FaEye, FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import { Button } from 'react-bootstrap';
import Select from 'react-select';

import AddDriver from './models/AddDriver';
import ViewDriver from './models/ViewDriver'; 
import UpdateDriver from './models/UpdateDriver'; 


const ManageDriver = () => {
    const [drivers, setDrivers] = useState([]);
    const [filteredDrivers, setFilteredDrivers] = useState([]); // For filtered results
    const [searchTerm, setSearchTerm] = useState(""); // For search input
    const [selectedDriver, setSelectedDriver] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [cars, setCars] = useState([]);

 

    useEffect(() => {
        fetchDrivers();
        fetchCars();
    }, []);

    const fetchDrivers = async () => {
      try {
          const response = await axios.get('http://localhost:8080/users'); 
          const driversData = response.data.filter(user => user.role === 'Driver'); 
          setFilteredDrivers(driversData); 
      } catch (error) {
          console.error('Error fetching drivers:', error);
      }
    };

    const fetchCars = async () => {
        try {
            const response = await axios.get('http://localhost:8080/cars/available'); // Assuming this is your endpoint for cars
            setCars(response.data); // Store the available cars
        } catch (error) {
            console.error('Error fetching cars:', error);
        }
    };

    const handleSearch = (event) => {
        const value = event.target.value;
        setSearchTerm(value);

        // Filter drivers based on name, email, or NIC
        const filtered = drivers.filter(
            (driver) =>
                driver.name.toLowerCase().includes(value.toLowerCase()) ||
                driver.email.toLowerCase().includes(value.toLowerCase()) ||
                driver.nicNumber.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredDrivers(filtered);
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:8080/users/${id}`);
            setDrivers(drivers.filter(driver => driver.id !== id));
            setFilteredDrivers(filteredDrivers.filter(driver => driver.id !== id));
        } catch (error) {
            console.error('Error deleting driver:', error);
        }
    };


    const handleView = (driver) => {
      
        setSelectedDriver(driver);
        setShowViewModal(true);

        
    };

    const handleUpdate = (driver) => {
        setSelectedDriver(driver);
        setShowUpdateModal(true);
    };
    

    const handleCloseViewModal = () => {
        setShowViewModal(false);
        setSelectedDriver(null);
      };




      const handleCarAssignment = async (driver, selectedOption) => {
        if (!selectedOption) {
            alert("No car selected.");
            return;
        }
    
        try {
            const requestBody = {
                driverId: driver.userId,
                assignedCarLicensePlate: selectedOption.value,
            };
    
            console.log("Sending request:", requestBody);
    
            await axios.put(`http://localhost:8080/users/assignCarToDriver/${driver.userId}`, requestBody);

    
            alert("Car assigned successfully!");
            fetchDrivers(); // Refresh the drivers list after assignment
        } catch (error) {
            console.error("Error assigning car:", error.response?.data || error.message);
            alert("Failed to assign car.");
        }
    };
    
    

    // Define columns for the DataTable
    const columns = [
        {
            name: 'Image',
            cell: (row) => 
                row.userImage ? (
                    <img 
                        src={`data:userImage/jpg;base64,${row.userImage}`} alt="Driver" width="50" height="50" />
                ) : (
                    "No Image"
                ),
                width: '90px',
        },
        
        {
            name: 'Name',
            cell: (row) => row.name,
            sortable: true,
            width: '120px',
        },
        {
            name: 'Email',
            cell: (row) => row.email,
            sortable: true,
            width: '150px',
        },
        {
            name: 'NIC',
            cell: (row) => row.nicNumber,
            width: '110px',
        },
        {
            name: 'Contact Number',
            cell: (row) => row.contactNumber,
            width: '130px',
        },
        {
            name: 'Assigned Car',
            cell: (row) => {
                return (
                    <Select
                        options={cars.map((car) => ({
                            value: car.licensePlate,
                            label: `${car.licensePlate} - ${car.brand} - ${car.model}`,
                        }))}
                        value={
                            row.assignedCarLicensePlate
                                ? {
                                      value: row.assignedCarLicensePlate,
                                      label: `${row.assignedCarLicensePlate}`,
                                  }
                                : null
                        }
                        onChange={(selectedOption) => handleCarAssignment(row, selectedOption)}
                        placeholder="Select a Vehicle"
                        isClearable
                    />
                );
            },
            width: '190px',
        },
        
        
        
        {
            name: 'Actions',
            cell: (row) => (
                <div>
                    <Button variant="info" onClick={() => handleView(row)}>
                        <FaEye />
                    </Button>{' '}
                    <Button variant="warning" onClick={() => handleUpdate(row)}>
                        <FaEdit />
                    </Button>{' '}
                    <Button variant="danger" onClick={() => handleDelete(row.id)}>
                        <FaTrash />
                    </Button>
                </div>
            ),
            // width: '130px',
        },
    ];

    return (
        <div>
            <h2>Manage Drivers</h2>

            {/* Add Driver Button */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '15px' }}>
                <Button variant="primary" onClick={() => setShowAddModal(true)}>
                    <FaPlus /> Add Driver
                </Button>
            </div>

            {/* Search Input */}
            <input
                type="text"
                placeholder="Search by name, email, or NIC..."
                className="form-control mb-3"
                value={searchTerm}
                onChange={handleSearch}
            />

            {/* DataTable */}
            <DataTable
                columns={columns}
                data={filteredDrivers}
                pagination
                highlightOnHover
                pointerOnHover
            />

            {/* AddDriver Modal */}
            <AddDriver
                show={showAddModal}
                onHide={() => setShowAddModal(false)}
                refreshDrivers={fetchDrivers}
            />

            <ViewDriver 
            show={showViewModal} 
            onHide={handleCloseViewModal} 
            driver={selectedDriver} />
            <UpdateDriver
                show={showUpdateModal}
                handleClose={() => setShowUpdateModal(false)}
                driver={selectedDriver}
            />


        </div>
    );
};

export default ManageDriver;
