import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LOGO from '../assets/logo.jpg';
import { collection, getDocs, doc, updateDoc, query, where, setDoc } from 'firebase/firestore';
import { db } from '../../firebase'; 

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [responses, setResponses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [stats, setStats] = useState({
        totalResponses: 0,
        completedRegistrations: 0
    });
    const [showAddForm, setShowAddForm] = useState(false);
    const [newParticipant, setNewParticipant] = useState({
        name: '',
        email: '',
        message: ''
    });
    const [currentPage, setCurrentPage] = useState(1);
    const [responsesPerPage] = useState(10); 

    // function to fetch responses from Firestore
    const fetchResponses = async () => {
        try {
            setLoading(true);
            const responsesCollection = collection(db, 'formResponses');
            const responsesSnapshot = await getDocs(responsesCollection);
            
            const responsesList = [];
            let completed = 0;
            
            responsesSnapshot.forEach((docSnapshot) => {
                // this will get both the document data and ID
                const data = docSnapshot.data();
                const id = docSnapshot.id;
                
                // Handle timestamp properly for both formats
                let timestamp;
                if (data.timestamp?.timestampValue) {
                    timestamp = data.timestamp.timestampValue;
                } else if (data.timestamp instanceof Date) {
                    timestamp = data.timestamp.toISOString();
                } else if (data.timestamp) {
                    timestamp = data.timestamp;
                } else {
                    timestamp = new Date().toISOString();
                }
                
                // formatting the data 
                const formattedResponse = {
                    id: id,
                    data: {
                        name: data.name?.stringValue || data.name || 'N/A',
                        email: data.email?.stringValue || data.email || 'N/A',
                        message: data.message?.stringValue || data.message || 'N/A',
                        phone: data.phone?.stringValue || data.phone || 'N/A'
                    },
                    timestamp: timestamp,
                    completed: data.completed || false
                };
                
                responsesList.push(formattedResponse);
                
                if (formattedResponse.completed) {
                    completed++;
                }
            });
            
            console.log("Fetched responses:", responsesList);
            
            setResponses(responsesList);
            setStats({
                totalResponses: responsesList.length,
                completedRegistrations: completed
            });
            
            setLoading(false);
        } catch (err) {
            console.error("Error fetching responses:", err);
            setError("Failed to load responses. Please try again.");
            setLoading(false);
        }
    };

    // update registration status in Firestore
    const updateRegistrationStatus = async (responseId, completed) => {
        try {
            const responseRef = doc(db, 'formResponses', responseId);
            await updateDoc(responseRef, { completed });
            
            // update local state
            setResponses(prevResponses => 
                prevResponses.map(response => 
                    response.id === responseId ? { ...response, completed } : response
                )
            );
            
            // update stats
            setStats(prevStats => ({
                ...prevStats,
                completedRegistrations: completed 
                    ? prevStats.completedRegistrations + 1 
                    : prevStats.completedRegistrations - 1
            }));
            
        } catch (err) {
            console.error("Error updating status:", err);
            setError("Failed to update registration status. Please try again.");
        }
    };

    // add participant manually
    const handleAddParticipant = async (e) => {
        e.preventDefault();
        
        try {
            const newId = `manual-${Date.now()}`;
            
            // create a new formResponse document with proper Firestore structure
            const newResponse = {
                name: { stringValue: newParticipant.name },
                email: { stringValue: newParticipant.email },
                message: { stringValue: newParticipant.message || "Manually added participant" },
                phone: { stringValue: newParticipant.phone || "" },
                timestamp: { timestampValue: new Date().toISOString() },
                completed: false
            };
            
            // add to Firestore
            const responseRef = doc(db, 'formResponses', newId);
            await setDoc(responseRef, newResponse);
            
            // apdate local state with formatted response
            const formattedResponse = {
                id: newId,
                data: {
                    name: newParticipant.name,
                    email: newParticipant.email,
                    message: newParticipant.message || "Manually added participant",
                    phone: newParticipant.phone || ""
                },
                timestamp: new Date().toISOString(),
                completed: false
            };
            
            setResponses([...responses, formattedResponse]);
            setStats({
                ...stats,
                totalResponses: stats.totalResponses + 1
            });
            
            // reset form
            setNewParticipant({
                name: '',
                email: '',
                message: '',
                phone: ''
            });
            
            setShowAddForm(false);
        } catch (err) {
            console.error("Error adding participant:", err);
            setError("Failed to add participant. Please try again.");
        }
    };

    // search responses based on search term
    const filteredResponses = responses.filter(response => {
        if (!searchTerm) return true;
        
        const searchData = response.data;
        return Object.values(searchData).some(value => 
            value && value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        );
    });

    // pagination logic
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const Pagination = () => {
        const pageNumbers = [];
        
        for (let i = 1; i <= Math.ceil(filteredResponses.length / responsesPerPage); i++) {
            pageNumbers.push(i);
        }
        
        return (
            <nav className="flex justify-center mt-4">
                <ul className="flex space-x-2">
                    {/* Previous button */}
                    <li>
                        <button
                            onClick={() => currentPage > 1 && paginate(currentPage - 1)}
                            disabled={currentPage === 1}
                            className={`px-3 py-1 rounded ${currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gray-200 hover:bg-gray-300'}`}
                        >
                            Prev
                        </button>
                    </li>
                    
                    {/* Page numbers */}
                    {pageNumbers.map(number => (
                        <li key={number}>
                            <button
                                onClick={() => paginate(number)}
                                className={`px-3 py-1 rounded ${currentPage === number ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
                            >
                                {number}
                            </button>
                        </li>
                    ))}
                    
                    {/* Next button */}
                    <li>
                        <button
                            onClick={() => currentPage < pageNumbers.length && paginate(currentPage + 1)}
                            disabled={currentPage === pageNumbers.length || pageNumbers.length === 0}
                            className={`px-3 py-1 rounded ${currentPage === pageNumbers.length || pageNumbers.length === 0 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gray-200 hover:bg-gray-300'}`}
                        >
                            Next
                        </button>
                    </li>
                </ul>
            </nav>
        );
    };

    // Calculate current page data
    const indexOfLastResponse = currentPage * responsesPerPage;
    const indexOfFirstResponse = indexOfLastResponse - responsesPerPage;
    const currentResponses = filteredResponses.slice(indexOfFirstResponse, indexOfLastResponse);

    // load responses on component mount
    useEffect(() => {
        fetchResponses();
        
        // this is commented out to save Firebase reads i might use it later
        // const intervalId = setInterval(() => {
        //     fetchResponses();
        // }, 60000);
        
        // return () => clearInterval(intervalId);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('adminAuthenticated');
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Dashboard Header */}
            <header className="bg-white shadow">
                <div className="mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                    <div className="flex items-center">
                        <img src={LOGO} className="h-12 w-12 rounded-full mr-3" alt="Logo" />
                        <h1 className="text-lg lg:text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                    </div>
                    <div className="flex space-x-4">
                        <button
                            onClick={handleLogout}
                            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            {/* Dashboard Content */}
            <main className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Dashboard Stats */}
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-2">
                        <div className="bg-white overflow-hidden shadow rounded-lg">
                            <div className="px-4 py-5 sm:p-6">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                                        <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                        </svg>
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-500 truncate">Total Responses</dt>
                                            <dd className="text-3xl font-semibold text-gray-900">{stats.totalResponses}</dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white overflow-hidden shadow rounded-lg">
                            <div className="px-4 py-5 sm:p-6">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                                        <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-500 truncate">Completed Registration</dt>
                                            <dd className="text-3xl font-semibold text-gray-900">{stats.completedRegistrations}</dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8">
                        <div className='flex justify-between'>
                            <h2 className="text-lg font-medium text-gray-900">Participant Management</h2>

                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search participants..."
                                    className="w-64 rounded-xl border-gray-300 shadow-sm p-3 focus:border-blue-500 focus:ring-blue-500"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                        
                        {/* Action Buttons */}
                        <div className="mt-4 flex space-x-4">
                            <button
                                onClick={fetchResponses}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                Sync Responses
                            </button>
                            
                            <button
                                onClick={() => setShowAddForm(!showAddForm)}
                                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                            >
                                {showAddForm ? 'Cancel' : 'Add Participant'}
                            </button>
                        </div>
                        
                        {/* Add Participant Form */}
                        {showAddForm && (
                            <div className="mt-4 bg-white shadow overflow-hidden sm:rounded-md p-4">
                                <h3 className="text-lg font-medium text-gray-900 mb-4">Add Participant Manually</h3>
                                <form onSubmit={handleAddParticipant}>
                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                        <div>
                                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                                            <input
                                                type="text"
                                                id="name"
                                                className="mt-1 block w-full rounded-md border border-gray-900 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                                value={newParticipant.name}
                                                onChange={(e) => setNewParticipant({...newParticipant, name: e.target.value})}
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                                            <input
                                                type="email"
                                                id="email"
                                                className="mt-1 block w-full rounded-md border border-gray-900 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                                value={newParticipant.email}
                                                onChange={(e) => setNewParticipant({...newParticipant, email: e.target.value})}
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone</label>
                                            <input
                                                type="tel"
                                                id="phone"
                                                className="mt-1 block w-full rounded-md border border-gray-900 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                                value={newParticipant.phone}
                                                onChange={(e) => setNewParticipant({...newParticipant, phone: e.target.value})}
                                            />
                                        </div>
                                    </div>
                                    <div className="mt-4 flex justify-end">
                                        <button
                                            type="submit"
                                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            Save Participant
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}
                        
                        {/* Participants Table */}
                        <div className="mt-4 bg-white shadow overflow-hidden sm:rounded-md">
                            {loading ? (
                                <div className="p-4 text-center">
                                    <p>Loading participants...</p>
                                </div>
                            ) : error ? (
                                <div className="p-4 text-center text-red-600">
                                    <p>{error}</p>
                                </div>
                            ) : filteredResponses.length === 0 ? (
                                <div className="p-4 text-center">
                                    <p>No participants found.</p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Message</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {currentResponses.map((response, index) => (
                                                <tr key={response.id || index}>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                        {response.data?.name || 'N/A'}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {response.data?.email || 'N/A'}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {response.data?.message || 'N/A'}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {new Date(response.timestamp).toLocaleDateString()}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${response.completed ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                                            {response.completed ? 'Completed' : 'Pending'}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                        <button
                                                            onClick={() => updateRegistrationStatus(response.id, !response.completed)}
                                                            className={`px-3 py-1 rounded-md ${response.completed ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' : 'bg-green-100 text-green-800 hover:bg-green-200'}`}
                                                        >
                                                            {response.completed ? 'Mark Incomplete' : 'Mark Complete'}
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    
                                    {/* Pagination component */}
                                    {!loading && !error && filteredResponses.length > 0 && <Pagination />}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;