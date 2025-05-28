import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { SUPPORTED_LANGUAGES, Language } from '../../constants/languages';

export const LanguageSelector: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Close modal on escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsModalOpen(false);
      }
    };

    if (isModalOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isModalOpen]);

  const currentLanguage = SUPPORTED_LANGUAGES.find(lang => lang.code === language);

  const handleLanguageSelect = (langCode: Language) => {
    setLanguage(langCode);
    setIsModalOpen(false);
  };

  return (
    <>
      {/* Language Selector Button */}
      <button
        onClick={() => setIsModalOpen(true)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.5rem 0.75rem',
          border: '1px solid #ddd',
          borderRadius: '6px',
          backgroundColor: 'white',
          cursor: 'pointer',
          fontSize: '0.9rem',
          transition: 'all 0.2s ease',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = '#4A2F6C';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = '#ddd';
        }}
        title={t.selectLanguage}
      >
        <span>{currentLanguage?.flag}</span>
        <span>{currentLanguage?.name}</span>
        <span style={{ fontSize: '0.8rem' }}>▼</span>
      </button>

      {/* Modal Overlay */}
      {isModalOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 999999,
          }}
          onClick={() => setIsModalOpen(false)}
        >
          {/* Modal Content */}
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '1.5rem',
              minWidth: '300px',
              maxWidth: '400px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
              transform: 'scale(1)',
              transition: 'transform 0.2s ease',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: '1.5rem'
            }}>
              <h3 style={{ 
                margin: 0, 
                fontSize: '1.2rem',
                color: '#333'
              }}>
                {t.selectLanguage}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                  color: '#666',
                  padding: '0.25rem',
                  borderRadius: '4px',
                  transition: 'background-color 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f0f0f0';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                ×
              </button>
            </div>

            {/* Language Options */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {SUPPORTED_LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleLanguageSelect(lang.code)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    padding: '1rem',
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
                  <span style={{ fontSize: '1.5rem' }}>{lang.flag}</span>
                  <span style={{ flex: 1, fontWeight: language === lang.code ? '600' : '400' }}>
                    {lang.name}
                  </span>
                  {language === lang.code && (
                    <span style={{ color: '#4A2F6C', fontSize: '1.2rem' }}>
                      ✓
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}; 