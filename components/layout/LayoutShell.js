import PatientSidebar from '../patients/PatientSidebar';

export default function LayoutShell({ children }) {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r overflow-y-auto">
        <PatientSidebar />
      </aside>

      {/* Main content */}
      <main className="flex-1 bg-gray-50 p-4 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
