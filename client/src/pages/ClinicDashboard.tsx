import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Calendar,
  Users,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Upload,
  List,
  Power,
  Settings,
  LayoutDashboard,
  BookOpen,
  Plus,
  Trash2,
  Image as ImageIcon,
  Loader2,
  MapPin,
  Phone,
  Mail,
  User,
  Activity
} from "lucide-react";
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toClinics } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

// Helper Interface
interface LabRequest {
  id: string;
  patient_name?: string;
  patient?: { full_name: string; email: string };
  service_name: string;
  status: string;
  created_at: string;
  contact_phone?: string;
}

export default function ClinicDashboard() {
  const [activeTab, setActiveTab] = useState<"all" | "completed" | "pending">("all");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Profile Form State
  const [formData, setFormData] = useState({
    clinic_name: "",
    contact_person: "",
    phone_number: "",
    email: "",
    address: {
      street_address: "",
      city: "",
      state: "",
      zip_code: ""
    }
  });
  const [services, setServices] = useState<string[]>([]);
  const [newService, setNewService] = useState("");
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  // Fetch Profile
  const { data: profileData, isLoading: isProfileLoading } = useQuery({
    queryKey: ["clinic-profile"],
    queryFn: async () => {
      const res = await toClinics.getProfile();
      return res.data || res;
    },
  });
  const profile = profileData;

  // Fetch Requests
  const { data: requests = [], isLoading: isRequestsLoading } = useQuery({
    queryKey: ["clinic-requests"],
    queryFn: async () => {
      const res = await toClinics.listRequests();
      return Array.isArray(res) ? res : (res.data || []);
    }
  });

  useEffect(() => {
    if (profile) {
      console.log({ profile })
      setFormData({
        clinic_name: profile.clinic_name || profile.name || "",
        contact_person: profile.contact_person || "",
        phone_number: profile.phone_number || "",
        email: profile.email || profile.username || profile.email_address || profile.user?.email || profile.user?.username || "",
        address: {
          street_address: profile.address?.street_address || "",
          city: profile.address?.city || "",
          state: profile.address?.state || "",
          zip_code: profile.address?.zip_code || ""
        }
      });
      setServices(profile.services || []);
      if (profile.images) {
        setPreviews(profile.images);
      } else if (profile.image) {
        setPreviews([profile.image]);
      }
    }
  }, [profile]);

  // Mutations
  const statusMutation = useMutation({
    mutationFn: (status: boolean) => toClinics.updateStatus(status),
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ["clinic-profile"] });
      toast({ title: vars ? "You are now Online" : "You are now Offline" });
    }
  });

  const updateProfileMutation = useMutation({
    mutationFn: (data: any) => toClinics.updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clinic-profile"] });
      toast({ title: "Profile Updated" });
    }
  });

  const uploadImagesMutation = useMutation({
    mutationFn: (files: File[]) => toClinics.uploadImages(files),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clinic-profile"] });
      toast({ title: "Images Updated" });
      setSelectedImages([]);
    }
  });

  const updateServicesMutation = useMutation({
    mutationFn: (services: string[]) => toClinics.manageServices(services),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clinic-profile"] });
      toast({ title: "Services Updated" });
    }
  });

  const updateRequestStatusMutation = useMutation({
    mutationFn: ({ id, status, note }: { id: string, status: string, note?: string }) =>
      toClinics.updateLabStatus(id, { status, note }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clinic-requests"] });
      toast({ title: "Status Updated" });
    }
  });

  const uploadResultMutation = useMutation({
    mutationFn: ({ id, file }: { id: string, file: File }) => toClinics.uploadResult(id, file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clinic-requests"] });
      toast({ title: "Result Uploaded" });
    }
  });

  // Handlers
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: { ...prev[parent as keyof typeof prev] as object, [child]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfileMutation.mutate(formData);
  };

  const addService = () => {
    if (newService.trim() && !services.includes(newService.trim())) {
      const updated = [...services, newService.trim()];
      setServices(updated);
      updateServicesMutation.mutate(updated);
      setNewService("");
    }
  };

  const removeService = (service: string) => {
    const updated = services.filter(s => s !== service);
    setServices(updated);
    updateServicesMutation.mutate(updated);
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setSelectedImages(prev => [...prev, ...files]);
      const newPreviews = files.map(file => URL.createObjectURL(file));
      setPreviews(prev => [...prev, ...newPreviews]);
      uploadImagesMutation.mutate(files);
    }
  };

  const handleStatusChange = (id: string, status: string) => {
    updateRequestStatusMutation.mutate({ id, status, note: "Status updated by clinic." });
  };

  const handleFileUpload = (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      uploadResultMutation.mutate({ id, file: e.target.files[0] });
    }
  };

  const filteredRequests = requests.filter((r: LabRequest) => {
    if (activeTab === "all") return true;
    return r.status === activeTab;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-emerald-100 text-emerald-700";
      case "processing": return "bg-blue-100 text-blue-700";
      case "pending": return "bg-amber-100 text-amber-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const isOnline = profile?.is_online ?? true;

  if (isRequestsLoading || isProfileLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white p-6 rounded-2xl border border-border/40 shadow-sm">
              <div>
                <h1 className="text-3xl font-heading font-bold text-foreground mb-1">{profile?.clinic_name || profile?.name || "Clinic Dashboard"}</h1>
                <div className="flex flex-col gap-1">
                  <p className="text-muted-foreground text-sm flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-primary/60" />
                    {profile?.email || profile?.username || profile?.email_address || profile?.user?.email || profile?.user?.username || "No Email provided"}
                  </p>
                  <p className="text-muted-foreground text-sm flex items-center gap-2">
                    <Activity className="w-3.5 h-3.5 text-emerald-500" />
                    Manage your health services and lab requests
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 bg-secondary/20 p-2 rounded-xl border border-border/50">
                <div className="flex flex-col items-end px-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Service Status</span>
                  <span className={`text-sm font-bold ${isOnline ? "text-emerald-600" : "text-destructive"}`}>
                    {isOnline ? "OPERATIONAL" : "OFFLINE"}
                  </span>
                </div>
                <div className="relative flex items-center">
                  <Switch
                    checked={isOnline}
                    onCheckedChange={(checked) => statusMutation.mutate(checked)}
                    disabled={statusMutation.isPending}
                  />
                  {statusMutation.isPending && (
                    <div className="absolute -right-6">
                      <Loader2 className="w-4 h-4 animate-spin text-primary" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <Tabs defaultValue="overview" className="space-y-8">
            <TabsList className="bg-secondary/30 p-1 rounded-xl h-12">
              <TabsTrigger value="overview" className="rounded-lg px-6 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                <LayoutDashboard className="w-4 h-4 mr-2" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="requests" className="rounded-lg px-6 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                <Activity className="w-4 h-4 mr-2" />
                Requests
              </TabsTrigger>
              <TabsTrigger value="settings" className="rounded-lg px-6 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                <Settings className="w-4 h-4 mr-2" />
                Profile Settings
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <div className="grid md:grid-cols-4 gap-4 mb-8">
                <Card className="bg-white border-border/40 shadow-sm overflow-hidden group hover:border-primary/30 transition-all">
                  <CardHeader className="pb-2">
                    <CardDescription className="flex items-center justify-between">
                      Active Requests
                      <Activity className="w-4 h-4 text-primary group-hover:scale-110 transition-transform" />
                    </CardDescription>
                    <CardTitle className="text-3xl font-bold">{requests.length}</CardTitle>
                  </CardHeader>
                </Card>
                <Card className="bg-white border-border/40 shadow-sm overflow-hidden group hover:border-emerald-300 transition-all">
                  <CardHeader className="pb-2">
                    <CardDescription className="flex items-center justify-between">
                      Completed
                      <CheckCircle className="w-4 h-4 text-emerald-500 group-hover:scale-110 transition-transform" />
                    </CardDescription>
                    <CardTitle className="text-3xl font-bold text-emerald-600">
                      {requests.filter((r: LabRequest) => r.status === 'completed').length}
                    </CardTitle>
                  </CardHeader>
                </Card>
                <Card className="bg-white border-border/40 shadow-sm overflow-hidden group hover:border-amber-300 transition-all">
                  <CardHeader className="pb-2">
                    <CardDescription className="flex items-center justify-between">
                      Pending
                      <Clock className="w-4 h-4 text-amber-500 group-hover:scale-110 transition-transform" />
                    </CardDescription>
                    <CardTitle className="text-3xl font-bold text-amber-600">
                      {requests.filter((r: LabRequest) => r.status === 'pending').length}
                    </CardTitle>
                  </CardHeader>
                </Card>
                <Card className="bg-primary/5 border-primary/20 shadow-sm overflow-hidden relative group">
                  <div className="absolute -right-4 -top-4 opacity-10 group-hover:scale-110 transition-transform">
                    <BookOpen className="w-24 h-24 text-primary" />
                  </div>
                  <CardHeader className="pb-2">
                    <CardDescription className="text-primary font-semibold flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-primary" />
                      Lab Request Book
                    </CardDescription>
                    <Badge variant="secondary" className="bg-primary/20 text-primary border-none w-fit">
                      Coming Soon
                    </Badge>
                  </CardHeader>
                </Card>
              </div>

              {/* Lab Request Book Coming Soon Placeholder */}
              <Card className="border-dashed border-2 border-border/60 bg-secondary/5 mb-8">
                <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center border border-border/40 shadow-sm mb-4">
                    <BookOpen className="w-8 h-8 text-primary/40" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Lab Request Book</h3>
                  <p className="text-muted-foreground max-w-sm mx-auto">
                    A comprehensive log system for all your lab requests, offline recordings, and batch processing is currently under development.
                  </p>
                  <Badge variant="secondary" className="mt-4 bg-white border border-border shadow-sm">
                    Release Version 2.4
                  </Badge>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="requests" className="space-y-6">
              <div className="flex gap-2 mb-4">
                {["all", "completed", "pending"].map((t) => (
                  <Button
                    key={t}
                    variant={activeTab === t ? "default" : "outline"}
                    size="sm"
                    onClick={() => setActiveTab(t as any)}
                    className="rounded-full px-6"
                  >
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </Button>
                ))}
              </div>

              <div className="space-y-4">
                {filteredRequests.map((request: LabRequest) => (
                  <Card key={request.id} className="group hover:border-primary/30 transition-all border-border/40 shadow-sm">
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-bold">
                              {request.patient?.full_name || request.patient_name || "Unknown Patient"}
                            </h3>
                            <Badge className={`${getStatusColor(request.status)} border-0`}>
                              {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                            </Badge>
                          </div>
                          <p className="text-muted-foreground text-sm font-medium mb-4">Service: {request.service_name}</p>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Calendar className="w-4 h-4 text-primary/60" />
                              {new Date(request.created_at).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                            </div>
                            {request.contact_phone && (
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <Users className="w-4 h-4 text-primary/60" />
                                {request.contact_phone}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex gap-2 w-full sm:w-auto items-center">
                          {request.status === "pending" && (
                            <Button size="sm" onClick={() => handleStatusChange(request.id, "processing")} className="font-semibold">
                              Start Processing
                            </Button>
                          )}

                          {(request.status === "processing" || request.status === "in-progress") && (
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline" className="relative cursor-pointer">
                                <Upload className="w-4 h-4 mr-2" /> Upload Result
                                <input
                                  type="file"
                                  className="absolute inset-0 opacity-0 cursor-pointer"
                                  onChange={(e) => handleFileUpload(request.id, e)}
                                />
                              </Button>
                              <Button size="sm" onClick={() => handleStatusChange(request.id, "completed")} className="bg-emerald-600 hover:bg-emerald-700 font-semibold text-white">
                                Mark Completed
                              </Button>
                            </div>
                          )}

                          <Button variant="ghost" size="sm" className="hover:bg-primary/10">
                            <Eye className="w-4 h-4 text-primary" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {filteredRequests.length === 0 && (
                  <div className="text-center py-20 bg-secondary/5 rounded-2xl border border-dashed border-border/40">
                    <p className="text-muted-foreground">No requests found for this category.</p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="settings">
              <div className="grid lg:grid-cols-3 gap-8">
                {/* Profile Form */}
                <div className="lg:col-span-2 space-y-8">
                  <Card className="border-border/40 shadow-sm">
                    <CardHeader>
                      <CardTitle>Clinic Information</CardTitle>
                      <CardDescription>Update your general clinic details and contact information.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleProfileSubmit} className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label>Clinic Name</Label>
                            <div className="relative">
                              <Activity className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                              <Input name="clinic_name" value={formData.clinic_name} onChange={handleProfileChange} className="pl-10" />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label>Contact Person</Label>
                            <div className="relative">
                              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                              <Input name="contact_person" value={formData.contact_person} onChange={handleProfileChange} className="pl-10" />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label>Phone Number</Label>
                            <div className="relative">
                              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                              <Input name="phone_number" value={formData.phone_number} onChange={handleProfileChange} className="pl-10" />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label>Email Address</Label>
                            <div className="relative">
                              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                              <Input name="email" type="email" value={formData.email} readOnly disabled className="pl-10 bg-secondary/50 cursor-not-allowed" />
                            </div>
                          </div>
                        </div>

                        <div className="space-y-4 pt-4 border-t border-border/50">
                          <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            Location Details
                          </h4>
                          <div className="space-y-2">
                            <Label>Street Address</Label>
                            <Input name="address.street_address" value={formData.address.street_address} onChange={handleProfileChange} />
                          </div>
                          <div className="grid md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                              <Label>City</Label>
                              <Input name="address.city" value={formData.address.city} onChange={handleProfileChange} />
                            </div>
                            <div className="space-y-2">
                              <Label>State</Label>
                              <Input name="address.state" value={formData.address.state} onChange={handleProfileChange} />
                            </div>
                            <div className="space-y-2">
                              <Label>ZIP Code</Label>
                              <Input name="address.zip_code" value={formData.address.zip_code} onChange={handleProfileChange} />
                            </div>
                          </div>
                        </div>

                        <Button type="submit" disabled={updateProfileMutation.isPending} className="w-full h-11">
                          {updateProfileMutation.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : "Save Profile Changes"}
                        </Button>
                      </form>
                    </CardContent>
                  </Card>

                  <Card className="border-border/40 shadow-sm">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle>Medical Services</CardTitle>
                        {updateServicesMutation.isPending && <Loader2 className="w-4 h-4 animate-spin text-primary" />}
                      </div>
                      <CardDescription>Manage the list of services and tests your clinic provides.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="flex gap-2">
                        <Input
                          placeholder="Add a new service (e.g. Blood Test, MRI)"
                          value={newService}
                          onChange={(e) => setNewService(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && addService()}
                        />
                        <Button onClick={addService} variant="secondary" className="shrink-0 bg-primary/10 text-primary hover:bg-primary/20">
                          <Plus className="w-4 h-4 mr-2" /> Add
                        </Button>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {services.map((service, i) => (
                          <Badge key={i} variant="outline" className="px-3 py-1.5 flex items-center gap-2 bg-white group hover:bg-destructive/5 hover:border-destructive/30 transition-all">
                            {service}
                            <button onClick={() => removeService(service)} className="text-muted-foreground hover:text-destructive">
                              <XCircle className="w-3.5 h-3.5" />
                            </button>
                          </Badge>
                        ))}
                        {services.length === 0 && <p className="text-sm text-muted-foreground italic">No services listed yet.</p>}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Images Sidebar */}
                <div className="space-y-8">
                  <Card className="border-border/40 shadow-sm">
                    <CardHeader>
                      <CardTitle className="text-lg">Gallery & Media</CardTitle>
                      <CardDescription>Upload showcase images of your facility.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-2 gap-2">
                        {previews.map((url, i) => (
                          <div key={i} className="relative aspect-square rounded-lg overflow-hidden border border-border group">
                            <img src={url} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <button className="text-white hover:text-destructive">
                                <Trash2 className="w-5 h-5" />
                              </button>
                            </div>
                          </div>
                        ))}
                        <label className="aspect-square rounded-lg border-2 border-dashed border-border/60 flex flex-col items-center justify-center cursor-pointer hover:border-primary/40 hover:bg-primary/5 transition-all">
                          <Upload className="w-6 h-6 text-muted-foreground mb-1" />
                          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Upload</span>
                          <input type="file" multiple className="hidden" onChange={handleImageSelect} accept="image/*" />
                        </label>
                      </div>
                      <p className="text-[11px] text-muted-foreground text-center">
                        Transparent, clear images of your clinic help build trust with patients.
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="bg-emerald-600 text-white border-none shadow-lg shadow-emerald-200">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center justify-between">
                        Live Status
                        <Activity className="w-4 h-4" />
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-emerald-50">
                        When status is set to online, your clinic will appear in search results for all potential patients.
                      </p>
                      <Button
                        onClick={() => statusMutation.mutate(!isOnline)}
                        variant="secondary"
                        disabled={statusMutation.isPending}
                        className="w-full bg-white text-emerald-700 hover:bg-emerald-50 font-bold"
                      >
                        {statusMutation.isPending ? (
                          <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        ) : null}
                        {isOnline ? "Switch to Offline" : "Turn On Service"}
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}

