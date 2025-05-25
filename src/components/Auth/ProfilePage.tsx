import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../ui';
import { getChatHistory } from '../../services/firebase';

interface ProfilePageProps {
  user: any;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ user }) => {
  const { signOut, resetPassword } = useAuth();
  const navigate = useNavigate();
  const [chatHistory, setChatHistory] = useState<any[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [resetError, setResetError] = useState<string | null>(null);
  const [modalIdx, setModalIdx] = useState<number | null>(null);

  useEffect(() => {
    if (user?.uid) {
      setLoadingHistory(true);
      getChatHistory(user.uid)
        .then(setChatHistory)
        .finally(() => setLoadingHistory(false));
    }
  }, [user]);

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const handleChangePassword = async () => {
    setResetSent(false);
    setResetError(null);
    if (!user?.email) return;
    const result = await resetPassword(user.email);
    if (result.success) setResetSent(true);
    else setResetError(result.error || 'Failed to send reset email.');
  };

  const handleOpenModal = (idx: number) => {
    setModalIdx(idx);
  };

  const handleCloseModal = () => {
    setModalIdx(null);
  };

  const handleGoHome = () => {
    navigate('/');
  };

  if (!user) {
    return <div style={{ padding: 40, textAlign: 'center' }}>No user found.</div>;
  }

  return (
    <div style={{ maxWidth: 500, margin: '40px auto', padding: 32, background: '#fff', borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.07)' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 16 }}>
        <h1
          style={{ margin: 0, textAlign: 'center', textShadow: '2px 2px 8px rgba(0,0,0,0.15), 0 2px 4px rgba(0,0,0,0.10)', color: '#2F1B41', cursor: 'pointer', fontFamily: 'Poppins, sans-serif', fontWeight: 700 }}
          onClick={handleGoHome}
        >
          Ask Better
        </h1>
        <Button onClick={handleGoHome} variant="secondary" style={{ marginTop: 12, marginBottom: 18 }}>
          Back to Home
        </Button>
      </div>
      <h2 style={{ textAlign: 'center', marginBottom: 24 }}>Profile</h2>
      <div style={{ fontSize: '1.1em', marginBottom: 16 }}>
        <strong>Name:</strong> {user.name || '-'}
      </div>
      <div style={{ fontSize: '1.1em', marginBottom: 16 }}>
        <strong>Email:</strong> {user.email || '-'}
      </div>
      <Button onClick={handleChangePassword} variant="primary" style={{ width: '100%', marginBottom: 16 }}>
        Change Password
      </Button>
      {resetSent && <div style={{ color: 'green', marginBottom: 12 }}>Password reset email sent! Please check your inbox.</div>}
      {resetError && <div style={{ color: 'red', marginBottom: 12 }}>{resetError}</div>}
      <h3 style={{ marginTop: 32, marginBottom: 12 }}>Chat History</h3>
      {loadingHistory ? (
        <div>Loading chat history...</div>
      ) : chatHistory.length === 0 ? (
        <div>No chat history found.</div>
      ) : (
        <div style={{ maxHeight: 250, overflowY: 'auto', border: '1px solid #eee', borderRadius: 8, padding: 0 }}>
          {chatHistory.map((session, idx) => {
            const firstUserMsg = session.chatLog?.find((msg: any) => msg.sender === 'user');
            return (
              <div key={session.timestamp || idx} style={{ borderBottom: '1px solid #f0f0f0', cursor: 'pointer', padding: '10px 16px', background: modalIdx === idx ? '#faf7ff' : 'transparent' }} onClick={() => handleOpenModal(idx)}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontWeight: 600, color: '#4A2F6C' }}>
                    {firstUserMsg ? firstUserMsg.text.slice(0, 60) : 'No title'}
                  </div>
                  <div style={{ fontSize: '0.95em', color: '#888', marginLeft: 12 }}>
                    {session.timestamp ? new Date(session.timestamp).toLocaleString() : 'Unknown time'}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      {/* Modal Popup for Chat Content */}
      {modalIdx !== null && chatHistory[modalIdx] && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          background: 'rgba(0,0,0,0.25)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center'
        }} onClick={handleCloseModal}>
          <div style={{ background: '#fff', borderRadius: 10, maxWidth: 500, width: '90vw', maxHeight: '80vh', overflowY: 'auto', boxShadow: '0 4px 24px rgba(0,0,0,0.18)', padding: 24, position: 'relative' }} onClick={e => e.stopPropagation()}>
            <button onClick={handleCloseModal} style={{ position: 'absolute', top: 12, right: 16, background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: '#4A2F6C' }}>&times;</button>
            <div style={{ fontWeight: 600, color: '#4A2F6C', marginBottom: 8 }}>
              {chatHistory[modalIdx].chatLog?.find((msg: any) => msg.sender === 'user')?.text.slice(0, 60) || 'No title'}
            </div>
            <div style={{ fontSize: '0.95em', color: '#888', marginBottom: 12 }}>
              {chatHistory[modalIdx].timestamp ? new Date(chatHistory[modalIdx].timestamp).toLocaleString() : 'Unknown time'}
            </div>
            <ul style={{ paddingLeft: 18, margin: 0 }}>
              {chatHistory[modalIdx].chatLog && chatHistory[modalIdx].chatLog.map((msg: any, i: number) => (
                <li key={msg.id || i} style={{ marginBottom: 2 }}>
                  <span style={{ color: msg.sender === 'user' ? '#4A2F6C' : '#2F1B41', fontWeight: 500 }}>{msg.sender}:</span> {msg.text}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
      <Button className="logout-button" onClick={handleLogout} variant="secondary" style={{ width: '100%', marginTop: 32 }}>
        Logout
      </Button>
    </div>
  );
};

export default ProfilePage; 