import { useMemo, useState } from 'react';
import { Check, Search } from 'lucide-react';
import { organizations } from '../data/organizations';
import type { Organization } from '../types/registration.types';

interface OrganizationSelectorProps {
  onSelect: (organization: Organization) => void;
}

export default function OrganizationSelector({
  onSelect,
}: OrganizationSelectorProps) {
  const [search, setSearch] = useState('');

  const filteredOrganizations = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return organizations;
    }

    return organizations.filter((organization) =>
      organization.name.toLowerCase().includes(query)
    );
  }, [search]);

  return (
    <div className="space-y-3">
      <div className="relative">
        <Search
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
        />

        <input
          value={search}
          onChange={(event) =>
            setSearch(event.target.value)
          }
          placeholder="Search organization..."
          className="w-full h-12 pl-10 pr-4 rounded-xl border border-slate-300 outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div className="max-h-72 overflow-y-auto space-y-2 pr-1">
        {filteredOrganizations.map((organization) => (
          <button
            key={organization.id}
            type="button"
            onClick={() => onSelect(organization)}
            className="w-full text-left p-3 sm:p-4 rounded-xl border border-slate-200 bg-white hover:border-indigo-400 hover:bg-indigo-50 transition"
          >
            <div className="flex items-start gap-3">
              <div className="h-8 w-8 shrink-0 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-semibold">
                {organization.id}
              </div>

              <div className="flex-1">
                <p className="text-sm sm:text-base font-medium text-slate-800">
                  {organization.name}
                </p>
              </div>

              <Check
                size={18}
                className="text-slate-300 shrink-0"
              />
            </div>
          </button>
        ))}

        {filteredOrganizations.length === 0 && (
          <div className="text-center py-8 text-slate-500">
            No organizations found.
          </div>
        )}
      </div>
    </div>
  );
}