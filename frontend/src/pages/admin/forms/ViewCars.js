import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import axios from "axios";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";

function ViewCars() {
  const [cars, setCars] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8080/cars")
      .then((response) => {
        console.log("Fetched Cars:", response.data); // Debug log
        setCars(response.data);
      })
      .catch((error) => console.error("Error fetching cars:", error));
  }, []);


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
      name: "Actions",
      cell: (row) => (
        <div>
          <button className="btn btn-info btn-sm me-2">
            <FaEye />
          </button>
          <button className="btn btn-warning btn-sm me-2">
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
      <DataTable columns={columns} data={cars} pagination />
    </div>
  );
}

export default ViewCars;
