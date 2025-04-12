// import { useState } from 'react';
// import './App.css';
// import ECGPredictionApp from './ecg_prediction';
// import DiseasePrediction from './disease_prediction';
// import MealPlanner from './meal_planner';
// import { 
//   Activity, BarChart, Utensils, 
//   Home, Heart, User, Bell,
//   Menu, X, ChevronRight
// } from 'lucide-react';

// function App() {
//   const [activeTab, setActiveTab] = useState('dashboard');
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

//   // Sample health data for visualization
//   const healthData = {
//     heartRate: {
//       current: 72,
//       trend: [65, 68, 72, 75, 73, 70, 72],
//       status: 'normal'
//     },
//     bloodPressure: {
//       current: '118/78',
//       trend: ['120/80', '118/76', '122/82', '119/79', '118/78'],
//       status: 'normal'
//     },
//     sleepHours: {
//       current: 7.5,
//       trend: [6.5, 7, 8, 7.5, 7.5, 8, 7.5],
//       status: 'good' 
//     },
//     riskScore: {
//       current: 18,
//       max: 100,
//       status: 'low'
//     }
//   };
  
//   // Sample upcoming activities
//   const upcomingActivities = [
//     { id: 1, title: 'Blood Pressure Check', time: 'Today, 06:00 PM' },
//     { id: 2, title: 'Take Medication', time: 'Today, 09:00 PM' },
//     { id: 3, title: 'Morning Exercise', time: 'Tomorrow, 07:00 AM' }
//   ];

//   const renderTrendIndicator = (trend) => {
//     const lastTwo = Array.isArray(trend) ? 
//       [trend[trend.length - 2], trend[trend.length - 1]] : 
//       [0, 0];
    
//     const isIncreasing = lastTwo[1] > lastTwo[0];
//     const isDecreasing = lastTwo[1] < lastTwo[0];
    
//     if (isIncreasing) return <span className="text-green-500">↑</span>;
//     if (isDecreasing) return <span className="text-red-500">↓</span>;
//     return <span className="text-gray-500">→</span>;
//   };

//   const renderHealthStatus = (status) => {
//     const colors = {
//       normal: 'bg-green-100 text-green-800',
//       good: 'bg-green-100 text-green-800',
//       high: 'bg-yellow-100 text-yellow-800',
//       low: 'bg-blue-100 text-blue-800',
//       critical: 'bg-red-100 text-red-800'
//     };
    
//     return (
//       <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[status] || 'bg-gray-100 text-gray-800'}`}>
//         {status}
//       </span>
//     );
//   };

//   const renderTabContent = () => {
//     switch (activeTab) {
//       case 'dashboard':
//         return (
//           <div className="space-y-6">
//             <div className="bg-gradient-to-r from-blue-500 to-blue-700 rounded-xl p-6 shadow-lg text-white">
//               <h1 className="text-2xl font-bold mb-2">Welcome Back!</h1>
//               <p className="opacity-90">Your health metrics look good today. Keep it up!</p>
//               <div className="flex items-center mt-4">
//                 <div className="bg-white bg-opacity-20 rounded-lg px-4 py-2 text-white mr-3">
//                   <span className="font-semibold">18</span> Risk Score
//                 </div>
//                 <div className="bg-white bg-opacity-20 rounded-lg px-4 py-2 text-white">
//                   <span className="font-semibold">3</span> Reminders
//                 </div>
//               </div>
//             </div>
            
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//               {/* Heart Rate Card */}
//               <div className="bg-white rounded-xl p-4 shadow">
//                 <div className="flex justify-between items-center mb-2">
//                   <div className="flex items-center">
//                     <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center mr-2">
//                       <Heart size={18} className="text-red-500" />
//                     </div>
//                     <h3 className="font-medium">Heart Rate</h3>
//                   </div>
//                   {renderHealthStatus(healthData.heartRate.status)}
//                 </div>
//                 <div className="flex items-end">
//                   <span className="text-3xl font-bold">{healthData.heartRate.current}</span>
//                   <span className="text-gray-500 ml-1 mb-1">bpm</span>
//                   <span className="ml-2 mb-1">{renderTrendIndicator(healthData.heartRate.trend)}</span>
//                 </div>
//                 <div className="mt-3 flex space-x-1">
//                   {healthData.heartRate.trend.map((value, i) => (
//                     <div 
//                       key={i} 
//                       className="flex-1 bg-red-100 rounded-sm relative overflow-hidden"
//                       style={{ height: '30px' }}
//                     >
//                       <div 
//                         className="absolute bottom-0 w-full bg-red-500"
//                         style={{ height: `${(value / 100) * 100}%` }}
//                       ></div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
              
