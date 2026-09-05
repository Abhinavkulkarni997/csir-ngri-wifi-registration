import { useEffect, useMemo, useRef, useState } from "react";
import {
  Wifi,
//   Laptop,
  Smartphone,
  Monitor,
  Apple,
  Building2,
  AppWindow,
  AppWindowMac,
  ChevronLeft,
} from "lucide-react";

import type { Dispatch, SetStateAction } from "react";

import Csirlogo from "../assets/csirlogo.jpg";
import NgriLogo from "../assets/ngrilogo.png";

import ChatMessage from "./ChatMessage";
import TypingIndicator from "./TypingIndicator";
import ChatInput from "./ChatInput";
import OptionCards from "./OptionCards";
import OrganizationSelector from "./OrganizationSelector";
import MacAddressInput from "./MacAddressInput";
import DeclarationCard from "./DeclarationCard";
import ChatReview from "./ChatReview";
import { getGuesthouseLabel } from "../utils/guesthouseLabels";

import {
  createInitialConversation,
  addUserMessage,
  getNextQuestionId,
} from "../chatbot/conversationEngine";

import { getQuestionById } from "../chatbot/questions";

import type { ConversationState } from "../chatbot/questionTypes";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
export default function ChatContainer() {
  const [conversation, setConversation] = useState<ConversationState>(
    createInitialConversation(),
  );

  const [typing, setTyping] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const currentQuestion = useMemo(
    () => getQuestionById(conversation.currentQuestionId),
    [conversation.currentQuestionId],
  );

  /*
   * Automatically scroll to the latest
   * chatbot message.
   */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [conversation.messages, typing]);

  /*
   * Move chatbot to the next question.
   */
  const showNextQuestion = (updatedState: ConversationState) => {
    /*
     * =====================================================
     * EDIT MODE
     * =====================================================
     */

    if (updatedState.editingQuestionId) {
      /*
       * Remember whether this edit originated
       * from Registration Summary.
       */
      const returnToReview = updatedState.returnToReviewAfterEdit;

      const editedQuestionId = updatedState.editingQuestionId;

      /*
       * Clear edit state before continuing.
       */
      const stateAfterEdit: ConversationState = {
        ...updatedState,

        editingQuestionId: undefined,

        returnToReviewAfterEdit: undefined,

        completed: false,

        reviewing: false,
      };

      /*
       * =================================================
       * EDIT FROM REVIEW
       * =================================================
       *
       * After changing the value:
       *
       * Question
       *    ↓
       * Registration Summary
       *
       */

      if (returnToReview) {
        setTyping(true);

        window.setTimeout(() => {
          setConversation({
            ...stateAfterEdit,

            reviewing: true,

            messages: [
              ...stateAfterEdit.messages,

              {
                id: crypto.randomUUID(),

                role: "bot",

                content:
                  "Updated successfully. Please review your registration details again.",

                timestamp: Date.now(),
              },
            ],
          });

          setTyping(false);
        }, 500);

        return;
      }

      /*
       * =================================================
       * EDIT FROM CHATBOT
       * =================================================
       *
       * After changing the value:
       *
       * Edited Question
       *       ↓
       * Next Question
       *
       */

      const nextQuestionId = getNextQuestionId(
        editedQuestionId,
        stateAfterEdit.formData,
      );

      /*
       * No question remaining → Review
       */
      if (!nextQuestionId) {
        setTyping(true);

        window.setTimeout(() => {
          setConversation({
            ...stateAfterEdit,

            reviewing: true,

            messages: [
              ...stateAfterEdit.messages,

              {
                id: crypto.randomUUID(),

                role: "bot",

                content:
                  "Updated successfully. Please review your registration details again.",

                timestamp: Date.now(),
              },
            ],
          });

          setTyping(false);
        }, 500);

        return;
      }

      const nextQuestion = getQuestionById(nextQuestionId);

      if (!nextQuestion) {
        return;
      }

      setTyping(true);

      window.setTimeout(() => {
        setConversation({
          ...stateAfterEdit,

          currentQuestionId: nextQuestionId,

          reviewing: false,

          messages: [
            ...stateAfterEdit.messages,

            {
              id: crypto.randomUUID(),

              role: "bot",

              content: nextQuestion.message,

              timestamp: Date.now(),
            },
          ],
        });

        setTyping(false);
      }, 500);

      return;
    }

    /*
     * =====================================================
     * NORMAL REGISTRATION FLOW
     * =====================================================
     */

    const nextQuestionId = getNextQuestionId(
      updatedState.currentQuestionId,
      updatedState.formData,
    );

    /*
     * =====================================================
     * NO NEXT QUESTION → REVIEW
     * =====================================================
     */

    if (!nextQuestionId) {
      setTyping(true);

      window.setTimeout(() => {
        setConversation({
          ...updatedState,

          reviewing: true,

          completed: false,

          messages: [
            ...updatedState.messages,

            {
              id: crypto.randomUUID(),

              role: "bot",

              content:
                "Thank you. Your registration details are ready for review.",

              timestamp: Date.now(),
            },

            {
              id: crypto.randomUUID(),

              role: "bot",

              content:
                "Please review the summary below. You can edit any detail before submitting.",

              timestamp: Date.now(),
            },
          ],
        });

        setTyping(false);
      }, 500);

      return;
    }

    /*
     * =====================================================
     * NEXT QUESTION
     * =====================================================
     */

    const nextQuestion = getQuestionById(nextQuestionId);

    if (!nextQuestion) {
      return;
    }

    setTyping(true);

    window.setTimeout(() => {
      setConversation({
        ...updatedState,

        currentQuestionId: nextQuestionId,

        reviewing: false,

        messages: [
          ...updatedState.messages,

          {
            id: crypto.randomUUID(),

            role: "bot",

            content: nextQuestion.message,

            timestamp: Date.now(),
          },
        ],
      });

      setTyping(false);
    }, 500);
  };

  /*
   * Submit normal text-based answer.
   */
  const submitAnswer = async (value: string) => {
    /*
     * =====================================================
     * MOBILE NUMBER VALIDATION
     * =====================================================
     */

    if (conversation.currentQuestionId === "mobileNumber") {
  const mobile = value.replace(/\s+/g, "");

  if (!/^\d{10}$/.test(mobile)) {
    setConversation((previous) => ({
      ...previous,

      messages: [
        ...previous.messages,

        {
          id: crypto.randomUUID(),
          role: "bot",
          content: "Please enter a valid 10-digit mobile number.",
          timestamp: Date.now(),
        },
      ],
    }));

    return;
  }

  /*
   * =====================================================
   * CHECK EMPLOYEE ID + MOBILE NUMBER
   * =====================================================
   */

  const employeeId = conversation.formData.employeeId?.trim();

  if (employeeId) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/registrations/check-duplicate?employeeId=${encodeURIComponent(
          employeeId,
        )}&mobileNumber=${encodeURIComponent(mobile)}`,
      );

      const result = await response.json();

      if (response.status === 409 && result.duplicate) {
        setConversation((previous) => ({
          ...previous,

          messages: [
            ...previous.messages,

            {
              id: crypto.randomUUID(),
              role: "bot",
              content:
                "This mobile number is already registered with this Employee ID. Please use a different mobile number.",
              timestamp: Date.now(),
            },
          ],
        }));

        return;
      }

      if (!response.ok) {
        console.error(
          "Duplicate check failed:",
          result.message,
        );
      }
    } catch (error) {
      console.error(
        "Unable to check duplicate registration:",
        error,
      );
    }
  }

  value = mobile;
}
    /*
     * =====================================================
     * NORMAL ANSWER PROCESSING
     * =====================================================
     */
    const stateWithUserMessage = addUserMessage(
      conversation,
      value,
      conversation.currentQuestionId,
    );

    const field = currentQuestion?.field;

    /*
     * Some questions such as device selectors and OS
     * selectors update formData themselves.
     */
    if (!field) {
      return;
    }

    const updatedState: ConversationState = {
      ...stateWithUserMessage,

      formData: {
        ...stateWithUserMessage.formData,

        [field]: value,
      },
    };

    setConversation(updatedState);

    showNextQuestion(updatedState);
  };

  const handleEdit = (questionId: string, fromReview: boolean = false) => {
    if (conversation.completed) return;
    const question = getQuestionById(questionId);

    if (!question) {
      console.warn("Cannot edit. Question not found:", questionId);
      return;
    }

    const editMessages: Record<string, string> = {
      fullName: "Sure! Let's update your full name. Please enter it again.(Please mention the name dispalyed in your official ID Card , this will be printed on the certificate)",

      designation: "Sure! Let's update your designation.",

      employeeId: "Sure! Let's update your Employee ID.",

      institutionEmail: "Sure! Let's update your institutional email.",

      mobileNumber: "Sure! Let's update your mobile number.",

      organization: "Sure! Let's update your organization.",

      divisionGroup: "Sure! Let's update your Division / Group.",

      devices: "Sure! Let's update your device selection.",

      laptopOS: "Sure! Let's update your laptop operating system.",

      laptopMac: "Sure! Let's update your laptop MAC address.",

      smartphoneOS: "Sure! Let's update your smartphone operating system.",

      smartphoneMac: "Sure! Let's update your smartphone MAC address.",

      guesthouseStaying: "Sure! Let's update your guesthouse information.",

      guesthouse: "Sure! Let's update your guesthouse.",

      roomNumber: "Sure! Let's update your guesthouse room number.",

      date: "Sure! Let's update your registration date.",

      place: "Sure! Let's update the registration place.",

      declaration: "Sure! Let's update your declaration.",
    };

    const editMessage =
      editMessages[questionId] ?? "Sure! Let's update this information.";

    setConversation((previous) => ({
      ...previous,

      currentQuestionId: questionId,

      editingQuestionId: questionId,

      /*
       * IMPORTANT
       *
       * true  → came from Review → return directly to Review
       * false → came from chatbot → continue to next question
       */
      returnToReviewAfterEdit: fromReview,

      reviewing: false,

      completed: false,

      messages: [
        ...previous.messages,

        {
          id: crypto.randomUUID(),

          role: "bot",

          content: editMessage,

          timestamp: Date.now(),
        },
      ],
    }));
  };
  /*
   * ============================================================
   * MAP BACKEND VALIDATION FIELD TO CHAT QUESTION ID
   * ============================================================
   *
   * Backend may return nested validation paths such as:
   *
   * devices.laptop.operatingSystem
   * devices.laptop.macAddress
   * devices.smartphone.operatingSystem
   * devices.smartphone.macAddress
   *
   * These are not actual question IDs.
   * Convert them into IDs understood by questions.ts.
   */

  const getQuestionIdFromValidationField = (
    field?: string,
  ): string | undefined => {
    switch (field) {
      case "devices.laptop.operatingSystem":
        return "laptopOS";

      case "devices.laptop.macAddress":
        return "laptopMac";

      case "devices.smartphone.operatingSystem":
        return "smartphoneOS";

      case "devices.smartphone.macAddress":
        return "smartphoneMac";

      case "guesthouse.staying":
        return "guesthouseStaying";

      case "guesthouse.name":
        return "guesthouse";

      case "guesthouse.roomNumber":
        return "roomNumber";

      case "otherOrganizationName":
        return "organization";

      default:
        return field;
    }
  };
  const getExistingAnswer = (questionId: string): string => {
    const data = conversation.formData;

    switch (questionId) {
      case "fullName":
        return data.fullName ?? "";

      case "designation":
        return data.designation ?? "";

      case "employeeId":
        return data.employeeId ?? "";

      case "institutionEmail":
        return data.institutionEmail ?? "";

      case "mobileNumber":
        return data.mobileNumber ?? "";

      case "divisionGroup":
        return data.divisionGroup ?? "";

      case "date":
        return data.date ?? "";

      case "place":
        return data.place ?? "";

      case "roomNumber":
        return data.guesthouse?.roomNumber ?? "";

      case "laptopMac":
        return data.devices?.laptop?.macAddress ?? "";

      case "smartphoneMac":
        return data.devices?.smartphone?.macAddress ?? "";

      default:
        return "";
    }
  };

  return (
    <div className="min-h-screen bg-slate-100">
      {/* =====================================================
          HEADER
          ===================================================== */}

      <header
        className="
        sticky
        top-0
        z-30
        bg-white/95
        backdrop-blur
        border-b
        border-slate-200
      "
      >
        <div
          className="
          max-w-5xl
          mx-auto
          px-4
          py-3
        "
        >
          <div
            className="
            flex
            items-center
            justify-between
            gap-4
          "
          >
            {/* ORGANIZATION BRANDING */}

            <div
              className="
              flex
              items-center
              gap-3
              min-w-0
            "
            >
              {/* CSIR LOGO */}

              <div
                className="
                h-12
                w-12
                sm:h-14
                sm:w-14
                flex
                items-center
                justify-center
                shrink-0
              "
              >
                <img
                  src={Csirlogo}
                  alt="CSIR Logo"
                  className="
                    max-h-full
                    max-w-full
                    object-contain
                  "
                />
              </div>

              {/* NGRI LOGO */}

              <div
                className="
                h-12
                w-12
                sm:h-14
                sm:w-14
                flex
                items-center
                justify-center
                shrink-0
              "
              >
                <img
                  src={NgriLogo}
                  alt="CSIR-NGRI Logo"
                  className="
                    max-h-full
                    max-w-full
                    object-contain
                  "
                />
              </div>

              {/* BRAND TEXT */}

              <div
                className="
                min-w-0
              "
              >
                <p
                  className="
                  font-bold
                  text-slate-900
                  text-sm
                  sm:text-base
                  truncate
                "
                >
                  CSIR-NGRI
                </p>

                <p
                  className="
                  text-xs
                  sm:text-sm
                  text-slate-700
                  truncate
                "
                >
                  Registration Portal
                </p>
              </div>
            </div>

            {/* SECURITY INDICATOR */}

            <div
              className="
              hidden
              sm:flex
              items-center
              gap-2
              text-xs
              text-slate-700
              shrink-0
            "
            >
              <Wifi size={16} strokeWidth={1.8} />

              <span>Secure Registration</span>
            </div>
          </div>
        </div>
      </header>

      {/* =====================================================
          TITLE SECTION
          ===================================================== */}

      <div
        className="
        max-w-5xl
        mx-auto
        px-4
        pt-6
      "
      >
        <div
          className="
          bg-white
          rounded-2xl
          border
          border-slate-200
          p-5
          sm:p-6
          shadow-sm
        "
        >
          <div className="text-center">
            <p
              className="
              text-2xl
              sm:text-2xl
              font-semibold
              uppercase
              tracking-wider
              text-cyan-600
              
            "
            >
              Training Programme On "Network Security for Network Administrators"
            </p>

            <h1
              className="
              text-xs
              sm:text-xl
              font-bold
              text-slate-900
              mt-1
            "
            >
             Registration Form
            </h1>

            <p
              className="
              text-sm
              text-slate-700
              mt-2
            "
            >
             
            </p>

            <p
              className="
              text-xs
              text-slate-600
              mt-1
            "
            >
              
            </p>
          </div>
        </div>
      </div>

      {/* =====================================================
          CHAT AREA
          ===================================================== */}

      <main
        className="
        max-w-5xl
        mx-auto
        px-4
        py-4
      "
      >
        <div
          className="
          bg-slate-50
          border
          border-slate-200
          rounded-2xl
          shadow-sm
          overflow-hidden
        "
        >
          {/* =====================================================
    CHAT MESSAGES
    ===================================================== */}

          <div
            className="
    h-[55vh]
    sm:h-[60vh]
    overflow-y-auto
    p-4
    sm:p-6
  "
          >
            {conversation.messages.map((message) => (
              <ChatMessage
                key={message.id}
                message={message}
                onEdit={(questionId) => handleEdit(questionId, false)}
              />
            ))}

            {typing && <TypingIndicator />}

            {/* =================================================
      CHATBOT REVIEW
      ================================================= */}

            {conversation.reviewing && (
              <ChatReview
                formData={conversation.formData}
                onEdit={(questionId) => handleEdit(questionId, true)}
                isSubmitting={submitting}
                completed={conversation.completed}
                onSubmit={async () => {
                     if (conversation.completed || submitting) return;
                  try {
                    setSubmitting(true);

                    console.log(
                      "Submitting registration:",
                      conversation.formData,
                    );

                    const response = await fetch(
                      `${API_BASE_URL}/api/registrations`,
                      {
                        method: "POST",

                        headers: {
                          "Content-Type": "application/json",
                        },

                        body: JSON.stringify(conversation.formData),
                      },
                    );

                    const contentType = response.headers.get("content-type") || "";

const result = contentType.includes("application/json")
  ? await response.json()
  : {
      success: false,
      message: `Server returned ${response.status} ${response.statusText}`,
    };
                    console.log(
                      "Validation errors:",
                      JSON.stringify(result.errors, null, 2),
                    );
                    if (!response.ok) {
                      const validationError = result.errors?.[0];

                      if (validationError) {
                        const error = new Error(validationError.message);

                        (
                          error as Error & {
                            field?: string;
                          }
                        ).field = validationError.field;

                        throw error;
                      }

                      throw new Error(
                        result.message || "Registration submission failed.",
                      );
                    }

                    setConversation((previous) => ({
                      ...previous,

                      completed: true,

                      reviewing: true,

                      messages: [
                        ...previous.messages,

                        {
                          id: crypto.randomUUID(),

                          role: "bot",

                          content:
                            "Your Wi-Fi registration has been submitted successfully.",

                          timestamp: Date.now(),
                        },
                      ],
                    }));
                  } catch (error) {
                    console.error("Registration submission error:", error);
                    const errorMessage =
                      error instanceof Error
                        ? error.message
                        : "Unable to submit your registration. Please try again.";

                    const validationField = (
                      error as Error & {
                        field?: string;
                      }
                    ).field;

                    /*
                     * Convert backend validation path into
                     * an actual chatbot question ID.
                     */
                    const validationQuestionId =
  getQuestionIdFromValidationField(validationField);

const isDuplicate = errorMessage.includes(
    "mobile number is already registered with this Employee ID"
);

setConversation((previous) => ({
  ...previous,

  currentQuestionId:
    validationQuestionId || previous.currentQuestionId,

  reviewing: isDuplicate ? true : false,

  editingQuestionId: validationQuestionId || undefined,

  returnToReviewAfterEdit: validationQuestionId
    ? true
    : undefined,

  completed: false,

  messages: [
    ...previous.messages,

    {
      id: crypto.randomUUID(),

      role: "bot",

      content: errorMessage,

      timestamp: Date.now(),
    },

    ...(validationField
      ? [
          {
            id: crypto.randomUUID(),
            role: "bot" as const,
            content:
              "Please correct this detail and submit it again.",
            timestamp: Date.now(),
          },
        ]
      : []),
  ],
}));
                  } finally {
                    setSubmitting(false);
                  }
                }}
              />
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* INPUT AREA */}
          {!conversation.reviewing && (
            <div
              className="
            border-t
            border-slate-200
            bg-white
            p-4
            sm:p-5
          "
            >
              <QuestionRenderer
                questionType={currentQuestion?.type}
                onSubmit={submitAnswer}
                conversation={conversation}
                setConversation={setConversation}
                showNextQuestion={showNextQuestion}
                onEdit={handleEdit}
                existingAnswer={getExistingAnswer(
                  conversation.currentQuestionId,
                )}
              />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

/* ============================================================
   QUESTION RENDERER
   ============================================================ */

interface QuestionRendererProps {
  questionType?: string;

  onSubmit: (value: string) => void;

  conversation: ConversationState;

  setConversation: Dispatch<SetStateAction<ConversationState>>;

  showNextQuestion: (state: ConversationState) => void;
  onEdit: (section: string) => void;
  existingAnswer: string;
}

function QuestionRenderer({
  questionType,

  onSubmit,

  conversation,

  setConversation,

  showNextQuestion,
//   onEdit,
  existingAnswer,
}: QuestionRendererProps) {
  console.log("CURRENT QUESTION TYPE:", questionType);
  console.log("QuestionRenderer received:", questionType);

  switch (questionType) {
    /* ========================================================
       TEXT
       ======================================================== */

    case "text":
      return (
        <ChatInput
          placeholder="Type your answer..."
          initialValue={existingAnswer}
          onSubmit={onSubmit}
        />
      );

    /* ========================================================
       EMAIL
       ======================================================== */

    case "email":
      return (
        <ChatInput
          type="email"
          placeholder="name@institution..."
          initialValue={existingAnswer}
          onSubmit={onSubmit}
        />
      );

    /* ========================================================
       PHONE
       ======================================================== */

    case "phone":
      return (
        <ChatInput
          type="tel"
          placeholder="10-digit mobile number"
          initialValue={existingAnswer}
          onSubmit={onSubmit}
        />
      );

    /* ========================================================
       ORGANIZATION
       ======================================================== */

    case "organization":
      return (
        <OrganizationSelector
          onSelect={(organization) => {
            const updatedState: ConversationState = {
              ...conversation,

              messages: [
                ...conversation.messages,

                {
                  id: crypto.randomUUID(),

                  role: "user",

                  content: organization.name,

                  timestamp: Date.now(),
                  questionId: "organization",
                },
              ],

              formData: {
                ...conversation.formData,

                organization,
              },
            };

            setConversation(updatedState);

            showNextQuestion(updatedState);
          }}
        />
      );

    /* ========================================================
       DEVICE SELECTION
       ======================================================== */

    // case "device-select":
    //   return (
    //     <OptionCards
    //       multiple
    //       options={[
    //         {
    //           value: "laptop",
    //           label: "Laptop",
    //           description: "Register a Windows, Linux or macOS laptop.",
    //           icon: <Laptop size={25} />,
    //         },
    //         {
    //           value: "smartphone",
    //           label: "Smartphone",
    //           description: "Register an Android or iOS device.",
    //           icon: <Smartphone size={25} />,
    //         },
    //       ]}
    //       onSelect={(values) => {
    //         const updatedState: ConversationState = {
    //           ...conversation,

    //           messages: [
    //             ...conversation.messages,
    //             {
    //               id: crypto.randomUUID(),
    //               role: "user",
    //               content: values
    //                 .map((value) =>
    //                   value === "laptop" ? "Laptop" : "Smartphone",
    //                 )
    //                 .join(" + "),
    //               timestamp: Date.now(),
    //                questionId: "devices",
    //             },
    //           ],

    //           formData: {
    //             ...conversation.formData,

    //             devices: {
    //               laptop: {
    //                 ...conversation.formData.devices?.laptop,

    //                 requested: values.includes("laptop"),
    //               },

    //               smartphone: {
    //                 ...conversation.formData.devices?.smartphone,

    //                 requested: values.includes("smartphone"),
    //               },
    //             },
    //           },
    //         };

    //         setConversation(updatedState);

    //         showNextQuestion(updatedState);
    //       }}
    //     />
    //   );
    case "device-select":
  return (
    <OptionCards
      options={[
        {
          value: "smartphone",
          label: "Smartphone",
          description:
            "Register an Android or iOS smartphone.",
          icon: <Smartphone size={25} />,
        },
      ]}
      onSelect={([value]) => {
        const updatedState: ConversationState = {
          ...conversation,

          messages: [
            ...conversation.messages,

            {
              id: crypto.randomUUID(),

              role: "user",

              content: "Smartphone",

              timestamp: Date.now(),

              questionId: "devices",
            },
          ],

          formData: {
            ...conversation.formData,

            devices: {
              laptop: {
                ...conversation.formData.devices?.laptop,

                requested: false,
              },

              smartphone: {
                ...conversation.formData.devices?.smartphone,

                requested: value === "smartphone",
              },
            },
          },
        };

        setConversation(updatedState);

        showNextQuestion(updatedState);
      }}
    />
  );


    /* ========================================================
   LAPTOP OPERATING SYSTEM
   ======================================================== */

    case "laptop-os":
      return (
        <OptionCards
          options={[
            {
              value: "Windows",
              label: "Windows",
              icon: <AppWindow size={24} strokeWidth={1.8} />,
            },

            {
              value: "Linux",
              label: "Linux",
              icon: <Monitor size={24} strokeWidth={1.8} />,
            },

            {
              value: "macOS",
              label: "macOS",
              icon: <AppWindowMac size={24} strokeWidth={1.8} />,
            },
          ]}
          onSelect={([value]) => {
            const updatedState: ConversationState = {
              ...conversation,

              messages: [
                ...conversation.messages,

                {
                  id: crypto.randomUUID(),

                  role: "user",

                  content: value,

                  timestamp: Date.now(),

                  questionId: "laptopOS",
                  
                },
              ],

              formData: {
                ...conversation.formData,

                devices: {
                  ...conversation.formData.devices!,

                  laptop: {
                    ...conversation.formData.devices!.laptop,

                    requested: true,

                    operatingSystem: value as "Windows" | "Linux" | "macOS",
                  },
                },
              },
            };

            setConversation(updatedState);

            showNextQuestion(updatedState);
          }}
        />
      );

    /* ========================================================
       SMARTPHONE OPERATING SYSTEM
       ======================================================== */

    case "smartphone-os":
      return (
        <OptionCards
          options={[
            {
              value: "Android",

              label: "Android",

              icon: <Smartphone size={24} strokeWidth={1.8} />,
            },

            {
              value: "iOS",

              label: "iOS",

              icon: <Apple size={24} strokeWidth={1.8} />,
            },
          ]}
          onSelect={([value]) => {
            const updatedState = {
              ...conversation,

              messages: [
                ...conversation.messages,

                {
                  id: crypto.randomUUID(),

                  role: "user" as const,

                  content: value,

                  timestamp: Date.now(),
                  questionId: "smartphoneOS",
                },
              ],

              formData: {
                ...conversation.formData,

                devices: {
                  ...conversation.formData.devices!,

                  smartphone: {
                    ...conversation.formData.devices!.smartphone,
                    requested: true,

                    operatingSystem: value as "Android" | "iOS",
                  },
                },
              },
            };

            setConversation(updatedState);

            showNextQuestion(updatedState);
          }}
        />
      );

    /* ========================================================
       MAC ADDRESS
       ======================================================== */

    case "mac-address":
      return (
        <MacAddressInput
          initialValue={existingAnswer}
          onSubmit={(macAddress) => {
            const isLaptop = conversation.currentQuestionId === "laptopMac";

            const updatedState: ConversationState = {
              ...conversation,

              messages: [
                ...conversation.messages,
                {
                  id: crypto.randomUUID(),
                  role: "user",
                  content: macAddress,
                  timestamp: Date.now(),
                  questionId: isLaptop ? "laptopMac" : "smartphoneMac",
                },
              ],

              formData: {
                ...conversation.formData,

                devices: {
                  ...conversation.formData.devices!,

                  ...(isLaptop
                    ? {
                        laptop: {
                          ...conversation.formData.devices!.laptop,
                          macAddress,
                        },
                      }
                    : {
                        smartphone: {
                          ...conversation.formData.devices!.smartphone,
                          macAddress,
                        },
                      }),
                },
              },
            };

            setConversation(updatedState);

            showNextQuestion(updatedState);
          }}
        />
      );
    /* ========================================================
       GUESTHOUSE YES / NO
       ======================================================== */

    case "guesthouse-yes-no":
      return (
        <OptionCards
          options={[
            {
              value: "yes",
              label: "Yes",
              description: "I am staying in a guesthouse.",
              icon: <Building2 size={24} />,
            },
            {
              value: "no",
              label: "No",
              description: "I am not staying in a guesthouse.",
              icon: <ChevronLeft size={24} />,
            },
          ]}
          onSelect={([value]) => {
            const staying = value === "yes";

            const updatedState: ConversationState = {
              ...conversation,

              messages: [
                ...conversation.messages,
                {
                  id: crypto.randomUUID(),
                  role: "user",
                  content: staying ? "Yes" : "No",
                  timestamp: Date.now(),
                  questionId: "guesthouseStaying",
                },
              ],

              formData: {
                ...conversation.formData,

                guesthouse: staying
                  ? {
                      ...(conversation.formData.guesthouse ?? {}),
                      staying: true,
                    }
                  : {
                      staying: false,
                    },
              },
            };

            setConversation(updatedState);

            /*
             * If we are editing from Review:
             * changing the answer should return to Review.
             */
            if (updatedState.editingQuestionId) {
              showNextQuestion(updatedState);
              return;
            }

            showNextQuestion(updatedState);
          }}
        />
      );

    /* ========================================================
       GUESTHOUSE SELECTION
       ======================================================== */

    case "guesthouse-select":
  return (
    <OptionCards
      options={[
        {
          value: "IICT_PRAGYAN_HOSTEL",
          label: "IICT Pragyan Hostel",
          description: "Indian Institute of Chemical Technology",
          icon: <Building2 size={26} strokeWidth={1.8} />,
        },
        {
          value: "IICT_GUEST_HOUSE",
          label: "IICT Guest House",
          description: "Indian Institute of Chemical Technology",
          icon: <Building2 size={26} strokeWidth={1.8} />,
        },
        {
          value: "NGRI",
          label: "NGRI Guest House",
          description: "National Geophysical Research Institute",
          icon: <Building2 size={26} strokeWidth={1.8} />,
        },
        {
          value: "CCMB",
          label: "CCMB Guest House",
          description: "Centre for Cellular and Molecular Biology",
          icon: <Building2 size={26} strokeWidth={1.8} />,
        },
      ]}
      onSelect={([value]) => {
        const updatedState: ConversationState = {
          ...conversation,

          messages: [
            ...conversation.messages,

            {
              id: crypto.randomUUID(),
              role: "user",
            //   content: value,
            content: getGuesthouseLabel(
  value as
    | "IICT_PRAGYAN_HOSTEL"
    | "IICT_GUEST_HOUSE"
    | "NGRI"
    | "CCMB",
),
              timestamp: Date.now(),
              questionId: "guesthouse",
            },
          ],

          formData: {
            ...conversation.formData,

            guesthouse: {
              ...conversation.formData.guesthouse,

              staying: true,

              name: value as
                | "IICT_PRAGYAN_HOSTEL"
                | "IICT_GUEST_HOUSE"
                | "NGRI"
                | "CCMB",
            },
          },
        };

        setConversation(updatedState);

        showNextQuestion(updatedState);
      }}
    />
  );

    /* ========================================================
       ROOM NUMBER
       ======================================================== */

    case "room-number":
      return (
        <ChatInput
          placeholder="Enter room number..."
          initialValue={existingAnswer}
          onSubmit={(value) => {
            const updatedState: ConversationState = {
              ...conversation,

              messages: [
                ...conversation.messages,
                {
                  id: crypto.randomUUID(),
                  role: "user",
                  content: value,
                  timestamp: Date.now(),
                   questionId: "roomNumber",
                },
              ],

              formData: {
                ...conversation.formData,

                guesthouse: {
                  ...conversation.formData.guesthouse!,
                  roomNumber: value,
                },
              },
            };

            setConversation(updatedState);

            showNextQuestion(updatedState);
          }}
        />
      );

    /* ========================================================
   DATE
   ======================================================== */

    case "date": {
      const today = new Date();

      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, "0");
      const day = String(today.getDate()).padStart(2, "0");

      const todayString = `${year}-${month}-${day}`;

      return (
        <ChatInput
          type="date"
          placeholder="Select registration date"
          initialValue={existingAnswer}
          min={todayString}
          onSubmit={onSubmit}
        />
      );
    }

    /* ========================================================
       PLACE
       ======================================================== */

    case "place":
      return (
        <ChatInput
          placeholder="Enter place..."
          initialValue={existingAnswer}
          onSubmit={onSubmit}
        />
      );

    /* ========================================================
       DECLARATION
       ======================================================== */

    case "declaration":
      return (
        <DeclarationCard
          onAccept={() => {
            const updatedState = {
              ...conversation,

              messages: [
                ...conversation.messages,

                {
                  id: crypto.randomUUID(),

                  role: "user" as const,

                  content: "I accept the declaration.",

                  timestamp: Date.now(),
                  questionId: "declaration",
                },
              ],

              formData: {
                ...conversation.formData,

                declarationAccepted: true,
              },
            };

            setConversation(updatedState);

            showNextQuestion(updatedState);
          }}
        />
      );

    /* ========================================================
       REVIEW
       ======================================================== */
    //     case 'review':

    //   return (
    //     <ReviewScreen
    //       formData={conversation.formData}
    //       onEdit={onEdit}
    //       onSubmit={() => {
    //         console.log(
    //           'FINAL FORM DATA:',
    //           conversation.formData
    //         );
    //       }}
    //     />
    //   );

    /* ========================================================
       DEFAULT
       ======================================================== */

    default:
      return null;
  }
}
