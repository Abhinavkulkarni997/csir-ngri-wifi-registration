export type LaptopOS = 'Windows' | 'Linux' | 'macOS';

export type SmartphoneOS = 'Android' | 'iOS';


export type GuesthouseName =
  | 'IICT_PRAGYAN_HOSTEL'
  | 'IICT_GUEST_HOUSE'
  | 'NGRI'
  | 'CCMB';

export interface Organization {
  id: number;
  name: string;
}

export interface LaptopRegistration {
  requested: boolean;
  operatingSystem?: LaptopOS;
  macAddress?: string;
}

export interface SmartphoneRegistration {
  requested: boolean;
  operatingSystem?: SmartphoneOS;
  macAddress?: string;
}

export interface Devices {
  laptop: LaptopRegistration;
  smartphone: SmartphoneRegistration;
}

export interface GuesthouseDetails {
  staying: boolean;
  name?: GuesthouseName;
  roomNumber?: string;
}

export interface WiFiRegistration {
  fullName: string;
  designation: string;
  employeeId: string;
  institutionEmail: string;
  mobileNumber: string;

  organization: Organization;
  otherOrganizationName?: string;

  divisionGroup: string;

  devices: Devices;

  guesthouse: GuesthouseDetails;

  date: string;
  place: string;

  declarationAccepted: boolean;
}

export interface RegistrationSubmission
  extends WiFiRegistration {
  registrationId?: string;
  submittedAt?: string;
}