//               {/* Blood Pressure Card */}
//               <div className="bg-white rounded-xl p-4 shadow">
//                 <div className="flex justify-between items-center mb-2">
//                   <div className="flex items-center">
//                     <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-2">
//                       <Activity size={18} className="text-blue-500" />
//                     </div>
//                     <h3 className="font-medium">Blood Pressure</h3>
//                   </div>
//                   {renderHealthStatus(healthData.bloodPressure.status)}
//                 </div>
//                 <div className="flex items-end">
//                   <span className="text-3xl font-bold">{healthData.bloodPressure.current}</span>
//                   <span className="text-gray-500 ml-1 mb-1">mmHg</span>
//                 </div>
//                 <div className="mt-4 flex items-center">
//                   <div className="flex-1 bg-gray-200 rounded-full h-2">
//                     <div className="bg-blue-500 h-2 rounded-full" style={{ width: '70%' }}></div>
//                   </div>
//                   <span className="ml-3 text-sm text-gray-500">70%</span>
//                 </div>
//               </div>
              
//               {/* Sleep Hours Card */}
//               <div className="bg-white rounded-xl p-4 shadow">
//                 <div className="flex justify-between items-center mb-2">
//                   <div className="flex items-center">
//                     <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center mr-2">
//                       <svg className="w-4 h-4 text-purple-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
//                         <path d="M17 4C17 3.44772 17.4477 3 18 3C18.5523 3 19 3.44772 19 4V5H20C20.5523 5 21 5.44772 21 6C21 6.55228 20.5523 7 20 7H19V8C19 8.55228 18.5523 9 18 9C17.4477 9 17 8.55228 17 8V7H16C15.4477 7 15 6.55228 15 6C15 5.44772 15.4477 5 16 5H17V4Z" fill="currentColor" />
//                         <path d="M12 4C12 3.44772 12.4477 3 13 3C13.5523 3 14 3.44772 14 4V5H15C15.5523 5 16 5.44772 16 6C16 6.55228 15.5523 7 15 7H14V8C14 8.55228 13.5523 9 13 9C12.4477 9 12 8.55228 12 8V7H11C10.4477 7 10 6.55228 10 6C10 5.44772 10.4477 5 11 5H12V4Z" fill="currentColor" />
//                         <path d="M7 11C7 9.89543 7.89543 9 9 9H15C16.1046 9 17 9.89543 17 11V19C17 20.1046 16.1046 21 15 21H9C7.89543 21 7 20.1046 7 19V11Z" fill="currentColor" />
//                       </svg>
//                     </div>
//                     <h3 className="font-medium">Sleep Hours</h3>
//                   </div>
//                   {renderHealthStatus(healthData.sleepHours.status)}
//                 </div>
//                 <div className="flex items-end">
//                   <span className="text-3xl font-bold">{healthData.sleepHours.current}</span>
//                   <span className="text-gray-500 ml-1 mb-1">hours</span>
//                   <span className="ml-2 mb-1">{renderTrendIndicator(healthData.sleepHours.trend)}</span>
//                 </div>
//                 <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
//                   <span>0</span>
//                   <span>4</span>
//                   <span>8</span>
//                   <span>12</span>
//                 </div>
//                 <div className="mt-1 bg-gray-200 rounded-full h-2">
//                   <div className="bg-purple-500 h-2 rounded-full" style={{ width: `${(healthData.sleepHours.current / 12) * 100}%` }}></div>
//                 </div>
//               </div>
//             </div>
            
