import {
  UserRound,
  Building2,
  Laptop,
  Smartphone,
  House,
  CalendarDays,
  MapPin,
  Pencil,
  CheckCircle2,
} from 'lucide-react';

import type { RegistrationFormData } from '../schemas/registration.schema';

interface RegistrationSummaryProps {
  formData: Partial<RegistrationFormData>;
  onEdit: (questionId: string) => void;
  onSubmit: () => void;
}

export default function RegistrationSummary({
  formData,
  onEdit,
  onSubmit,
}: RegistrationSummaryProps) {
  const laptop = formData.devices?.laptop;
  const smartphone = formData.devices?.smartphone;
  const guesthouse = formData.guesthouse;

  return (
    <div className="w-full space-y-3">

      {/* SUMMARY HEADER */}
      <div className="rounded-2xl border border-indigo-100 bg-indigo-50 p-4 sm:p-5">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white">
            <CheckCircle2 size={22} />
          </div>

          <div>
            <h2 className="font-bold text-slate-900">
              Registration Details
            </h2>

            <p className="mt-1 text-sm text-slate-600">
              Please check your details. You can edit any individual
              answer before submitting.
            </p>
          </div>
        </div>
      </div>

      {/* PERSONAL */}
      <SummarySection
        title="Personal Information"
        icon={<UserRound size={19} />}
      >
        <SummaryRow
          label="Full Name"
          value={formData.fullName}
          onEdit={() => onEdit('fullName')}
        />

        <SummaryRow
          label="Designation"
          value={formData.designation}
          onEdit={() => onEdit('designation')}
        />

        <SummaryRow
          label="Employee ID"
          value={formData.employeeId}
          onEdit={() => onEdit('employeeId')}
        />

        <SummaryRow
          label="Institutional Email"
          value={formData.institutionEmail}
          onEdit={() => onEdit('institutionEmail')}
        />

        <SummaryRow
          label="Mobile Number"
          value={formData.mobileNumber}
          onEdit={() => onEdit('mobileNumber')}
        />
      </SummarySection>

      {/* ORGANIZATION */}
      <SummarySection
        title="Organization"
        icon={<Building2 size={19} />}
      >
        <SummaryRow
          label="Organization"
          value={formData.organization?.name}
          onEdit={() => onEdit('organization')}
        />

        {formData.organization?.id === 45 && (
          <SummaryRow
            label="Organization Name"
            value={formData.otherOrganizationName}
            onEdit={() => onEdit('otherOrganizationName')}
          />
        )}

        <SummaryRow
          label="Division / Group"
          value={formData.divisionGroup}
          onEdit={() => onEdit('divisionGroup')}
        />
      </SummarySection>

      {/* LAPTOP */}
      {laptop?.requested && (
        <SummarySection
          title="Laptop"
          icon={<Laptop size={19} />}
        >
          <SummaryRow
            label="Operating System"
            value={laptop.operatingSystem}
            onEdit={() => onEdit('laptopOS')}
          />

          <SummaryRow
            label="MAC Address"
            value={laptop.macAddress}
            mono
            onEdit={() => onEdit('laptopMac')}
          />
        </SummarySection>
      )}

      {/* SMARTPHONE */}
      {smartphone?.requested && (
        <SummarySection
          title="Smartphone"
          icon={<Smartphone size={19} />}
        >
          <SummaryRow
            label="Operating System"
            value={smartphone.operatingSystem}
            onEdit={() => onEdit('smartphoneOS')}
          />

          <SummaryRow
            label="MAC Address"
            value={smartphone.macAddress}
            mono
            onEdit={() => onEdit('smartphoneMac')}
          />
        </SummarySection>
      )}

      {/* DEVICE SELECTION */}
      <SummarySection
        title="Registered Devices"
        icon={<Laptop size={19} />}
      >
        <SummaryRow
          label="Devices"
          value={[
            laptop?.requested ? 'Laptop' : null,
            smartphone?.requested ? 'Smartphone' : null,
          ]
            .filter(Boolean)
            .join(' + ')}
          onEdit={() => onEdit('devices')}
        />
      </SummarySection>

      {/* GUESTHOUSE */}
      <SummarySection
        title="Guesthouse"
        icon={<House size={19} />}
      >
        <SummaryRow
          label="Staying in Guesthouse"
          value={guesthouse?.staying ? 'Yes' : 'No'}
          onEdit={() => onEdit('guesthouseStaying')}
        />

        {guesthouse?.staying && (
          <>
            <SummaryRow
              label="Guesthouse"
              value={guesthouse.name}
              onEdit={() => onEdit('guesthouse')}
            />

            <SummaryRow
              label="Room Number"
              value={guesthouse.roomNumber}
              onEdit={() => onEdit('roomNumber')}
            />
          </>
        )}
      </SummarySection>

      {/* REGISTRATION */}
      <SummarySection
        title="Registration Details"
        icon={<CalendarDays size={19} />}
      >
        <SummaryRow
          label="Date"
          value={formData.date}
          onEdit={() => onEdit('date')}
        />

        <SummaryRow
          label="Place"
          value={formData.place}
          onEdit={() => onEdit('place')}
          icon={<MapPin size={15} />}
        />
      </SummarySection>

      {/* DECLARATION */}
      <div className="rounded-2xl border border-green-200 bg-green-50 p-4">
        <div className="flex items-start gap-3">
          <CheckCircle2
            size={21}
            className="mt-0.5 shrink-0 text-green-600"
          />

          <div>
            <p className="font-semibold text-green-900">
              Declaration Accepted
            </p>

            <p className="mt-1 text-sm text-green-700">
              You have accepted the CSIR-NGRI Wi-Fi usage declaration.
            </p>
          </div>
        </div>
      </div>

      {/* SUBMIT */}
      <button
        type="button"
        onClick={onSubmit}
        className="
          flex
          w-full
          items-center
          justify-center
          gap-2
          rounded-xl
          bg-indigo-600
          px-5
          py-3.5
          text-sm
          font-semibold
          text-white
          shadow-sm
          transition
          hover:bg-indigo-700
          active:scale-[0.99]
          focus:outline-none
          focus:ring-4
          focus:ring-indigo-100
        "
      >
        <CheckCircle2 size={19} />
        Confirm & Submit Registration
      </button>
    </div>
  );
}

