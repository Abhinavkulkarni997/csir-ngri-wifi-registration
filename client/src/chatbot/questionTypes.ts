import type { RegistrationFormData } from '../schemas/registration.schema';

export type ChatMessageRole = 'bot' | 'user';

export interface ChatMessage {
  id: string;
  role: ChatMessageRole;
  content: string;
  timestamp: number;
   questionId?: string;
}

export type QuestionType =
  | 'text'
  | 'email'
  | 'phone'
  | 'organization'
  | 'device-select'
  | 'laptop-os'
  | 'smartphone-os'
  | 'mac-address'
  | 'guesthouse-yes-no'
  | 'guesthouse-select'
  | 'room-number'
  | 'arrival-date-time'
  | 'date'
  | 'place'
  | 'declaration'
  | 'review';

export interface ChatQuestion {
  id: string;
  type: QuestionType;

  /**
   * Human-readable question shown by the chatbot.
   */
  message: string;

  /**
   * Optional field associated with this question.
   */
  field?: keyof RegistrationFormData;

  /**
   * Whether an answer is required.
   */
  required?: boolean;
}

export interface ConversationState {
  currentQuestionId: string;

  messages: ChatMessage[];

  formData: Partial<RegistrationFormData>;

  completed: boolean;

  submitting: boolean;

  // Review screen displayed inside chatbot
  reviewing?: boolean;

  // Used when editing a field from review
  editingQuestionId?: string;
    /*
   * true  = edit was started from Registration Summary
   * false = edit was started from normal chatbot conversation
   */
  returnToReviewAfterEdit?: boolean;
}