import React, { useState, useEffect } from 'react';
import {
  Heart,
  Stethoscope,
  MapPin,
  Shield,
  ArrowRight,
  Menu,
  X,
  Users,
  Star,
  CheckCircle,
  Phone,
  Mail,
  Play,
  Award,
  Clock,
  Smartphone
} from 'lucide-react';

const HomePage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const testimonials = [
    {
      name: "Dr. Priya Sharma",
      role: "Rural Health Specialist",
      content: "RuralCare AI has revolutionized how we deliver healthcare to remote villages. The AI diagnostic tools are incredibly accurate.",
      rating: 5
    },
    {
      name: "Rajesh Kumar",
      role: "Village Health Worker",
      content: "This platform has made it possible for me to provide quality healthcare advice even without a doctor physically present.",
      rating: 5
    },
    {
      name: "Maria Santos",
      role: "Community Leader",
      content: "Our village now has access to world-class healthcare. The telemedicine feature has saved countless lives.",
      rating: 5
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleLogin = () => {
    window.location.href = '/login';
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-green-50 font-sans text-gray-800">
      {/* Navbar */}
      <nav className="bg-white shadow-lg sticky top-0 z-50 border-b border-green-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="bg-green-500 p-3 rounded-xl shadow-lg">
              <Heart className="h-7 w-7 text-white" />
            </div>
            <span className="text-2xl font-bold text-green-600">
              RuralCare AI
            </span>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <button onClick={() => scrollToSection('home')} className="text-gray-700 hover:text-green-600 transition-colors duration-200 font-medium">
              Home
            </button>
            <button onClick={() => scrollToSection('services')} className="text-gray-700 hover:text-green-600 transition-colors duration-200 font-medium">
              Services
            </button>
            <button onClick={() => scrollToSection('about')} className="text-gray-700 hover:text-green-600 transition-colors duration-200 font-medium">
              About
            </button>
            <button onClick={() => scrollToSection('contact')} className="text-gray-700 hover:text-green-600 transition-colors duration-200 font-medium">
              Contact
            </button>
            <button
              onClick={handleLogin}
              className="bg-green-500 text-white px-6 py-3 rounded-xl shadow-lg hover:bg-green-600 transition-all duration-200 transform hover:scale-105 font-medium"
            >
              Login
            </button>
          </div>

          <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-700 p-2">
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden bg-white rounded-2xl mx-4 mb-4 p-6 shadow-xl border border-green-200 space-y-4">
            {[
              { name: 'Home', id: 'home' },
              { name: 'Services', id: 'services' },
              { name: 'About', id: 'about' },
              { name: 'Contact', id: 'contact' }
            ].map((item) => (
              <button 
                key={item.name} 
                onClick={() => {
                  scrollToSection(item.id);
                  setIsMenuOpen(false);
                }}
                className="block w-full text-left text-gray-700 hover:text-green-600 font-medium py-2"
              >
                {item.name}
              </button>
            ))}
            <button
              onClick={handleLogin}
              className="w-full bg-green-500 text-white py-3 rounded-xl shadow-lg hover:bg-green-600 font-medium"
            >
              Login
            </button>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section id="home" className="text-center py-32 px-6 relative overflow-hidden bg-gradient-to-br from-green-100 to-blue-100">
        <div className="relative z-10">
          <div className="mb-8">
            <span className="inline-block bg-green-500 text-white px-6 py-2 rounded-full text-sm font-semibold shadow-lg">
              🚀 Revolutionizing Rural Healthcare
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            <span className="text-green-600">
              AI-Powered Rural
            </span>
            <br />
            <span className="text-gray-800">Healthcare Revolution</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-12 leading-relaxed">
            Bridging the healthcare gap in rural communities with cutting-edge AI technology, 
            bringing world-class medical care to every village and remote area.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
            <button className="bg-green-500 text-white px-10 py-4 rounded-xl hover:scale-105 hover:bg-green-600 transition-all duration-200 shadow-xl flex items-center space-x-3 font-medium">
              <span>Get Started Today</span>
              <ArrowRight className="h-5 w-5" />
            </button>
            <button className="bg-white border-2 border-green-200 text-green-600 px-10 py-4 rounded-xl hover:bg-green-50 transition-all duration-200 shadow-lg flex items-center space-x-3 font-medium">
              <Play className="h-5 w-5" />
              <span>Watch Demo</span>
            </button>
          </div>
          
          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center items-center gap-8 text-gray-600 text-sm">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span>WHO Approved</span>
            </div>
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-green-500" />
              <span>HIPAA Compliant</span>
            </div>
            <div className="flex items-center space-x-2">
              <Award className="h-5 w-5 text-green-500" />
              <span>ISO Certified</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="services" className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Why Choose <span className="text-green-600">RuralCare AI</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Experience the future of healthcare with our AI-driven, doctor-approved solutions 
              that bring medical expertise to every corner of the world.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <FeatureCard
              icon={<Stethoscope className="h-8 w-8 text-white" />}
              title="AI-Powered Diagnosis"
              text="Advanced machine learning algorithms provide accurate health assessments and preliminary diagnoses in real-time."
              bgColor="bg-green-500"
            />
            <FeatureCard
              icon={<MapPin className="h-8 w-8 text-white" />}
              title="Remote Consultations"
              text="Connect with certified doctors through high-quality video calls from any remote location with internet access."
              bgColor="bg-blue-500"
            />
            <FeatureCard
              icon={<Shield className="h-8 w-8 text-white" />}
              title="Secure & Private"
              text="Military-grade encryption ensures all patient data remains completely confidential and protected 24/7."
              bgColor="bg-purple-500"
            />
            <FeatureCard
              icon={<Smartphone className="h-8 w-8 text-white" />}
              title="Mobile-First Design"
              text="Optimized for smartphones and tablets, making healthcare accessible even with basic internet connectivity."
              bgColor="bg-pink-500"
            />
            <FeatureCard
              icon={<Clock className="h-8 w-8 text-white" />}
              title="24/7 Availability"
              text="Round-the-clock AI assistance and emergency consultation services ensure help is always available."
              bgColor="bg-red-500"
            />
            <FeatureCard
              icon={<Users className="h-8 w-8 text-white" />}
              title="Community Health"
              text="Track and monitor community health trends, enabling proactive healthcare management for entire villages."
              bgColor="bg-indigo-500"
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-green-500 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-8 text-center relative z-10">
          <StatCard value="50,000+" label="Patients Served" />
          <StatCard value="500+" label="Certified Doctors" />
          <StatCard value="1,200+" label="Villages Covered" />
          <StatCard value="99.9%" label="Uptime Guarantee" />
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-12">
            What Our <span className="text-green-600">Heroes</span> Say
          </h2>
          
          <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-green-200 relative">
            <div className="flex justify-center mb-6">
              {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                <Star key={i} className="h-6 w-6 text-yellow-400 fill-current" />
              ))}
            </div>
            <blockquote className="text-xl md:text-2xl text-gray-700 mb-8 italic leading-relaxed">
              "{testimonials[currentTestimonial].content}"
            </blockquote>
            <div>
              <div className="font-semibold text-lg text-gray-900">
                {testimonials[currentTestimonial].name}
              </div>
              <div className="text-green-600 font-medium">
                {testimonials[currentTestimonial].role}
              </div>
            </div>
            
            <div className="flex justify-center mt-8 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-200 ${
                    index === currentTestimonial ? 'bg-green-500' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Transforming Rural Healthcare with 
                <span className="text-green-600"> AI Innovation</span>
              </h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                RuralCare AI was founded with a simple yet powerful mission: to ensure that geographic location 
                never determines the quality of healthcare someone receives. Our platform combines cutting-edge 
                artificial intelligence with the expertise of certified medical professionals to create a 
                comprehensive healthcare solution for rural communities.
              </p>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-500 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-gray-900">AI-Driven Diagnostics</h4>
                    <p className="text-gray-600">Advanced algorithms trained on millions of medical cases</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-500 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Expert Medical Team</h4>
                    <p className="text-gray-600">Board-certified doctors available for consultations</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-500 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Continuous Innovation</h4>
                    <p className="text-gray-600">Regular updates and improvements based on user feedback</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-green-100 rounded-3xl p-8 text-center">
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <Heart className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h3>
                <p className="text-gray-600 leading-relaxed">
                  To democratize healthcare by making world-class medical services accessible to every person, 
                  regardless of their location or economic status.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 bg-green-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Get in <span className="text-green-600">Touch</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Ready to bring AI-powered healthcare to your community? Contact us today.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <ContactCard
              icon={<Phone className="h-8 w-8 text-white" />}
              title="Call Us"
              info="+1 (555) 123-4567"
              bgColor="bg-green-500"
            />
            <ContactCard
              icon={<Mail className="h-8 w-8 text-white" />}
              title="Email Us"
              info="contact@ruralcare.ai"
              bgColor="bg-blue-500"
            />
            <ContactCard
              icon={<MapPin className="h-8 w-8 text-white" />}
              title="Visit Us"
              info="123 Healthcare Ave, Medical District"
              bgColor="bg-purple-500"
            />
          </div>

          <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-green-200 text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to Get Started?</h3>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              Join thousands of healthcare providers and patients who are already experiencing 
              the future of rural healthcare with RuralCare AI.
            </p>
            <button className="bg-green-500 text-white px-12 py-4 rounded-xl hover:scale-105 hover:bg-green-600 transition-all duration-200 shadow-xl font-medium text-lg">
              Start Your Journey
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="bg-green-500 p-2 rounded-xl">
                  <Heart className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl font-bold">RuralCare AI</span>
              </div>
              <p className="text-gray-400 leading-relaxed">
                Transforming rural healthcare through artificial intelligence and connecting communities with world-class medical care.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-green-400 transition">AI Diagnosis</a></li>
                <li><a href="#" className="hover:text-green-400 transition">Telemedicine</a></li>
                <li><a href="#" className="hover:text-green-400 transition">Health Monitoring</a></li>
                <li><a href="#" className="hover:text-green-400 transition">Emergency Care</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-green-400 transition">About Us</a></li>
                <li><a href="#" className="hover:text-green-400 transition">Careers</a></li>
                <li><a href="#" className="hover:text-green-400 transition">Press</a></li>
                <li><a href="#" className="hover:text-green-400 transition">Blog</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-green-400 transition">Help Center</a></li>
                <li><a href="#" className="hover:text-green-400 transition">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-green-400 transition">Terms of Service</a></li>
                <li><a href="#" className="hover:text-green-400 transition">Contact</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; 2025 RuralCare AI. All rights reserved. Made with ❤️ for rural communities worldwide.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, text, bgColor }) => (
  <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl border border-gray-100 hover:border-green-200 transition-all duration-300 transform hover:-translate-y-2 group">
    <div className={`${bgColor} w-16 h-16 flex items-center justify-center rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-200`}>
      {icon}
    </div>
    <h3 className="text-xl font-semibold text-gray-800 mb-4">{title}</h3>
    <p className="text-gray-600 leading-relaxed">{text}</p>
  </div>
);

const StatCard = ({ value, label }) => (
  <div className="text-center transform hover:scale-105 transition-transform duration-200">
    <div className="text-4xl md:text-5xl font-bold mb-2">{value}</div>
    <div className="text-white text-lg font-medium opacity-90">{label}</div>
  </div>
);

const ContactCard = ({ icon, title, info, bgColor }) => (
  <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl border border-gray-100 hover:border-green-200 transition-all duration-300 text-center">
    <div className={`${bgColor} w-16 h-16 flex items-center justify-center rounded-2xl mx-auto mb-4`}>
      {icon}
    </div>
    <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
    <p className="text-gray-600">{info}</p>
  </div>
);

export default HomePage;