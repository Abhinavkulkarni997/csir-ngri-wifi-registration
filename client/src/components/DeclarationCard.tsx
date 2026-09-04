import { useState } from 'react';
import { ShieldCheck } from 'lucide-react';

interface DeclarationCardProps {
  onAccept: () => void;
}

export default function DeclarationCard({
  onAccept,
}: DeclarationCardProps) {
  const [accepted, setAccepted] = useState(false);

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-10 w-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
            <ShieldCheck size={22} />
          </div>

          <div>
            <h3 className="font-bold text-slate-900">
              Declaration
            </h3>
            <p className="text-xs text-slate-500">
              Please read carefully
            </p>
          </div>
        </div>

        <div className="space-y-4 text-sm sm:text-base text-slate-700 leading-relaxed">
          <p>
            I hereby declare that:
          </p>

          <ol className="list-decimal pl-5 space-y-3">
            <li>
              I will not indulge in any illegal and
              prohibited internet activities through
              CSIR-NGRI Wi-Fi services.
            </li>

            <li>
              I have completely read the CSIR-NGRI's
              "Policy on Use of IT Resources of CSIR-NGRI"
              and the other linked policies of GOI and
              understood them. I agree to abide by them.
            </li>
          </ol>
        </div>
      </div>

      <label className="flex items-start gap-3 p-4 rounded-xl border border-slate-200 bg-white cursor-pointer hover:border-indigo-300">
        <input
          type="checkbox"
          checked={accepted}
          onChange={(event) =>
            setAccepted(event.target.checked)
          }
          className="mt-1 h-5 w-5 accent-indigo-600"
        />

        <span className="text-sm sm:text-base text-slate-700">
          I have read, understood and agree to the
          declaration above.
        </span>
      </label>

      <button
        type="button"
        disabled={!accepted}
        onClick={onAccept}
        className="w-full h-12 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 disabled:opacity-40 transition"
      >
        Accept & Continue
      </button>
    </div>
  );
}