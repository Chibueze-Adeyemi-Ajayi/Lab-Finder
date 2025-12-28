import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, FileText, Eye, CheckCircle, Clock, Download, DollarSign, Star } from "lucide-react";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toPatients } from "@/lib/api";
import { Link, useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface LabRequest {
  id: string; // or _id
  clinic_name: string;
  service_name: string;
  status: string; // e.g., "pending", "processing", "completed"
  created_at: string;
  hospital_location?: string;
  price?: number;
  payment_status?: string;
  result_url?: string;
}

export default function UserDashboard() {
  const [activeTab, setActiveTab] = useState<"all" | "completed" | "pending">("all");
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: requests = [], isLoading } = useQuery({
    queryKey: ["my-requests"],
    queryFn: async () => {
      const res = await toPatients.listRequests();
      // Handle different response structures if needed, assume array for now
      return Array.isArray(res) ? res : (res.data || []);
    }
  });

  const payMutation = useMutation({
    mutationFn: async ({ id, ref }: { id: string, ref: string }) => {
      return toPatients.pay(id, ref);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-requests"] });
      toast({ title: "Payment Successful", description: "Your payment has been recorded." });
    },
    onError: (err: any) => {
      toast({ title: "Payment Failed", description: err.message, variant: "destructive" });
    }
  });

  const rateMutation = useMutation({
    mutationFn: async ({ id, rating, comment }: { id: string, rating: number, comment: string }) => {
      return toPatients.rate(id, { rating, comment });
    },
    onSuccess: () => {
      toast({ title: "Rating Submitted", description: "Thank you for your feedback!" });
    }
  });

  const filteredRequests = requests.filter((r: LabRequest) => {
    if (activeTab === "all") return true;
    if (activeTab === "completed") return r.status === "completed";
    if (activeTab === "pending") return r.status === "pending" || r.status === "processing"; // Adjust based on actual status values
    return true;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-emerald-100 text-emerald-700";
      case "processing":
      case "in-progress":
        return "bg-blue-100 text-blue-700";
      case "pending":
        return "bg-amber-100 text-amber-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // Mock Payment & Rating handlers
  const handlePay = (id: string) => {
    // In a real app, integrate a payment gateway here.
    // For now, prompt for a "fake" reference
    const ref = prompt("Enter Payment Reference (Simulated):", "PAY-" + Math.floor(Math.random() * 10000));
    if (ref) {
      payMutation.mutate({ id, ref });
    }
  };

  const handleRate = (id: string) => {
    // Trigger dialog or similar. For simplicity, just prompt
    const ratingStr = prompt("Rate 1-5:");
    if (!ratingStr) return;
    const rating = parseInt(ratingStr);
    if (isNaN(rating) || rating < 1 || rating > 5) return alert("Invalid rating");
    const comment = prompt("Comment:") || "";
    rateMutation.mutate({ id, rating, comment });
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
              <Button className="font-semibold" onClick={() => setLocation("/find-lab")}>
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
              <div className="text-3xl font-bold text-foreground">{requests.length}</div>
            </div>
            <div className="bg-white rounded-lg border border-border/40 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm text-muted-foreground">Completed</div>
                <CheckCircle className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-3xl font-bold text-emerald-600">
                {requests.filter((r: LabRequest) => r.status === "completed").length}
              </div>
            </div>
            <div className="bg-white rounded-lg border border-border/40 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm text-muted-foreground">Pending</div>
                <Clock className="w-4 h-4 text-amber-600" />
              </div>
              <div className="text-3xl font-bold text-amber-600">
                {requests.filter((r: LabRequest) => r.status === "pending" || r.status === "processing").length}
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-8 border-b border-border">
            {["all", "completed", "pending"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors ${activeTab === tab
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
              >
                {tab === "all" ? "All Requests" : tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* Requests List */}
          {isLoading ? (
            <div className="text-center py-10">Loading requests...</div>
          ) : (
            <div className="space-y-4">
              {filteredRequests.map((request: LabRequest) => (
                <div
                  key={request.id}
                  className="bg-white rounded-lg border border-border/40 p-6 hover:shadow-md hover:border-primary/30 transition-all group"
                >
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    {/* Left Content */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-lg font-bold text-foreground">{request.clinic_name || "Unknown Clinic"}</h3>
                        <Badge className={`${getStatusColor(request.status)} border-0`}>
                          {request.status ? (request.status.charAt(0).toUpperCase() + request.status.slice(1)) : "Unknown"}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground text-sm mb-3">{request.service_name}</p>

                      {/* Details */}
                      <div className="flex flex-col sm:flex-row gap-6 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-primary" />
                          {new Date(request.created_at).toLocaleDateString()}
                        </div>
                        {request.hospital_location && (
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-primary" />
                            {request.hospital_location}
                          </div>
                        )}
                        {request.price && (
                          <div className="flex items-center gap-2 font-semibold text-foreground">
                            <DollarSign className="w-4 h-4 text-primary" />
                            {request.price.toLocaleString()}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 w-full sm:w-auto flex-wrap">
                      {request.status === "completed" && (
                        <>
                          {request.result_url && (
                            <Button variant="default" size="sm" className="flex items-center gap-2" onClick={() => window.open(request.result_url, '_blank')}>
                              <Download className="w-4 h-4" />
                              Report
                            </Button>
                          )}
                          <Button variant="outline" size="sm" onClick={() => handleRate(request.id)}>
                            <Star className="w-4 h-4 mr-1" /> Rate
                          </Button>
                        </>
                      )}

                      {request.status === "pending" && !request.payment_status && (
                        <Button variant="default" size="sm" onClick={() => handlePay(request.id)}>
                          Pay Now
                        </Button>
                      )}

                      <Button variant="ghost" size="sm">
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!isLoading && filteredRequests.length === 0 && (
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