//             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//               <div className="lg:col-span-2 bg-white rounded-xl p-4 shadow">
//                 <div className="flex justify-between items-center mb-4">
//                   <h2 className="text-lg font-semibold">Risk Assessment</h2>
//                   <button className="text-blue-500 text-sm font-medium">Details</button>
//                 </div>
//                 <div className="relative pt-4">
//                   <div className="flex mb-2 items-center justify-between">
//                     <div>
//                       <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200">
//                         Your Risk Score: {healthData.riskScore.current}
//                       </span>
//                     </div>
//                     <div className="text-right">
//                       <span className="text-xs font-semibold inline-block text-blue-600">
//                         {healthData.riskScore.current}%
//                       </span>
//                     </div>
//                   </div>
//                   <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200">
//                     <div style={{ width: `${healthData.riskScore.current}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"></div>
//                   </div>
//                   <div className="grid grid-cols-3 gap-4 mt-6">
//                     <div className="bg-green-50 p-3 rounded-lg text-center">
//                       <p className="text-green-600 font-semibold text-lg">Low</p>
//                       <p className="text-xs text-gray-500">0-30%</p>
//                     </div>
//                     <div className="bg-yellow-50 p-3 rounded-lg text-center">
//                       <p className="text-yellow-600 font-semibold text-lg">Medium</p>
//                       <p className="text-xs text-gray-500">31-70%</p>
//                     </div>
//                     <div className="bg-red-50 p-3 rounded-lg text-center">
//                       <p className="text-red-600 font-semibold text-lg">High</p>
//                       <p className="text-xs text-gray-500">71-100%</p>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               <div className="bg-white rounded-xl p-4 shadow">
//                 <div className="flex justify-between items-center mb-4">
//                   <h2 className="text-lg font-semibold">Upcoming Activities</h2>
//                   <button className="text-blue-500 text-sm font-medium">View All</button>
//                 </div>
//                 <div className="space-y-3">
//                   {upcomingActivities.map((activity) => (
//                     <div key={activity.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
//                       <div>
//                         <p className="font-medium">{activity.title}</p>
//                         <p className="text-xs text-gray-500">{activity.time}</p>
//                       </div>
//                       <ChevronRight size={16} className="text-gray-400" />
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           </div>
//         );
//       case 'ecg':
//         return <ECGPredictionApp />;
//       case 'disease':
//         return <DiseasePrediction />;
//       case 'meal':
//         return <MealPlanner />;
//       default:
//         return <div className="text-center py-12">Select a module from the sidebar</div>;
//     }
//   };

//   // Navigation items
//   const navItems = [
//     { id: 'dashboard', label: 'Dashboard', icon: <Home size={22} /> },
//     { id: 'ecg', label: 'ECG Analysis', icon: <Activity size={22} /> },
//     { id: 'disease', label: 'Risk Prediction', icon: <BarChart size={22} /> },
//     { id: 'meal', label: 'Meal Planner', icon: <Utensils size={22} /> }
//   ];

//   return (
//     <div className="flex h-screen bg-gray-100">
//       {/* Mobile Sidebar Toggle */}
//       <div className="md:hidden fixed top-0 left-0 right-0 z-20 bg-white shadow-sm flex items-center justify-between p-4">
//         <button 
//           onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
//           className="p-2 rounded-md text-gray-500 hover:bg-gray-100"
//         >
//           {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
//         </button>
//         <h1 className="text-xl font-bold text-blue-600">HealthTracker</h1>
//         <div className="flex items-center">
//           <button className="relative p-2 rounded-full text-gray-500 hover:bg-gray-100 mr-2">
//             <Bell size={20} />
//             <span className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
//               3
//             </span>
//           </button>
//           <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 text-white flex items-center justify-center">
//             <User size={16} />
//           </div>
//         </div>
//       </div>

