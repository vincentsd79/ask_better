import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useLanguage } from '../../contexts/LanguageContext';
import { Button } from '../ui';
import { ThemeToggle } from '../ui/ThemeToggle';
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
        .then((history) => {
          // Sort chat history from newest to oldest
          const sortedHistory = history.sort((a: any, b: any) => {
            const timestampA = a.timestamp || 0;
            const timestampB = b.timestamp || 0;
            return timestampB - timestampA; // Descending order (newest first)
          });
          setChatHistory(sortedHistory);
        })
        .finally(() => setLoadingHistory(false));
    }
  }, [user]);

  // Add ESC key listener to close modal
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && modalIdx !== null) {
        handleCloseModal();
      }
    };

    if (modalIdx !== null) {
      document.addEventListener('keydown', handleEscapeKey);
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [modalIdx]);

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
    return (
      <div className="app-container">
        <header style={{ 
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '1rem 0',
          width: '100%'
        }}>
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
              transition: 'color 0.2s ease'
            }}
            onClick={handleGoHome}
          >
            {t.appTitle}
          </h1>
        </header>
        <div className="auth-form-container">
          <h2 className="section-title">No user found.</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <header style={{ 
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '1rem 0',
        width: '100%'
      }}>
        {/* Left side - App title */}
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
            transition: 'color 0.2s ease'
          }}
          onClick={handleGoHome}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = '#4A2F6C';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = '#2F1B41';
          }}
        >
          {t.appTitle}
        </h1>

        {/* Right side - Theme toggle and User info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <ThemeToggle />
          <div 
            style={{ 
              fontSize: '1.5em', 
              color: '#4A2F6C', 
              fontWeight: 600,
            }}
          >
            {user.name || user.email}
          </div>
        </div>
      </header>
      
      {/* Combined Profile, Language, and Security Section */}
      <div className="profile-combined-container">
       
        
        {/* User Information */}
        <div className="profile-info-section">
          <div className="profile-username">
            {user.name || user.email || 'User'}
          </div>
          <div className="profile-email">
            <strong>Email:</strong> {user.email || '-'}
          </div>
        </div>

        {/* Language and Security in horizontal layout */}
        <div className="profile-horizontal-sections">
          {/* Language Selection Section */}
          <div className="profile-section-half">
            <h3 className="profile-subsection-title">
              {language === 'vi' ? 'Ngôn ngữ' : 'Language'}
            </h3>
            <div className="language-options">
              {SUPPORTED_LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => setLanguage(lang.code)}
                  className={`language-option ${language === lang.code ? 'selected' : ''}`}
                >
                  <span className="language-option-flag">{lang.flag}</span>
                  <span className="language-option-name">
                    {lang.name}
                  </span>
                  {language === lang.code && (
                    <span className="language-option-check">
                      ✓
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Password Reset Section */}
          <div className="profile-section-half">
            <h3 className="profile-subsection-title">
              {language === 'vi' ? 'Bảo mật' : 'Security'}
            </h3>
            <Button onClick={handleChangePassword} variant="primary" style={{ width: '100%', marginBottom: 16 }}>
              {language === 'vi' ? 'Đổi Mật Khẩu' : 'Change Password'}
            </Button>
            <Button className="logout-button" onClick={handleLogout} variant="secondary" style={{ width: '100%', marginBottom: 16 }}>
              {language === 'vi' ? 'Đăng Xuất' : 'Logout'}
            </Button>
            {resetSent && (
              <div className="profile-success-message">
                {language === 'vi' 
                  ? 'Email đặt lại mật khẩu đã được gửi! Vui lòng kiểm tra hộp thư của bạn.'
                  : 'Password reset email sent! Please check your inbox.'
                }
              </div>
            )}
            {resetError && <div className="profile-error-message">{resetError}</div>}
          </div>
        </div>
      </div>
      
      {/* Chat History Section */}
      <div className="refined-output-area">
        <h2 className="section-title">
          {language === 'vi' ? 'Lịch Sử Trò Chuyện' : 'Chat History'}
        </h2>
        {loadingHistory ? (
          <div>{language === 'vi' ? 'Đang tải lịch sử trò chuyện...' : 'Loading chat history...'}</div>
        ) : chatHistory.length === 0 ? (
          <div>{language === 'vi' ? 'Không tìm thấy lịch sử trò chuyện.' : 'No chat history found.'}</div>
        ) : (
          <div className="chat-history-list">
            {chatHistory.map((session, idx) => {
              const firstUserMsg = session.chatLog?.find((msg: any) => msg.sender === 'user');
              return (
                <div 
                  key={session.timestamp || idx} 
                  className={`chat-history-item ${modalIdx === idx ? 'active' : ''}`}
                  onClick={() => handleOpenModal(idx)}
                >
                  <div className="chat-history-item-content">
                    <div className="chat-history-item-title">
                      {firstUserMsg ? (
                        firstUserMsg.text.length > 60 
                          ? firstUserMsg.text.slice(0, 60) + '...'
                          : firstUserMsg.text
                      ) : (language === 'vi' ? 'Không có tiêu đề' : 'No title')}
                    </div>
                    <div className="chat-history-item-date">
                      {session.timestamp ? new Date(session.timestamp).toLocaleString() : (language === 'vi' ? 'Thời gian không xác định' : 'Unknown time')}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      
      {/* Modal Popup for Chat Content */}
      {modalIdx !== null && chatHistory[modalIdx] && (
        <div className="profile-modal-overlay" onClick={handleCloseModal}>
          <div className="profile-modal-content" onClick={e => e.stopPropagation()}>
            <button onClick={handleCloseModal} className="profile-modal-close">&times;</button>
            <div className="profile-modal-title">
              {chatHistory[modalIdx].chatLog?.find((msg: any) => msg.sender === 'user')?.text.slice(0, 80) || (language === 'vi' ? 'Không có tiêu đề' : 'No title')}
              {chatHistory[modalIdx].chatLog?.find((msg: any) => msg.sender === 'user')?.text.length > 80 && '...'}
            </div>
            <div className="profile-modal-date">
              {chatHistory[modalIdx].timestamp ? new Date(chatHistory[modalIdx].timestamp).toLocaleString() : (language === 'vi' ? 'Thời gian không xác định' : 'Unknown time')}
            </div>
            <ul className="profile-modal-messages">
              {chatHistory[modalIdx].chatLog && chatHistory[modalIdx].chatLog.map((msg: any, i: number) => (
                <li key={msg.id || i} className={`profile-modal-message ${msg.sender}-message`}>
                  <span className={`profile-modal-message-sender ${msg.sender}`}>
                    {msg.sender === 'user' ? (language === 'vi' ? 'Người dùng' : 'User') : 'AI'}
                  </span>
                  <div className="profile-modal-message-text">{msg.text}</div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage; 