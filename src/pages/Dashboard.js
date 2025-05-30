import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  Calendar, 
  TrendingUp, 
  MessageCircle, 
  Bell, 
  User, 
  Activity,
  Shield,
  Home,
  Clock,
  Target,
  Award,
  Plus,
  ChevronRight,
  Sparkles,
  Menu,
  X,
  Settings,
  LogOut,
  BookOpen,
  Users,
  Maximize2,
  Send,
  Phone,
  Video,
  Search
} from 'lucide-react';

// Import your actual components here
import HealthTips from '../Components/HealthTips';
import AppointmentForm from '../Components/AppointmentForm';
import RecoveryTracker from '../Components/RecoveryTracker';
import MentorChat from '../Components/MentorChat';
import SymptomChecker from '../Components/SymptomChecker';

// Modal Component
const Modal = ({ isOpen, onClose, title, children, size = 'lg' }) => {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-6xl'
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className={`bg-white rounded-lg shadow-xl w-full ${sizeClasses[size]} max-h-[90vh] overflow-hidden`}>
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {children}
        </div>
      </div>
    </div>
  );
};

// Dashboard Component Cards with fixed dynamic class issues
const DashboardCard = ({ icon: Icon, title, description, onClick, color = 'blue', stats }) => {
  // Fixed color classes to avoid dynamic generation issues
  const getColorClasses = (colorName) => {
    const colorMap = {
      blue: {
        bg: 'bg-blue-50',
        hoverBg: 'group-hover:bg-blue-100',
        text: 'text-blue-600',
        statText: 'text-blue-600'
      },
      emerald: {
        bg: 'bg-emerald-50',
        hoverBg: 'group-hover:bg-emerald-100',
        text: 'text-emerald-600',
        statText: 'text-emerald-600'
      },
      orange: {
        bg: 'bg-orange-50',
        hoverBg: 'group-hover:bg-orange-100',
        text: 'text-orange-600',
        statText: 'text-orange-600'
      },
      purple: {
        bg: 'bg-purple-50',
        hoverBg: 'group-hover:bg-purple-100',
        text: 'text-purple-600',
        statText: 'text-purple-600'
      },
      red: {
        bg: 'bg-red-50',
        hoverBg: 'group-hover:bg-red-100',
        text: 'text-red-600',
        statText: 'text-red-600'
      }
    };
    return colorMap[colorName] || colorMap.blue;
  };

  const colors = getColorClasses(color);

  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-lg shadow-sm border p-6 cursor-pointer hover:shadow-md transition-all duration-200 hover:scale-105 group"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-3 ${colors.bg} rounded-lg transition-colors ${colors.hoverBg}`}>
            <Icon className={`w-6 h-6 ${colors.text}`} />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{title}</h3>
            <p className="text-sm text-gray-600">{description}</p>
          </div>
        </div>
        <Maximize2 className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
      
      {stats && (
        <div className="grid grid-cols-2 gap-4 pt-4 border-t">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className={`text-lg font-bold ${colors.statText}`}>{stat.value}</div>
              <div className="text-xs text-gray-500">{stat.label}</div>
            </div>
          ))}
        </div>
      )}
      
      <div className="flex items-center justify-end mt-4 text-sm text-gray-500">
        Click to open <ChevronRight className="w-4 h-4 ml-1" />
      </div>
    </div>
  );
};

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeModal, setActiveModal] = useState(null);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const sidebarItems = [
    { icon: Home, label: 'Dashboard', active: true }
  ];

  const stats = [
    { icon: Activity, label: 'Health Score', value: '92/100', color: 'text-green-600', bg: 'bg-green-50' },
    { icon: Clock, label: 'Next Appointment', value: 'Tomorrow 2PM', color: 'text-blue-600', bg: 'bg-blue-50' },
    { icon: Award, label: 'Current Streak', value: '12 days', color: 'text-purple-600', bg: 'bg-purple-50' },
    { icon: Shield, label: 'Wellness Level', value: 'Excellent', color: 'text-emerald-600', bg: 'bg-emerald-50' }
  ];

  const dashboardComponents = [
    {
      id: 'mentor',
      title: 'AI Health Mentor',
      description: 'Chat with your personal AI health assistant',
      icon: MessageCircle,
      color: 'orange',
      component: MentorChat,
      stats: [
        { label: 'Messages Today', value: '8' },
        { label: 'Streak', value: '5 days' }
      ]
    },
    {
      id: 'tips',
      title: 'Health Tips',
      description: 'Personalized daily health recommendations',
      icon: Heart,
      color: 'emerald',
      component: HealthTips,
      stats: [
        { label: 'Tips Read', value: '24' },
        { label: 'Applied', value: '18' }
      ]
    },
    {
      id: 'appointments',
      title: 'Appointments',
      description: 'Schedule and manage your medical appointments',
      icon: Calendar,
      color: 'blue',
      component: AppointmentForm,
      stats: [
        { label: 'Upcoming', value: '2' },
        { label: 'This Month', value: '5' }
      ]
    },
    {
      id: 'recovery',
      title: 'Recovery Tracker',
      description: 'Monitor your health progress and recovery',
      icon: TrendingUp,
      color: 'purple',
      component: RecoveryTracker,
      stats: [
        { label: 'Progress', value: '78%' },
        { label: 'Goals Met', value: '12/15' }
      ]
    },
    {
      id: 'symptom',
      title: 'Symptom Checker',
      description: 'Analyze your symptoms and get health insights',
      icon: Search,
      color: 'red',
      component: SymptomChecker,
      stats: [
        { label: 'Checks Done', value: '7' },
        { label: 'Last Check', value: '2 days ago' }
      ]
    }
  ];

  const openModal = (componentId) => {
    setActiveModal(componentId);
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  const getModalTitle = (componentId) => {
    const component = dashboardComponents.find(c => c.id === componentId);
    return component ? component.title : '';
  };

  const renderModalContent = (componentId) => {
    const component = dashboardComponents.find(c => c.id === componentId);
    if (!component) return null;
    
    const Component = component.component;
    return <Component />;
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 flex flex-col`}>
        <div className="flex items-center justify-between h-16 px-6 border-b flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500 rounded-lg text-white">
              <Heart className="w-6 h-6" />
            </div>
            <span className="text-xl font-bold text-gray-900">ArogyaAI</span>
          </div>
          <button 
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <nav className="px-4 py-6 flex-1">
          <ul className="space-y-2">
            {sidebarItems.map((item, index) => (
              <li key={index}>
                <a 
                  href="#" 
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                    item.active 
                      ? 'bg-blue-50 text-blue-600 font-medium' 
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        
        <div className="p-4 border-t flex-shrink-0">
          <button className="flex items-center gap-3 w-full px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-200">
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Header */}
        <header className="bg-white shadow-sm border-b h-16 flex items-center justify-between px-4 lg:px-6 flex-shrink-0">
          <div className="flex items-center gap-4 min-w-0">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 flex-shrink-0"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="min-w-0">
              <h1 className="text-lg lg:text-xl font-semibold text-gray-900 truncate">{getGreeting()}!</h1>
              <p className="text-sm text-gray-600 hidden sm:block">Welcome back to your health dashboard</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 lg:gap-4 flex-shrink-0">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-gray-900">
                {currentTime.toLocaleDateString()}
              </p>
              <p className="text-xs text-gray-600">
                {currentTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
              </p>
            </div>
            <button className="p-2 rounded-lg hover:bg-gray-100 relative">
              <Bell className="w-5 h-5 text-gray-600" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
            </button>
            <button className="p-2 bg-blue-500 rounded-lg hover:bg-blue-600">
              <User className="w-5 h-5 text-white" />
            </button>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6 lg:mb-8">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm border p-4 lg:p-6">
                <div className="flex items-center gap-3 lg:gap-4">
                  <div className={`p-2 lg:p-3 ${stat.bg} rounded-lg flex-shrink-0`}>
                    <stat.icon className={`w-5 h-5 lg:w-6 lg:h-6 ${stat.color}`} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm text-gray-600">{stat.label}</p>
                    <p className="text-lg lg:text-xl font-bold text-gray-900 truncate">{stat.value}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Welcome Message */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-4 lg:p-6 mb-6 lg:mb-8 text-white">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <h2 className="text-xl lg:text-2xl font-bold mb-2">ArogyaAI - Patient Dashboard</h2>
                <p className="text-blue-100 text-sm lg:text-base">Your personalized health companion is here to help you on your wellness journey.</p>
              </div>
              <div className="hidden md:block flex-shrink-0 ml-4">
                <div className="p-3 lg:p-4 bg-white/20 rounded-full">
                  <Heart className="w-8 h-8 lg:w-12 lg:h-12" />
                </div>
              </div>
            </div>
          </div>

          {/* Main Component Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
            {dashboardComponents.map((component) => (
              <DashboardCard
                key={component.id}
                icon={component.icon}
                title={component.title}
                description={component.description}
                onClick={() => openModal(component.id)}
                color={component.color}
                stats={component.stats}
              />
            ))}
          </div>
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Modal for Components */}
      <Modal
        isOpen={activeModal !== null}
        onClose={closeModal}
        title={getModalTitle(activeModal)}
        size="xl"
      >
        {activeModal && renderModalContent(activeModal)}
      </Modal>
    </div>
  );
};

export default Dashboard;