//       {/* Mobile Menu */}
//       {isMobileMenuOpen && (
//         <div className="fixed inset-0 z-10 bg-gray-900 bg-opacity-50 md:hidden" onClick={() => setIsMobileMenuOpen(false)}>
//           <div 
//             className="fixed inset-y-0 left-0 w-64 bg-white shadow-xl p-4"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <div className="flex items-center justify-between mb-6">
//               <h1 className="text-xl font-bold text-blue-600">HealthTracker</h1>
//               <button onClick={() => setIsMobileMenuOpen(false)}>
//                 <X size={24} className="text-gray-500" />
//               </button>
//             </div>
//             <nav className="space-y-2">
//               {navItems.map(item => (
//                 <button
//                   key={item.id}
//                   onClick={() => { setActiveTab(item.id); setIsMobileMenuOpen(false); }}
//                   className={`flex items-center w-full px-4 py-3 rounded-lg text-sm font-medium ${
//                     activeTab === item.id 
//                       ? 'bg-blue-50 text-blue-600' 
//                       : 'text-gray-700 hover:bg-gray-50'
//                   }`}
//                 >
//                   <span className="mr-3">{item.icon}</span>
//                   {item.label}
//                 </button>
//               ))}
//             </nav>
//           </div>
//         </div>
//       )}

//       {/* Desktop Sidebar */}
//       <aside className="hidden md:flex md:flex-col w-20 bg-white shadow-sm">
//         <div className="flex flex-col items-center py-6">
//           <div className="h-10 w-10 rounded-lg bg-gradient-to-r from-blue-400 to-blue-600 text-white flex items-center justify-center mb-6">
//             <Heart size={20} />
//           </div>
//           <nav className="flex-1 space-y-2">
//             {navItems.map(item => (
//               <button
//                 key={item.id}
//                 onClick={() => setActiveTab(item.id)}
//                 className={`flex flex-col items-center justify-center w-16 h-16 rounded-xl text-xs font-medium ${
//                   activeTab === item.id 
//                     ? 'bg-blue-50 text-blue-600' 
//                     : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
//                 }`}
//               >
//                 {item.icon}
//                 <span className="mt-1">{item.label}</span>
//               </button>
//             ))}
//           </nav>
//         </div>
//       </aside>

//       {/* Main Content */}
//       <main className="flex-1 overflow-y-auto">
//         <div className="p-4 md:p-6 pt-20 md:pt-6 max-w-6xl mx-auto">
//           {renderTabContent()}
//         </div>
//       </main>
//     </div>
//   );
// }

// export default App;
import React, { useState } from 'react';
import RiskPredictionForm from './riskPrediction';
import FitnessPredictionForm from './fitnessPrediction';
import ECGPredictionApp from './ecg_prediction';
import DiseasePrediction from './disease_prediction';
import MealPlanner from './meal_planner';

export default function App() {
  const [activeTab, setActiveTab] = useState('ECG');

  const tabs = [
    { name: 'ECG Prediction', key: 'ECG' },
    { name: 'Disease Prediction', key: 'Disease' },
    { name: 'Meal Planner', key: 'Meal' },
    { name: 'Risk Prediction', key: 'Risk' },
    { name: 'Fitness Prediction', key: 'Fitness' },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'ECG':
        return <ECGPredictionApp />;
      case 'Disease':
        return <DiseasePrediction />;
      case 'Meal':
        return <MealPlanner />;
      case 'Risk':
        return <RiskPredictionForm />;
      case 'Fitness':
        return <FitnessPredictionForm />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 pt-6 md:p-6 lg:p-8">
      <h1 className="text-3xl font-bold mb-4">AI-Powered Health Dashboard</h1>

      {/* Tabs Navigation */}
      <div className="flex space-x-4 border-b mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 font-medium ${
              activeTab === tab.key
                ? 'border-b-2 border-blue-500 text-blue-500'
                : 'text-gray-600 hover:text-blue-500'
            }`}
          >
            {tab.name}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="bg-white shadow-md rounded p-4">{renderContent()}</div>
    </div>
  );
}
