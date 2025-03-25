import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const ViewCustomer = ({ show, onHide, customer }) => {
    if (!customer) return null;

    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title>Customer Details</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="mb-3">
                    <h5>{customer.name}</h5>
                    <p className="text-muted">{customer.email}</p>
                </div>

                <div className="mb-3">
                    <p><strong>Contact Number:</strong> {customer.contactNumber}</p>
                    <p><strong>NIC Number:</strong> {customer.nicNumber || 'N/A'}</p>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ViewCustomer;