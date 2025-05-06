import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LOGO from '../assets/logo.jpg';
import { collection, getDocs, doc, updateDoc, query, where, setDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import Papa from 'papaparse';

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
        gender: '',
        organization: '',
        phone: '',
        city: '',
        state: '',
        expectation: '',
        referral: ''
    });
    const [currentPage, setCurrentPage] = useState(1);
    const [responsesPerPage, setResponsesPerPage] = useState(10);
    const [csvFile, setCsvFile] = useState(null);
    const [csvUploadStatus, setCsvUploadStatus] = useState('');

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
                        gender: data.gender?.stringValue || data.gender || 'N/A',
                        organization: data.organization?.stringValue || data.organization || 'N/A',
                        phone: data.phone?.stringValue || data.phone || 'N/A',
                        city: data.city?.stringValue || data.city || 'N/A',
                        state: data.state?.stringValue || data.state || 'N/A',
                        expectation: data.expectation?.stringValue || data.expectation || 'N/A',
                        referral: data.referral?.stringValue || data.referral || 'N/A'
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
                gender: { stringValue: newParticipant.gender || "" },
                organization: { stringValue: newParticipant.organization || "" },
                phone: { stringValue: newParticipant.phone || "" },
                city: { stringValue: newParticipant.city || "" },
                state: { stringValue: newParticipant.state || "" },
                expectation: { stringValue: newParticipant.expectation || "" },
                referral: { stringValue: newParticipant.referral || "" },
                timestamp: { timestampValue: new Date().toISOString() },
                completed: false
            };

            // add to Firestore
            const responseRef = doc(db, 'formResponses', newId);
            await setDoc(responseRef, newResponse);

            // update local state with formatted response
            const formattedResponse = {
                id: newId,
                data: {
                    name: newParticipant.name,
                    email: newParticipant.email,
                    gender: newParticipant.gender || "",
                    organization: newParticipant.organization || "",
                    phone: newParticipant.phone || "",
                    city: newParticipant.city || "",
                    state: newParticipant.state || "",
                    expectation: newParticipant.expectation || "",
                    referral: newParticipant.referral || ""
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
                gender: '',
                organization: '',
                phone: '',
                city: '',
                state: '',
                expectation: '',
                referral: ''
            });

            setShowAddForm(false);
        } catch (err) {
            console.error("Error adding participant:", err);
            setError("Failed to add participant. Please try again.");
        }
    };

    // Handle CSV file input change
    const handleFileChange = (e) => {
        setCsvFile(e.target.files[0]);
        setCsvUploadStatus('');
    };

    // Process and upload CSV data
    const handleCsvUpload = async () => {
        if (!csvFile) {
            setCsvUploadStatus('Please select a CSV file first.');
            return;
        }

        setCsvUploadStatus('Processing CSV file...');

        // Parse CSV file
        Papa.parse(csvFile, {
            header: true,
            skipEmptyLines: true,
            complete: async (results) => {
                try {
                    if (results.errors.length > 0) {
                        console.error("CSV parsing errors:", results.errors);
                        setCsvUploadStatus(`Error parsing CSV: ${results.errors[0].message}`);
                        return;
                    }

                    const { data } = results;
                    console.log("CSV Data:", data);

                    if (data.length === 0) {
                        setCsvUploadStatus('No data found in CSV file.');
                        return;
                    }

                    let successCount = 0;
                    let errorCount = 0;


                    for (const row of data) {
                        try {
                            const participant = {
                                name: row['Name'] || '',
                                email: row['Email Address'] || '',
                                gender: row['Gender'] || '',
                                organization: row['Church/Organization'] || '',
                                phone: row['Phone No.'] || '',
                                city: row['City'] || '',
                                state: row['State'] || '',
                                expectation: row['What do you anticipate from the Hangout?'] || '',
                                referral: row['How did you hear about this program'] || ''
                            };

                            // Generate ID for this record
                            const newId = `csv-${Date.now()}-${successCount}`;

                            // thsi will create Firestore document
                            const newResponse = {
                                name: { stringValue: participant.name },
                                email: { stringValue: participant.email },
                                gender: { stringValue: participant.gender },
                                organization: { stringValue: participant.organization },
                                phone: { stringValue: participant.phone },
                                city: { stringValue: participant.city },
                                state: { stringValue: participant.state },
                                expectation: { stringValue: participant.expectation },
                                referral: { stringValue: participant.referral },
                                timestamp: { timestampValue: new Date().toISOString() },
                                completed: false
                            };

                            // add to Firestore
                            const responseRef = doc(db, 'formResponses', newId);
                            await setDoc(responseRef, newResponse);

                            successCount++;
                        } catch (err) {
                            console.error("Error adding CSV row:", err);
                            errorCount++;
                        }
                    }

                    // Refresh data
                    await fetchResponses();

                    // Reset file input
                    setCsvFile(null);
                    document.getElementById('csv-file').value = '';

                    setCsvUploadStatus(`Upload complete: ${successCount} added, ${errorCount} failed.`);
                } catch (err) {
                    console.error("Error processing CSV:", err);
                    setCsvUploadStatus(`Error: ${err.message}`);
                }
            },
            error: (error) => {
                console.error("CSV parsing error:", error);
                setCsvUploadStatus(`Error parsing CSV: ${error}`);
            }
        });
    };

    // search responses based on search term
    const filteredResponses = responses.filter(response => {
        response.data.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            response.data.email.toLowerCase().includes(searchTerm.toLowerCase())
        // response.data.phone.toLowerCase().includes(searchTerm.toLowerCase())
        if (!searchTerm) return true;

        const searchData = response.data;
        return Object.values(searchData).some(value =>
            value && value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        );

    });



    // pagination logic
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const Pagination = () => {
        const totalPages = Math.ceil(filteredResponses.length / responsesPerPage);
        const visiblePages = [];

        // Always show first page
        if (currentPage > 2) {
            visiblePages.push(1);
            if (currentPage > 3) visiblePages.push('...');
        }

        // Show currentPage - 1, currentPage, currentPage + 1
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
            if (i > 1 && i < totalPages) {
                visiblePages.push(i);
            }
        }

        // Always show last page
        if (currentPage < totalPages - 1) {
            if (currentPage < totalPages - 2) visiblePages.push('...');
            visiblePages.push(totalPages);
        }

        return (
            <nav className="flex justify-center mt-4">
                <ul className="flex space-x-2">
                    <li>
                        <button
                            onClick={() => paginate(currentPage - 1)}
                            disabled={currentPage === 1}
                            className={`px-3 py-1 rounded ${currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gray-200 hover:bg-gray-300'}`}
                        >
                            Prev
                        </button>
                    </li>

                    {visiblePages.map((number, index) => (
                        <li key={index}>
                            {number === '...' ? (
                                <span className="px-3 py-1 text-gray-500">...</span>
                            ) : (
                                <button
                                    onClick={() => paginate(number)}
                                    className={`px-3 py-1 rounded ${currentPage === number ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
                                >
                                    {number}
                                </button>
                            )}
                        </li>
                    ))}

                    <li>
                        <button
                            onClick={() => paginate(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className={`px-3 py-1 rounded ${currentPage === totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gray-200 hover:bg-gray-300'}`}
                        >
                            Next
                        </button>
                    </li>
                </ul>
            </nav>
        );
    };

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
                        <h1 className="text-sm lg:text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                    </div>
                    <div className="flex space-x-4">
                        <button
                            onClick={handleLogout}
                            className="px-4 py-2 bg-red-600 text-sm lg:text-lg text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
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
                        </div>

                        {/* CSV Upload Section */}
                        <div className='flex  w-full gap-x-10 items-center justify-center'>
                            <div className="mt-4 bg-white shadow overflow-hidden w-full sm:rounded-md p-4">
                                <h3 className="text-lg font-medium text-gray-900 mb-4">Import Participants from CSV</h3>
                                <div className="flex flex-col md:flex-row gap-4 items-center">
                                    <div className="flex-grow">
                                        <input
                                            type="file"
                                            id="csv-file"
                                            accept=".csv"
                                            onChange={handleFileChange}
                                            className="block w-full text-sm text-gray-500
                                        file:mr-4 file:py-2 file:px-4
                                        file:rounded-md file:border-0
                                        file:text-sm file:font-medium
                                        file:bg-blue-50 file:text-blue-700
                                        hover:file:bg-blue-100"
                                        />

                                    </div>
                                    <div>
                                        <button
                                            onClick={handleCsvUpload}
                                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            disabled={!csvFile}
                                        >
                                            Upload CSV
                                        </button>
                                    </div>
                                </div>
                                {csvUploadStatus && (
                                    <div className={`mt-2 p-2 text-sm rounded ${csvUploadStatus.includes('Error') ? 'bg-red-100 text-red-700' : csvUploadStatus.includes('complete') ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                                        {csvUploadStatus}
                                    </div>
                                )}
                            </div>

                            <div className='flex space-y-4 w-full justify-end flex-col items-end'>
                                <div>
                                    <button
                                        onClick={fetchResponses}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        Sync Responses
                                    </button>
                                </div>

                                <div>
                                    <button
                                        onClick={() => setShowAddForm(!showAddForm)}
                                        className={`px-4 py-2 bg-green-600 text-white rounded-md ${showAddForm ? 'bg-red-500 hover:bg-red-700 border-red-500 focus:ring-red-700' : 'bg-green-600 hover:bg-green-700 focus:ring-green-500'}  focus:outline-none focus:ring-2 `}
                                    >
                                        {showAddForm ? 'Cancel' : 'Add Participant'}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="mt-4 justify-center items-center flex space-x-4">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search participants..."
                                    className="lg:w-64 rounded-xl w-full border-gray-300 shadow-sm p-3 focus:border-blue-500 focus:ring-blue-500"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                            </div>

                            <div className='w-full flex justify-end'>
                                <select onChange={(e) => setResponsesPerPage(Number(e.target.value))} value={responsesPerPage}>
                                    <option value={5}>5</option>
                                    <option value={10}>10</option>
                                    <option value={20}>20</option>
                                    <option value={30}>30</option>
                                </select>
                            </div>


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
                                                className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                                value={newParticipant.name}
                                                onChange={(e) => setNewParticipant({ ...newParticipant, name: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                                            <input
                                                type="email"
                                                id="email"
                                                className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                                value={newParticipant.email}
                                                onChange={(e) => setNewParticipant({ ...newParticipant, email: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="gender" className="block text-sm font-medium text-gray-700">Gender</label>
                                            <select
                                                id="gender"
                                                className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                                value={newParticipant.gender}
                                                onChange={(e) => setNewParticipant({ ...newParticipant, gender: e.target.value })}
                                            >
                                                <option value="">Select Gender</option>
                                                <option value="Male">Male</option>
                                                <option value="Female">Female</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label htmlFor="organization" className="block text-sm font-medium text-gray-700">Church/Organization</label>
                                            <input
                                                type="text"
                                                id="organization"
                                                className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                                value={newParticipant.organization}
                                                onChange={(e) => setNewParticipant({ ...newParticipant, organization: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone No.</label>
                                            <input
                                                type="tel"
                                                id="phone"
                                                className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                                value={newParticipant.phone}
                                                onChange={(e) => setNewParticipant({ ...newParticipant, phone: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="city" className="block text-sm font-medium text-gray-700">City</label>
                                            <input
                                                type="text"
                                                id="city"
                                                className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                                value={newParticipant.city}
                                                onChange={(e) => setNewParticipant({ ...newParticipant, city: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="state" className="block text-sm font-medium text-gray-700">State</label>
                                            <input
                                                type="text"
                                                id="state"
                                                className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                                value={newParticipant.state}
                                                onChange={(e) => setNewParticipant({ ...newParticipant, state: e.target.value })}
                                            />
                                        </div>
                                        <div className="sm:col-span-2">
                                            <label htmlFor="expectation" className="block text-sm font-medium text-gray-700">What do you anticipate from the Hangout?</label>
                                            <textarea
                                                id="expectation"
                                                rows="2"
                                                className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                                value={newParticipant.expectation}
                                                onChange={(e) => setNewParticipant({ ...newParticipant, expectation: e.target.value })}
                                            ></textarea>
                                        </div>
                                        <div className="sm:col-span-2">
                                            <label htmlFor="referral" className="block text-sm font-medium text-gray-700">How did you hear about this program?</label>
                                            <select
                                                id="referral"
                                                className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                                value={newParticipant.referral}
                                                onChange={(e) => setNewParticipant({ ...newParticipant, referral: e.target.value })}
                                            >
                                                <option value="">Select an option</option>
                                                <option value="Social Media">Social Media</option>
                                                <option value="Friend/Family">Friend/Family</option>
                                                <option value="Church">Church</option>
                                                <option value="Other">Other platforms</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="mt-4 flex justify-end">
                                        <button
                                            type="submit"
                                            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">S/N</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gender</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Organization</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {currentResponses.map((response, index) => (
                                                <tr key={response.id || index}>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {(currentPage - 1) * responsesPerPage + index + 1}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                        {response.data?.name || 'N/A'}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {response.data?.email || 'N/A'}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {response.data?.gender || 'N/A'}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {response.data?.organization || 'N/A'}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {response.data?.phone || 'N/A'}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {response.data?.city ? `${response.data.city}, ${response.data?.state || ''}` : 'N/A'}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {new Date(response.timestamp).toLocaleDateString()}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${response.completed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                            {response.completed ? 'Checked In' : 'Pending'}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                        <button
                                                            onClick={() => updateRegistrationStatus(response.id, !response.completed)}
                                                            className={`px-3 py-1 rounded-md ${response.completed ? 'bg-green-100 text-green-800 hover:bg-green-200' : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'}`}
                                                        >
                                                            {response.completed ? 'Registration Completed' : 'Registration Incomplete'}
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