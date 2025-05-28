import React from 'react';
import { Button } from '../ui';
import { MODES } from '../../constants';
import { useAuth } from '../../hooks/useAuth';
import { useLanguage } from '../../contexts/LanguageContext';

interface ModeSelectionProps {
  onModeSelect: (modeId: string) => void;
  onTitleClick?: () => void;
}

export const ModeSelection: React.FC<ModeSelectionProps> = ({ onModeSelect, onTitleClick }) => {
  const { user } = useAuth();
  const { t, language } = useLanguage();

  // Create a mapping of mode IDs to translation keys
  const getModeTranslations = (modeId: string) => {
    switch (modeId) {
      case 'PROMPT_BETTER':
        return { displayName: t.promptBetter, description: t.promptBetterDesc };
      case 'ASK_BETTER':
        return { displayName: t.askBetter, description: t.askBetterDesc };
      case 'CODING_MODE':
        return { displayName: t.codingMode, description: t.codingModeDesc };
      case 'MARKETING_101':
        return { displayName: t.marketing101, description: t.marketing101Desc };
      default:
        return { displayName: '', description: '' };
    }
  };

  return (
    <div className="mode-selector">
      {/* Application Introduction */}
      <div className="app-introduction">
        <h1 
          className="app-title"
          style={{ 
            cursor: onTitleClick ? 'pointer' : 'default',
            transition: 'color 0.2s ease'
          }}
          onClick={onTitleClick}
          onMouseEnter={(e) => {
            if (onTitleClick) {
              e.currentTarget.style.color = '#4A2F6C';
            }
          }}
          onMouseLeave={(e) => {
            if (onTitleClick) {
              e.currentTarget.style.color = '#2F1B41';
            }
          }}
        >
          {t.appTitle}
        </h1>
        <p className="app-subtitle">
          {language === 'vi' 
            ? 'Biến ý tưởng của bạn thành giao tiếp rõ ràng và hiệu quả'
            : 'Transform your ideas into clear, effective communication'
          }
        </p>
        
        <div className="intro-content">
          <p className="intro-description">
            {language === 'vi' 
              ? 'Dù bạn đang tạo prompt cho AI, đặt câu hỏi với đồng nghiệp, debug code, hay phát triển chiến lược marketing, Ask Better giúp bạn giao tiếp rõ ràng và chính xác.'
              : 'Whether you\'re crafting prompts for AI, asking questions to colleagues, debugging code, or developing marketing strategies, Ask Better helps you communicate with clarity and precision.'
            }
          </p>
          
          <div className="how-it-works">
            <h3>
              {language === 'vi' ? 'Cách hoạt động:' : 'How it works:'}
            </h3>
            <ol className="steps-list">
              <li>
                <strong>
                  {language === 'vi' ? 'Chọn chế độ' : 'Choose your mode'}
                </strong> - {language === 'vi' 
                  ? 'Chọn loại giao tiếp bạn muốn cải thiện'
                  : 'Select the type of communication you want to improve'
                }
              </li>
              <li>
                <strong>
                  {language === 'vi' ? 'Chia sẻ ý tưởng' : 'Share your idea'}
                </strong> - {language === 'vi' 
                  ? 'Cho chúng tôi biết bạn muốn truyền đạt điều gì'
                  : 'Tell us what you want to communicate'
                }
              </li>
              <li>
                <strong>
                  {language === 'vi' ? 'Nhận phiên bản cải tiến' : 'Get refined versions'}
                </strong> - {language === 'vi' 
                  ? 'Nhận các phiên bản được chỉnh sửa, hiệu quả'
                  : 'Receive polished, effective alternatives'
                }
              </li>
            </ol>
          </div>
          
          <div className="benefits">
            <p className="benefits-text">
              {language === 'vi' ? (
                <>
                  💡 <strong>Tiết kiệm thời gian</strong> bằng cách truyền đạt đúng ngay lần đầu<br/>
                  🎯 <strong>Cải thiện độ rõ ràng</strong> và giảm hiểu lầm<br/>
                  🚀 <strong>Tăng hiệu quả</strong> trong mọi giao tiếp
                </>
              ) : (
                <>
                  💡 <strong>Save time</strong> by getting your message right the first time<br/>
                  🎯 <strong>Improve clarity</strong> and reduce misunderstandings<br/>
                  🚀 <strong>Boost effectiveness</strong> in all your communications
                </>
              )}
            </p>
          </div>
        </div>
      </div>

      <h2 className="section-title">
        {user 
          ? (language === 'vi' 
              ? `Xin chào ${user.name || user.email}, vui lòng chọn chế độ bạn muốn sử dụng`
              : `Hey ${user.name || user.email}, please choose the mode you want to use`
            )
          : t.modeSelectionTitle
        }
      </h2>
      <div className="mode-buttons-container">
        {Object.values(MODES).map(mode => {
          const translations = getModeTranslations(mode.id);
          return (
            <Button 
              key={mode.id}
              className="mode-button"
              onClick={() => onModeSelect(mode.id)}
              variant="secondary"
            >
              <div className="mode-display-name">{translations.displayName}</div>
              <div className="mode-description">{translations.description}</div>
            </Button>
          );
        })}
      </div>
    </div>
  );
};
