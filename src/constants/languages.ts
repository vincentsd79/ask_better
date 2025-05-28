export type Language = 'en' | 'vi';

export interface Translations {
  // Header
  appTitle: string;
  
  // Mode Selection
  modeSelectionTitle: string;
  promptBetter: string;
  promptBetterDesc: string;
  askBetter: string;
  askBetterDesc: string;
  codingMode: string;
  codingModeDesc: string;
  marketing101: string;
  marketing101Desc: string;
  
  // Tone Options
  neutral: string;
  formal: string;
  casual: string;
  friendly: string;
  assertive: string;
  conciseTone: string;
  
  // Common UI
  loading: string;
  error: string;
  reset: string;
  submit: string;
  send: string;
  startNew: string;
  
  // Placeholders
  promptBetterPlaceholder: string;
  askBetterPlaceholder: string;
  codingModePlaceholder: string;
  marketing101Placeholder: string;
  
  // Language Selector
  selectLanguage: string;
  english: string;
  vietnamese: string;
}

export const translations: Record<Language, Translations> = {
  en: {
    // Header
    appTitle: 'Ask Better',
    
    // Mode Selection
    modeSelectionTitle: 'Choose Your Mode',
    promptBetter: '🚀 Prompt Better',
    promptBetterDesc: 'Get help writing better prompts for AI tools (like ChatGPT, image generators, etc.)',
    askBetter: '💬 Ask Better',
    askBetterDesc: 'Get help asking clear, effective questions for any situation.',
    codingMode: '💻 Coding Mode',
    codingModeDesc: 'Get help writing or improving your coding questions and prompts.',
    marketing101: '📈 Marketing 101',
    marketing101Desc: 'Get help crafting marketing questions, ideas, or strategies.',
    
    // Tone Options
    neutral: 'Neutral',
    formal: 'Formal',
    casual: 'Casual',
    friendly: 'Friendly',
    assertive: 'Assertive',
    conciseTone: 'Concise (Tone)',
    
    // Common UI
    loading: 'Loading...',
    error: 'Error',
    reset: 'Reset',
    submit: 'Submit',
    send: 'Send',
    startNew: 'Start New',
    
    // Placeholders
    promptBetterPlaceholder: 'e.g., Generate a story about a friendly robot learning to paint...',
    askBetterPlaceholder: 'e.g., Ask my manager for feedback on the recent X project...',
    codingModePlaceholder: 'e.g., Help me debug a Python script for data analysis that gives a KeyError...',
    marketing101Placeholder: 'e.g., Brainstorm taglines for a new eco-friendly cleaning product targeting millennials...',
    
    // Language Selector
    selectLanguage: 'Select Language',
    english: 'English',
    vietnamese: 'Tiếng Việt',
  },
  vi: {
    // Header
    appTitle: 'Hỏi Tốt Hơn',
    
    // Mode Selection
    modeSelectionTitle: 'Chọn Chế Độ',
    promptBetter: '🚀 Prompt Tốt Hơn',
    promptBetterDesc: 'Nhận trợ giúp viết prompt tốt hơn cho các công cụ AI (như ChatGPT, tạo hình ảnh, v.v.)',
    askBetter: '💬 Hỏi Tốt Hơn',
    askBetterDesc: 'Nhận trợ giúp đặt câu hỏi rõ ràng, hiệu quả cho mọi tình huống.',
    codingMode: '💻 Chế Độ Lập Trình',
    codingModeDesc: 'Nhận trợ giúp viết hoặc cải thiện câu hỏi và prompt lập trình.',
    marketing101: '📈 Marketing Cơ Bản',
    marketing101Desc: 'Nhận trợ giúp tạo câu hỏi, ý tưởng hoặc chiến lược marketing.',
    
    // Tone Options
    neutral: 'Trung Tính',
    formal: 'Trang Trọng',
    casual: 'Thân Mật',
    friendly: 'Thân Thiện',
    assertive: 'Quyết Đoán',
    conciseTone: 'Ngắn Gọn',
    
    // Common UI
    loading: 'Đang tải...',
    error: 'Lỗi',
    reset: 'Đặt Lại',
    submit: 'Gửi',
    send: 'Gửi',
    startNew: 'Bắt Đầu Mới',
    
    // Placeholders
    promptBetterPlaceholder: 'ví dụ: Tạo một câu chuyện về robot thân thiện học vẽ tranh...',
    askBetterPlaceholder: 'ví dụ: Hỏi quản lý phản hồi về dự án X gần đây...',
    codingModePlaceholder: 'ví dụ: Giúp tôi debug script Python phân tích dữ liệu bị lỗi KeyError...',
    marketing101Placeholder: 'ví dụ: Brainstorm slogan cho sản phẩm tẩy rửa thân thiện môi trường hướng đến millennials...',
    
    // Language Selector
    selectLanguage: 'Chọn Ngôn Ngữ',
    english: 'English',
    vietnamese: 'Tiếng Việt',
  },
};

export const SUPPORTED_LANGUAGES: { code: Language; name: string; flag: string }[] = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'vi', name: 'Tiếng Việt', flag: '🇻🇳' },
]; 