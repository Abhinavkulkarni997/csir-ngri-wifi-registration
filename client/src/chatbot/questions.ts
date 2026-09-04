import type {
  ChatQuestion,
} from './questionTypes';


export const questions: ChatQuestion[] = [

  {
    id: 'fullName',
    type: 'text',
    field: 'fullName',
    required: true,
    message:
      "Hello!  Welcome to the CSIR-NGRI Wi-Fi Registration Portal. I'll guide you through the registration. To begin, what is your full name?(Please mention the name dispalyed in your official ID Card , this will be printed on the certificate) ",
  },

  {
    id: 'designation',
    type: 'text',
    field: 'designation',
    required: true,
    message:
      'Thanks! What is your designation?',
  },

  {
    id: 'employeeId',
    type: 'text',
    field: 'employeeId',
    required: true,
    message:
      'Please enter your Employee ID number.',
  },

  {
    id: 'institutionEmail',
    type: 'email',
    field: 'institutionEmail',
    required: true,
    message:
      'Please enter your institutional email address.',
  },

  {
    id: 'mobileNumber',
    type: 'phone',
    field: 'mobileNumber',
    required: true,
    message:
      'What mobile number should be associated with this registration?',
  },

  {
    id: 'organization',
    type: 'organization',
    field: 'organization',
    required: true,
    message:
      'Which CSIR organization or institute are you associated with?',
  },

  {
    id: 'divisionGroup',
    type: 'text',
    field: 'divisionGroup',
    required: true,
    message:
      'What is your Division or Group?',
  },

  {
    id: 'devices',
    type: 'device-select',
    message:
    //   'Which device would you like to connect to the CSIR-NGRI Wi-Fi? You can select a laptop, smartphone, or both.',
        'Which device would you like to connect to the CSIR-NGRI Wi-Fi?',
  },

  {
    id: 'laptopOS',
    type: 'laptop-os',
    message:
      "Let's configure your laptop first. Which operating system does it use?",
  },

  {
    id: 'laptopMac',
    type: 'mac-address',
    message:
      "Great. Now enter your laptop's Wi-Fi MAC address.",
  },

  {
    id: 'smartphoneOS',
    type: 'smartphone-os',
    message:
    //   "Your laptop is configured. Now let's configure your smartphone. Which operating system does it use?",
    "Let's configure your smartphone. Which operating system does it use?",
  },

  {
    id: 'smartphoneMac',
    type: 'mac-address',
    message:
      "Almost done. Please enter your smartphone's Wi-Fi MAC address.",
  },

  {
    id: 'guesthouseStaying',
    type: 'guesthouse-yes-no',
    message:
      'Are you currently staying in a CSIR guesthouse?',
  },

  {
    id: 'guesthouse',
    type: 'guesthouse-select',
    message:
      'Please select the guesthouse where you are staying.',
  },

  {
    id: 'roomNumber',
    type: 'room-number',
    message:
      'What is your guesthouse room number?',
  },

  {
    id: 'date',
    type: 'date',
    field: 'date',
    required: true,
    message:
      'Please select the date of this Wi-Fi registration.',
  },

  {
    id: 'place',
    type: 'place',
    field: 'place',
    required: true,
    message:
      'Finally, Please mention the place where you are submitting this registration?',
  },

  {
    id: 'declaration',
    type: 'declaration',
    field: 'declarationAccepted',
    required: true,
    message:
      'Please review the declaration and confirm that you agree to the CSIR-NGRI Wi-Fi usage conditions.',
  },



];


export const getQuestionById = (
  questionId: string
): ChatQuestion | undefined => {

  return questions.find(
    (question) =>
      question.id === questionId
  );

};