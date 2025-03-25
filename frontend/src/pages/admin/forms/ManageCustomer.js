// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import DataTable from 'react-data-table-component';
// import { FaEye, FaEdit, FaTrash } from 'react-icons/fa';
// import { Button } from 'react-bootstrap';


// import ViewCustomer from './models/ViewCustomer';
// import UpdateCustomer from './models/UpdateCustomer';

// const ManageCustomer = () => {
//     const [customers, setCustomers] = useState([]);
//     const [filteredCustomers, setFilteredCustomers] = useState([]);
//     const [searchTerm, setSearchTerm] = useState("");
//     const [selectedCustomer, setSelectedCustomer] = useState(null);
//     const [showViewModal, setShowViewModal] = useState(false);
//     const [showUpdateModal, setShowUpdateModal] = useState(false);

//     useEffect(() => {
//         fetchCustomers();
//     }, []);

//     const fetchCustomers = async () => {
//         try {
//             const response = await axios.get('http://localhost:8080/users');
//             const customersData = response.data.filter(user => user.role === 'Customer');
//             setCustomers(customersData);
//             setFilteredCustomers(customersData);
//         } catch (error) {
//             console.error('Error fetching customers:', error);
//         }
//     };

//     const handleSearch = (event) => {
//         const value = event.target.value;
//         setSearchTerm(value);

//         const filtered = customers.filter(
//             (customer) =>
//                 customer.name.toLowerCase().includes(value.toLowerCase()) ||
//                 customer.email.toLowerCase().includes(value.toLowerCase()) ||
//                 (customer.nicNumber && customer.nicNumber.toLowerCase().includes(value.toLowerCase()))
//         );
//         setFilteredCustomers(filtered);
//     };

//     const handleDelete = async (id) => {
//         try {
//             await axios.delete(`http://localhost:8080/users/${id}`);
//             setCustomers(customers.filter(customer => customer.id !== id));
//             setFilteredCustomers(filteredCustomers.filter(customer => customer.id !== id));
//             alert('Customer deleted successfully');
//         } catch (error) {
//             console.error('Error deleting customer:', error);
//             alert('Failed to delete customer');
//         }
//     };

//     const handleView = (customer) => {
//         setSelectedCustomer(customer);
//         setShowViewModal(true);
//     };

//     const handleUpdate = (customer) => {
//         setSelectedCustomer(customer);
//         setShowUpdateModal(true);
//     };

//     const handleCloseViewModal = () => {
//         setShowViewModal(false);
//         setSelectedCustomer(null);
//     };

//     const columns = [
//         {
//             name: 'Name',
//             selector: row => row.name,
//             sortable: true,
//         },
//         {
//             name: 'Email',
//             selector: row => row.email,
//             sortable: true,
//         },
//         {
//             name: 'Contact Number',
//             selector: row => row.contactNumber,
//         },
//         {
//             name: 'NIC Number',
//             selector: row => row.nicNumber || 'N/A',
//         },
//         {
//             name: 'Actions',
//             cell: (row) => (
//                 <div>
//                     <Button variant="info" onClick={() => handleView(row)} className="me-2">
//                         <FaEye />
//                     </Button>
//                     <Button variant="warning" onClick={() => handleUpdate(row)} className="me-2">
//                         <FaEdit />
//                     </Button>
//                     <Button variant="danger" onClick={() => handleDelete(row.id)}>
//                         <FaTrash />
//                     </Button>
//                 </div>
//             ),
//         },
//     ];

//     return (
//         <div className="p-4">
//             <h2 className="mb-4">Manage Customers</h2>

//             <div className="d-flex justify-content-between mb-4">
//                 <div className="w-50">
//                     <input
//                         type="text"
//                         placeholder="Search by name, email, or NIC..."
//                         className="form-control"
//                         value={searchTerm}
//                         onChange={handleSearch}
//                     />
//                 </div>
//             </div>

//             <DataTable
//                 columns={columns}
//                 data={filteredCustomers}
//                 pagination
//                 highlightOnHover
//                 striped
//                 responsive
//                 noDataComponent="No customers found"
//             />

//             {/* Modals */}


//             <ViewCustomer 
//                 show={showViewModal}
//                 onHide={handleCloseViewModal}
//                 customer={selectedCustomer}
//             />

//             <UpdateCustomer
//                 show={showUpdateModal}
//                 handleClose={() => setShowUpdateModal(false)}
//                 customer={selectedCustomer}
//                 refreshCustomers={fetchCustomers}
//             />
//         </div>
//     );
// };

