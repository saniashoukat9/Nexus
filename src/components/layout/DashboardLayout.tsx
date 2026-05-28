import React, { useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';

const tourSteps = [
  {
    title: '👋 Welcome to Business Nexus!',
    description: 'Let us give you a quick tour of all the features available on this platform.',
    position: 'center' as const,
  },
  {
    title: '🏠 Dashboard',
    description: 'Your main overview — see wallet balance, connections, pending requests and more.',
    position: 'sidebar' as const,
  },
  {
    title: '📅 Meetings',
    description: 'Schedule meetings with investors or entrepreneurs. Accept or decline requests from the calendar.',
    position: 'sidebar' as const,
  },
  {
    title: '📹 Video Call',
    description: 'Start face-to-face video calls. Toggle camera, mute audio and share screen in real-time.',
    position: 'sidebar' as const,
  },
  {
    title: '📄 Documents',
    description: 'Upload and manage your deal documents. Sign contracts with e-signature and track their status.',
    position: 'sidebar' as const,
  },
  {
    title: '💳 Payments',
    description: 'Manage your wallet — deposit, withdraw, transfer funds and track all transaction history.',
    position: 'sidebar' as const,
  },
  {
    title: '💬 Messages',
    description: 'Chat directly with investors or entrepreneurs on the platform.',
    position: 'sidebar' as const,
  },
  {
    title: '🚀 You are all set!',
    description: 'You now know your way around Business Nexus. Start connecting with investors and entrepreneurs!',
    position: 'center' as const,
  },
];

export const DashboardLayout: React.FC = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [runTour, setRunTour] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const startTour = () => {
    setCurrentStep(0);
    setRunTour(true);
  };

  const nextStep = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      setRunTour(false);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) setCurrentStep(prev => prev - 1);
  };

  const skipTour = () => setRunTour(false);

  const step = tourSteps[currentStep];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">

      {/* Custom Tour Overlay */}
      {runTour && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={skipTour} />

          {/* Tour Card */}
          <div
            className={`fixed z-50 bg-white rounded-2xl shadow-2xl p-6 w-80 ${
              step.position === 'center'
                ? 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'
                : 'top-1/2 left-72 -translate-y-1/2'
            }`}
          >
            {/* Progress dots */}
            <div className="flex gap-1.5 mb-4">
              {tourSteps.map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 rounded-full transition-all ${
                    i === currentStep ? 'bg-blue-600 w-6' : 'bg-gray-200 w-1.5'
                  }`}
                />
              ))}
            </div>

            {/* Step counter */}
            <p className="text-xs text-blue-600 font-medium mb-2">
              Step {currentStep + 1} of {tourSteps.length}
            </p>

            {/* Content */}
            <h3 className="text-base font-bold text-gray-900 mb-2">{step.title}</h3>
            <p className="text-sm text-gray-500 leading-relaxed">{step.description}</p>

            {/* Buttons */}
            <div className="flex items-center justify-between mt-5">
              <button
                onClick={skipTour}
                className="text-xs text-gray-400 hover:text-gray-600 transition"
              >
                Skip tour
              </button>
              <div className="flex gap-2">
                {currentStep > 0 && (
                  <button
                    onClick={prevStep}
                    className="px-3 py-1.5 text-xs border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition"
                  >
                    Back
                  </button>
                )}
                <button
                  onClick={nextStep}
                  className="px-4 py-1.5 text-xs bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                >
                  {currentStep === tourSteps.length - 1 ? 'Finish 🎉' : 'Next →'}
                </button>
              </div>
            </div>
          </div>

          {/* Arrow pointer for sidebar steps */}
          {step.position === 'sidebar' && (
            <div className="fixed z-50 top-1/2 left-64 -translate-y-1/2">
              <div className="w-0 h-0 border-t-8 border-b-8 border-r-8 border-t-transparent border-b-transparent border-r-white" />
            </div>
          )}
        </>
      )}

      <Navbar />

      <div className="flex-1 flex overflow-hidden">
        <Sidebar />

        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">

            {/* Guided Tour Button */}
            <button
              onClick={startTour}
              className="fixed bottom-6 right-6 z-30 bg-blue-600 text-white px-4 py-3 rounded-full shadow-lg hover:bg-blue-700 transition flex items-center gap-2 text-sm font-medium"
            >
              <span>🧭</span>
              <span className="hidden sm:inline">Guided Tour</span>
            </button>

            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};