import { z } from "zod";

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api/v1";

export const getToken = (role: "patient" | "clinic" | "superadmin") => {
    return localStorage.getItem(`${role}_token`);
};

export const setToken = (role: "patient" | "clinic" | "superadmin", token: string) => {
    localStorage.setItem(`${role}_token`, token);
};

export const clearToken = (role: "patient" | "clinic" | "superadmin") => {
    localStorage.removeItem(`${role}_token`);
};

type RequestOptions = {
    method?: string;
    body?: any;
    headers?: Record<string, string>;
    tokenRole?: "patient" | "clinic" | "superadmin";
};

export async function fetchApi(endpoint: string, options: RequestOptions = {}) {
    const { method = "GET", body, headers = {}, tokenRole } = options;

    const requestHeaders: Record<string, string> = { ...headers };

    if (tokenRole) {
        const token = getToken(tokenRole);
        if (token) {
            requestHeaders["Authorization"] = `Bearer ${token}`;
        }
    }

    const isFormData = body instanceof FormData;
    if (!isFormData && body) {
        requestHeaders["Content-Type"] = "application/json";
    }

    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
        method,
        headers: requestHeaders,
        body: isFormData ? body : (body ? JSON.stringify(body) : undefined),
    });

    console.log({ res })

    if (!res.ok) {
        const errorData = await res.json().catch(() => ({ detail: res.statusText }));
        if (res.status === 422) {
            console.error("Validation Error (422):", {
                endpoint,
                method,
                payload: body,
                response: errorData
            });
        } else {
            console.log("API Error:", errorData);
        }
        throw new Error(errorData.detail || errorData.message || "API request failed");
    }

    return res.json();
}

// --- API Functions ---

// 1. Super Admin
export const toSuperAdmin = {
    login: (data: any) => fetchApi("/superadmin/login", { method: "POST", body: data }),
    listClinics: (params: { skip?: number; limit?: number } = {}) => {
        const query = new URLSearchParams({ skip: (params.skip || 0).toString(), limit: (params.limit || 10).toString() });
        return fetchApi(`/superadmin/clinics?${query}`, { tokenRole: "superadmin" });
    },
    updateClinicStatus: (clinicId: string, isActive: boolean) =>
        fetchApi(`/superadmin/clinics/${clinicId}/active-status`, { method: "PATCH", body: { is_active: isActive }, tokenRole: "superadmin" }),
};

// 2. Clinics
export const toClinics = {
    signup: (data: any) => fetchApi("/clinics/signup", { method: "POST", body: data }),
    login: (data: any) => fetchApi("/clinics/login", { method: "POST", body: data }),
    updateStatus: (online: boolean) => fetchApi(`/clinics/me/status?is_online=${online}`, { method: "POST", tokenRole: "clinic" }),
    manageServices: (services: any[]) => fetchApi("/clinics/me", { method: "PUT", body: { services }, tokenRole: "clinic" }),
    listRequests: () => fetchApi("/lab-requests/clinic/requests", { tokenRole: "clinic" }),
    updateLabStatus: (requestId: string, data: any) =>
        fetchApi(`/lab-requests/clinic/requests/${requestId}/status`, { method: "PATCH", body: data, tokenRole: "clinic" }),
    uploadResult: (requestId: string, file: File) => {
        const formData = new FormData();
        formData.append("file", file);
        return fetchApi(`/lab-requests/clinic/requests/${requestId}/result`, { method: "POST", body: formData, tokenRole: "clinic" });
    },
    forgotPassword: (email: string) => fetchApi("/clinics/forgot-password", { method: "POST", body: { email } }),
    resetPassword: (data: any) => fetchApi("/clinics/reset-password", { method: "POST", body: data }),
    getProfile: () => fetchApi("/clinics/me", { tokenRole: "clinic" }),
    updateProfile: (data: any) => fetchApi("/clinics/me", { method: "PUT", body: data, tokenRole: "clinic" }),
    uploadImages: (files: File[]) => {
        const formData = new FormData();
        files.forEach(file => formData.append("files", file));
        return fetchApi("/clinics/me/images", { method: "POST", body: formData, tokenRole: "clinic" });
    },
};