// export default ManageCustomer;

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DataTable from 'react-data-table-component';
import { FaEye, FaEdit, FaTrash, FaSpinner } from 'react-icons/fa';
import { Button, Modal } from 'react-bootstrap';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import ViewCustomer from './models/ViewCustomer';
import UpdateCustomer from './models/UpdateCustomer';

const ManageCustomer = () => {
    const [customers, setCustomers] = useState([]);
    const [filteredCustomers, setFilteredCustomers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [showViewModal, setShowViewModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [customerToDelete, setCustomerToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        fetchCustomers();
    }, []);

    const fetchCustomers = async () => {
        try {
            const response = await axios.get('http://localhost:8080/users');
            const customersData = response.data.filter(user => user.role === 'Customer');
            setCustomers(customersData);
            setFilteredCustomers(customersData);
        } catch (error) {
            console.error('Error fetching customers:', error);
            toast.error('Failed to fetch customers');
        }
    };

    const handleSearch = (event) => {
        const value = event.target.value;
        setSearchTerm(value);

        const filtered = customers.filter(
            (customer) =>
                customer.name.toLowerCase().includes(value.toLowerCase()) ||
                customer.email.toLowerCase().includes(value.toLowerCase()) ||
                (customer.nicNumber && customer.nicNumber.toLowerCase().includes(value.toLowerCase()))
        );
        setFilteredCustomers(filtered);
    };

    const confirmDelete = (id) => {
        setCustomerToDelete(id);
        setShowDeleteModal(true);
    };

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            await axios.delete(`http://localhost:8080/users/${customerToDelete}`);
            setCustomers(customers.filter(customer => customer.id !== customerToDelete));
            setFilteredCustomers(filteredCustomers.filter(customer => customer.id !== customerToDelete));
            toast.success('Customer deleted successfully');
        } catch (error) {
            console.error('Error deleting customer:', error);
            toast.error('Failed to delete customer');
        } finally {
            setIsDeleting(false);
            setShowDeleteModal(false);
            setCustomerToDelete(null);
        }
    };

    const handleView = (customer) => {
        setSelectedCustomer(customer);
        setShowViewModal(true);
    };

    const handleUpdate = (customer) => {
        setSelectedCustomer(customer);
        setShowUpdateModal(true);
    };

    const handleCloseViewModal = () => {
        setShowViewModal(false);
        setSelectedCustomer(null);
    };

    const columns = [
        {
            name: 'Name',
            selector: row => row.name,
            sortable: true,
        },
        {
            name: 'Email',
            selector: row => row.email,
            sortable: true,
        },
        {
            name: 'Contact Number',
            selector: row => row.contactNumber,
        },
        {
            name: 'NIC Number',
            selector: row => row.nicNumber || 'N/A',
        },
        {
            name: 'Actions',
            cell: (row) => (
                <div>
                    <Button variant="info" onClick={() => handleView(row)} className="me-2">
                        <FaEye />
                    </Button>
                    <Button variant="warning" onClick={() => handleUpdate(row)} className="me-2">
                        <FaEdit />
                    </Button>
                    <Button variant="danger" onClick={() => confirmDelete(row.id)}>
                        <FaTrash />
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <div className="p-4">
            <h2 className="mb-4">Manage Customers</h2>

            <div className="d-flex justify-content-between mb-4">
                <div className="w-50">
                    <input
                        type="text"
                        placeholder="Search by name, email, or NIC..."
                        className="form-control"
                        value={searchTerm}
                        onChange={handleSearch}
                    />
                </div>
            </div>

            <DataTable
                columns={columns}
                data={filteredCustomers}
                pagination
                highlightOnHover
                striped
                responsive
                noDataComponent="No customers found"
            />

            {/* View Customer Modal */}
            <ViewCustomer 
                show={showViewModal}
                onHide={handleCloseViewModal}
                customer={selectedCustomer}
            />

            {/* Update Customer Modal */}
            <UpdateCustomer
                show={showUpdateModal}
                handleClose={() => setShowUpdateModal(false)}
                customer={selectedCustomer}
                refreshCustomers={fetchCustomers}
            />

            {/* Delete Confirmation Modal */}
            <Modal show={showDeleteModal} onHide={() => !isDeleting && setShowDeleteModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Delete</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to delete this customer? This action cannot be undone.
                </Modal.Body>
                <Modal.Footer>
                    <Button 
                        variant="secondary" 
                        onClick={() => setShowDeleteModal(false)}
                        disabled={isDeleting}
                    >
                        Cancel
                    </Button>
                    <Button 
                        variant="danger" 
                        onClick={handleDelete}
                        disabled={isDeleting}
                    >
                        {isDeleting ? (
                            <>
                                <FaSpinner className="fa-spin me-2" />
                                Deleting...
                            </>
                        ) : 'Delete'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default ManageCustomer;