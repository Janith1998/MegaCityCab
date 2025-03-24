import React from "react";
import { Button, Modal } from "react-bootstrap";
import jsPDF from "jspdf";
//import "jspdf-autotable";

function BillComponent({ bookingData, onConfirm, onCancel, routeDetails }) {
  const handleDownloadBill = () => {
    const doc = new jsPDF();
    
    // Header Section
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("MegaCity Cab", 105, 20, { align: "center" });
    doc.setFontSize(14);
    doc.text("Booking Invoice", 105, 30, { align: "center" });

    // Contact Info
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text("Contact us: 84653864", 15, 40);
    doc.text("Email: info@megacity.lk", 105, 40);
    doc.text("Address: galeehddddfjddjhf", 180, 40);

    // Separator line
    doc.setDrawColor(200, 200, 200);
    doc.line(15, 45, 195, 45);

    // Booking Details
    doc.setFontSize(12);
    doc.text(`Customer: ${localStorage.getItem('userName') || bookingData.userId}`, 20, 55);
    doc.text(`Date: ${new Date(bookingData.pickupTime).toLocaleDateString()}`, 20, 65);
    doc.text(`Pickup Time: ${new Date(bookingData.pickupTime).toLocaleTimeString()}`, 20, 75);
    doc.text(`Pickup Location: ${bookingData.pickupLocation}`, 20, 85);
    doc.text(`Dropoff Location: ${bookingData.dropoffLocation}`, 20, 95);
    doc.text(`Distance: ${routeDetails?.distance || 'N/A'} km`, 20, 105);
    doc.text(`Estimated Arrival: ${routeDetails?.estimatedArrivalTime || 'N/A'}`, 20, 115);

    // Table with booking details
    doc.autoTable({
      startY: 125,
      head: [["Description", "Distance", "Arrival Time", "Price", "Total"]],
      body: [
        [
          "Ride Booking",
          `${routeDetails?.distance || 'N/A'} km`,
          routeDetails?.estimatedArrivalTime || 'N/A',
          `Rs ${bookingData.price}`,
          `Rs ${bookingData.price}`
        ]
      ],
      theme: "striped",
      headStyles: { 
        fillColor: [30, 144, 255], 
        textColor: [255, 255, 255],
        fontSize: 10
      },
      styles: { 
        fontSize: 10, 
        cellPadding: 3,
        valign: 'middle'
      },
      margin: { left: 15, right: 15 },
      columnStyles: {
        0: { cellWidth: 'auto' },
        1: { cellWidth: 'auto' },
        2: { cellWidth: 'auto' },
        3: { cellWidth: 'auto' },
        4: { cellWidth: 'auto' }
      }
    });

    // Total amount
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text(`Total Amount: Rs ${bookingData.price}`, 150, doc.lastAutoTable.finalY + 10);
    
    // Footer
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("Thank you for choosing MegaCity Cab!", 105, doc.lastAutoTable.finalY + 20, { align: "center" });
    
    doc.save("megacity_booking_invoice.pdf");
  };

  return (
    <Modal show={true} onHide={onCancel} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Booking Invoice</Modal.Title>
      </Modal.Header>
      <Modal.Body className="p-4">
        <div className="border p-4 rounded shadow bg-gray-50">
          {/* Header Section */}
          <div className="flex justify-between items-center mb-4">
            <div className="text-left">
              <h2 className="text-xl font-bold">MegaCity Cab</h2>
              <p className="text-sm text-gray-600">Booking Invoice</p>
            </div>
            
            <div className="h-16 border-l border-gray-300 mx-4"></div>
            
            <div className="text-right">
              <p className="text-sm">Contact us: 84653864</p>
              <p className="text-sm">Email: info@megacity.lk</p>
              <p className="text-sm">Address: galeehfjddjhf</p>
            </div>
          </div>

          <hr className="my-2" />

          {/* Booking Details */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p><strong>Customer:</strong> {localStorage.getItem('userName') || bookingData.userId}</p>
              <p><strong>Date:</strong> {new Date(bookingData.pickupTime).toLocaleDateString()}</p>
              <p><strong>Pickup Time:</strong> {new Date(bookingData.pickupTime).toLocaleTimeString()}</p>
            </div>
            <div>
              <p><strong>Pickup:</strong> {bookingData.pickupLocation}</p>
              <p><strong>Dropoff:</strong> {bookingData.dropoffLocation}</p>
              <p><strong>Distance:</strong> {routeDetails?.distance || 'Calculating...'} km</p>
              <p><strong>Est. Arrival:</strong> {routeDetails?.estimatedArrivalTime || 'Calculating...'}</p>
            </div>
          </div>

          {/* Booking Table */}
          <table className="w-full text-sm border-collapse border border-gray-300 mb-4">
            <thead>
              <tr className="bg-blue-500 text-white">
                <th className="border border-gray-300 p-2">Description</th>
                <th className="border border-gray-300 p-2">Distance</th>
                <th className="border border-gray-300 p-2">Arrival Time</th>
                <th className="border border-gray-300 p-2">Price</th>
                <th className="border border-gray-300 p-2">Total</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 p-2">Ride Booking</td>
                <td className="border border-gray-300 p-2">{routeDetails?.distance || 'N/A'} km</td>
                <td className="border border-gray-300 p-2">{routeDetails?.estimatedArrivalTime || 'N/A'}</td>
                <td className="border border-gray-300 p-2">Rs {bookingData.price}</td>
                <td className="border border-gray-300 p-2">Rs {bookingData.price}</td>
              </tr>
            </tbody>
          </table>

          {/* Total */}
          <div className="text-right">
            <p className="font-bold">Total Amount: Rs {bookingData.price}</p>
          </div>

          <hr className="my-4" />
          
          {/* Footer */}
          <p className="text-center text-gray-600">Thank you for choosing MegaCity Cab!</p>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button variant="primary" onClick={() => { onConfirm(); handleDownloadBill(); }}>
          Confirm & Download
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default BillComponent;