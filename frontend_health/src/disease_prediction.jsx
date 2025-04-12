import { useState, useEffect } from 'react';

function App() {
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [availableSymptoms, setAvailableSymptoms] = useState([]);
  const [predictions, setPredictions] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [modelInfo, setModelInfo] = useState(null);

  // List of all possible symptoms - fixing any formatting issues
  const allSymptoms = [
    'abdominal_pain', 'acidity', 'altered_sensorium', 'back_pain',
    'blurred_and_distorted_vision', 'breathlessness', 'burning_micturition',
    'chest_pain', 'chills', 'continuous_sneezing', 'cough', 'dark_urine',
    'depression', 'diarrhoea', 'dischromic_patches', 'dizziness',
    'excessive_hunger', 'extra_marital_contacts', 'family_history',
    'fatigue', 'headache', 'high_fever', 'increased_appetite',
    'indigestion', 'internal_itching', 'irregular_sugar_level',
    'irritability', 'itching', 'lack_of_concentration', 'lethargy',
    'loss_of_appetite', 'loss_of_balance', 'muscle_pain',
    'muscle_wasting', 'mucoid_sputum', 'nausea', 'neck_pain',
    'nodal_skin_eruptions', 'obesity', 'patches_in_throat',
    'passage_of_gases', 'polyuria', 'restlessness', 'shivering',
    'skin_rash', 'spotting_urination', 'stiff_neck', 'stomach_pain',
    'sunken_eyes', 'sweating', 'vomiting', 'watering_from_eyes',
    'weakness_in_limbs', 'weakness_of_one_body_side', 'weight_loss',
    'visual_disturbances', 'yellowing_of_eyes', 'yellowish_skin'
  ];

  // Initialize available symptoms
  useEffect(() => {
    setAvailableSymptoms(allSymptoms.filter(s => !selectedSymptoms.includes(s)));
  }, []);

  const handleSymptomAdd = (e) => {
    const symptom = e.target.value;
    if (symptom && !selectedSymptoms.includes(symptom) && selectedSymptoms.length < 7) {
      const updatedSelected = [...selectedSymptoms, symptom];
      setSelectedSymptoms(updatedSelected);
      setAvailableSymptoms(allSymptoms.filter(s => !updatedSelected.includes(s)));
    }
  };

  const handleSymptomRemove = (symptomToRemove) => {
    const updatedSelected = selectedSymptoms.filter(s => s !== symptomToRemove);
    setSelectedSymptoms(updatedSelected);
    setAvailableSymptoms([...availableSymptoms, symptomToRemove].sort());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (selectedSymptoms.length < 3) {
      setError("Please select at least 3 symptoms");
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      console.log("Sending data:", { symptoms: selectedSymptoms });
      
      const response = await fetch('http://127.0.0.1:8000/predict_disease', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ symptoms: selectedSymptoms }),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("API error response:", errorText);
        throw new Error(`Server responded with status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("API response:", data);
      
      // Handle the response format based on your API's response structure
      setPredictions(data.predictions || []);
      setModelInfo(data.model_info || null);
    } catch (err) {
      console.error("Error details:", err);
      setError(`Failed to fetch predictions: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setSelectedSymptoms([]);
    setAvailableSymptoms(allSymptoms);
    setPredictions(null);
    setError(null);
    setModelInfo(null);
  };

  // Mock function to demonstrate the UI with example data when needed
  const handleDemoData = () => {
    const mockResponse = {
      input_symptoms: ["itching", "skin_rash", "nodal_skin_eruptions", "dischromic_patches"],
      predictions: [
        { disease: "Fungal infection", confidence: 63.36 },
        { disease: "Common Cold", confidence: 3.02 },
        { disease: "Tuberculosis", confidence: 2.0 }
      ],
      model_info: {
        type: "VotingClassifier(RandomForest + GradientBoosting)",
        accuracy: 95.08,
        version: "1.0"
      }
    };
    
    setPredictions(mockResponse.predictions);
    setModelInfo(mockResponse.model_info);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-md mx-auto">
            <div>
              <h1 className="text-2xl font-semibold text-center text-gray-900">Disease Prediction System</h1>
            </div>
            
            <div className="divide-y divide-gray-200">
              <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                <form onSubmit={handleSubmit}>
                  <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Select your symptoms (min 3, max 7):
                    </label>
                    
                    {/* Display selected symptoms */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {selectedSymptoms.map((symptom, index) => (
                        <div key={index} className="flex items-center bg-blue-100 px-3 py-1 rounded-full">
                          <span className="mr-1">{symptom.replace(/_/g, ' ')}</span>
                          <button
                            type="button"
                            onClick={() => handleSymptomRemove(symptom)}
                            className="text-red-500 hover:text-red-700"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                    
                    {/* Dropdown for adding symptoms */}
                    <select
                      onChange={handleSymptomAdd}
                      value=""
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      disabled={selectedSymptoms.length >= 7}
                    >
                      <option value="">Select a symptom</option>
                      {availableSymptoms.map((symptom, index) => (
                        <option key={index} value={symptom}>
                          {symptom.replace(/_/g, ' ')}
                        </option>
                      ))}
                    </select>

                    {selectedSymptoms.length < 3 && (
                      <p className="mt-2 text-sm text-red-600">
                        Please select at least {3 - selectedSymptoms.length} more symptom(s).
                      </p>
                    )}
                    
                    {selectedSymptoms.length >= 7 && (
                      <p className="mt-2 text-sm text-yellow-600">
                        Maximum number of symptoms (7) selected.
                      </p>
                    )}
                  </div>
                  
                  <div className="flex justify-between">
                    <button
                      type="submit"
                      disabled={selectedSymptoms.length < 3 || isLoading}
                      className={`px-4 py-2 rounded-md text-white font-medium ${
                        selectedSymptoms.length < 3 || isLoading
                          ? 'bg-gray-400 cursor-not-allowed'
                          : 'bg-indigo-600 hover:bg-indigo-700'
                      }`}
                    >
                      {isLoading ? 'Analyzing...' : 'Predict Disease'}
                    </button>
                    
                    <button
                      type="button"
                      onClick={handleReset}
                      className="px-4 py-2 bg-gray-200 rounded-md text-gray-700 font-medium hover:bg-gray-300"
                    >
                      Reset
                    </button>
                  </div>

                  {/* Debug button - remove in production */}
                  <div className="mt-2">
                    <button
                      type="button"
                      onClick={handleDemoData}
                      className="text-xs text-gray-500 underline"
                    >
                      Show Demo Results
                    </button>
                  </div>
                </form>
                
                {error && (
                  <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                    {error}
                  </div>
                )}
                
                {predictions && (
                  <div className="mt-6">
                    <h2 className="text-xl font-bold mb-3">Prediction Results:</h2>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      {predictions.map((prediction, index) => (
                        <div key={index} className={`mb-2 p-2 rounded ${index === 0 ? 'bg-green-100' : ''}`}>
                          <span className={`font-semibold ${index === 0 ? 'text-green-800' : 'text-gray-700'}`}>
                            {prediction.disease}:
                          </span>
                          <span className="ml-2">{prediction.confidence.toFixed(2)}% confidence</span>
                          {index === 0 && (
                            <div className="mt-1 text-sm text-green-600">
                              Top prediction
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                    
                    {modelInfo && (
                      <div className="mt-4 text-sm text-gray-600">
                        <p>Model: {modelInfo.type}</p>
                        <p>Accuracy: {modelInfo.accuracy}%</p>
                        <p>Version: {modelInfo.version}</p>
                        <p className="mt-2 text-xs italic">
                          Disclaimer: This prediction is for informational purposes only and should not replace professional medical advice.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;