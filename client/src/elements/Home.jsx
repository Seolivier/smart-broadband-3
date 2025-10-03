import React, { useState } from 'react';
import Smart from './Smart';
import Create from './Create';
import Read from './Read';
import Edit from './Edit';

export default function Home() {
  const [view, setView] = useState('clients');
  const [selectedClientId, setSelectedClientId] = useState(null);

  return (
    <div className="container">
      <div className="toggle-buttons">
        <button className="clients-btn" onClick={() => setView('clients')}>Clients</button>
        <button className="clients-btn" onClick={() => setView('create')}>Add Client</button>
      </div>

      {view === 'clients' && <Smart setView={setView} setSelectedClientId={setSelectedClientId} />}
      {view === 'create' && <Create setView={setView} />}
      {view === 'read' && <Read clientId={selectedClientId} setView={setView} />}
      {view === 'edit' && <Edit clientId={selectedClientId} setView={setView} />}
    </div>
  );
}





















