import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useLanguage } from '../../contexts/LanguageContext';
import { Button } from '../ui';
import { getChatHistory } from '../../services/firebase';
import { SUPPORTED_LANGUAGES } from '../../constants/languages';

interface ProfilePageProps {
  user: any;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ user }) => {
  const { signOut, resetPassword } = useAuth();
  const { language, setLanguage, t } = useLanguage();
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
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1
          style={{ 
            margin: 0, 
            textAlign: 'left', 
            textShadow: '2px 2px 8px rgba(0,0,0,0.15), 0 2px 4px rgba(0,0,0,0.10)', 
            color: '#2F1B41', 
            cursor: 'pointer', 
            fontFamily: 'Poppins, sans-serif', 
            fontWeight: 700,
            fontSize: '2.5rem',
            transition: 'color 0.2s ease',
          }}
          onClick={handleGoHome}
          onMouseEnter={(e) => (e.target as HTMLElement).style.color = '#4A2F6C'}
          onMouseLeave={(e) => (e.target as HTMLElement).style.color = '#2F1B41'}
        >
          {t.appTitle}
        </h1>
        <div style={{ fontSize: '1.1em', color: '#4A2F6C', fontWeight: 600 }}>
          {user.name || user.email || 'User'}
        </div>
      </div>

      {/* User Information */}
      <div style={{ fontSize: '1.1em', marginBottom: 16 }}>
        <strong>Email:</strong> {user.email || '-'}
      </div>

      {/* Language Selection */}
      <div style={{ marginBottom: 24 }}>
        <h3 style={{ marginBottom: 12, color: '#333' }}>
          {language === 'vi' ? 'Ngôn ngữ' : 'Language'}
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {SUPPORTED_LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => setLanguage(lang.code)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                padding: '0.75rem 1rem',
                border: language === lang.code ? '2px solid #4A2F6C' : '1px solid #e0e0e0',
                borderRadius: '8px',
                backgroundColor: language === lang.code ? '#f8f9ff' : 'white',
                cursor: 'pointer',
                fontSize: '1rem',
                textAlign: 'left',
                transition: 'all 0.2s ease',
                width: '100%',
              }}
              onMouseEnter={(e) => {
                if (language !== lang.code) {
                  e.currentTarget.style.backgroundColor = '#f8f9fa';
                  e.currentTarget.style.borderColor = '#4A2F6C';
                }
              }}
              onMouseLeave={(e) => {
                if (language !== lang.code) {
                  e.currentTarget.style.backgroundColor = 'white';
                  e.currentTarget.style.borderColor = '#e0e0e0';
                }
              }}
            >
              <span style={{ fontSize: '1.2rem' }}>{lang.flag}</span>
              <span style={{ flex: 1, fontWeight: language === lang.code ? '600' : '400' }}>
                {lang.name}
              </span>
              {language === lang.code && (
                <span style={{ color: '#4A2F6C', fontSize: '1rem' }}>
                  ✓
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      <Button onClick={handleChangePassword} variant="primary" style={{ width: '100%', marginBottom: 16 }}>
        {language === 'vi' ? 'Đổi Mật Khẩu' : 'Change Password'}
      </Button>
      {resetSent && (
        <div style={{ color: 'green', marginBottom: 12 }}>
          {language === 'vi' 
            ? 'Email đặt lại mật khẩu đã được gửi! Vui lòng kiểm tra hộp thư của bạn.'
            : 'Password reset email sent! Please check your inbox.'
          }
        </div>
      )}
      {resetError && <div style={{ color: 'red', marginBottom: 12 }}>{resetError}</div>}
      
      <h3 style={{ marginTop: 32, marginBottom: 12 }}>
        {language === 'vi' ? 'Lịch Sử Trò Chuyện' : 'Chat History'}
      </h3>
      {loadingHistory ? (
        <div>{language === 'vi' ? 'Đang tải lịch sử trò chuyện...' : 'Loading chat history...'}</div>
      ) : chatHistory.length === 0 ? (
        <div>{language === 'vi' ? 'Không tìm thấy lịch sử trò chuyện.' : 'No chat history found.'}</div>
      ) : (
        <div style={{ maxHeight: 250, overflowY: 'auto', border: '1px solid #eee', borderRadius: 8, padding: 0 }}>
          {chatHistory.map((session, idx) => {
            const firstUserMsg = session.chatLog?.find((msg: any) => msg.sender === 'user');
            return (
              <div key={session.timestamp || idx} style={{ borderBottom: '1px solid #f0f0f0', cursor: 'pointer', padding: '10px 16px', background: modalIdx === idx ? '#faf7ff' : 'transparent' }} onClick={() => handleOpenModal(idx)}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontWeight: 600, color: '#4A2F6C' }}>
                    {firstUserMsg ? firstUserMsg.text.slice(0, 60) : (language === 'vi' ? 'Không có tiêu đề' : 'No title')}
                  </div>
                  <div style={{ fontSize: '0.95em', color: '#888', marginLeft: 12 }}>
                    {session.timestamp ? new Date(session.timestamp).toLocaleString() : (language === 'vi' ? 'Thời gian không xác định' : 'Unknown time')}
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
              {chatHistory[modalIdx].chatLog?.find((msg: any) => msg.sender === 'user')?.text.slice(0, 60) || (language === 'vi' ? 'Không có tiêu đề' : 'No title')}
            </div>
            <div style={{ fontSize: '0.95em', color: '#888', marginBottom: 12 }}>
              {chatHistory[modalIdx].timestamp ? new Date(chatHistory[modalIdx].timestamp).toLocaleString() : (language === 'vi' ? 'Thời gian không xác định' : 'Unknown time')}
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
      
      <div style={{ display: 'flex', gap: 12, marginTop: 32 }}>
        <Button onClick={handleGoHome} variant="secondary" style={{ flex: 1 }}>
          {language === 'vi' ? 'Về Trang Chủ' : 'Back to Home'}
        </Button>
        <Button className="logout-button" onClick={handleLogout} variant="secondary" style={{ flex: 1 }}>
          {language === 'vi' ? 'Đăng Xuất' : 'Logout'}
        </Button>
      </div>
    </div>
  );
};

export default ProfilePage; 