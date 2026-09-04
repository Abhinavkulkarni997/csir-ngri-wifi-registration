import {
  User,
  BriefcaseBusiness,
  IdCard,
  Mail,
  Phone,
  Building2,
  Layers3,
  Laptop,
  Smartphone,
  Network,
  House,
  DoorOpen,
  CalendarDays,
  MapPin,
  Pencil,
  CheckCircle2,
} from 'lucide-react';

import type { RegistrationFormData } from '../schemas/registration.schema';

interface ReviewCardProps {
  formData: Partial<RegistrationFormData>;
  onEdit: (questionId: string) => void;
  onConfirm: () => void;
}

interface ReviewRowProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  onEdit?: () => void;
}

function ReviewRow({
  icon,
  label,
  value,
  onEdit,
}: ReviewRowProps) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 sm:p-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
        {icon}
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
          {label}
        </p>

        <p className="mt-1 break-words text-sm font-medium text-slate-800">
          {value || 'Not provided'}
        </p>
      </div>

      {onEdit && (
        <button
          type="button"
          onClick={onEdit}
          className="
            flex shrink-0 items-center gap-1.5
            rounded-lg
            border border-slate-200
            bg-white
            px-3 py-2
            text-xs font-semibold
            text-indigo-600
            transition
            hover:bg-indigo-50
          "
        >
          <Pencil size={14} />
          Edit
        </button>
      )}
    </div>
  );
}

export default function ReviewCard({
  formData,
  onEdit,
  onConfirm,
}: ReviewCardProps) {
  const laptop = formData.devices?.laptop;
  const smartphone = formData.devices?.smartphone;

  const organization =
    typeof formData.organization === 'object'
      ? formData.organization?.name
      : String(formData.organization ?? '');

  const guesthouseName =
    formData.guesthouse?.name ?? '';

  return (
    <div className="w-full space-y-5">

      {/* HEADER */}
      <div className="rounded-2xl border border-indigo-100 bg-indigo-50 p-5">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white">
            <CheckCircle2 size={24} />
          </div>

          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Review Your Registration
            </h2>

            <p className="mt-1 text-sm text-slate-600">
              Please verify all details before submitting.
              You can edit any field if required.
            </p>
          </div>
        </div>
      </div>

      {/* PERSONAL INFORMATION */}
      <section>
        <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-slate-700">
          <User size={17} />
          Personal Information
        </h3>

        <div className="space-y-2">
          <ReviewRow
            icon={<User size={19} />}
            label="Full Name"
            value={String(formData.fullName ?? '')}
            onEdit={() => onEdit('fullName')}
          />

          <ReviewRow
            icon={<BriefcaseBusiness size={19} />}
            label="Designation"
            value={String(formData.designation ?? '')}
            onEdit={() => onEdit('designation')}
          />

          <ReviewRow
            icon={<IdCard size={19} />}
            label="Employee ID"
            value={String(formData.employeeId ?? '')}
            onEdit={() => onEdit('employeeId')}
          />

          <ReviewRow
            icon={<Mail size={19} />}
            label="Institutional Email"
            value={String(formData.institutionEmail ?? '')}
            onEdit={() => onEdit('institutionEmail')}
          />

          <ReviewRow
            icon={<Phone size={19} />}
            label="Mobile Number"
            value={String(formData.mobileNumber ?? '')}
            onEdit={() => onEdit('mobileNumber')}
          />

          <ReviewRow
            icon={<Building2 size={19} />}
            label="Organization"
            value={organization}
            onEdit={() => onEdit('organization')}
          />

          <ReviewRow
            icon={<Layers3 size={19} />}
            label="Division / Group"
            value={String(formData.divisionGroup ?? '')}
            onEdit={() => onEdit('divisionGroup')}
          />
        </div>
      </section>

      {/* DEVICE INFORMATION */}
      <section>
        <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-slate-700">
          <Network size={17} />
          Device Information
        </h3>

        <div className="space-y-3">

          {/* LAPTOP */}
          {laptop?.requested && (
            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Laptop
                    size={20}
                    className="text-indigo-600"
                  />

                  <span className="font-semibold text-slate-800">
                    Laptop
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => onEdit('laptopOS')}
                  className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-indigo-600 hover:bg-indigo-50"
                >
                  <Pencil size={14} />
                  Edit
                </button>
              </div>

              <div className="grid gap-2 sm:grid-cols-2">
                <div className="rounded-lg bg-slate-50 p-3">
                  <p className="text-xs text-slate-400">
                    Operating System
                  </p>

                  <p className="mt-1 text-sm font-medium text-slate-800">
                    {laptop.operatingSystem ?? 'Not provided'}
                  </p>
                </div>

                <div className="rounded-lg bg-slate-50 p-3">
                  <p className="text-xs text-slate-400">
                    MAC Address
                  </p>

                  <p className="mt-1 font-mono text-sm font-medium text-slate-800">
                    {laptop.macAddress ?? 'Not provided'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onEdit('laptopMac')}
                className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:underline"
              >
                <Pencil size={13} />
                Edit MAC address
              </button>
            </div>
          )}

          {/* SMARTPHONE */}
          {smartphone?.requested && (
            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Smartphone
                    size={20}
                    className="text-indigo-600"
                  />

                  <span className="font-semibold text-slate-800">
                    Smartphone
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => onEdit('smartphoneOS')}
                  className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-indigo-600 hover:bg-indigo-50"
                >
                  <Pencil size={14} />
                  Edit
                </button>
              </div>

              <div className="grid gap-2 sm:grid-cols-2">
                <div className="rounded-lg bg-slate-50 p-3">
                  <p className="text-xs text-slate-400">
                    Operating System
                  </p>

                  <p className="mt-1 text-sm font-medium text-slate-800">
                    {smartphone.operatingSystem ?? 'Not provided'}
                  </p>
                </div>

                <div className="rounded-lg bg-slate-50 p-3">
                  <p className="text-xs text-slate-400">
                    MAC Address
                  </p>

                  <p className="mt-1 font-mono text-sm font-medium text-slate-800">
                    {smartphone.macAddress ?? 'Not provided'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onEdit('smartphoneMac')}
                className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:underline"
              >
                <Pencil size={13} />
                Edit MAC address
              </button>
            </div>
          )}

          {/* NO DEVICE */}
          {!laptop?.requested &&
            !smartphone?.requested && (
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700">
                No device has been selected.
              </div>
            )}
        </div>
      </section>

      {/* GUESTHOUSE */}
      {/* GUESTHOUSE */}
