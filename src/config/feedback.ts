export interface FeedbackConfig {
  enabled: boolean;
  position: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  delay: number; // milliseconds before showing feedback button
  cooldown: number; // hours between feedback prompts
}

export const feedbackConfig: FeedbackConfig = {
  enabled: true,
  position: 'bottom-right',
  delay: 30000, // Show after 30 seconds
  cooldown: 72 // Don't show again for 72 hours
};

export const feedbackQuestions = [
  {
    id: 'satisfaction',
    text: 'How satisfied are you with your experience?',
    type: 'rating' as const,
    scale: 5
  },
  {
    id: 'features',
    text: 'Which features do you find most valuable?',
    type: 'multiselect' as const,
    options: [
      'Quote Discovery',
      'AI Transformations',
      'Text-to-Speech',
      'Music Search',
      'Theme Customization'
    ]
  },
  {
    id: 'improvements',
    text: 'What could we improve?',
    type: 'text' as const,
    placeholder: 'Share your thoughts...'
  }
];