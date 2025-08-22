import React, { useEffect, useState } from 'react';

const LoginDebugger: React.FC = () => {
  const [logs, setLogs] = useState<string[]>([]);
  const [authTokens, setAuthTokens] = useState<string>('');
  const [userData, setUserData] = useState<string>('');

  useEffect(() => {
    // Store original console methods
    const originalLog = console.log;
    const originalError = console.error;
    const originalWarn = console.warn;

    // Create a custom logger that captures relevant logs
    const captureLog = (level: string, ...args: any[]) => {
      const message = args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
      ).join(' ');
      
      // Only capture auth-related logs
      if (message.includes('🔑') || message.includes('👤') || message.includes('🚨') || 
          message.includes('Auth') || message.includes('Token') || message.includes('User')) {
        const timestamp = new Date().toLocaleTimeString();
        setLogs(prev => [...prev.slice(-20), `[${timestamp}] ${level}: ${message}`]);
      }
    };

    // Override console methods
    console.log = (...args) => {
      originalLog.apply(console, args);
      captureLog('LOG', ...args);
    };

    console.error = (...args) => {
      originalError.apply(console, args);
      captureLog('ERROR', ...args);
    };

    console.warn = (...args) => {
      originalWarn.apply(console, args);
      captureLog('WARN', ...args);
    };

    // Monitor sessionStorage changes
    const checkStorage = () => {
      const tokens = sessionStorage.getItem('auth_tokens');
      const user = sessionStorage.getItem('user_data');
      
      setAuthTokens(tokens ? 'EXISTS' : 'NULL');
      setUserData(user ? 'EXISTS' : 'NULL');
    };

    // Check storage every 500ms
    const interval = setInterval(checkStorage, 500);
    checkStorage(); // Initial check

    // Setup storage event listener for changes from other tabs
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'auth_tokens' || e.key === 'user_data') {
        captureLog('STORAGE', `Storage changed: ${e.key} = ${e.newValue ? 'EXISTS' : 'NULL'}`);
        checkStorage();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // Cleanup
    return () => {
      console.log = originalLog;
      console.error = originalError;
      console.warn = originalWarn;
      clearInterval(interval);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const clearLogs = () => setLogs([]);

  const testAuth = () => {
    const tokens = sessionStorage.getItem('auth_tokens');
    const user = sessionStorage.getItem('user_data');
    
    console.log('🧪 Manual Auth Test:');
    console.log('- Auth Tokens:', tokens ? 'EXISTS' : 'NULL');
    console.log('- User Data:', user ? 'EXISTS' : 'NULL');
    
    if (tokens) {
      try {
        const parsedTokens = JSON.parse(tokens);
        console.log('- Token Expiry:', new Date(parsedTokens.tokenExpiry).toISOString());
        console.log('- Time Until Expiry:', Math.round((parsedTokens.tokenExpiry - Date.now()) / 1000), 'seconds');
      } catch (e) {
        console.error('- Failed to parse tokens:', e);
      }
    }
  };

  const clearAllData = () => {
    sessionStorage.clear();
    console.log('🧹 Cleared all sessionStorage data');
  };

  return (
    <div className="fixed bottom-4 right-4 w-96 bg-black/90 text-white p-4 rounded-lg border border-white/20 max-h-96 overflow-hidden z-50">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-bold">Auth Debugger</h3>
        <div className="flex gap-2">
          <button 
            onClick={testAuth}
            className="px-2 py-1 bg-blue-600 text-xs rounded"
          >
            Test
          </button>
          <button 
            onClick={clearLogs}
            className="px-2 py-1 bg-gray-600 text-xs rounded"
          >
            Clear
          </button>
          <button 
            onClick={clearAllData}
            className="px-2 py-1 bg-red-600 text-xs rounded"
          >
            Reset
          </button>
        </div>
      </div>
      
      <div className="text-xs mb-2">
        <div>Auth Tokens: <span className={authTokens === 'EXISTS' ? 'text-green-400' : 'text-red-400'}>{authTokens}</span></div>
        <div>User Data: <span className={userData === 'EXISTS' ? 'text-green-400' : 'text-red-400'}>{userData}</span></div>
      </div>
      
      <div className="text-xs font-mono overflow-y-auto max-h-48 bg-gray-900/50 p-2 rounded">
        {logs.length === 0 ? (
          <div className="text-gray-400">No auth logs yet...</div>
        ) : (
          logs.map((log, index) => (
            <div 
              key={index} 
              className={`mb-1 ${log.includes('ERROR') ? 'text-red-400' : log.includes('WARN') ? 'text-yellow-400' : 'text-green-400'}`}
            >
              {log}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default LoginDebugger;