import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Users, TrendingUp, Eye, CheckCircle, XCircle, Clock, Edit } from "lucide-react";
import { useState } from "react";

interface Appointment {
  id: string;
  patientName: string;
  testType: string;
  status: "confirmed" | "pending" | "cancelled";
  date: string;
  time: string;
  contact: string;
}

const MOCK_APPOINTMENTS: Appointment[] = [
  {
    id: "1",
    patientName: "John Doe",
    testType: "Blood Work + Pathology",
    status: "confirmed",
    date: "Dec 28, 2024",
    time: "10:00 AM",
    contact: "john@example.com"
  },
  {
    id: "2",
    patientName: "Sarah Smith",
    testType: "MRI Scan",
    status: "pending",
    date: "Dec 29, 2024",
    time: "2:00 PM",
    contact: "sarah@example.com"
  },
  {
    id: "3",
    patientName: "Michael Johnson",
    testType: "Full Body Checkup",
    status: "confirmed",
    date: "Dec 30, 2024",
    time: "9:30 AM",
    contact: "michael@example.com"
  },
  {
    id: "4",
    patientName: "Emma Williams",
    testType: "Cardiology Consultation",
    status: "cancelled",
    date: "Dec 25, 2024",
    time: "3:00 PM",
    contact: "emma@example.com"
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "confirmed":
      return "bg-emerald-100 text-emerald-700";
    case "pending":
      return "bg-amber-100 text-amber-700";
    case "cancelled":
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

export default function ClinicDashboard() {
  const [activeTab, setActiveTab] = useState<"all" | "confirmed" | "pending">("all");

  const filteredAppointments = activeTab === "all"
    ? MOCK_APPOINTMENTS
    : MOCK_APPOINTMENTS.filter(a => a.status === activeTab);

  const confirmedCount = MOCK_APPOINTMENTS.filter(a => a.status === "confirmed").length;
  const pendingCount = MOCK_APPOINTMENTS.filter(a => a.status === "pending").length;
  const cancelledCount = MOCK_APPOINTMENTS.filter(a => a.status === "cancelled").length;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-4xl font-heading font-bold text-foreground mb-2">Clinic Dashboard</h1>
                <p className="text-muted-foreground">Manage appointments, patients, and clinic operations</p>
              </div>
              <Button className="font-semibold">
                Edit Clinic Profile
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-4 gap-4 mb-12">
            <div className="bg-white rounded-lg border border-border/40 p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm text-muted-foreground">Total Appointments</div>
                <Calendar className="w-4 h-4 text-primary" />
              </div>
              <div className="text-3xl font-bold text-foreground">{MOCK_APPOINTMENTS.length}</div>
            </div>
            <div className="bg-white rounded-lg border border-border/40 p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm text-muted-foreground">Confirmed</div>
                <CheckCircle className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-3xl font-bold text-emerald-600">{confirmedCount}</div>
            </div>
            <div className="bg-white rounded-lg border border-border/40 p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm text-muted-foreground">Pending</div>
                <Clock className="w-4 h-4 text-amber-600" />
              </div>
              <div className="text-3xl font-bold text-amber-600">{pendingCount}</div>
            </div>
            <div className="bg-white rounded-lg border border-border/40 p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm text-muted-foreground">Cancellations</div>
                <XCircle className="w-4 h-4 text-red-600" />
              </div>
              <div className="text-3xl font-bold text-red-600">{cancelledCount}</div>
            </div>
          </div>

          {/* Clinic Info Card */}
          <div className="bg-white rounded-lg border border-border/40 p-8 mb-12 shadow-sm">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-bold text-foreground mb-4">Clinic Information</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase">Clinic Name</label>
                    <p className="text-foreground font-semibold mt-1">Apex Diagnostic Center</p>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase">Location</label>
                    <p className="text-foreground font-semibold mt-1">Downtown Medical Park, New York</p>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase">Contact</label>
                    <p className="text-foreground font-semibold mt-1">clinic@apex.com | +1 (555) 123-4567</p>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground mb-4">Services Offered</h3>
                <div className="space-y-2 flex flex-wrap gap-2">
                  {["MRI", "CT Scan", "Pathology", "Blood Tests", "X-Ray"].map((service) => (
                    <Badge key={service} className="bg-primary/10 text-primary border-0">
                      {service}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-8 border-b border-border">
            {["all", "confirmed", "pending"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors ${
                  activeTab === tab
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab === "all" ? "All Appointments" : tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* Appointments List */}
          <div className="space-y-4">
            {filteredAppointments.map((appointment) => (
              <div
                key={appointment.id}
                className="bg-white rounded-lg border border-border/40 p-6 hover:shadow-md hover:border-primary/30 transition-all group"
              >
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  {/* Left Content */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-lg font-bold text-foreground">{appointment.patientName}</h3>
                      <Badge className={`${getStatusColor(appointment.status)} border-0`}>
                        {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground text-sm mb-3">{appointment.testType}</p>

                    {/* Details */}
                    <div className="flex flex-col sm:flex-row gap-6 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-primary" />
                        {appointment.date}
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-primary" />
                        {appointment.time}
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-primary" />
                        {appointment.contact}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 w-full sm:w-auto">
                    {appointment.status === "pending" && (
                      <>
                        <Button variant="default" size="sm" className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4" />
                          Confirm
                        </Button>
                        <Button variant="destructive" size="sm" className="flex items-center gap-2">
                          <XCircle className="w-4 h-4" />
                          Reject
                        </Button>
                      </>
                    )}
                    {appointment.status === "confirmed" && (
                      <>
                        <Button variant="outline" size="sm" className="flex items-center gap-2">
                          <Edit className="w-4 h-4" />
                          Reschedule
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredAppointments.length === 0 && (
            <div className="text-center py-16">
              <Calendar className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No appointments found</h3>
              <p className="text-muted-foreground">No appointments with this status</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
