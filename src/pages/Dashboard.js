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
  Search,
  Globe,
  Mic
} from 'lucide-react';

// Import your actual components here
import HealthTips from '../Components/HealthTips';
import AppointmentForm from '../Components/AppointmentForm';
import RecoveryTracker from '../Components/RecoveryTracker';
import MentorChat from '../Components/MentorChat';
import SymptomChecker from '../Components/SymptomChecker';
import MultilingualChecker from '../Components/MultilingualChecker';
import VoiceHealthAssistant from '../Components/VoiceHealthAssistant';

// Modal Component - Enhanced styling only
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
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className={`bg-white rounded-3xl shadow-2xl w-full ${sizeClasses[size]} max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-300 border border-gray-200`}>
        <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-gray-50 via-white to-gray-50 backdrop-blur-sm">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-pulse"></div>
            {title}
          </h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100/80 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 group"
          >
            <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-200" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)] bg-gradient-to-b from-white to-gray-50/30">
          {children}
        </div>
      </div>
    </div>
  );
};

// Dashboard Component Cards - Enhanced styling only
const DashboardCard = ({ icon: Icon, title, description, onClick, color = 'blue', stats }) => {
  // Fixed color classes to avoid dynamic generation issues
  const getColorClasses = (colorName) => {
    const colorMap = {
      blue: {
        bg: 'bg-gradient-to-br from-blue-50 to-blue-100/50',
        hoverBg: 'group-hover:from-blue-100 group-hover:to-blue-200/50',
        text: 'text-blue-600',
        statText: 'text-blue-700',
        glow: 'group-hover:shadow-blue-200/50'
      },
      emerald: {
        bg: 'bg-gradient-to-br from-emerald-50 to-emerald-100/50',
        hoverBg: 'group-hover:from-emerald-100 group-hover:to-emerald-200/50',
        text: 'text-emerald-600',
        statText: 'text-emerald-700',
        glow: 'group-hover:shadow-emerald-200/50'
      },
      orange: {
        bg: 'bg-gradient-to-br from-orange-50 to-orange-100/50',
        hoverBg: 'group-hover:from-orange-100 group-hover:to-orange-200/50',
        text: 'text-orange-600',
        statText: 'text-orange-700',
        glow: 'group-hover:shadow-orange-200/50'
      },
      purple: {
        bg: 'bg-gradient-to-br from-purple-50 to-purple-100/50',
        hoverBg: 'group-hover:from-purple-100 group-hover:to-purple-200/50',
        text: 'text-purple-600',
        statText: 'text-purple-700',
        glow: 'group-hover:shadow-purple-200/50'
      },
      red: {
        bg: 'bg-gradient-to-br from-red-50 to-red-100/50',
        hoverBg: 'group-hover:from-red-100 group-hover:to-red-200/50',
        text: 'text-red-600',
        statText: 'text-red-700',
        glow: 'group-hover:shadow-red-200/50'
      },
      indigo: {
        bg: 'bg-gradient-to-br from-indigo-50 to-indigo-100/50',
        hoverBg: 'group-hover:from-indigo-100 group-hover:to-indigo-200/50',
        text: 'text-indigo-600',
        statText: 'text-indigo-700',
        glow: 'group-hover:shadow-indigo-200/50'
      },
      teal: {
        bg: 'bg-gradient-to-br from-teal-50 to-teal-100/50',
        hoverBg: 'group-hover:from-teal-100 group-hover:to-teal-200/50',
        text: 'text-teal-600',
        statText: 'text-teal-700',
        glow: 'group-hover:shadow-teal-200/50'
      }
    };
    return colorMap[colorName] || colorMap.blue;
  };

  const colors = getColorClasses(color);

  return (
    <div 
      onClick={onClick}
      className={`bg-white/70 backdrop-blur-sm rounded-3xl shadow-sm border border-gray-200/50 p-6 cursor-pointer hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1 group relative overflow-hidden ${colors.glow}`}
    >
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/50 via-transparent to-gray-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className={`p-4 ${colors.bg} rounded-2xl transition-all duration-500 ${colors.hoverBg} shadow-sm group-hover:shadow-md group-hover:scale-110`}>
              <Icon className={`w-6 h-6 ${colors.text} transition-transform duration-300 group-hover:rotate-12`} />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-lg group-hover:text-gray-800 transition-colors">{title}</h3>
              <p className="text-sm text-gray-600 mt-1 group-hover:text-gray-700 transition-colors">{description}</p>
            </div>
          </div>
          <div className="p-2 rounded-xl bg-gray-50/50 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:bg-white/80">
            <Maximize2 className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
          </div>
        </div>
        
        {stats && (
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100/50">
            {stats.map((stat, index) => (
              <div key={index} className="text-center p-3 rounded-2xl bg-gradient-to-br from-gray-50/50 to-white/50 backdrop-blur-sm hover:bg-white/80 transition-all duration-300 group-hover:shadow-sm">
                <div className={`text-lg font-bold ${colors.statText} group-hover:scale-105 transition-transform duration-300`}>{stat.value}</div>
                <div className="text-xs text-gray-500 group-hover:text-gray-600 transition-colors">{stat.label}</div>
              </div>
            ))}
          </div>
        )}
        
        <div className="flex items-center justify-end mt-6 text-sm text-gray-500 group-hover:text-gray-700 transition-colors">
          <span className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">Click to explore</span>
          <ChevronRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
        </div>
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
    { icon: Activity, label: 'Health Score', value: '92/100', color: 'text-green-600', bg: 'bg-gradient-to-br from-green-50 to-green-100/50' },
    { icon: Clock, label: 'Next Appointment', value: 'Tomorrow 2PM', color: 'text-blue-600', bg: 'bg-gradient-to-br from-blue-50 to-blue-100/50' },
    { icon: Award, label: 'Current Streak', value: '12 days', color: 'text-purple-600', bg: 'bg-gradient-to-br from-purple-50 to-purple-100/50' },
    { icon: Shield, label: 'Wellness Level', value: 'Excellent', color: 'text-emerald-600', bg: 'bg-gradient-to-br from-emerald-50 to-emerald-100/50' }
  ];

  const dashboardComponents = [
    {
      id: 'mentor',
      title: 'AI MythBuster',
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
    },
    {
      id: 'multilingual',
      title: 'Multilingual Checker',
      description: 'Get health information in your preferred language',
      icon: Globe,
      color: 'indigo',
      component: MultilingualChecker,
      stats: [
        { label: 'Languages', value: '8+' },
        { label: 'Translations', value: '45' }
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
    <div className="flex h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20">
      {/* Sidebar - Enhanced styling only */}
      <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} fixed inset-y-0 left-0 z-50 w-64 bg-white/80 backdrop-blur-xl shadow-2xl transform transition-all duration-500 ease-out lg:translate-x-0 lg:static lg:inset-0 flex flex-col border-r border-gray-200/50`}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200/50 bg-gradient-to-r from-white/50 to-gray-50/30">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl text-white shadow-lg hover:shadow-xl transition-shadow duration-300 hover:scale-105">
              <Heart className="w-6 h-6" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">MythBuster</span>
          </div>
          <button 
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-xl hover:bg-gray-100/50 transition-all duration-200 hover:scale-105 active:scale-95"
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
                  className={`flex items-center gap-3 px-4 py-4 rounded-2xl transition-all duration-300 ${
                    item.active 
                      ? 'bg-gradient-to-r from-blue-50 to-purple-50 text-blue-600 font-semibold border border-blue-200/50 shadow-sm scale-105' 
                      : 'text-gray-700 hover:bg-gradient-to-r hover:from-gray-50 hover:to-white/50 hover:scale-105'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                  {item.active && <div className="ml-auto w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"></div>}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        
        <div className="p-4 border-t border-gray-200/50 flex-shrink-0 bg-gradient-to-r from-gray-50/30 to-white/50">
          <button className="flex items-center gap-3 w-full px-4 py-4 text-gray-700 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 hover:text-red-600 rounded-2xl transition-all duration-300 hover:scale-105 group">
            <LogOut className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
            Sign Out
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Header - Enhanced styling only */}
        <header className="bg-white/60 backdrop-blur-xl shadow-sm border-b border-gray-200/50 h-16 flex items-center justify-between px-4 lg:px-6 flex-shrink-0">
          <div className="flex items-center gap-4 min-w-0">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl hover:bg-gray-100/50 flex-shrink-0 transition-all duration-200 hover:scale-105 active:scale-95"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="min-w-0">
              <h1 className="text-lg lg:text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent truncate">{getGreeting()}!</h1>
              <p className="text-sm text-gray-600 hidden sm:block">Welcome back to your health dashboard</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 lg:gap-4 flex-shrink-0">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-gray-900">
                {currentTime.toLocaleDateString()}
              </p>
              <p className="text-xs text-gray-600">
                {currentTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
              </p>
            </div>
            <button className="p-2 rounded-xl hover:bg-gray-100/50 relative transition-all duration-200 hover:scale-105 active:scale-95 group">
              <Bell className="w-5 h-5 text-gray-600 group-hover:animate-pulse" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-red-500 to-pink-500 rounded-full animate-pulse shadow-lg"></div>
            </button>
            <button className="p-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-xl hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95">
              <User className="w-5 h-5 text-white" />
            </button>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {/* Quick Stats - Enhanced styling only */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6 lg:mb-8">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-sm border border-gray-200/50 p-4 lg:p-6 hover:shadow-xl hover:scale-105 transition-all duration-500 hover:-translate-y-1 group cursor-pointer">
                <div className="flex items-center gap-3 lg:gap-4">
                  <div className={`p-3 lg:p-4 ${stat.bg} rounded-2xl flex-shrink-0 shadow-sm group-hover:shadow-md group-hover:scale-110 transition-all duration-300`}>
                    <stat.icon className={`w-5 h-5 lg:w-6 lg:h-6 ${stat.color} group-hover:rotate-12 transition-transform duration-300`} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm text-gray-600 group-hover:text-gray-700 transition-colors">{stat.label}</p>
                    <p className="text-lg lg:text-xl font-bold text-gray-900 truncate group-hover:scale-105 transition-transform duration-300">{stat.value}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Welcome Message - Enhanced styling only */}
          <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-3xl p-6 lg:p-8 mb-6 lg:mb-8 text-white shadow-2xl relative overflow-hidden group">
            {/* Animated background pattern */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 animate-pulse"></div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-700"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12 group-hover:scale-150 transition-transform duration-700"></div>
            
            <div className="relative z-10 flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <h2 className="text-2xl lg:text-3xl font-bold mb-3 flex items-center gap-2">
                  MythBuster - Patient Dashboard
                  <Sparkles className="w-6 h-6 animate-pulse" />
                </h2>
                <p className="text-blue-100 text-sm lg:text-base opacity-90">Your personalized health companion is here to help you on your wellness journey.</p>
              </div>
              <div className="hidden md:block flex-shrink-0 ml-6">
                <div className="p-4 lg:p-6 bg-white/20 rounded-3xl backdrop-blur-sm shadow-xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                  <Heart className="w-10 h-10 lg:w-12 lg:h-12 animate-pulse" />
                </div>
              </div>
            </div>
          </div>

          {/* Main Component Grid - Better responsive layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-6 lg:gap-8">
            {dashboardComponents.map((component, index) => (
              <div 
                key={component.id}
                className="animate-in slide-in-from-bottom-4 duration-500"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <DashboardCard
                  icon={component.icon}
                  title={component.title}
                  description={component.description}
                  onClick={() => openModal(component.id)}
                  color={component.color}
                  stats={component.stats}
                />
              </div>
            ))}
          </div>
        </main>
      </div>

      {/* Mobile Sidebar Overlay - Enhanced styling only */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden animate-in fade-in duration-300"
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