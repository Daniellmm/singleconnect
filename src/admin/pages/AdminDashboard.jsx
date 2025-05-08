import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import LOGO from '../assets/logo.jpg';
import {
    collection,
    getDocs,
    doc,
    updateDoc,
    query,
    where,
    setDoc,
    limit,
    startAfter,
    orderBy,
    getCountFromServer,
    Timestamp,
    writeBatch
} from 'firebase/firestore';
import { db } from '../../firebase';
import Papa from 'papaparse';

// Component imports
import StatsCard from '../components/StatsCard';
import CsvUploadForm from '../components/CsvUploadForm';
import SearchBar from '../components/SearchBar';
import ParticipantTable from '../components/ParticipantTable';
import AddParticipantForm from '../components/AddParticipantForm';
import PaginationControls from '../components/PaginationControls';

// Utility functions
const normalizeTimestamp = (timestamp) => {
    if (!timestamp) return new Date().toISOString();

    // Handle Firestore Timestamp objects
    if (timestamp.toDate && typeof timestamp.toDate === 'function') {
        return timestamp.toDate().toISOString();
    }

    // Handle Firestore timestampValue format
    if (typeof timestamp === 'object' && timestamp.timestampValue) {
        return new Date(timestamp.timestampValue).toISOString();
    }

    // Handle Date objects
    if (timestamp instanceof Date) {
        return timestamp.toISOString();
    }

    // Handle ISO string format
    if (typeof timestamp === 'string') {
        const date = new Date(timestamp);
        if (!isNaN(date.getTime())) {
            return date.toISOString();
        }
    }

    // Handle seconds and nanoseconds format (Firestore representation)
    if (typeof timestamp === 'object' && timestamp.seconds) {
        return new Date(timestamp.seconds * 1000).toISOString();
    }

    return new Date().toISOString();
};

