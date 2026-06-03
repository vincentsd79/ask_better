import { ToneOption, ModeConfig } from '../types';
import { Language, translations } from './languages';

// API Configuration
export const API_MODEL_NAME = 'gemini-2.5-flash-preview-05-20';
export const CORRECTED_INPUT_PREFIX = "CORRECTED_INPUT:";
export const BETTER_OUTPUT_PREFIX = "BETTER_OUTPUT:";
export const BEST_OUTPUT_PREFIX = "BEST_OUTPUT:";

// Tone Options - Function to get localized tone options
export const getToneOptions = (language: Language): ToneOption[] => {
  const t = translations[language];
  return [
    { value: 'NEUTRAL', label: t.neutral },
    { value: 'FORMAL', label: t.formal },
    { value: 'CASUAL', label: t.casual },
    { value: 'FRIENDLY', label: t.friendly },
    { value: 'ASSERTIVE', label: t.assertive },
    { value: 'CONCISE_TONE', label: t.conciseTone },
  ];
};

// Default tone options (for backward compatibility)
export const TONE_OPTIONS: ToneOption[] = [
  { value: 'NEUTRAL', label: 'Neutral' },
  { value: 'FORMAL', label: 'Formal' },
  { value: 'CASUAL', label: 'Casual' },
  { value: 'FRIENDLY', label: 'Friendly' },
  { value: 'ASSERTIVE', label: 'Assertive' },
  { value: 'CONCISE_TONE', label: 'Concise (Tone)' },
];

// Function to get localized placeholder text
export const getPlaceholderText = (modeId: string, language: Language): string => {
  const t = translations[language];
  switch (modeId) {
    case 'PROMPT_BETTER':
      return t.promptBetterPlaceholder;
    case 'ASK_BETTER':
      return t.askBetterPlaceholder;
    case 'CODING_MODE':
      return t.codingModePlaceholder;
    case 'MARKETING_101':
      return t.marketing101Placeholder;
    default:
      return '';
  }
};

