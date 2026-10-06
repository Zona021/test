import { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import News from './components/News';
import Documents from './components/Documents';
import Statistics from './components/Statistics';
import Calendar from './components/Calendar';
import Contacts from './components/Contacts';
import Profile from './components/Profile';
import Settings from './components/Settings';
import UserManagement from './components/UserManagement';
import LoginScreen from './components/LoginScreen';

function AppContent() {
  const { currentUser } = useAuth();
  const [activeSection, setActiveSection] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!currentUser) {
    return <LoginScreen />;
  }

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <Dashboard />;
      case 'news':
        return <News />;
      case 'documents':
        return <Documents />;
      case 'statistics':
        return <Statistics />;
      case 'calendar':
        return <Calendar />;
      case 'contacts':
        return <Contacts />;
      case 'profile':
        return <Profile />;
      case 'settings':
        return <Settings />;
      case 'users':
        return <UserManagement />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex">
        <Sidebar
          activeSection={activeSection}
          onSectionChange={setActiveSection}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        <main className="flex-1 p-4 md:p-8 ml-0 md:ml-64 min-h-screen">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
