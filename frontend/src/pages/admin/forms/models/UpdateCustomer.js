import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios';
import { toast } from 'react-toastify';

const UpdateCustomer = ({ show, handleClose, customer, refreshCustomers }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        contactNumber: '',
        nicNumber: '',
        password: ''
    });

    useEffect(() => {
        if (customer) {
            setFormData({
                name: customer.name,
                email: customer.email,
                contactNumber: customer.contactNumber,
                nicNumber: customer.nicNumber || '',
                password: ''
            });
        }
    }, [customer]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            await axios.put(`http://localhost:8080/users/customers/${customer.id}`, formData);
            refreshCustomers();
            handleClose();
            toast.success('Customer updated successfully!');
        } catch (error) {
            console.error('Error updating customer:', error);
            toast.error(error.response?.data?.message || 'Failed to update customer');
        }
    };

    return (
        
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Update Customer</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Contact Number</Form.Label>
                        <Form.Control
                            type="text"
                            name="contactNumber"
                            value={formData.contactNumber}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>NIC Number (Optional)</Form.Label>
                        <Form.Control
                            type="text"
                            name="nicNumber"
                            value={formData.nicNumber}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>New Password (Leave blank to keep current)</Form.Label>
                        <Form.Control
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Enter new password"
                        />
                    </Form.Group>

                    <Button variant="primary" type="submit" className="w-100">
                        Update Customer
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default UpdateCustomer;