/* ===================================================== */
/* SECTION */
/* ===================================================== */

interface SummarySectionProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

function SummarySection({
  title,
  icon,
  children,
}: SummarySectionProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center gap-2 border-b border-slate-100 px-4 py-3">
        <span className="text-indigo-600">
          {icon}
        </span>

        <h3 className="font-semibold text-slate-900">
          {title}
        </h3>
      </div>

      <div className="divide-y divide-slate-100">
        {children}
      </div>
    </div>
  );
}

/* ===================================================== */
/* ROW */
/* ===================================================== */

interface SummaryRowProps {
  label: string;
  value?: string;
  mono?: boolean;
  icon?: React.ReactNode;
  onEdit: () => void;
}

function SummaryRow({
  label,
  value,
  mono = false,
  icon,
  onEdit,
}: SummaryRowProps) {
  return (
    <div className="flex items-center gap-3 px-4 py-3">

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1 text-xs font-medium uppercase tracking-wide text-slate-400">
          {icon}
          {label}
        </div>

        <div
          className={`
            mt-1
            break-words
            text-sm
            font-medium
            text-slate-800
            ${mono ? 'font-mono tracking-wide' : ''}
          `}
        >
          {value || '—'}
        </div>
      </div>

      <button
        type="button"
        onClick={onEdit}
        className="
          flex
          shrink-0
          items-center
          gap-1
          rounded-lg
          px-2.5
          py-1.5
          text-sm
          font-semibold
          text-indigo-600
          transition
          hover:bg-indigo-50
          hover:text-indigo-800
        "
      >
        <Pencil size={14} />
        Edit
      </button>
    </div>
  );
}