import React, { useState } from 'react';
import ExpenseTracker from './components/ExpenseTracker';
import Login from './components/Login';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <div className="w-full min-h-screen">
      {isLoggedIn ? (
        <ExpenseTracker onLogout={() => setIsLoggedIn(false)} />
      ) : (
        <Login onLogin={() => setIsLoggedIn(true)} />
      )}
    </div>
  );
}

export default App;
