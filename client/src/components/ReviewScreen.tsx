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

interface ReviewScreenProps {
  formData: Partial<RegistrationFormData>;
  onEdit: (section: string) => void;
  onSubmit: () => void;
}

export default function ReviewScreen({
  formData,
  onEdit,
  onSubmit,
}: ReviewScreenProps) {
  const laptop = formData.devices?.laptop;
  const smartphone = formData.devices?.smartphone;
  const guesthouse = formData.guesthouse;

  return (
    <div className="w-full space-y-4">

      {/* HEADER */}
      <div className="rounded-2xl border border-indigo-100 bg-indigo-50 p-5">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white">
            <CheckCircle2 size={23} />
          </div>

          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Registration Summary
            </h2>

            <p className="mt-1 text-sm text-slate-600">
              Please verify your details before submitting the
              Wi-Fi registration.
            </p>
          </div>
        </div>
      </div>

      {/* PERSONAL INFORMATION */}
      <ReviewCard
        title="Personal Information"
        icon={<UserRound size={20} />}
        onEdit={() => onEdit('personal')}
      >
        <ReviewRow
          label="Full Name"
          value={formData.fullName}
        />

        <ReviewRow
          label="Designation"
          value={formData.designation}
        />

        <ReviewRow
          label="Employee ID"
          value={formData.employeeId}
        />

        <ReviewRow
          label="Institutional Email"
          value={formData.institutionEmail}
        />

        <ReviewRow
          label="Mobile Number"
          value={formData.mobileNumber}
        />
      </ReviewCard>

      {/* ORGANIZATION */}
      <ReviewCard
        title="Organization"
        icon={<Building2 size={20} />}
        onEdit={() => onEdit('organization')}
      >
        <ReviewRow
          label="Organization"
          value={formData.organization?.name}
        />

        {formData.organization?.id === 45 && (
          <ReviewRow
            label="Organization Name"
            value={formData.otherOrganizationName}
          />
        )}

        <ReviewRow
          label="Division / Group"
          value={formData.divisionGroup}
        />
      </ReviewCard>

      {/* DEVICES */}
      <ReviewCard
        title="Device Registration"
        icon={<Laptop size={20} />}
        onEdit={() => onEdit('devices')}
      >
        {laptop?.requested && (
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-center gap-2">
              <Laptop
                size={19}
                className="text-indigo-600"
              />

              <span className="font-semibold text-slate-900">
                Laptop
              </span>
            </div>

            <div className="mt-3 space-y-2">
              <ReviewRow
                label="Operating System"
                value={laptop.operatingSystem}
              />

              <ReviewRow
                label="MAC Address"
                value={laptop.macAddress}
                mono
              />
            </div>
          </div>
        )}

        {smartphone?.requested && (
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-center gap-2">
              <Smartphone
                size={19}
                className="text-indigo-600"
              />

              <span className="font-semibold text-slate-900">
                Smartphone
              </span>
            </div>

            <div className="mt-3 space-y-2">
              <ReviewRow
                label="Operating System"
                value={smartphone.operatingSystem}
              />

              <ReviewRow
                label="MAC Address"
                value={smartphone.macAddress}
                mono
              />
            </div>
          </div>
        )}
      </ReviewCard>

      {/* GUESTHOUSE */}
      <ReviewCard
        title="Guesthouse"
        icon={<House size={20} />}
        onEdit={() => onEdit('guesthouse')}
      >
        <ReviewRow
          label="Staying in Guesthouse"
          value={guesthouse?.staying ? 'Yes' : 'No'}
        />

        {guesthouse?.staying && (
          <>
            <ReviewRow
              label="Guesthouse"
              value={guesthouse.name}
            />

            <ReviewRow
              label="Room Number"
              value={guesthouse.roomNumber}
            />
          </>
        )}
      </ReviewCard>

      {/* REGISTRATION DETAILS */}
      <ReviewCard
        title="Registration Details"
        icon={<CalendarDays size={20} />}
        onEdit={() => onEdit('registration')}
      >
        <ReviewRow
          label="Date"
          value={formData.date}
        />

        <ReviewRow
          label="Place"
          value={formData.place}
          icon={<MapPin size={16} />}
        />
      </ReviewCard>

      {/* DECLARATION */}
      <div className="rounded-2xl border border-green-200 bg-green-50 p-4 sm:p-5">
        <div className="flex items-center gap-3">
          <CheckCircle2
            size={22}
            className="shrink-0 text-green-600"
          />

          <div>
            <p className="font-semibold text-green-900">
              Declaration Accepted
            </p>

            <p className="mt-1 text-sm text-green-700">
              You have confirmed that you agree to the
              CSIR-NGRI Wi-Fi usage declaration.
            </p>
          </div>
        </div>
      </div>

      {/* SUBMIT */}
      <div className="pt-2">
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

        <p className="mt-2 text-center text-xs text-slate-400">
          Please make sure all information is correct before
          submitting.
        </p>
      </div>
    </div>
  );
}

/* -------------------------------- */
/* REVIEW CARD */
/* -------------------------------- */

interface ReviewCardProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  onEdit: () => void;
}

function ReviewCard({
  title,
  icon,
  children,
  onEdit,
}: ReviewCardProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3 sm:px-5">
        <div className="flex items-center gap-2">
          <span className="text-indigo-600">
            {icon}
          </span>

          <h3 className="font-semibold text-slate-900">
            {title}
          </h3>
        </div>

        <button
          type="button"
          onClick={onEdit}
          className="
            flex
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
          <Pencil size={15} />
          Edit
        </button>
      </div>

      <div className="space-y-3 p-4 sm:p-5">
        {children}
      </div>
    </div>
  );
}

/* -------------------------------- */
/* REVIEW ROW */
/* -------------------------------- */

interface ReviewRowProps {
  label: string;
  value?: string;
  mono?: boolean;
  icon?: React.ReactNode;
}

function ReviewRow({
  label,
  value,
  mono = false,
  icon,
}: ReviewRowProps) {
  return (
    <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
      <span className="flex items-center gap-1 text-xs font-medium uppercase tracking-wide text-slate-400">
        {icon}
        {label}
      </span>

      <span
        className={`
          text-sm
          font-medium
          text-slate-800
          sm:max-w-[65%]
          sm:text-right
          break-words
          ${mono ? 'font-mono tracking-wide' : ''}
        `}
      >
        {value || '—'}
      </span>
    </div>
  );
}