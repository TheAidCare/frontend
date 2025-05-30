export default function NewPatientPrompt() {
  return (
    <div className="text-center mt-20">
      <h2 className="text-2xl font-bold mb-2">Start a new consultation</h2>
      <p className="text-gray-600 mb-6">Select a patient from the sidebar or create a new one to begin.</p>
      <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
        New Patient
      </button>
    </div>
  );
}