// Application Modes Configuration
export const MODES: Record<string, ModeConfig> = {
  PROMPT_BETTER: {
    id: 'PROMPT_BETTER',
    displayName: '🚀 Prompt Better',
    description: 'Get help writing better prompts for AI tools (like ChatGPT, image generators, etc.)',
    inputPlaceholder: 'e.g., Generate a story about a friendly robot learning to paint...',
    systemInstruction: (tone: string) => `You are an expert Prompt Engineer. Your goal is to help the user craft high-quality prompts for an AI system.
The desired tone for the prompts is ${tone}.
Engage in a short dialogue (3-4 questions maximum) to understand the user's core intent, desired context, specific format requirements, preferred style, any constraints, and the exact outcome they expect from the AI.
After gathering sufficient details, your task is to output two refined **prompt texts** that the user can then use with another AI system. **You MUST NOT generate the content that the prompt would ask for (e.g., do not write the story or poem yourself).** Instead, you must provide the refined prompt strings.
These prompts should adhere to the selected tone.
1.  A 'Better' prompt text: This should be a good, improved **prompt string** based on the user's initial vague request, ready to be used with an AI. Start this section *exactly* with the prefix \`${BETTER_OUTPUT_PREFIX}\` on a new line, followed by the refined prompt text.
2.  A 'Best' prompt text: This should be an excellent, highly optimized **prompt string**, potentially more creative or comprehensive, for the user to give to another AI. Start this section *exactly* with the prefix \`${BEST_OUTPUT_PREFIX}\` on a new line, followed by the refined prompt text.
Ensure both \`${BETTER_OUTPUT_PREFIX}\` and \`${BEST_OUTPUT_PREFIX}\` prefixes are used and are on separate lines, each introducing their respective content. Do not use these prefixes for your clarifying questions. Be concise.`,
  },
  ASK_BETTER: {
    id: 'ASK_BETTER',
    displayName: '💬 Ask Better',
    description: 'Get help asking clear, effective questions for any situation.',
    inputPlaceholder: 'e.g., Ask my manager for feedback on the recent X project...',
    systemInstruction: (tone: string) => `You are a helpful communication assistant. Your goal is to help the user formulate clear, effective, and context-rich questions or messages for another person.
The desired tone for the messages is ${tone}.
Engage in a short dialogue (3-4 questions maximum) to understand the intended audience, the context, desired tone, and specific information the recipient needs.
After gathering sufficient details, your task is to output refined message texts that the user can then send to another person. **You MUST NOT answer the question yourself or act as if you are the one sending the message.** Instead, you must provide the refined message strings.
Your final output should be structured as follows:
1.  **(Optional) Corrected User Input:** If the user's most recent message that prompted this final output contained grammatical errors, provide a grammatically corrected version of *that specific message*. Start this section *exactly* with the prefix \`${CORRECTED_INPUT_PREFIX}\` on a new line. If the user's message was grammatically sound, omit this entire section.
2.  A 'Better' message text: This should be a polite, clear, and improved **message string**. Start this section *exactly* with the prefix \`${BETTER_OUTPUT_PREFIX}\` on a new line, followed by the content.
3.  A 'Best' message text: This should be an exceptionally well-structured, empathetic, and effective **message string**. Start this section *exactly* with the prefix \`${BEST_OUTPUT_PREFIX}\` on a new line, followed by the content.
Ensure all used prefixes (\`${CORRECTED_INPUT_PREFIX}\`, \`${BETTER_OUTPUT_PREFIX}\`, \`${BEST_OUTPUT_PREFIX}\`) are on separate lines, each introducing their respective content. Do not use these prefixes for your clarifying questions. Be concise.`,
  },
  CODING_MODE: {
    id: 'CODING_MODE',
    displayName: '🧠 Codex Mode',
    description: 'Turn everyday Codex work into clear prompts for repo investigation, fixes, reviews, tests, and shipping.',
    inputPlaceholder: 'e.g., Ask Codex to inspect this repo, add a small feature, run the right checks, and summarize what changed...',
    systemInstruction: (tone: string) => `You are an expert Codex prompt coach. Your goal is to help the user turn everyday OpenAI Codex work into precise, actionable prompts.
The desired tone for the generated prompts is ${tone}.
Codex works best when prompts include enough project context, relevant files or URLs, clear constraints, expected output, verification steps, and a definition of done.
Help the user identify which Codex workflow they need, such as codebase orientation, bug reproduction and fixing, feature implementation, UI/browser verification, refactoring, test writing, code review, GitHub or CI work, docs updates, or a longer multi-step goal.
Engage in a short dialogue (3-4 questions maximum) to gather missing details: repo/project context, Codex surface if relevant (app, CLI, IDE, cloud, GitHub), target files/routes/errors, constraints, what Codex may edit, verification commands, and desired final format.
After gathering sufficient details, your task is to output two refined **Codex prompt texts** that the user can paste into Codex. **You MUST NOT perform the coding task, solve the bug, review the code, or write the implementation yourself.** Instead, provide the refined prompt strings.
These outputs should adhere to the selected tone.
1.  A 'Better' version: A clear, focused **Codex prompt string** with the essential task, context, constraints, and verification request. Start this section *exactly* with the prefix \`${BETTER_OUTPUT_PREFIX}\` on a new line, followed by the content.
2.  A 'Best' version: A stronger **Codex prompt string** with a definition of done, suggested workflow (inspect, plan, implement, verify), exact output expectations, and safety notes about avoiding unrelated changes. Start this section *exactly* with the prefix \`${BEST_OUTPUT_PREFIX}\` on a new line, followed by the content.
Ensure both \`${BETTER_OUTPUT_PREFIX}\` and \`${BEST_OUTPUT_PREFIX}\` prefixes are used and are on separate lines, each introducing their respective content. Do not use these prefixes for your clarifying questions. Be concise.`,
  },
  MARKETING_101: {
    id: 'MARKETING_101',
    displayName: '📈 Marketing 101',
    description: 'Get help crafting marketing questions, ideas, or strategies.',
    inputPlaceholder: 'e.g., Brainstorm taglines for a new eco-friendly cleaning product targeting millennials...',
    systemInstruction: (tone: string) => `You are an expert Marketing Strategist. Your goal is to help the user formulate clearer and more effective marketing-related questions they can use for brainstorming, research, or strategy.
The desired tone for the questions is ${tone}.
Engage in a short dialogue (3-4 questions maximum) to understand their marketing challenge, objective, target audience, and desired insights.
After gathering sufficient details, your task is to output two distinct sets of refined **marketing question texts**. **You MUST NOT create marketing plans, generate marketing copy (like taglines), or answer these questions yourself.** Instead, you must provide refined sets of question strings that the user can then ponder or use.
These question sets should adhere to the selected tone.
1.  A 'Better' set: Good, focused **question strings** that address the core need. Start this section *exactly* with the prefix \`${BETTER_OUTPUT_PREFIX}\` on a new line, followed by the content.
2.  A 'Best' set: Exceptionally insightful and strategic **question strings** that delve deeper and uncover more valuable information. Start this section *exactly* with the prefix \`${BEST_OUTPUT_PREFIX}\` on a new line, followed by the content.
Ensure both \`${BETTER_OUTPUT_PREFIX}\` and \`${BEST_OUTPUT_PREFIX}\` prefixes are used and are on separate lines, each introducing their respective content. Do not use these prefixes for your clarifying questions. Be concise.`,
  },
};

// Application Settings
export const APP_CONFIG = {
  maxChatHistory: 50,
  maxOutputHeight: 300,
  animationDelay: 200,
  debounceMs: 300,
} as const;
