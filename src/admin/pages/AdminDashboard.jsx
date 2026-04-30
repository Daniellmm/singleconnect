import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Papa from 'papaparse';
import { supabase } from '../../supabase';
import LOGO from '../assets/logo.jpg';

import StatsCard        from '../components/StatsCard';
import CsvUploadForm    from '../components/CsvUploadForm';
import SearchBar        from '../components/SearchBar';
import ParticipantTable from '../components/ParticipantTable';
import AddParticipantForm  from '../components/AddParticipantForm';
import PaginationControls  from '../components/PaginationControls';

/* ─── helpers ─────────────────────────────────────────────────── */

/** Map a Supabase row to the shape the existing UI components expect */
const rowToResponse = (row) => ({
  id:        row.id,
  data: {
    name:         row.full_name  ?? 'N/A',
    email:        row.email      ?? 'N/A',
    gender:       row.gender     ?? 'N/A',
    organization: row.church     ?? 'N/A',
    phone:        row.phone      ?? 'N/A',
    ageGroup:     row.age_group  ?? 'N/A',
    hearAbout:    row.hear_about ?? 'N/A',
    Colour:       row.Colour     ?? 'N/A',
  },
  timestamp:  row.created_at,
  completed:  row.checked_in    ?? false,
  checkedInAt: row.checked_in_at ?? null,
  isDirty:    false,
});

/** Map a local newParticipant form object to a Supabase insert payload */
const participantToRow = (p) => ({
  full_name:  p.name,
  email:      p.email,
  phone:      p.phone      || '',
  gender:     p.gender     || '',
  age_group:  p.ageGroup   || '',
  hear_about: p.referral   || '',
  church:     p.organization || '',
  Colour:     p.Colour || '', 
  checked_in: false,
});

/* ─── component ───────────────────────────────────────────────── */

