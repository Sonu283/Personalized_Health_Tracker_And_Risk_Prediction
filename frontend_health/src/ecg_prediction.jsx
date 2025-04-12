import { useState } from 'react';

export default function ECGPredictionApp() {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const classInfo = {
    0: { name: 'Normal (1dAVb)', color: 'bg-green-100 text-green-800', desc: 'First-degree Atrioventricular block' },
    1: { name: 'Right Bundle Branch Block (RBBB)', color: 'bg-yellow-100 text-yellow-800', desc: 'Delayed activation of the right ventricle' },
    2: { name: 'Left Bundle Branch Block (LBBB)', color: 'bg-orange-100 text-orange-800', desc: 'Delayed activation of the left ventricle' },
    3: { name: 'Sinus Bradycardia (SB)', color: 'bg-blue-100 text-blue-800', desc: 'Abnormally slow heart rhythm from the sinus node' },
    4: { name: 'Atrial Fibrillation (AF)', color: 'bg-purple-100 text-purple-800', desc: 'Irregular rhythm with rapid, disorganized atrial activity' },
    5: { name: 'ST Elevation (ST)', color: 'bg-red-100 text-red-800', desc: 'ST segment elevation, often indicating myocardial injury' }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.name.endsWith('.csv')) {
      setFile(selectedFile);
      setFileName(selectedFile.name);
      setError('');
    } else {
      setFile(null);
      setFileName('');
      setError('Please select a valid CSV file');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!file) {
      setError('Please select a CSV file');
      return;
    }

    setIsLoading(true);
    setError('');
    
    const formData = new FormData();
    formData.append('file', file);

    try {
      // In a real app, you would send the CSV file
      // For now, we'll simulate the API response
      setTimeout(() => {
        // Mock the API response
        const mockResponse = {
          predicted_class: 0,
          confidence_percent: 45.17
        };
        setResult(mockResponse);
        setIsLoading(false);
      }, 1500);

      // Actual API call would look like this:
      const response = await fetch('http://127.0.0.1:8000/predict_ecg', {
        method: 'POST',
        mode: "no-cors",
        body: formData,
      });
      const data = await response.json();
      setResult(data);
    } catch (err) {
      // setError('Error processing the file. Please try again.');
      setIsLoading(false);
    }
  };

  // Function to determine confidence text color
  const getConfidenceColorClass = (confidence) => {
    if (confidence < 40) return 'text-red-600';
    if (confidence < 70) return 'text-yellow-600';
    return 'text-green-600';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-blue-700 text-white shadow-lg">
        <div className="container mx-auto px-4 py-6 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
          </svg>
          <h1 className="text-2xl font-bold">CardioSense Hospital</h1>
          <div className="ml-auto text-sm">ECG Analysis System</div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
            <div className="bg-blue-600 px-6 py-4">
              <h2 className="text-xl font-semibold text-white">ECG Pattern Analysis</h2>
            </div>
            <div className="p-6">
              <form onSubmit={handleSubmit} className="mb-6">
                <div className="mb-6">
                  <label className="block text-gray-700 font-medium mb-2">
                    Upload ECG Data (CSV format only)
                  </label>
                  <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-blue-300 border-dashed rounded-lg cursor-pointer bg-blue-50 hover:bg-blue-100 transition-all">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <svg className="w-10 h-10 mb-3 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                        </svg>
                        {fileName ? (
                          <p className="mb-2 text-sm text-blue-600 font-semibold">{fileName}</p>
                        ) : (
                          <>
                            <p className="mb-2 text-sm text-blue-600 font-semibold">Click to upload ECG data</p>
                            <p className="text-xs text-gray-500">CSV files only</p>
                          </>
                        )}
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        accept=".csv"
                        onChange={handleFileChange}
                      />
                    </label>
                  </div>
                  {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
                </div>
                <button
                  type="submit"
                  disabled={isLoading || !file}
                  className={`w-full py-3 px-4 rounded-md font-medium text-white transition-colors ${
                    isLoading || !file 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
                  }`}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </div>
                  ) : 'Analyze ECG Data'}
                </button>
              </form>

              {/* Results section */}
              {result && (
                <div className="mt-8 border rounded-lg overflow-hidden">
                  <div className="bg-gray-100 px-4 py-3 border-b">
                    <h3 className="font-semibold text-gray-800">Analysis Results</h3>
                  </div>
                  <div className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="bg-white p-4 rounded-lg border">
                        <p className="text-sm text-gray-500 mb-1">Detected Pattern</p>
                        <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium mt-1 ${classInfo[result.predicted_class].color}`}>
                          {classInfo[result.predicted_class].name}
                        </div>
                      </div>
                      <div className="bg-white p-4 rounded-lg border">
                        <p className="text-sm text-gray-500 mb-1">Confidence</p>
                        <p className={`text-2xl font-bold ${getConfidenceColorClass(result.confidence_percent)}`}>
                          {result.confidence_percent.toFixed(2)}%
                        </p>
                      </div>
                    </div>
                    
                    <div className="bg-white p-4 rounded-lg border">
                      <p className="text-sm text-gray-500 mb-2">Description</p>
                      <p className="text-gray-700">{classInfo[result.predicted_class].desc}</p>
                    </div>
                    
                    <div className="mt-6">
                      <h4 className="font-medium text-gray-700 mb-3">Recommendation</h4>
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                          </svg>
                          <p className="text-sm text-blue-700">
                            These results are based on machine learning analysis. Please consult with a cardiologist for clinical interpretation and diagnosis.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Classification Guide */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-blue-600 px-6 py-4">
              <h2 className="text-xl font-semibold text-white">ECG Classification Guide</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(classInfo).map(([key, info]) => (
                  <div key={key} className="border rounded-lg overflow-hidden">
                    <div className={`${info.color} px-4 py-2 font-medium`}>
                      {info.name}
                    </div>
                    <div className="p-4 bg-white">
                      <p className="text-sm text-gray-600">{info.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-gray-800 text-gray-300 py-6">
        <div className="container mx-auto px-4 text-center text-sm">
          <p>© 2025 CardioSense Hospital. ECG Analysis System.</p>
          <p className="mt-2">This tool is for educational purposes only. Always consult with a healthcare professional.</p>
        </div>
      </footer>
    </div>
  );
}