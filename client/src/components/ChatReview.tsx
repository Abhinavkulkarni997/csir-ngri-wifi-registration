import {
  ClipboardList,
  CheckCircle2,
  Pencil,
  Send,
  Loader2,
} from "lucide-react";

import type { RegistrationFormData } from "../schemas/registration.schema";

interface ChatReviewProps {
  formData: Partial<RegistrationFormData>;
  onEdit: (questionId: string) => void;
  onSubmit: () => void;
  isSubmitting?: boolean;
  completed?: boolean;
}

export default function ChatReview({
  formData,
  onEdit,
  onSubmit,
  isSubmitting = false,
  completed = false,
}: ChatReviewProps) {
//   const laptop = formData.devices?.laptop;
  const smartphone = formData.devices?.smartphone;
  const guesthouse = formData.guesthouse;

  /*
   * ----------------------------------------------------------
   * SUCCESS STATE
   * ----------------------------------------------------------
   */

  if (completed) {
    return (
      <div className="w-full">
        <div className="rounded-2xl border border-green-200 bg-white shadow-sm overflow-hidden">
          <div className="p-6 sm:p-8 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-50 text-green-600">
              <CheckCircle2 size={34} />
            </div>

            <h3 className="mt-4 text-lg font-semibold text-slate-900">
              Registration Submitted Successfully
            </h3>

            <p className="mt-2 text-sm text-slate-600">
              Your Registration Form  has been submitted successfully.
            </p>

            <p className="mt-1 text-xs text-slate-500">
              You may now close this window.
            </p>
          </div>
        </div>
      </div>
    );
  }

  /*
   * ----------------------------------------------------------
   * REVIEW CARD
   * ----------------------------------------------------------
   */

  return (
    <div className="w-full">
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        {/* HEADER */}
        <div className="flex items-center gap-3 border-b border-slate-200 p-4 sm:p-5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
            <ClipboardList size={23} />
          </div>

          <div>
            <h3 className="font-semibold text-slate-900">
              Registration Summary
            </h3>

            <p className="text-sm text-slate-500">
              Please verify your details before submitting.
            </p>
          </div>
        </div>

        {/* DETAILS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 md:divide-x md:divide-slate-200">
          {/* LEFT COLUMN */}
          <div className="p-4 sm:p-5 space-y-3">
            <ReviewRow
              label="Full Name"
              value={formData.fullName}
              questionId="fullName"
              onEdit={onEdit}
              disabled={isSubmitting}
            />

            <ReviewRow
              label="Designation"
              value={formData.designation}
              questionId="designation"
              onEdit={onEdit}
              disabled={isSubmitting}
            />

            <ReviewRow
              label="Employee ID"
              value={formData.employeeId}
              questionId="employeeId"
              onEdit={onEdit}
              disabled={isSubmitting}
            />

            <ReviewRow
              label="Institutional Email"
              value={formData.institutionEmail}
              questionId="institutionEmail"
              onEdit={onEdit}
              disabled={isSubmitting}
            />

            <ReviewRow
              label="Mobile Number"
              value={formData.mobileNumber}
              questionId="mobileNumber"
              onEdit={onEdit}
              disabled={isSubmitting}
            />

            <ReviewRow
              label="Organization"
              value={formData.organization?.name}
              questionId="organization"
              onEdit={onEdit}
              disabled={isSubmitting}
            />

            <ReviewRow
              label="Division / Group"
              value={formData.divisionGroup}
              questionId="divisionGroup"
              onEdit={onEdit}
              disabled={isSubmitting}
            />
          </div>

          {/* RIGHT COLUMN */}
          <div className="p-4 sm:p-5 space-y-3">
            {/* LAPTOP */}
            {/* <ReviewRow
              label="Laptop"
              value={
                laptop?.requested
                  ? `Yes${
                      laptop.operatingSystem
                        ? ` — ${laptop.operatingSystem}`
                        : ""
                    }`
                  : "No"
              }
              questionId="laptopOS"
              onEdit={onEdit}
              disabled={isSubmitting}
            />

            {laptop?.requested && (
              <ReviewRow
                label="Laptop MAC"
                value={laptop.macAddress}
                questionId="laptopMac"
                onEdit={onEdit}
                disabled={isSubmitting}
              />
            )} */}

            {/* SMARTPHONE */}
            <ReviewRow
              label="Smartphone"
              value={
                smartphone?.requested
                  ? `Yes${
                      smartphone.operatingSystem
                        ? ` — ${smartphone.operatingSystem}`
                        : ""
                    }`
                  : "No"
              }
              questionId="smartphoneOS"
              onEdit={onEdit}
              disabled={isSubmitting}
            />

            {smartphone?.requested && (
              <ReviewRow
                label="Smartphone MAC"
                value={smartphone.macAddress}
                questionId="smartphoneMac"
                onEdit={onEdit}
                disabled={isSubmitting}
              />
            )}

            {/* GUESTHOUSE */}

            <ReviewRow
              label="Staying in Guesthouse"
              value={guesthouse?.staying ? "Yes" : "No"}
              questionId="guesthouseStaying"
              onEdit={onEdit}
              disabled={isSubmitting}
            />

            {guesthouse?.staying && (
              <>
                <ReviewRow
                  label="Guesthouse"
                  value={guesthouse.name}
                  questionId="guesthouse"
                  onEdit={onEdit}
                  disabled={isSubmitting}
                />

                <ReviewRow
                  label="Room Number"
                  value={guesthouse.roomNumber}
                  questionId="roomNumber"
                  onEdit={onEdit}
                  disabled={isSubmitting}
                />
              </>
            )}

            {/* DATE */}
            <ReviewRow
              label="Date of Registration"
              value={formData.date}
              questionId="date"
              onEdit={onEdit}
              disabled={isSubmitting}
            />

            {/* PLACE */}
            <ReviewRow
              label="Place"
              value={formData.place}
              questionId="place"
              onEdit={onEdit}
              disabled={isSubmitting}
            />

            {/* DECLARATION */}
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm font-medium text-slate-600">
                Declaration
              </span>

              <span className="flex items-center gap-1 text-sm font-semibold text-green-600">
                <CheckCircle2 size={16} />
                Accepted
              </span>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="border-t border-slate-200 bg-slate-50 p-4 sm:p-5">
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            {/* EDIT */}
            {/* <button
              type="button"
              disabled={isSubmitting}
              onClick={() => onEdit("fullName")}
              className="
                inline-flex
                items-center
                justify-center
                gap-2
                rounded-xl
                border
                border-indigo-500
                bg-white
                px-6
                py-3
                text-sm
                font-semibold
                text-indigo-600
                hover:bg-indigo-50
                disabled:cursor-not-allowed
                disabled:opacity-50
                transition
              "
            >
              <Pencil size={17} />
              Edit Details
            </button> */}

            {/* SUBMIT */}
            <button
              type="button"
              disabled={isSubmitting}
              onClick={onSubmit}
              className="
                inline-flex
                items-center
                justify-center
                gap-2
                rounded-xl
                bg-indigo-600
                px-6
                py-3
                text-sm
                font-semibold
                text-white
                shadow-sm
                hover:bg-indigo-700
                disabled:cursor-not-allowed
                disabled:opacity-60
                transition
              "
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={17} className="animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send size={17} />
                  Submit Registration
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   REVIEW ROW
   ============================================================ */

interface ReviewRowProps {
  label: string;
  value?: string;
  questionId: string;
  onEdit: (questionId: string) => void;
  disabled?: boolean;
}

function ReviewRow({
  label,
  value,
  questionId,
  onEdit,
  disabled = false,
}: ReviewRowProps) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0">
        <p className="text-xs font-medium text-slate-500">{label}</p>

        <p className="mt-0.5 text-sm font-medium text-slate-900 break-words">
          {value || "Not provided"}
        </p>
      </div>

      <button
        type="button"
        disabled={disabled}
        onClick={() => onEdit(questionId)}
        className="
          shrink-0
          rounded-lg
          p-1.5
          text-slate-400
          hover:bg-indigo-50
          hover:text-indigo-600
          disabled:cursor-not-allowed
          disabled:opacity-40
          transition
        "
        aria-label={`Edit ${label}`}
      >
        <Pencil size={14} />
      </button>
    </div>
  );
}
