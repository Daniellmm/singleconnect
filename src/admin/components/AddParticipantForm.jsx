import React from 'react';

const HEAR_OPTIONS = [
  'Instagram', 'Facebook', 'WhatsApp', 'Friend / Word of Mouth',
  'Church Announcement', 'Flyer / Poster', 'Other',
];

const AddParticipantForm = ({ participant, setParticipant, handleSubmit, isSubmitting }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setParticipant(prev => ({ ...prev, [name]: value }));
  };

  const field = 'mt-1 block w-full border-2 border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-md p-2 sm:text-sm outline-none transition-colors';

  return (
    <div className="mt-6 bg-white shadow rounded-lg p-6">
      <h3 className="text-base font-semibold text-gray-900 mb-5">Add Participant Manually</h3>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">

          {/* Name */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text" name="name" required
              value={participant.name}
              onChange={handleChange}
              placeholder="e.g. Adunola Bello"
              className={field}
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              type="email" name="email" required
              value={participant.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className={field}
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <input
              type="tel" name="phone" required
              value={participant.phone}
              onChange={handleChange}
              placeholder="+234 800 000 0000"
              className={field}
            />
          </div>

          {/* Gender */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Gender</label>
            <select name="gender" value={participant.gender} onChange={handleChange} className={field}>
              <option value="">Select gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>

          {/* Age Group */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Age Group</label>
            <select name="ageGroup" value={participant.ageGroup} onChange={handleChange} className={field}>
              <option value="">Select age group</option>
              <option value="22-26">22 – 26</option>
              <option value="27-30">27 – 30</option>
              <option value="31-35">31 – 35</option>
              <option value="36+">36+</option>
            </select>
          </div>

          {/* Church / Org */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Church / Organisation <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <input
              type="text" name="organization"
              value={participant.organization}
              onChange={handleChange}
              placeholder="e.g. RCCG, Winners Chapel"
              className={field}
            />
          </div>

          {/* How heard */}
          <div className="sm:col-span-2 lg:col-span-3">
            <label className="block text-xs font-medium text-gray-600 mb-1">
              How did they hear about us? <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <select name="referral" value={participant.referral} onChange={handleChange} className={`${field} max-w-sm`}>
              <option value="">Select an option</option>
              {HEAR_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>

        </div>

        {/* Colour */}
        <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">
            Colour
        </label>
        <input
            type="text"
            name="colour"
            value={participant.colour}
            onChange={handleChange}
            placeholder="e.g. Red, Blue, VIP"
            className={field}
        />
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 py-2 px-6 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? 'Saving…' : 'Save Participant'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddParticipantForm;