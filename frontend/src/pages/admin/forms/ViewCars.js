import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import axios from "axios";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";
import UpdateCar from "./models/UpdateCar";
import LoadCar from "./models/LoadCar";

function ViewCars() {
  const [cars, setCars] = useState([]);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedCar, setSelectedCar] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [filteredCars, setFilteredCars] = useState([]); // Stores filtered results
  const [searchTerm, setSearchTerm] = useState(""); // Stores search input

  const handleView = (car) => {
    setSelectedCar(car);
    setShowViewModal(true);
  };

  const handleCloseViewModal = () => {
    setShowViewModal(false);
    setSelectedCar(null);
  };


  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = () => {
    axios
      .get("http://localhost:8080/cars")
      .then((response) => {
        console.log("Fetched Cars:", response.data); // Debug log
        setCars(response.data);
        setFilteredCars(response.data);
      })
      .catch((error) => console.error("Error fetching cars:", error));
  };

    // Handle search input change
    const handleSearch = (event) => {
      const value = event.target.value;
      setSearchTerm(value);

    // Filter cars based on brand, model, or license plate
    const filtered = cars.filter(
      (car) =>
      car.brand.toLowerCase().includes(value.toLowerCase()) ||
      car.model.toLowerCase().includes(value.toLowerCase()) ||
      car.licensePlate.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredCars(filtered);
    };


  const handleDelete = (carId) => {
    axios
      .delete(`http://localhost:8080/cars/${carId}`)
      .then((response) => {
        if (response.status === 200) {
          // Remove the deleted car from the UI
          setCars(cars.filter((car) => car.id !== carId));
          alert('Car deleted successfully!');
        }
      })
      .catch((error) => {
        console.error("Error deleting car:", error);
        alert('Failed to delete car!');
      });
  };


  // const handleAvailabilityChange = (carId, currentAvailability) => {
  //   const newAvailability = !currentAvailability; // Toggle the availability
  //   axios
  //     .put(
  //       `http://localhost:8080/cars/${carId}/available`,
  //       newAvailability,
  //       { headers: { "Content-Type": "application/json" } } // Set Content-Type header
  //     )
  //     .then((response) => {
  //       if (response.status === 200) {
  //         // Update the car availability in the state
  //         setCars(
  //           cars.map((car) =>
  //             car.id === carId ? { ...car, available: newAvailability } : car
  //           )
  //         );
  //       }
  //     })
  //     .catch((error) => {
  //       console.error("Error updating car availability:", error);
  //       alert("Failed to update car availability!");
  //     });
  // };

  const handleAvailabilityChange = (carId, currentAvailability) => {
    const newAvailability = !currentAvailability; // Toggle the availability
    axios
      .put(
        `http://localhost:8080/cars/${carId}/available`,
        newAvailability,
        { headers: { "Content-Type": "application/json" } } // Set Content-Type header
      )
      .then((response) => {
        if (response.status === 200) {
          // Update the car availability in both cars and filteredCars state
          setCars(
            cars.map((car) =>
              car.id === carId ? { ...car, available: newAvailability } : car
            )
          );
          setFilteredCars(
            filteredCars.map((car) =>
              car.id === carId ? { ...car, available: newAvailability } : car
            )
          );
        }
      })
      .catch((error) => {
        console.error("Error updating car availability:", error);
        alert("Failed to update car availability!");
      });
  };
  

  

  const handleEdit = (car) => {
    setSelectedCar(car);
    setShowUpdateModal(true);
  };

  const handleCloseUpdateModal = () => {
    setShowUpdateModal(false);
    setSelectedCar(null);
    fetchCars(); // Refresh car list after update
  };
  




  // Define table columns
  const columns = [
    {
      name: "Brand",
      selector: (row) => row.brand,
      sortable: true,
    },
    {
      name: "Model",
      selector: (row) => row.model,
      sortable: true,
    },
    {
      name: "License Plate",
      selector: (row) => row.licensePlate,
    },
    {
      name: "Image",
      cell: (row) =>
        row.image ? (
          <img src={`data:image/png;base64,${row.image}`} alt="Car" width="50" height="30" />
        ) : (
          "No Image"
        ),
    },
    {
      name: "Availability",
      cell: (row) => (
        <input
          type="checkbox"
          checked={row.available}
          onChange={() => handleAvailabilityChange(row.id, row.available)}
        />
      ),
    },
    {
      name: "Actions",
      cell: (row) => (
        <div>
          <button className="btn btn-info btn-sm me-2" onClick={() => handleView(row)}>
            <FaEye />
          </button>
          <button className="btn btn-warning btn-sm me-2" onClick={() => handleEdit(row)}>
            <FaEdit />
          </button>
          <button className="btn btn-danger btn-sm" onClick={() => handleDelete(row.id)}>
            <FaTrash />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="container mt-4">
      <h2>All Cars</h2>
      {/* Search Input */}
      <input
        type="text"
        placeholder="Search by brand, model, or license plate..."
        className="form-control mb-3"
        value={searchTerm}
        onChange={handleSearch}
      />
      <DataTable columns={columns} data={filteredCars} pagination />
       {/* Update Car Modal */}
       <UpdateCar show={showUpdateModal} handleClose={handleCloseUpdateModal} car={selectedCar} />
        {/* View Car Modal */}
      <LoadCar show={showViewModal} handleClose={handleCloseViewModal} car={selectedCar} />
    </div>
  );
}

export default ViewCars;
