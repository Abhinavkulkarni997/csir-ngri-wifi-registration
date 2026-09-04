import type { ConversationState } from "./questionTypes";

import { questions, getQuestionById } from "./questions";

import type { RegistrationFormData } from "../schemas/registration.schema";

export const INITIAL_QUESTION_ID = "fullName";

/**
 * Creates a fresh chatbot conversation.
 */
export const createInitialConversation = (): ConversationState => {
  const firstQuestion = getQuestionById(INITIAL_QUESTION_ID);

  return {
    currentQuestionId: INITIAL_QUESTION_ID,

    messages: firstQuestion
      ? [
          {
            id: crypto.randomUUID(),

            role: "bot",

            content: firstQuestion.message,

            timestamp: Date.now(),
          },
        ]
      : [],

    formData: {},

    completed: false,

    submitting: false,
    reviewing: false,
  };
};

/**
 * Adds a user message to the conversation.
 */
export const addUserMessage = (
  state: ConversationState,
  content: string,
  questionId?: string,
): ConversationState => {
  return {
    ...state,
    messages: [
      ...state.messages,
      {
        id: crypto.randomUUID(),
        role: "user",
        content,
        timestamp: Date.now(),
        questionId,
      },
    ],
  };
};

/**
 * Determines which question should
 * appear next.
 */
export const getNextQuestionId = (
  currentQuestionId: string,

  formData: Partial<RegistrationFormData>,
): string | null => {
  switch (currentQuestionId) {
    /* =====================================================
       DIVISION / GROUP
       ===================================================== */

    case "divisionGroup":
      return "devices";

    /* =====================================================
       DEVICE SELECTION
       ===================================================== */

    // case "devices": {
    //   const laptopRequested = formData.devices?.laptop?.requested === true;

    //   const smartphoneRequested =
    //     formData.devices?.smartphone?.requested === true;

    //   /*
    //    * At least one device should be
    //    * selected by the UI.
    //    *
    //    * Laptop gets configured first
    //    * when both are selected.
    //    */

    //   if (laptopRequested) {
    //     return "laptopOS";
    //   }

    //   if (smartphoneRequested) {
    //     return "smartphoneOS";
    //   }

    //   /*
    //    * Safety fallback.
    //    *
    //    * The OptionCards component should
    //    * prevent this situation, but if it
    //    * happens we continue to guesthouse.
    //    */

    //   return "guesthouseStaying";
    // }
    case "devices":
        return "smartphoneOS";
    /* =====================================================
       LAPTOP MAC ADDRESS
       ===================================================== */

    case "laptopMac": {
      const smartphoneRequested =
        formData.devices?.smartphone?.requested === true;

      /*
       * If both devices were selected,
       * configure smartphone next.
       */

      if (smartphoneRequested) {
        return "smartphoneOS";
      }

      /*
       * Laptop only.
       */

      return "guesthouseStaying";
    }

    /* =====================================================
       SMARTPHONE MAC ADDRESS
       ===================================================== */

    case "smartphoneMac":
      return "guesthouseStaying";

    /* =====================================================
       GUESTHOUSE
       ===================================================== */

    case "guesthouseStaying": {
      const stayingAtGuesthouse = formData.guesthouse?.staying === true;

      if (stayingAtGuesthouse) {
        return "guesthouse";
      }

      return "date";
    }

    /* =====================================================
       GUESTHOUSE NAME
       ===================================================== */

    case "guesthouse":
      return "roomNumber";

    /* =====================================================
       ROOM NUMBER
       ===================================================== */

    case "roomNumber":
      return "date";

    /* =====================================================
       DATE
       ===================================================== */

    case "date":
      return "place";

    /* =====================================================
       PLACE
       ===================================================== */

    case "place":
      return "declaration";

    /* =====================================================
       DECLARATION
       ===================================================== */

    case "declaration":
      return null;

    /* =====================================================
       DEFAULT LINEAR FLOW
       ===================================================== */

    default: {
      const currentIndex = questions.findIndex(
        (question) => question.id === currentQuestionId,
      );

      if (currentIndex === -1) {
        return null;
      }

      return questions[currentIndex + 1]?.id ?? null;
    }
  }
};

/**
 * Moves the conversation to the next
 * question and adds the bot message.
 *
 * This helper can be used anywhere
 * that needs to advance the chatbot.
 */
export const moveToNextQuestion = (
  state: ConversationState,
): ConversationState => {
  const nextQuestionId = getNextQuestionId(
    state.currentQuestionId,

    state.formData,
  );

  /*
   * No next question means the
   * conversation is complete.
   */

  if (!nextQuestionId) {
    return {
      ...state,

      completed: true,
    };
  }

  const nextQuestion = getQuestionById(nextQuestionId);

  if (!nextQuestion) {
    return {
      ...state,

      completed: true,
    };
  }

  return {
    ...state,

    currentQuestionId: nextQuestionId,

    messages: [
      ...state.messages,

      {
        id: crypto.randomUUID(),

        role: "bot",

        content: nextQuestion.message,

        timestamp: Date.now(),
      },
    ],
  };
};

export const startEditing = (
  state: ConversationState,
  questionId: string,
): ConversationState => {
  const question = getQuestionById(questionId);

  if (!question) {
    return state;
  }

  return {
    ...state,

    currentQuestionId: questionId,

    editingQuestionId: questionId,

    // returnToReview: true,

    completed: false,

    messages: [
      ...state.messages,
      {
        id: crypto.randomUUID(),
        role: "bot",
        content: `Let's update your ${question.message
          .replace(/\?$/, "")
          .replace(
            /^Please |^What is |^Which |^Finally, |^Got it\. |^Thank you\. /i,
            "",
          )
          .toLowerCase()}.`,
        timestamp: Date.now(),
      },
    ],
  };
};
