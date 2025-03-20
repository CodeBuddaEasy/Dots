import { useState } from 'react';
import { runDatabaseTest } from '../tests/database.test';

export const DatabaseTest = () => {
  const [testStatus, setTestStatus] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const handleTest = async () => {
    setIsLoading(true);
    setTestStatus('Running tests...');
    
    try {
      await runDatabaseTest();
      setTestStatus('Tests completed! Check console for details.');
    } catch (error) {
      setTestStatus(`Test failed: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg shadow-sm">
      <h2 className="text-xl font-bold mb-4">Database Test</h2>
      <button
        onClick={handleTest}
        disabled={isLoading}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
      >
        {isLoading ? 'Running...' : 'Run Database Test'}
      </button>
      {testStatus && (
        <div className="mt-4 p-3 bg-gray-100 rounded">
          <pre>{testStatus}</pre>
        </div>
      )}
    </div>
  );
}; 