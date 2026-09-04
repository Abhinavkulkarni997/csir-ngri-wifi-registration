import { useState } from 'react';
import type { ReactNode } from 'react';

interface Option {
  value: string;
  label: string;
  description?: string;
  icon?: ReactNode;
}

interface OptionCardsProps {
  options: Option[];
  onSelect: (values: string[]) => void;
  multiple?: boolean;
   initialValues?: string[];
}

export default function OptionCards({
  options,
  onSelect,
  multiple = false,
  initialValues=[],
}: OptionCardsProps) {
  const [selectedValues, setSelectedValues] = useState<string[]>([]);

  const handleSelect = (value: string) => {
    if (!multiple) {
      onSelect([value]);
      return;
    }

    setSelectedValues((current) => {
      if (current.includes(value)) {
        return current.filter((item) => item !== value);
      }

      return [...current, value];
    });
  };

  const handleContinue = () => {
    if (selectedValues.length === 0) {
      return;
    }

    onSelect(selectedValues);
  };

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {options.map((option) => {
          const selected = selectedValues.includes(
            option.value
          );

          return (
            <button
              key={option.value}
              type="button"
              onClick={() =>
                handleSelect(option.value)
              }
              className={`
                group relative w-full text-left
                rounded-2xl border
                p-4 sm:p-5
                transition-all duration-200
                focus:outline-none
                focus:ring-2
                focus:ring-indigo-500
                ${
                  selected
                    ? 'border-indigo-600 bg-indigo-50 shadow-md'
                    : 'border-slate-200 bg-white hover:border-indigo-400 hover:bg-indigo-50/50 hover:shadow-sm'
                }
              `}
            >
              <div className="flex items-start gap-4">
                {/* ICON */}
                <div
                  className={`
                    flex h-12 w-12 shrink-0
                    items-center justify-center
                    rounded-xl
                    transition
                    ${
                      selected
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-100 text-slate-700 group-hover:bg-indigo-100 group-hover:text-indigo-700'
                    }
                  `}
                >
                  {option.icon}
                </div>

                {/* TEXT */}
                <div className="min-w-0 flex-1">
                  <p
                    className={`
                      font-semibold
                      ${
                        selected
                          ? 'text-indigo-700'
                          : 'text-slate-900'
                      }
                    `}
                  >
                    {option.label}
                  </p>

                  {option.description && (
                    <p className="mt-1 text-sm leading-5 text-slate-500">
                      {option.description}
                    </p>
                  )}
                </div>

                {/* CHECK */}
                {multiple && (
                  <div
                    className={`
                      h-5 w-5 shrink-0
                      rounded-md border-2
                      flex items-center justify-center
                      transition
                      ${
                        selected
                          ? 'border-indigo-600 bg-indigo-600'
                          : 'border-slate-300 bg-white'
                      }
                    `}
                  >
                    {selected && (
                      <span className="text-xs font-bold text-white">
                        ✓
                      </span>
                    )}
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* MULTI SELECT CONTINUE */}
      {multiple && (
        <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <p className="text-sm text-slate-500">
            {selectedValues.length === 0
              ? 'Select at least one device.'
              : selectedValues.length === 1
              ? '1 device selected.'
              : `${selectedValues.length} devices selected.`}
          </p>

          <button
            type="button"
            disabled={selectedValues.length === 0}
            onClick={handleContinue}
            className="
              w-full sm:w-auto
              rounded-xl
              bg-indigo-600
              px-6 py-3
              text-sm font-semibold text-white
              shadow-sm
              transition
              hover:bg-indigo-700
              disabled:cursor-not-allowed
              disabled:bg-slate-300
            "
          >
            Continue
          </button>
        </div>
      )}
    </div>
  );
}