import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, FileText, Eye, CheckCircle, Clock, Download } from "lucide-react";
import { useState } from "react";

interface LabRequest {
  id: string;
  clinicName: string;
  testType: string;
  status: "completed" | "pending" | "in-progress";
  date: string;
  location: string;
}

const MOCK_REQUESTS: LabRequest[] = [
  {
    id: "1",
    clinicName: "Apex Diagnostic Center",
    testType: "Blood Work + Pathology",
    status: "completed",
    date: "Dec 20, 2024",
    location: "Downtown Medical Park"
  },
  {
    id: "2",
    clinicName: "City Health Labs",
    testType: "MRI Scan",
    status: "in-progress",
    date: "Dec 25, 2024",
    location: "Westside Plaza"
  },
  {
    id: "3",
    clinicName: "MediCare Imaging",
    testType: "Full Body Checkup",
    status: "pending",
    date: "Dec 28, 2024",
    location: "North Hills"
  }
];

export default function UserDashboard() {
  const [activeTab, setActiveTab] = useState<"all" | "completed" | "pending">("all");

  const filteredRequests = activeTab === "all"
    ? MOCK_REQUESTS
    : MOCK_REQUESTS.filter(r => r.status === activeTab || (activeTab === "pending" && (r.status === "pending" || r.status === "in-progress")));

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-emerald-100 text-emerald-700";
      case "in-progress":
        return "bg-blue-100 text-blue-700";
      case "pending":
        return "bg-amber-100 text-amber-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-4xl font-heading font-bold text-foreground mb-2">My Lab Requests</h1>
                <p className="text-muted-foreground">Track and manage your lab test appointments and reports</p>
              </div>
              <Button className="font-semibold">
                New Request
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-3 gap-4 mb-12">
            <div className="bg-white rounded-lg border border-border/40 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm text-muted-foreground">Total Requests</div>
                <Calendar className="w-4 h-4 text-primary" />
              </div>
              <div className="text-3xl font-bold text-foreground">{MOCK_REQUESTS.length}</div>
            </div>
            <div className="bg-white rounded-lg border border-border/40 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm text-muted-foreground">Completed</div>
                <CheckCircle className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-3xl font-bold text-emerald-600">
                {MOCK_REQUESTS.filter(r => r.status === "completed").length}
              </div>
            </div>
            <div className="bg-white rounded-lg border border-border/40 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm text-muted-foreground">Pending</div>
                <Clock className="w-4 h-4 text-amber-600" />
              </div>
              <div className="text-3xl font-bold text-amber-600">
                {MOCK_REQUESTS.filter(r => r.status === "pending" || r.status === "in-progress").length}
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-8 border-b border-border">
            {["all", "completed", "pending"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors ${
                  activeTab === tab
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab === "all" ? "All Requests" : tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* Requests List */}
          <div className="space-y-4">
            {filteredRequests.map((request) => (
              <div
                key={request.id}
                className="bg-white rounded-lg border border-border/40 p-6 hover:shadow-md hover:border-primary/30 transition-all group"
              >
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  {/* Left Content */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-lg font-bold text-foreground">{request.clinicName}</h3>
                      <Badge className={`${getStatusColor(request.status)} border-0`}>
                        {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground text-sm mb-3">{request.testType}</p>

                    {/* Details */}
                    <div className="flex flex-col sm:flex-row gap-6 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-primary" />
                        {request.date}
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-primary" />
                        {request.location}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 w-full sm:w-auto">
                    {request.status === "completed" && (
                      <>
                        <Button variant="default" size="sm" className="flex items-center gap-2">
                          <Download className="w-4 h-4" />
                          Report
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </>
                    )}
                    {request.status !== "completed" && (
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredRequests.length === 0 && (
            <div className="text-center py-16">
              <FileText className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No requests found</h3>
              <p className="text-muted-foreground">No lab requests with this status</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
