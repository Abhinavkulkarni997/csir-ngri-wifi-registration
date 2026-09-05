import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Download,
  Search,
  Eye,
  Laptop,
  Smartphone,
  Building2,
  Clock3,
  CheckCircle2,
  XCircle,
  Users,
  X,
 LogOut,
} from "lucide-react";
import Csirlogo from "../assets/csirlogo.jpg";
import NgriLogo from "../assets/ngrilogo.png";
import { getGuesthouseLabel } from "../utils/guesthouseLabels";
import { formatDateTime } from "../utils/formatDateTime";

const API_BASE_URL =import.meta.env.VITE_API_BASE_URL;
interface Device {
  requested: boolean;
  operatingSystem?: string;
  macAddress?: string;
}

interface Registration {
  _id: string;

  fullName: string;
  designation: string;
  employeeId: string;
  institutionEmail: string;
  mobileNumber: string;

  organization: {
    name: string;
  };

  divisionGroup: string;

  devices: {
    laptop: Device;
    smartphone: Device;
  };

  guesthouse: {
    staying: boolean;
    name?: string;
    roomNumber?: string;
  };
  arrivalDateTime: string;

  date: string;
  place: string;

  declarationAccepted: boolean;

  status: "pending" | "approved" | "rejected";

  createdAt: string;
  updatedAt: string;
}

interface RegistrationResponse {
  success: boolean;
  count: number;

  // Filtered total
  total: number;

  // Global total
  totalRegistrations: number;

  page: number;
  limit: number;
  totalPages: number;

  statusCounts: {
    pending: number;
    approved: number;
    rejected: number;
  };

  data: Registration[];
}