<section>
  <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-slate-700">
    <House size={17} />
    Guesthouse Information
  </h3>

  <div className="space-y-2">

    {/* STAYING */}
    <ReviewRow
      icon={<House size={19} />}
      label="Guesthouse Stay"
      value={
        formData.guesthouse?.staying
          ? 'Yes'
          : 'No'
      }
      onEdit={() =>
        onEdit('guesthouseStaying')
      }
    />

    {/* GUESTHOUSE NAME */}
    {formData.guesthouse?.staying && (
      <>
        <ReviewRow
          icon={<Building2 size={19} />}
          label="Guesthouse"
          value={guesthouseName}
          onEdit={() =>
            onEdit('guesthouse')
          }
        />

        {/* ROOM NUMBER */}
        <ReviewRow
          icon={<DoorOpen size={19} />}
          label="Room Number"
          value={String(
            formData.guesthouse?.roomNumber ?? ''
          )}
          onEdit={() =>
            onEdit('roomNumber')
          }
        />
      </>
    )}

  </div>
</section>

      {/* SUBMISSION INFORMATION */}
      <section>
        <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-slate-700">
          <CalendarDays size={17} />
          Submission Information
        </h3>

        <div className="space-y-2">
          <ReviewRow
            icon={<CalendarDays size={19} />}
            label="Date"
            value={String(formData.date ?? '')}
            onEdit={() => onEdit('date')}
          />

          <ReviewRow
            icon={<MapPin size={19} />}
            label="Place"
            value={String(formData.place ?? '')}
            onEdit={() => onEdit('place')}
          />
        </div>
      </section>

      {/* FINAL CONFIRMATION */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        <div className="flex items-start gap-3">
          <CheckCircle2
            size={22}
            className="mt-0.5 shrink-0 text-green-600"
          />

          <div>
            <p className="font-semibold text-slate-800">
              Ready to submit?
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Make sure all information above is correct.
              Once submitted, your Wi-Fi registration
              request will be ready for processing.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onConfirm}
          className="
            mt-5
            flex
            w-full
            items-center
            justify-center
            gap-2
            rounded-xl
            bg-green-600
            px-5
            py-3.5
            text-sm
            font-bold
            text-white
            shadow-sm
            transition
            hover:bg-green-700
            active:scale-[0.99]
          "
        >
          <CheckCircle2 size={19} />
          Confirm & Submit
        </button>
      </div>
    </div>
  );
}