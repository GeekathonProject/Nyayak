import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useAuth } from "../context/Authcontext"; // <--- FIXED CASING
import { Scale, Mail, Lock, User, Phone, Shield, Briefcase, ArrowRight, CheckCircle2 } from "lucide-react";
import { toast } from "react-toastify";

const SignupPage = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [selectedRole, setSelectedRole] = useState("citizen"); // Default role
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { signup } = useAuth();

    const onSubmit = async (data) => {
        setIsLoading(true);
        try {
            // We pass the selectedRole manually along with form data
            await signup(data.email, data.password, data.fullName, selectedRole, data.phone);
            toast.success("Account created! Redirecting...");
            
            // --- LOGIC: REDIRECT BASED ON SELECTED ROLE ---
            if (selectedRole === 'police') {
                navigate("/police-dashboard");
            } else if (selectedRole === 'lawyer') {
                navigate("/legal-dashboard");
            } else {
                navigate("/dashboard");
            }

        } catch (error) {
            toast.error(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex bg-[#FFFAF0]">
            
            {/* LEFT SIDE: BRANDING */}
            <div className="hidden lg:flex w-1/2 bg-[#0B1120] relative flex-col justify-between p-12 overflow-hidden">
                <div className="absolute inset-0 opacity-20" 
                     style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)', backgroundSize: '32px 32px' }}>
                </div>
                
                <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-8">
                        {/* <div className="p-2 bg-orange-500/20 rounded-lg">
                            <Scale className="w-6 h-6 text-orange-500" />
                        </div>
                        <span className="text-2xl font-bold text-white tracking-tight">NyayaSahayak</span> */}
                    </div>
                    <h1 className="text-5xl font-bold text-white mb-6 leading-tight">
                        {/* Join the <span className="text-orange-500">Digital Justice</span> <br/> */}
                        not sure what to put here.
                    </h1>
                    {/* <div className="space-y-4 text-slate-400 text-lg">
                        <div className="flex items-center gap-3">
                            <CheckCircle2 className="w-5 h-5 text-green-500" />
                            <span>Instant FIR Filing & Tracking</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <CheckCircle2 className="w-5 h-5 text-green-500" />
                            <span>AI-Powered Legal Drafting</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <CheckCircle2 className="w-5 h-5 text-green-500" />
                            <span>Secure Evidence Vault</span>
                        </div>
                    </div> */}
                </div>

                <div className="relative z-10 text-xs text-slate-600">
                    © 2026 NyayaSahayak. Official Government Initiative.
                </div>
            </div>

            {/* RIGHT SIDE: FORM */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 overflow-y-auto">
                <div className="w-full max-w-md space-y-8">
                    
                    <div className="text-center lg:text-left">
                        <h2 className="text-3xl font-bold text-slate-900">Create your account</h2>
                        <p className="mt-2 text-slate-600">
                            Already have one? <Link to="/login" className="font-bold text-orange-600 hover:text-orange-500">Sign in here</Link>
                        </p>
                    </div>

                    {/* ROLE SELECTOR */}
                    <div className="grid grid-cols-3 gap-3">
                        <RoleCard 
                            role="citizen" 
                            icon={<User className="w-5 h-5" />} 
                            label="Citizen" 
                            selected={selectedRole === "citizen"} 
                            onClick={() => setSelectedRole("citizen")}
                        />
                        <RoleCard 
                            role="police" 
                            icon={<Shield className="w-5 h-5" />} 
                            label="Police" 
                            selected={selectedRole === "police"} 
                            onClick={() => setSelectedRole("police")}
                        />
                        <RoleCard 
                            role="lawyer" 
                            icon={<Briefcase className="w-5 h-5" />} 
                            label="Lawyer" 
                            selected={selectedRole === "lawyer"} 
                            onClick={() => setSelectedRole("lawyer")}
                        />
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        
                        {/* Full Name */}
                        <div className="space-y-1">
                            <label className="text-sm font-semibold text-slate-700">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input 
                                    type="text"
                                    className="w-full h-11 pl-10 pr-4 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                                    placeholder="John Doe"
                                    {...register("fullName", { required: "Name is required" })}
                                />
                            </div>
                            {errors.fullName && <p className="text-red-500 text-xs">{errors.fullName.message}</p>}
                        </div>

                        {/* Email */}
                        <div className="space-y-1">
                            <label className="text-sm font-semibold text-slate-700">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input 
                                    type="email"
                                    className="w-full h-11 pl-10 pr-4 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                                    placeholder="name@email.com"
                                    {...register("email", { required: "Email is required" })}
                                />
                            </div>
                            {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
                        </div>

                        {/* Phone */}
                        <div className="space-y-1">
                            <label className="text-sm font-semibold text-slate-700">Phone Number (For SOS)</label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input 
                                    type="tel"
                                    className="w-full h-11 pl-10 pr-4 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                                    placeholder="+91 98765 43210"
                                    {...register("phone", { required: "Phone is required" })}
                                />
                            </div>
                            {errors.phone && <p className="text-red-500 text-xs">{errors.phone.message}</p>}
                        </div>

                        {/* Password */}
                        <div className="space-y-1">
                            <label className="text-sm font-semibold text-slate-700">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input 
                                    type="password"
                                    className="w-full h-11 pl-10 pr-4 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                                    placeholder="••••••••"
                                    {...register("password", { 
                                        required: "Password is required",
                                        minLength: { value: 6, message: "Min 6 chars" }
                                    })}
                                />
                            </div>
                            {errors.password && <p className="text-red-500 text-xs">{errors.password.message}</p>}
                        </div>

                        <button 
                            type="submit" 
                            disabled={isLoading}
                            className="w-full h-12 mt-4 bg-slate-900 hover:bg-black text-white font-bold rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {isLoading ? "Creating Account..." : "Create Account"}
                            {!isLoading && <ArrowRight className="w-4 h-4" />}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

// Internal Component for Role Cards
const RoleCard = ({ icon, label, selected, onClick }) => (
    <div 
        onClick={onClick}
        className={`cursor-pointer p-3 rounded-xl border-2 transition-all flex flex-col items-center justify-center gap-2 ${
            selected 
            ? "border-orange-500 bg-orange-50 text-orange-700" 
            : "border-slate-200 bg-white text-slate-500 hover:border-orange-200 hover:bg-slate-50"
        }`}
    >
        <div className={selected ? "text-orange-600" : "text-slate-400"}>{icon}</div>
        <span className="text-xs font-bold">{label}</span>
    </div>
);

export default SignupPage;