// 3. Patients
export const toPatients = {
    signup: (data: any) => fetchApi("/patients/signup", { method: "POST", body: data }),
    verifyEmail: (data: any) => fetchApi("/patients/verify-email", { method: "POST", body: data }),
    login: (data: any) => fetchApi("/patients/login", { method: "POST", body: data }),
    googleLogin: (idToken: string) => fetchApi("/patients/google-login", { method: "POST", body: { id_token: idToken } }),
    createRequest: (data: FormData) => fetchApi("/lab-requests/me/requests", { method: "POST", body: data, tokenRole: "patient" }),
    listRequests: () => fetchApi("/lab-requests/me/requests", { tokenRole: "patient" }),
    pay: (requestId: string, paymentRef: string) =>
        fetchApi(`/lab-requests/me/requests/${requestId}/pay/${paymentRef}`, { method: "POST", tokenRole: "patient" }),
    rate: (requestId: string, data: { rating: number; comment: string }) =>
        fetchApi(`/lab-requests/me/requests/${requestId}/rate`, { method: "POST", body: data, tokenRole: "patient" }),
};

// Helper to get IP address
async function getIpAddress(): Promise<string | undefined> {
    try {
        const response = await fetch("https://api64.ipify.org?format=json");
        const data = await response.json();
        return data.ip;
    } catch (error) {
        console.error("Failed to get IP address:", error);
        return undefined;
    }
}

// 4. Public
export const toPublic = {
    searchClinics: async (params: { q?: string; radius?: number; skip?: number; limit?: number; lat?: number; lng?: number; location?: string } = {}) => {

        const queryParams = new URLSearchParams();

        if (params.q) queryParams.append("q", params.q);
        if (params.location) queryParams.append("location", params.location);
        if (params.radius) queryParams.append("radius", params.radius.toString());
        if (params.skip !== undefined) queryParams.append("skip", params.skip.toString());
        if (params.limit !== undefined) queryParams.append("limit", params.limit.toString());
        if (params.lat !== undefined) queryParams.append("lat", params.lat.toString());
        if (params.lng !== undefined) queryParams.append("lng", params.lng.toString());

        // Add IP address to search params ONLY if cookie consent is accepted
        const consent = localStorage.getItem("cookie-consent");

        if (consent === "accepted") {
            const ip = await getIpAddress();
            if (ip) {
                queryParams.append("ip_address", ip);
            }
        }

        // Auto-detect user location for personalization (if permission granted)
        if (typeof navigator !== "undefined" && "geolocation" in navigator) {
            try {
                // Safely check for permissions API
                const permissions = (navigator as any).permissions;
                if (permissions && typeof permissions.query === "function") {
                    const permission = await permissions.query({ name: "geolocation" });
                    if (permission.state === "granted") {
                        const coords = await new Promise<{ lat: number; lng: number } | null>((resolve) => {
                            navigator.geolocation.getCurrentPosition(
                                (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
                                (err) => {
                                    console.warn("Geolocation access failed despite permission:", err);
                                    resolve(null);
                                },
                                { timeout: 3000, maximumAge: 300000 }
                            );
                        });

                        if (coords) {
                            queryParams.append("user_lat", coords.lat.toString());
                            queryParams.append("user_lng", coords.lng.toString());
                        }
                    }
                }
            } catch (error) {
                console.error("Auto-location failed:", error);
            }
        }

        return fetchApi(`/clinics/public/search?${queryParams.toString()}`);
    },
    sendContact: (data: { first_name: string; last_name?: string; email: string; message: string }) =>
        fetchApi("/contact", { method: "POST", body: data }),
};