const AdminDashboard = () => {
  const navigate = useNavigate();

  /* ── data state ── */
  const [allRows,       setAllRows]       = useState([]);   // full dataset
  const [displayed,     setDisplayed]     = useState([]);   // current page rows
  const [loading,       setLoading]       = useState(true);
  const [error,         setError]         = useState(null);
  const [successMsg,    setSuccessMsg]    = useState('');

  /* ── stats ── */
  const [stats, setStats] = useState({ total: 0, checkedIn: 0 });

  /* ── pagination ── */
  const [page,    setPage]    = useState(1);
  const [perPage, setPerPage] = useState(10);

  /* ── search ── */
  const [searchTerm,    setSearchTerm]    = useState('');
  const [isSearching,   setIsSearching]   = useState(false);

  /* ── add form ── */
  const EMPTY_PARTICIPANT = {
    name: '', email: '', phone: '', gender: '', ageGroup: '', organization: '', referral: '', Colour: '',
  };
  const [showAddForm,    setShowAddForm]    = useState(false);
  const [newParticipant, setNewParticipant] = useState(EMPTY_PARTICIPANT);
  const [addLoading, setAddLoading] = useState(false);

  /* ── csv ── */
  const [csvFile,      setCsvFile]      = useState(null);
  const [csvStatus,    setCsvStatus]    = useState('');
  const [csvUploading, setCsvUploading] = useState(false);

  const hasFetched = useRef(false);

  /* ── flash helper ── */
  const flash = useCallback((msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 3500);
  }, []);

  /* ── recalc stats whenever allRows changes ── */
  useEffect(() => {
    setStats({
      total:     allRows.length,
      checkedIn: allRows.filter(r => r.completed).length,
    });
  }, [allRows]);

  /* ── update displayed slice ── */
  useEffect(() => {
    if (isSearching) return; // search manages its own slice
    const start = (page - 1) * perPage;
    setDisplayed(allRows.slice(start, start + perPage));
  }, [allRows, page, perPage, isSearching]);

  /* ══════════════════════════════════════════════════════════════
     FETCH ALL
  ══════════════════════════════════════════════════════════════ */
  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);

    const { data, error: sbError } = await supabase
      .from('registrations')
      .select('*')
      .order('created_at', { ascending: false });

    if (sbError) {
      setError(`Failed to load registrations: ${sbError.message}`);
      setLoading(false);
      return;
    }

    const mapped = (data ?? []).map(rowToResponse);
    setAllRows(mapped);
    setLoading(false);
  }, []);

  /* ══════════════════════════════════════════════════════════════
     REAL-TIME SUBSCRIPTION
     Any INSERT / UPDATE in the table is applied locally without
     a full re-fetch, so multiple devices stay in sync instantly.
  ══════════════════════════════════════════════════════════════ */
  useEffect(() => {
    if (!hasFetched.current) {
      fetchAll();
      hasFetched.current = true;
    }

    const channel = supabase
      .channel('registrations-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'registrations' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setAllRows(prev => [rowToResponse(payload.new), ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setAllRows(prev =>
              prev.map(r => r.id === payload.new.id ? rowToResponse(payload.new) : r)
            );
          } else if (payload.eventType === 'DELETE') {
            setAllRows(prev => prev.filter(r => r.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [fetchAll]);

  /* ══════════════════════════════════════════════════════════════
     CHECK-IN TOGGLE
  ══════════════════════════════════════════════════════════════ */
  const updateRegistrationStatus = useCallback(async (id, checked_in) => {
    // Optimistic update in UI
    setAllRows(prev =>
      prev.map(r => r.id === id ? { ...r, completed: checked_in } : r)
    );

    const { error: sbError } = await supabase
      .from('registrations')
      .update({
        checked_in,
        checked_in_at: checked_in ? new Date().toISOString() : null,
      })
      .eq('id', id);

    if (sbError) {
      // Revert optimistic update
      setAllRows(prev =>
        prev.map(r => r.id === id ? { ...r, completed: !checked_in } : r)
      );
      setError(`Check-in update failed: ${sbError.message}`);
    }
  }, []);

  /* ══════════════════════════════════════════════════════════════
     ADD PARTICIPANT MANUALLY
  ══════════════════════════════════════════════════════════════ */
  const handleAddParticipant = useCallback(async (e) => {
    e.preventDefault();
    if (!newParticipant.name || !newParticipant.email) return;

    setAddLoading(true);
    const { data, error: sbError } = await supabase
      .from('registrations')
      .insert(participantToRow(newParticipant))
      .select()
      .single();

    if (sbError) {
      setError(`Could not add participant: ${sbError.message}`);
    } else {
      // Real-time will pick this up but we can pre-populate immediately
      setAllRows(prev => [rowToResponse(data), ...prev]);
      flash('Participant added successfully.');
      setNewParticipant(EMPTY_PARTICIPANT);
      setShowAddForm(false);
    }

    setAddLoading(false);
  }, [newParticipant, flash]);

  /* ══════════════════════════════════════════════════════════════
     CSV UPLOAD  (bulk insert to Supabase)
  ══════════════════════════════════════════════════════════════ */
  const handleCsvUpload = useCallback(async () => {
    if (!csvFile) {
      setCsvStatus('Please select a CSV file first.');
      return;
    }

    setCsvUploading(true);
    setCsvStatus('Parsing CSV…');

    Papa.parse(csvFile, {
      header: true,
      skipEmptyLines: true,
      complete: async ({ data, errors }) => {
        if (errors.length > 0) {
          setCsvStatus(`CSV parse error: ${errors[0].message}`);
          setCsvUploading(false);
          return;
        }

        const rows = data
          .filter(r => r['Email Address'] && r['Name'])
          .map(r => ({
            full_name:  r['Name']            || '',
            email:      r['Email Address']   || '',
            phone:      r['Phone No.']       || '',
            gender:     r['Gender']          || '',
            age_group:  r['Age Group']       || '',
            hear_about: r['How did you hear about this program'] || '',
            church:     r['Church/Organization'] || '',
            Colour:     r['Colour'] || '',
            checked_in: false,
          }));

        if (rows.length === 0) {
          setCsvStatus('No valid rows found. Ensure columns: Name, Email Address.');
          setCsvUploading(false);
          return;
        }

        setCsvStatus(`Uploading ${rows.length} records…`);

        const { data: inserted, error: sbError } = await supabase
          .from('registrations')
          .insert(rows)
          .select();

        if (sbError) {
          setCsvStatus(`Upload error: ${sbError.message}`);
        } else {
          const count = inserted?.length ?? rows.length;
          setCsvStatus(`Done! ${count} records imported.`);
          setAllRows(prev => [...(inserted ?? []).map(rowToResponse), ...prev]);
          setCsvFile(null);
          document.getElementById('csv-file').value = '';
        }

        setCsvUploading(false);
      },
      error: (err) => {
        setCsvStatus(`Parse error: ${err}`);
        setCsvUploading(false);
      },
    });
  }, [csvFile]);

  /* ══════════════════════════════════════════════════════════════
     SEARCH
  ══════════════════════════════════════════════════════════════ */
  /* Live search — runs every time searchTerm or allRows changes */
  useEffect(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) {
      setIsSearching(false);
      const start = (page - 1) * perPage;
      setDisplayed(allRows.slice(start, start + perPage));
      return;
    }
    setIsSearching(true);
    const filtered = allRows.filter(r => {
      const d = r.data;
      return [d.name, d.email, d.phone, d.gender, d.ageGroup, d.organization, d.hearAbout]
        .some(v => String(v ?? '').toLowerCase().includes(term));
    });
    setDisplayed(filtered);
  }, [searchTerm, allRows, page, perPage]);

  /* handleSearch kept as no-op so SearchBar prop contract stays satisfied */
  const handleSearch = useCallback(() => {}, []);

  const clearSearch = useCallback(() => {
    setSearchTerm('');
  }, []);

  /* ── pagination handlers ── */
  const loadNextPage = useCallback(() => {
    if ((page * perPage) < allRows.length) setPage(p => p + 1);
  }, [page, perPage, allRows.length]);

  const loadPrevPage = useCallback(() => {
    if (page > 1) setPage(p => p - 1);
  }, [page]);

  /* ── logout ── */
  const handleLogout = useCallback(async () => {
    await supabase.auth.signOut();
    navigate('/');
  }, [navigate]);

  /* ══════════════════════════════════════════════════════════════
     RENDER
  ══════════════════════════════════════════════════════════════ */
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img src={LOGO} className="h-12 w-12 rounded-full" alt="Logo" />
            <div>
              <h1 className="text-lg lg:text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-xs text-gray-400">Singles Connect 2026</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-sm text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="py-6">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 space-y-6">

          {/* Stats */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            <StatsCard
              title="Total Registrations"
              value={stats.total}
              bgColor="bg-blue-500"
              icon={
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              }
            />
            <StatsCard
              title="Checked In"
              value={stats.checkedIn}
              bgColor="bg-green-500"
              icon={
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
            />
            <StatsCard
              title="Not Yet Checked In"
              value={stats.total - stats.checkedIn}
              bgColor="bg-yellow-500"
              icon={
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
            />
          </div>

          {/* Participant Management */}
          <div>
            <h2 className="text-xl font-medium text-gray-900 mb-4">Participant Management</h2>

            {successMsg && (
              <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md text-sm">{successMsg}</div>
            )}
            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm flex justify-between">
                <span>{error}</span>
                <button onClick={() => setError(null)} className="font-bold ml-4">×</button>
              </div>
            )}

            {/* Actions row */}
            <div className="flex flex-col lg:flex-row w-full gap-5 items-start lg:items-center justify-between">
              <CsvUploadForm
                handleFileChange={(e) => setCsvFile(e.target.files[0])}
                handleCsvUpload={handleCsvUpload}
                csvFile={csvFile}
                uploadStatus={csvStatus}
                isUploading={csvUploading}
              />

              {/* <div className="flex gap-3 flex-wrap">
                <button
                  onClick={fetchAll}
                  disabled={loading}
                  className="px-4 py-2 text-sm bg-orange-500 text-white rounded-md hover:bg-orange-600 disabled:opacity-50 transition-colors"
                >
                  {loading ? 'Loading…' : 'Refresh'}
                </button>
                <button
                  onClick={() => setShowAddForm(!showAddForm)}
                  className={`px-4 py-2 text-sm text-white rounded-md transition-colors ${
                    showAddForm
                      ? 'bg-red-500 hover:bg-red-600'
                      : 'bg-green-600 hover:bg-green-700'
                  }`}
                >
                  {showAddForm ? 'Cancel' : 'Add Participant'}
                </button>
              </div> */}
            </div>

            {/* Search + per-page */}
            <div className="mt-4 flex flex-col sm:flex-row items-center gap-3">
              <SearchBar
                searchTerm={searchTerm}
                handleSearchTermChange={(e) => setSearchTerm(e.target.value)}
                handleSearch={handleSearch}
                clearSearch={clearSearch}
                isSearching={isSearching}
              />
              <div className="ml-auto">
                <select
                  value={perPage}
                  onChange={(e) => { setPerPage(Number(e.target.value)); setPage(1); }}
                  className="rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                >
                  {[5, 10, 20, 30].map(n => (
                    <option key={n} value={n}>{n} per page</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Add form */}
            {showAddForm && (
              <AddParticipantForm
                participant={newParticipant}
                setParticipant={setNewParticipant}
                handleSubmit={handleAddParticipant}
                isSubmitting={addLoading}
              />
            )}

            {/* Table */}
            <ParticipantTable
              responses={displayed}
              loading={loading}
              error={null}
              currentPage={page}
              responsesPerPage={perPage}
              updateStatus={updateRegistrationStatus}
            />

            {/* Pagination */}
            {!loading && displayed.length > 0 && !isSearching && (
              <PaginationControls
                loadPrevPage={loadPrevPage}
                loadNextPage={loadNextPage}
                isFirstPage={page === 1}
                hasMore={(page * perPage) < allRows.length}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;