export default function RegistrationData() {
  const [registrations, setRegistrations] = useState<Registration[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);

  const [pagination, setPagination] = useState({
    total: 0,
    totalRegistrations: 0,
    limit: 20,
    totalPages: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  });

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [organizationFilter, setOrganizationFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [deviceFilter, setDeviceFilter] = useState("all");

  const [selectedRegistration, setSelectedRegistration] =
    useState<Registration | null>(null);

  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [confirmAction, setConfirmAction] = useState<
    "approved" | "rejected" | null
  >(null);

  const navigate = useNavigate();

  /*
   * ============================================================
   * FETCH REGISTRATIONS
   * ============================================================
   */

  useEffect(() => {
    const fetchRegistrations = async () => {
      try {
        setLoading(true);

        const params = new URLSearchParams({
          page: String(page),
          limit: "20",
        });

        if (debouncedSearch) {
          params.set("search", debouncedSearch);
        }

        if (organizationFilter !== "all") {
          params.set("organization", organizationFilter);
        }

        if (statusFilter !== "all") {
          params.set("status", statusFilter);
        }

        if (deviceFilter !== "all") {
          params.set("device", deviceFilter);
        }

        const response = await fetch(
          `${API_BASE_URL}/api/registrations?${params.toString()}`,
          {
            credentials: "include",
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch registrations");
        }

        const result: RegistrationResponse = await response.json();

        setRegistrations(result.data);

        setPagination({
          total: result.total,
          totalRegistrations: result.totalRegistrations,
          limit: result.limit,
          totalPages: result.totalPages,
          pending: result.statusCounts.pending,
          approved: result.statusCounts.approved,
          rejected: result.statusCounts.rejected,
        });
      } catch (error) {
        console.error("Failed to fetch registrations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRegistrations();
  }, [page, debouncedSearch, organizationFilter, statusFilter, deviceFilter]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearch(search.trim());
    }, 400);

    return () => window.clearTimeout(timer);
  }, [search]);

  /*
   * ============================================================
   * ORGANIZATIONS
   * ============================================================
   */

  const organizations = useMemo(() => {
    return Array.from(
      new Set(
        registrations.map((registration) => registration.organization.name),
      ),
    );
  }, [registrations]);

  /*
   * ============================================================
   * FILTERED DATA
   * ============================================================
   */
  // commented filteredRegistrations as backend handles it
  //   const filteredRegistrations = useMemo(() => {
  //     const searchValue = search.toLowerCase().trim();

  //     return registrations.filter((registration) => {
  //       const matchesSearch =
  //         !searchValue ||
  //         registration.fullName
  //           .toLowerCase()
  //           .includes(searchValue) ||
  //         registration.employeeId
  //           .toLowerCase()
  //           .includes(searchValue) ||
  //         registration.institutionEmail
  //           .toLowerCase()
  //           .includes(searchValue) ||
  //         registration.mobileNumber.includes(searchValue);

  //       const matchesOrganization =
  //         organizationFilter === "all" ||
  //         registration.organization.name === organizationFilter;

  //       const matchesStatus =
  //         statusFilter === "all" ||
  //         registration.status === statusFilter;

  //       const hasLaptop =
  //         registration.devices.laptop?.requested === true;

  //       const hasSmartphone =
  //         registration.devices.smartphone?.requested === true;

  //       const matchesDevice =
  //         deviceFilter === "all" ||
  //         (deviceFilter === "laptop" && hasLaptop) ||
  //         (deviceFilter === "smartphone" && hasSmartphone);

  //       return (
  //         matchesSearch &&
  //         matchesOrganization &&
  //         matchesStatus &&
  //         matchesDevice
  //       );
  //     });
  //   }, [
  //     registrations,
  //     search,
  //     organizationFilter,
  //     statusFilter,
  //     deviceFilter,
  //   ]);

  /*
   * ============================================================
   * SUMMARY COUNTS
   * ============================================================
   */

  const totalCount = pagination.totalRegistrations;

  const pendingCount = pagination.pending;
  const approvedCount = pagination.approved;
  const rejectedCount = pagination.rejected;

  /*
   * ============================================================
   * DEVICE DISPLAY
   * ============================================================
   */

  const getDevices = (registration: Registration) => {
    const devices: string[] = [];

    if (registration.devices.laptop?.requested) {
      devices.push("Laptop");
    }

    if (registration.devices.smartphone?.requested) {
      devices.push("Smartphone");
    }

    return devices;
  };

  /*
   * ============================================================
   * STATUS BADGE
   * ============================================================
   */

  const getStatusBadge = (status: Registration["status"]) => {
    if (status === "approved") {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
          <CheckCircle2 size={13} />
          Approved
        </span>
      );
    }

    if (status === "rejected") {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-700">
          <XCircle size={13} />
          Rejected
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
        <Clock3 size={13} />
        Pending
      </span>
    );
  };

  /*
   * ============================================================
   * DATE FORMAT
   * ============================================================
   */

  const formatDate = (date: string) => {
    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return date;
    }

    return parsedDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const handleConfirmStatus = async () => {
    if (!selectedRegistration || !confirmAction) {
      return;
    }

    const id = selectedRegistration._id;
    const status = confirmAction;

    setConfirmAction(null);

    await updateStatus(id, status);
  };

  const updateStatus = async (id: string, status: "approved" | "rejected") => {
    try {
      setUpdatingStatus(true);
      setError("");

      const response = await fetch(
        `${API_BASE_URL}/api/registrations/${id}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
           credentials: "include",
          body: JSON.stringify({
            status,
          }),
        },
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to update status.");
      }

      /*
       * Update the table immediately
       */
      setRegistrations((previous) =>
        previous.map((registration) =>
          registration._id === id
            ? {
                ...registration,
                status,
              }
            : registration,
        ),
      );

      /*
       * Update the currently opened modal
       */
      setSelectedRegistration((previous) =>
        previous && previous._id === id
          ? {
              ...previous,
              status,
            }
          : previous,
      );
    } catch (err) {
      console.error("Status update error:", err);

      setError(err instanceof Error ? err.message : "Failed to update status.");
    } finally {
      setUpdatingStatus(false);
    }
  };

  /*
   * ============================================================
   * LOADING
   * ============================================================
   */

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-600" />

          <p className="text-sm font-medium text-slate-600">
            Loading registrations...
          </p>
        </div>
      </div>
    );
  }

   /*
   * ============================================================
   * LOGOUT FUNCTION
   * ============================================================
   */
  

const handleLogout = async () => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/auth/logout`,
      {
        method: "POST",
        credentials: "include",
      },
    );

    if (!response.ok) {
      throw new Error("Logout failed.");
    }

    navigate("/admin/login", {
      replace: true,
    });
  } catch (error) {
    console.error("Logout error:", error);
  }
};


 /*
   * ============================================================
   * DOWNLOAD EXCEL FUNCTION
   * ============================================================
   */
  
const handleDownloadExcel = async () => {
  try {
    const params = new URLSearchParams();

    if (search.trim()) {
      params.append("search", search.trim());
    }

    if (organizationFilter) {
      params.append(
        "organization",
        organizationFilter,
      );
    }

    if (statusFilter) {
      params.append(
        "status",
        statusFilter,
      );
    }

    if (deviceFilter) {
      params.append(
        "device",
        deviceFilter,
      );
    }

    const response = await fetch(
      `${API_BASE_URL}/api/registrations/export?${params.toString()}`,
      {
        method: "GET",
        credentials: "include",
      },
    );

    if (response.status === 401) {
      navigate("/admin/login", {
        replace: true,
      });

      return;
    }

    if (!response.ok) {
      throw new Error(
        "Failed to download Excel file.",
      );
    }

    const blob = await response.blob();

    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;

    link.download = `NGRI_WiFi_Registrations_${new Date()
      .toISOString()
      .slice(0, 10)}.xlsx`;

    document.body.appendChild(link);

    link.click();

    link.remove();

    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error(
      "Excel download error:",
      error,
    );

    alert(
      "Unable to download Excel file. Please try again.",
    );
  }
};

  /*
   * ============================================================
   * MAIN PAGE
   * ============================================================
   */

  return (
    <div className="min-h-screen bg-slate-50">
      {/* ======================================================
          HEADER
          ====================================================== */}

      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex min-h-[86px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* CSIR */}
          <div className="flex items-center">
            <img
              src={Csirlogo}
              alt="CSIR Logo"
              className="h-14 w-auto object-contain"
            />
          </div>

          {/* TITLE */}
          <div className="text-center">
            <h1 className="text-lg font-bold text-slate-900 sm:text-2xl">
              CSIR-NGRI
            </h1>

            <p className="text-xs font-medium text-slate-500 sm:text-sm">
              Wi-Fi Registration Management
            </p>
          </div>

          {/* NGRI */}
          <div className="flex items-center">
            <img
              src={NgriLogo}
              alt="NGRI Logo"
              className="h-14 w-auto object-contain"
            />
          </div>
        </div>
      </header>

      {/* ======================================================
          CONTENT
          ====================================================== */}

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* TITLE */}
<div className="mb-6">
  <div className="flex items-center justify-between gap-4">
    <div>
      <h2 className="text-2xl font-bold text-slate-900">
        Registration Records
      </h2>

      <p className="mt-1 text-sm text-slate-500">
        View and manage submitted Wi-Fi registration details.
      </p>
    </div>

    <div className="flex shrink-0 items-center gap-3">
  <button
    type="button"
    onClick={handleDownloadExcel}
    className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 hover:text-slate-900"
  >
    <Download size={17} />
    Download Excel
  </button>

  <button
    type="button"
    onClick={handleLogout}
    className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 hover:text-red-600"
  >
    <LogOut size={17} />
    Logout
  </button>
</div>
  </div>
</div>

        {/* ERROR */}

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* ====================================================
            SUMMARY CARDS
            ==================================================== */}

        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* TOTAL */}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Total Registrations
                </p>

                <p className="mt-2 text-3xl font-bold text-slate-900">
                  {totalCount}
                </p>
              </div>

              <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600">
                <Users size={22} />
              </div>
            </div>
          </div>

          {/* PENDING */}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Pending</p>

                <p className="mt-2 text-3xl font-bold text-slate-900">
                  {pendingCount}
                </p>
              </div>

              <div className="rounded-xl bg-amber-50 p-3 text-amber-600">
                <Clock3 size={22} />
              </div>
            </div>
          </div>

          {/* APPROVED */}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Approved</p>

                <p className="mt-2 text-3xl font-bold text-slate-900">
                  {approvedCount}
                </p>
              </div>

              <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
                <CheckCircle2 size={22} />
              </div>
            </div>
          </div>

          {/* REJECTED */}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Rejected</p>

                <p className="mt-2 text-3xl font-bold text-slate-900">
                  {rejectedCount}
                </p>
              </div>

              <div className="rounded-xl bg-red-50 p-3 text-red-600">
                <XCircle size={22} />
              </div>
            </div>
          </div>
        </div>

        {/* ====================================================
            FILTERS
            ==================================================== */}

        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="grid grid-cols-1 gap-3 lg:grid-cols-4">
            {/* SEARCH */}

            <div className="relative lg:col-span-1">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setPage(1);
                }}
                placeholder="Search name, ID, email..."
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            {/* ORGANIZATION */}

            <select
              value={organizationFilter}
              onChange={(event) => {
                setOrganizationFilter(event.target.value);
                setPage(1);
              }}
              className="h-11 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-700 outline-none focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100"
            >
              <option value="all">All Organizations</option>

              {organizations.map((organization) => (
                <option key={organization} value={organization}>
                  {organization}
                </option>
              ))}
            </select>

            {/* STATUS */}

            <select
              value={statusFilter}
              onChange={(event) => {
                setStatusFilter(event.target.value);
                setPage(1);
              }}
              className="h-11 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-700 outline-none focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>

            {/* DEVICE */}

            <select
              value={deviceFilter}
              onChange={(event) => {
                setDeviceFilter(event.target.value);
                setPage(1);
              }}
              className="h-11 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-700 outline-none focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100"
            >
              <option value="all">All Devices</option>
              <option value="laptop">Laptop</option>
              <option value="smartphone">Smartphone</option>
            </select>
          </div>
        </div>

        {/* ====================================================
            TABLE
            ==================================================== */}

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px] text-left">
              <thead className="border-b border-slate-200 bg-slate-50">
                <tr>
                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Name
                  </th>

                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Employee ID
                  </th>

                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Organization
                  </th>

                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Devices
                  </th>

                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Guesthouse
                  </th>

                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Date
                  </th>

                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Status
                  </th>

                  <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {registrations.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-5 py-12 text-center">
                      <Users
                        size={35}
                        className="mx-auto mb-3 text-slate-300"
                      />

                      <p className="font-medium text-slate-600">
                        No registrations found
                      </p>

                      <p className="mt-1 text-sm text-slate-400">
                        Try changing your search or filters.
                      </p>
                    </td>
                  </tr>
                ) : (
                  registrations.map((registration) => {
                    const devices = getDevices(registration);

                    return (
                      <tr
                        key={registration._id}
                        className="transition hover:bg-slate-50"
                      >
                        {/* NAME */}

                        <td className="px-5 py-4">
                          <div className="font-semibold text-slate-800">
                            {registration.fullName}
                          </div>

                          <div className="mt-1 text-xs text-slate-400">
                            {registration.designation}
                          </div>
                        </td>

                        {/* EMPLOYEE ID */}

                        <td className="px-5 py-4 text-sm text-slate-600">
                          {registration.employeeId}
                        </td>

                        {/* ORGANIZATION */}

                        <td className="max-w-[220px] px-5 py-4">
                          <div className="flex items-start gap-2">
                            <Building2
                              size={16}
                              className="mt-0.5 shrink-0 text-slate-400"
                            />

                            <span className="text-sm text-slate-600">
                              {registration.organization.name}
                            </span>
                          </div>
                        </td>

                        {/* DEVICES */}

                        <td className="px-5 py-4">
                          <div className="flex flex-wrap gap-1.5">
                            {devices.map((device) => (
                              <span
                                key={device}
                                className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600"
                              >
                                {device === "Laptop" ? (
                                  <Laptop size={13} />
                                ) : (
                                  <Smartphone size={13} />
                                )}

                                {device}
                              </span>
                            ))}
                          </div>
                        </td>

                        {/* GUESTHOUSE */}

                        <td className="px-5 py-4 text-sm text-slate-600">
                         {registration.guesthouse.staying
  ? getGuesthouseLabel(
      registration.guesthouse.name as
        | "IICT_PRAGYAN_HOSTEL"
        | "IICT_GUEST_HOUSE"
        | "NGRI"
        | "CCMB"
    ) || "Yes"
  : "No"}
                        </td>

                        {/* DATE */}

                        <td className="px-5 py-4 text-sm text-slate-600">
                          {formatDate(registration.date)}
                        </td>

                        {/* STATUS */}

                        <td className="px-5 py-4">
                          {getStatusBadge(registration.status)}
                        </td>

                        {/* ACTION */}

                        <td className="px-5 py-4 text-right">
                          <button
                            type="button"
                            onClick={() =>
                              setSelectedRegistration(registration)
                            }
                            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600"
                          >
                            <Eye size={16} />
                            View
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* RESULT COUNT */}

          <div className="flex flex-col gap-3 border-t border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-500">
              Page {page} of {pagination.totalPages}
              {" • "}
              {pagination.total} total registrations
            </p>

            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={page === 1 || loading}
                onClick={() => setPage((current) => current - 1)}
                className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Previous
              </button>

              <span className="rounded-lg bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">
                {page}
              </span>

              <button
                type="button"
                disabled={page >= pagination.totalPages || loading}
                onClick={() => setPage((current) => current + 1)}
                className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* ======================================================
          DETAILS MODAL
          ====================================================== */}

      {selectedRegistration && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-2xl">
            {/* MODAL HEADER */}

            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Registration Details
                </h3>

                <p className="text-sm text-slate-500">
                  {selectedRegistration.fullName}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedRegistration(null)}
                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              >
                <X size={20} />
              </button>
            </div>

            {/* MODAL CONTENT */}

            <div className="max-h-[calc(90vh-80px)] overflow-y-auto p-6">
              {/* PERSONAL */}

              <section className="mb-6">
                <h4 className="mb-3 text-sm font-bold uppercase tracking-wide text-slate-500">
                  Personal Information
                </h4>

                <div className="grid grid-cols-1 gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4 sm:grid-cols-2">
                  <Detail
                    label="Full Name"
                    value={selectedRegistration.fullName}
                  />

                  <Detail
                    label="Designation"
                    value={selectedRegistration.designation}
                  />

                  <Detail
                    label="Employee ID"
                    value={selectedRegistration.employeeId}
                  />

                  <Detail
                    label="Mobile Number"
                    value={selectedRegistration.mobileNumber}
                  />

                  <Detail
                    label="Institution Email"
                    value={selectedRegistration.institutionEmail}
                  />
                </div>
              </section>

              {/* ORGANIZATION */}

              <section className="mb-6">
                <h4 className="mb-3 text-sm font-bold uppercase tracking-wide text-slate-500">
                  Organization
                </h4>

                <div className="grid grid-cols-1 gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4 sm:grid-cols-2">
                  <Detail
                    label="Organization"
                    value={selectedRegistration.organization.name}
                  />

                  <Detail
                    label="Division / Group"
                    value={selectedRegistration.divisionGroup}
                  />
                </div>
              </section>

              {/* DEVICES */}

              <section className="mb-6">
                <h4 className="mb-3 text-sm font-bold uppercase tracking-wide text-slate-500">
                  Devices
                </h4>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <DeviceCard
                    title="Laptop"
                    device={selectedRegistration.devices.laptop}
                  />

                  <DeviceCard
                    title="Smartphone"
                    device={selectedRegistration.devices.smartphone}
                  />
                </div>
              </section>

              {/* GUESTHOUSE */}

              <section className="mb-6">
                <h4 className="mb-3 text-sm font-bold uppercase tracking-wide text-slate-500">
                  Guesthouse
                </h4>

                <div className="grid grid-cols-1 gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4 sm:grid-cols-3">
                  <Detail
                    label="Staying"
                    value={
                      selectedRegistration.guesthouse.staying ? "Yes" : "No"
                    }
                  />

                  <Detail
  label="Guesthouse"
  value={
    getGuesthouseLabel(
      selectedRegistration.guesthouse.name as
        | "IICT_PRAGYAN_HOSTEL"
        | "IICT_GUEST_HOUSE"
        | "NGRI"
        | "CCMB"
    ) || "—"
  }
/>
                  <Detail
                    label="Room Number"
                    value={selectedRegistration.guesthouse.roomNumber || "—"}
                  />
                </div>
              </section>

              {/* REGISTRATION */}

              <section>
                <h4 className="mb-3 text-sm font-bold uppercase tracking-wide text-slate-500">
                  Registration
                </h4>

                <div className="grid grid-cols-1 gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4 sm:grid-cols-2">
                   <Detail
    label="Expected Arrival Date & Time"
    value={formatDateTime(selectedRegistration.arrivalDateTime)}
  />
                   <Detail
    label="Date of Registration"
    value={formatDate(selectedRegistration.date)}
  />

                  <Detail label="Place" value={selectedRegistration.place} />

                  <Detail
                    label="Declaration"
                    value={
                      selectedRegistration.declarationAccepted
                        ? "Accepted"
                        : "Not Accepted"
                    }
                  />

                  <div>
                    <p className="mb-1 text-xs font-medium text-slate-400">
                      Status
                    </p>

                    {getStatusBadge(selectedRegistration.status)}
                  </div>
                </div>
              </section>

              {/* ADMIN ACTIONS */}

              {selectedRegistration.status === "pending" && (
                <div className="mt-6 rounded-xl border border-slate-200 bg-white p-4">
                  <h4 className="mb-3 text-sm font-bold uppercase tracking-wide text-slate-500">
                    Administrator Action
                  </h4>

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <button
                      type="button"
                      disabled={updatingStatus}
                      onClick={() => setConfirmAction("approved")}
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <CheckCircle2 size={17} />

                      {updatingStatus ? "Updating..." : "Approve Registration"}
                    </button>

                    <button
                      type="button"
                      disabled={updatingStatus}
                      onClick={() => setConfirmAction("rejected")}
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <XCircle size={17} />

                      {updatingStatus ? "Updating..." : "Reject Registration"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {/* ======================================================
    CONFIRMATION MODAL
    ====================================================== */}

      {confirmAction && selectedRegistration && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-5 flex items-start gap-4">
              <div
                className={`rounded-xl p-3 ${
                  confirmAction === "approved"
                    ? "bg-emerald-50 text-emerald-600"
                    : "bg-red-50 text-red-600"
                }`}
              >
                {confirmAction === "approved" ? (
                  <CheckCircle2 size={24} />
                ) : (
                  <XCircle size={24} />
                )}
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  {confirmAction === "approved"
                    ? "Approve Registration?"
                    : "Reject Registration?"}
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  {confirmAction === "approved"
                    ? "Are you sure you want to approve this registration?"
                    : "Are you sure you want to reject this registration?"}
                </p>
              </div>
            </div>

            <div className="mb-5 rounded-xl bg-slate-50 p-4">
              <p className="text-sm font-semibold text-slate-800">
                {selectedRegistration.fullName}
              </p>

              <p className="mt-1 text-xs text-slate-500">
                Employee ID: {selectedRegistration.employeeId}
              </p>

              <p className="mt-1 text-xs text-slate-500">
                {selectedRegistration.institutionEmail}
              </p>
            </div>

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                disabled={updatingStatus}
                onClick={() => setConfirmAction(null)}
                className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={updatingStatus}
                onClick={handleConfirmStatus}
                className={`rounded-xl px-5 py-3 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-50 ${
                  confirmAction === "approved"
                    ? "bg-emerald-600 hover:bg-emerald-700"
                    : "bg-red-600 hover:bg-red-700"
                }`}
              >
                {updatingStatus
                  ? "Updating..."
                  : confirmAction === "approved"
                    ? "Yes, Approve"
                    : "Yes, Reject"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/*
 * ============================================================
 * DETAIL COMPONENT
 * ============================================================
 */

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="mb-1 text-xs font-medium text-slate-400">{label}</p>

      <p className="break-words text-sm font-medium text-slate-700">
        {value || "—"}
      </p>
    </div>
  );
}

/*
 * ============================================================
 * DEVICE CARD
 * ============================================================
 */

function DeviceCard({ title, device }: { title: string; device: Device }) {
  const requested = device?.requested === true;

  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {title === "Laptop" ? <Laptop size={18} /> : <Smartphone size={18} />}

          <span className="font-semibold text-slate-800">{title}</span>
        </div>

        <span
          className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
            requested
              ? "bg-emerald-50 text-emerald-700"
              : "bg-slate-200 text-slate-500"
          }`}
        >
          {requested ? "Requested" : "Not Requested"}
        </span>
      </div>

      {requested ? (
        <div className="space-y-3">
          <Detail
            label="Operating System"
            value={device.operatingSystem || "—"}
          />

          <Detail label="MAC Address" value={device.macAddress || "—"} />
        </div>
      ) : (
        <p className="text-sm text-slate-400">This device was not requested.</p>
      )}
    </div>
  );
}