const formatResponse = (docSnapshot) => {
    const data = docSnapshot.data();
    const id = docSnapshot.id;

    // Handle timestamp consistently
    const timestamp = normalizeTimestamp(data.timestamp);

    return {
        id: id,
        data: {
            name: data.name || 'N/A',
            email: data.email || 'N/A',
            gender: data.gender || 'N/A',
            organization: data.organization || 'N/A',
            phone: data.phone || 'N/A',
            city: data.city || 'N/A',
            state: data.state || 'N/A',
            expectation: data.expectation || 'N/A',
            referral: data.referral || 'N/A'
        },
        timestamp: timestamp,
        completed: data.completed || false,
        // Add a dirty flag to track local changes
        isDirty: false
    };
};

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [dashboardState, setDashboardState] = useState({
        responses: [],
        loading: true,
        error: null,
        stats: {
            totalResponses: 0,
            completedRegistrations: 0
        },
        pagination: {
            currentPage: 1,
            responsesPerPage: 10,
            lastVisible: null,
            isFirstPage: true,
            pageCursors: { 1: null }
        },
        search: {
            searchTerm: '',
            isSearching: false,
            searchResults: []
        }
    });

    // Local cache of all responses
    const [allResponsesCache, setAllResponsesCache] = useState([]);
    // Track changes pending to be synced with Firestore
    const [pendingChanges, setPendingChanges] = useState({
        statusUpdates: {}, // Format: { responseId: { completed: boolean } }
        newParticipants: [] // Array of new participant objects to be added
    });

    // Flag to show if there are unsaved changes
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

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

    const [csvState, setCsvState] = useState({
        file: null,
        uploadStatus: '',
        isUploading: false
    });

    // Ref to track if we've already loaded data
    const initialDataLoaded = useRef(false);

    // Calculate stats from local cache
    const calculateStats = useCallback(() => {
        const totalResponses = allResponsesCache.length;
        const completedRegistrations = allResponsesCache.filter(r => r.completed).length;

        setDashboardState(prev => ({
            ...prev,
            stats: {
                totalResponses,
                completedRegistrations
            }
        }));
    }, [allResponsesCache]);

    // Fetch all responses once and cache them
    const fetchAllResponses = useCallback(async () => {
        try {
            setDashboardState(prev => ({ ...prev, loading: true, error: null }));

            const responsesCollection = collection(db, 'formResponses');
            const responsesQuery = query(
                responsesCollection,
                orderBy("timestamp", "desc")
            );

            const responsesSnapshot = await getDocs(responsesQuery);
            const responsesList = responsesSnapshot.docs.map(formatResponse);

            // Update our complete cache
            setAllResponsesCache(responsesList);

            // Display responses based on current pagination
            updateDisplayedResponses(responsesList);

            // Calculate stats
            setDashboardState(prev => ({
                ...prev,
                loading: false,
                stats: {
                    totalResponses: responsesList.length,
                    completedRegistrations: responsesList.filter(r => r.completed).length
                }
            }));

            initialDataLoaded.current = true;
        } catch (err) {
            console.error("Error fetching responses:", err);
            setDashboardState(prev => ({
                ...prev,
                error: `Failed to load responses: ${err.message}`,
                loading: false
            }));
        }
    }, []);

    // Update which responses are displayed based on pagination settings
    const updateDisplayedResponses = useCallback((allResponses = allResponsesCache) => {
        const startIdx = (dashboardState.pagination.currentPage - 1) * dashboardState.pagination.responsesPerPage;
        const endIdx = startIdx + dashboardState.pagination.responsesPerPage;

        // Get the slice of responses for current page
        const currentPageResponses = allResponses.slice(startIdx, endIdx);

        setDashboardState(prev => ({
            ...prev,
            responses: currentPageResponses,
            loading: false
        }));
    }, [dashboardState.pagination.currentPage, dashboardState.pagination.responsesPerPage, allResponsesCache]);

    // Load next page from local cache
    const loadNextPage = useCallback(() => {
        const newPage = dashboardState.pagination.currentPage + 1;
        const startIdx = (newPage - 1) * dashboardState.pagination.responsesPerPage;

        // Check if we have more data
        if (startIdx < allResponsesCache.length) {
            setDashboardState(prev => ({
                ...prev,
                pagination: {
                    ...prev.pagination,
                    currentPage: newPage,
                    isFirstPage: false
                }
            }));
        }
    }, [dashboardState.pagination.currentPage, dashboardState.pagination.responsesPerPage, allResponsesCache.length]);

    // Load previous page from local cache
    const loadPrevPage = useCallback(() => {
        if (dashboardState.pagination.currentPage > 1) {
            const newPage = dashboardState.pagination.currentPage - 1;

            setDashboardState(prev => ({
                ...prev,
                pagination: {
                    ...prev.pagination,
                    currentPage: newPage,
                    isFirstPage: newPage === 1
                }
            }));
        }
    }, [dashboardState.pagination.currentPage]);

    // Update registration status (locally only)
    // Update registration status (locally only)
    const updateRegistrationStatus = useCallback((responseId, completed) => {
        // Update in displayed responses and cache in a single batch
        setDashboardState(prev => {
            // First update the displayed responses
            const updatedResponses = prev.responses.map(response =>
                response.id === responseId ? { ...response, completed, isDirty: true } : response
            );

            // Calculate new stats based on the current allResponsesCache plus this change
            // This ensures we have accurate stats even before the cache state updates
            const updatedAllResponsesCache = allResponsesCache.map(response =>
                response.id === responseId ? { ...response, completed, isDirty: true } : response
            );

            const totalResponses = updatedAllResponsesCache.length;
            const completedRegistrations = updatedAllResponsesCache.filter(r => r.completed).length;

            // Return updated state with new responses and stats
            return {
                ...prev,
                responses: updatedResponses,
                stats: {
                    totalResponses,
                    completedRegistrations
                }
            };
        });

        // Update the cache separately
        setAllResponsesCache(prev =>
            prev.map(response =>
                response.id === responseId ? { ...response, completed, isDirty: true } : response
            )
        );

        // Add to pending changes
        setPendingChanges(prev => ({
            ...prev,
            statusUpdates: {
                ...prev.statusUpdates,
                [responseId]: { completed }
            }
        }));

        setHasUnsavedChanges(true);
    }, [allResponsesCache]);

    // Add participant to local cache
    const handleAddParticipant = useCallback((e) => {
        e.preventDefault();

        // Generate temporary ID for this record
        const tempId = `local-${Date.now()}`;

        // Create a consistent document structure
        const newResponse = {
            id: tempId,
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
            completed: false,
            isDirty: true
        };

        // Add to cache
        setAllResponsesCache(prev => [newResponse, ...prev]);

        // Add to pending changes
        setPendingChanges(prev => ({
            ...prev,
            newParticipants: [...prev.newParticipants, {
                id: tempId,
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
                }
            }]
        }));

        setHasUnsavedChanges(true);

        // Reset form
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

        // Update stats and displayed responses
        calculateStats();
        updateDisplayedResponses([newResponse, ...allResponsesCache]);

        // Show success message
        setDashboardState(prev => ({
            ...prev,
            successMessage: "Participant added locally. Click 'Sync Changes' to save to database.",
            // Auto-clear after 3 seconds
            successTimeout: setTimeout(() => {
                setDashboardState(prev => ({ ...prev, successMessage: null }));
            }, 3000)
        }));
    }, [newParticipant, calculateStats, updateDisplayedResponses, allResponsesCache]);

    // Handle CSV file upload (directly to Firestore for now)
    const handleFileChange = (e) => {
        setCsvState({
            ...csvState,
            file: e.target.files[0],
            uploadStatus: ''
        });
    };

    // Validate CSV row
    const validateCsvRow = (row) => {
        const errors = [];

        if (!row['Email Address']) {
            errors.push('Missing email address');
        } else if (!row['Email Address'].includes('@')) {
            errors.push('Invalid email format');
        }

        if (!row['Name'] || row['Name'].trim() === '') {
            errors.push('Name is required');
        }

        return errors;
    };

    // Process CSV and add to local cache
    const handleCsvUpload = useCallback(async () => {
        if (!csvState.file) {
            setCsvState(prev => ({
                ...prev,
                uploadStatus: 'Please select a CSV file first.'
            }));
            return;
        }

        setCsvState(prev => ({
            ...prev,
            uploadStatus: 'Processing CSV file...',
            isUploading: true
        }));

        // Parse CSV file
        Papa.parse(csvState.file, {
            header: true,
            skipEmptyLines: true,
            complete: async (results) => {
                try {
                    if (results.errors.length > 0) {
                        console.error("CSV parsing errors:", results.errors);
                        setCsvState(prev => ({
                            ...prev,
                            uploadStatus: `Error parsing CSV: ${results.errors[0].message}`,
                            isUploading: false
                        }));
                        return;
                    }

                    const { data } = results;

                    if (data.length === 0) {
                        setCsvState(prev => ({
                            ...prev,
                            uploadStatus: 'No data found in CSV file.',
                            isUploading: false
                        }));
                        return;
                    }

                    let successCount = 0;
                    let errorCount = 0;
                    const errorDetails = [];
                    const newParticipantsFromCsv = [];
                    const newCachedResponses = [];

                    for (let i = 0; i < data.length; i++) {
                        const row = data[i];
                        const rowIndex = i + 1; // 1-based row index for user-friendly messages

                        // Validate row
                        const validationErrors = validateCsvRow(row);
                        if (validationErrors.length > 0) {
                            errorCount++;
                            errorDetails.push(`Row ${rowIndex}: ${validationErrors.join(', ')}`);
                            continue;
                        }

                        try {
                            // Generate ID for this record
                            const tempId = `csv-local-${Date.now()}-${successCount}`;

                            const participant = {
                                name: row['Name'] || '',
                                email: row['Email Address'] || '',
                                gender: row['Gender'] || '',
                                organization: row['Church/Organization'] || '',
                                phone: row['Phone No.'] || '',
                                city: row['City'] || '',
                                state: row['State'] || '',
                                expectation: row['What do you anticipate from the Hangout?'] || '',
                                referral: row['How did you hear about this program'] || '',
                            };

                            // Add to pending changes
                            newParticipantsFromCsv.push({
                                id: tempId,
                                data: participant
                            });

                            // Add to cache in format
                            const newResponse = {
                                id: tempId,
                                data: participant,
                                timestamp: new Date().toISOString(),
                                completed: false,
                                isDirty: true
                            };

                            newCachedResponses.push(newResponse);
                            successCount++;
                        } catch (err) {
                            console.error(`Error processing CSV row ${rowIndex}:`, err);
                            errorCount++;
                            errorDetails.push(`Row ${rowIndex}: ${err.message}`);
                        }
                    }

                    // Update cache with all new participants
                    setAllResponsesCache(prev => [...newCachedResponses, ...prev]);

                    // Add to pending changes
                    setPendingChanges(prev => ({
                        ...prev,
                        newParticipants: [...prev.newParticipants, ...newParticipantsFromCsv]
                    }));

                    setHasUnsavedChanges(true);

                    // Update displayed responses
                    updateDisplayedResponses([...newCachedResponses, ...allResponsesCache]);

                    // Update stats
                    calculateStats();

                    // Reset file input
                    setCsvState(prev => ({
                        ...prev,
                        file: null,
                        uploadStatus: `CSV processed: ${successCount} added locally, ${errorCount} failed. Click 'Sync Changes' to save to database.${errorDetails.length > 0
                            ? ` First ${Math.min(3, errorDetails.length)} errors: ${errorDetails.slice(0, 3).join('; ')}${errorDetails.length > 3 ? ' (and more)' : ''
                            }`
                            : ''
                            }`,
                        isUploading: false
                    }));

                    document.getElementById('csv-file').value = '';
                } catch (err) {
                    console.error("Error processing CSV:", err);
                    setCsvState(prev => ({
                        ...prev,
                        uploadStatus: `Error: ${err.message}`,
                        isUploading: false
                    }));
                }
            },
            error: (error) => {
                console.error("CSV parsing error:", error);
                setCsvState(prev => ({
                    ...prev,
                    uploadStatus: `Error parsing CSV: ${error}`,
                    isUploading: false
                }));
            }
        });
    }, [csvState.file, updateDisplayedResponses, allResponsesCache, calculateStats]);

    // Sync all pending changes to Firestore
    const syncChangesToFirestore = useCallback(async () => {
        if (!hasUnsavedChanges) {
            setDashboardState(prev => ({
                ...prev,
                successMessage: "No changes to sync.",
                successTimeout: setTimeout(() => {
                    setDashboardState(prev => ({ ...prev, successMessage: null }));
                }, 3000)
            }));
            return;
        }

        setDashboardState(prev => ({ ...prev, loading: true }));

        try {
            // Create a batch to handle multiple writes
            const batch = writeBatch(db);

            // Process status updates
            Object.entries(pendingChanges.statusUpdates).forEach(([id, changes]) => {
                const docRef = doc(db, 'formResponses', id);
                batch.update(docRef, changes);
            });

            // Process new participants
            const timestampNow = Timestamp.now();
            pendingChanges.newParticipants.forEach((participant) => {
                // Generate permanent ID for new records
                const newId = participant.id.startsWith('local-')
                    ? `manual-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
                    : `csv-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

                const docRef = doc(db, 'formResponses', newId);
                batch.set(docRef, {
                    ...participant.data,
                    timestamp: timestampNow,
                    completed: false
                });

                // Update ID in cache to match Firestore
                setAllResponsesCache(prev =>
                    prev.map(response =>
                        response.id === participant.id
                            ? { ...response, id: newId, isDirty: false }
                            : response
                    )
                );
            });

            // Commit the batch
            await batch.commit();

            // Clear pending changes
            setPendingChanges({
                statusUpdates: {},
                newParticipants: []
            });

            // Mark everything as clean
            setAllResponsesCache(prev =>
                prev.map(response => ({ ...response, isDirty: false }))
            );

            setHasUnsavedChanges(false);

            // Update UI
            updateDisplayedResponses();

            setDashboardState(prev => ({
                ...prev,
                loading: false,
                successMessage: "All changes synced successfully to database!",
                successTimeout: setTimeout(() => {
                    setDashboardState(prev => ({ ...prev, successMessage: null }));
                }, 3000)
            }));
        } catch (err) {
            console.error("Error syncing changes to Firestore:", err);
            setDashboardState(prev => ({
                ...prev,
                loading: false,
                error: `Failed to sync changes: ${err.message}`
            }));
        }
    }, [hasUnsavedChanges, pendingChanges, updateDisplayedResponses]);

    // Optimized search functionality using local cache
    const handleSearch = useCallback(() => {
        const searchTerm = dashboardState.search.searchTerm.trim().toLowerCase();

        if (searchTerm === '') {
            updateDisplayedResponses();
            setDashboardState(prev => ({
                ...prev,
                search: {
                    ...prev.search,
                    isSearching: false
                },
                error: null
            }));
            return;
        }

        setDashboardState(prev => ({
            ...prev,
            search: {
                ...prev.search,
                isSearching: true
            },
            loading: true,
            error: null
        }));

        const filtered = allResponsesCache.filter(res => {
            if (!res.data || typeof res.data !== 'object') return false;
            return searchInObject(res.data, searchTerm);
        });

        setDashboardState(prev => ({
            ...prev,
            responses: filtered,
            loading: false,
            error: filtered.length === 0 ? `No results found for "${searchTerm}"` : null
        }));
    }, [dashboardState.search.searchTerm, allResponsesCache, updateDisplayedResponses]);

    // Helper function to search deeply through objects
    const searchInObject = (obj, searchTerm) => {
        // Base case: If obj is null or undefined
        if (obj === null || obj === undefined) {
            return false;
        }

        // If obj is a primitive type
        if (typeof obj !== 'object') {
            return String(obj).toLowerCase().includes(searchTerm);
        }

        // If obj is an array
        if (Array.isArray(obj)) {
            return obj.some(item => searchInObject(item, searchTerm));
        }

        // If obj is an object
        return Object.values(obj).some(value => searchInObject(value, searchTerm));
    };

    // Clear search and reset to pagination view
    const clearSearch = useCallback(() => {
        setDashboardState(prev => ({
            ...prev,
            search: {
                searchTerm: '',
                isSearching: false,
                searchResults: []
            }
        }));
        updateDisplayedResponses();
    }, [updateDisplayedResponses]);

    // Handle change in responses per page
    const handleResponsesPerPageChange = useCallback((e) => {
        const newValue = Number(e.target.value);
        setDashboardState(prev => ({
            ...prev,
            pagination: {
                ...prev.pagination,
                responsesPerPage: newValue,
                currentPage: 1,
                isFirstPage: true
            }
        }));
    }, []);

    // Handle search term changes
    const handleSearchTermChange = useCallback((e) => {
        setDashboardState(prev => ({
            ...prev,
            search: {
                ...prev.search,
                searchTerm: e.target.value
            }
        }));
    }, []);

    // Refresh data from Firestore
    const refreshFromFirestore = useCallback(async () => {
        if (hasUnsavedChanges) {
            if (!window.confirm("You have unsaved changes that will be lost if you refresh. Continue?")) {
                return;
            }
        }

        // Reset states
        setPendingChanges({
            statusUpdates: {},
            newParticipants: []
        });
        setHasUnsavedChanges(false);

        // Fetch fresh data
        await fetchAllResponses();

        setDashboardState(prev => ({
            ...prev,
            successMessage: "Data refreshed from database.",
            successTimeout: setTimeout(() => {
                setDashboardState(prev => ({ ...prev, successMessage: null }));
            }, 3000)
        }));
    }, [hasUnsavedChanges, fetchAllResponses]);

    // Effect to update displayed responses when pagination changes
    useEffect(() => {
        if (initialDataLoaded.current) {
            updateDisplayedResponses();
        }
    }, [dashboardState.pagination.currentPage, dashboardState.pagination.responsesPerPage, updateDisplayedResponses]);

    // Load responses on component mount
    useEffect(() => {
        fetchAllResponses();

        // Clean up timeout on component unmount
        return () => {
            if (dashboardState.successTimeout) {
                clearTimeout(dashboardState.successTimeout);
            }
        };
    }, [fetchAllResponses]);

    const handleLogout = useCallback(() => {
        if (hasUnsavedChanges) {
            if (!window.confirm("You have unsaved changes. Are you sure you want to logout?")) {
                return;
            }
        }
        localStorage.removeItem('adminAuthenticated');
        navigate('/');
    }, [navigate, hasUnsavedChanges]);

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
                        <StatsCard
                            title="Total Responses"
                            value={dashboardState.stats.totalResponses}
                            icon={
                                <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                            }
                            bgColor="bg-blue-500"
                        />
                        <StatsCard
                            title="Completed Registration"
                            value={dashboardState.stats.completedRegistrations}
                            icon={
                                <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            }
                            bgColor="bg-green-500"
                        />
                    </div>

                    <div className="mt-8">
                        <div className='flex justify-between'>
                            <h2 className="text-xl font-medium text-gray-900">Participant Management</h2>
                            {hasUnsavedChanges && (
                                <span className="text-orange-500 font-medium flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                    </svg>
                                    Unsaved Changes
                                </span>
                            )}
                        </div>

                        {/* Success Message */}
                        {dashboardState.successMessage && (
                            <div className="mt-4 p-3 bg-green-100 text-green-700 rounded-md">
                                {dashboardState.successMessage}
                            </div>
                        )}

                        {/* Error Message */}
                        {dashboardState.error && (
                            <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md">
                                {dashboardState.error}
                            </div>
                        )}

                        {/* CSV Upload Section */}
                        <div className='flex flex-col lg:flex-row w-full gap-x-10 gap-y-5 items-center justify-center'>
                            <CsvUploadForm
                                handleFileChange={handleFileChange}
                                handleCsvUpload={handleCsvUpload}
                                csvFile={csvState.file}
                                uploadStatus={csvState.uploadStatus}
                                isUploading={csvState.isUploading}
                            />

                            <div className='flex space-y-4 w-full justify-center lg:justify-end gap-x-10 lg:flex-col items-end'>
                                <div>
                                    <button
                                        onClick={syncChangesToFirestore}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        disabled={dashboardState.loading}
                                    >
                                        {dashboardState.loading ? 'Syncing...' : ' Save Changes'}
                                    </button>
                                </div>
                                <div>
                                    <button
                                        onClick={fetchAllResponses} // Attach the fetchAllResponses function
                                        className="px-4 py-1 text-sm bg-orange-600  lg:text-sm text-white rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    >
                                        Reload Page
                                    </button>
                                </div>
                                <div>
                                    <button
                                        onClick={() => setShowAddForm(!showAddForm)}
                                        className={`px-3 py-2 text-white rounded-md ${showAddForm ? 'bg-red-500 hover:bg-red-700 border-red-500 focus:ring-red-700' : 'bg-green-600 hover:bg-green-700 focus:ring-green-500'}  focus:outline-none focus:ring-2 `}
                                    >
                                        {showAddForm ? 'Cancel' : 'Add Participant'}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Search and Pagination Controls */}
                        <div className="mt-4 justify-center items-center flex space-x-4">
                            <SearchBar
                                searchTerm={dashboardState.search.searchTerm}
                                handleSearchTermChange={handleSearchTermChange}
                                handleSearch={handleSearch}
                                clearSearch={clearSearch}
                                isSearching={dashboardState.search.isSearching}
                            />

                            <div className='w-full flex justify-end'>
                                <select
                                    onChange={handleResponsesPerPageChange}
                                    value={dashboardState.pagination.responsesPerPage}
                                    className="rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                >
                                    <option value={5}>5 per page</option>
                                    <option value={10}>10 per page</option>
                                    <option value={20}>20 per page</option>
                                    <option value={30}>30 per page</option>
                                </select>
                            </div>
                        </div>

                        {/* Add Participant Form */}
                        {showAddForm && (
                            <AddParticipantForm
                                participant={newParticipant}
                                setParticipant={setNewParticipant}
                                handleSubmit={handleAddParticipant}
                                isSubmitting={dashboardState.loading}
                            />
                        )}

                        {/* Participants Table */}
                        <ParticipantTable
                            responses={dashboardState.responses}
                            loading={dashboardState.loading}
                            error={dashboardState.error}
                            currentPage={dashboardState.pagination.currentPage}
                            responsesPerPage={dashboardState.pagination.responsesPerPage}
                            updateStatus={updateRegistrationStatus}
                        />

                        {/* Pagination controls */}
                        {!dashboardState.loading && !dashboardState.error && dashboardState.responses.length > 0 && (
                            <PaginationControls
                                loadPrevPage={loadPrevPage}
                                loadNextPage={loadNextPage}
                                isFirstPage={dashboardState.pagination.isFirstPage}
                                hasMore={dashboardState.responses.length >= dashboardState.pagination.responsesPerPage}
                            />
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;