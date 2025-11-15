import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useWallet } from "@suiet/wallet-kit";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import { config } from "@/config/env";
import { cn } from "@/lib/utils";
import { loadSessionProfile, storeSessionProfile } from "@/lib/profile-storage";
import type { UserProfile } from "@/types/profile";
import {
  Search,
  ArrowUpRight,
  Users,
  Award,
  Trophy,
  FileText,
  Github,
  Twitter,
  MessageCircle,
  Bell,
  Settings,
  HelpCircle,
  LogOut,
  PencilLine,
} from "lucide-react";
import NavBar from "@/components/NavBar";
import CustomConnectWallet from "@/components/CustomConnectWallet";

// BountyCard Component
interface BountyCardProps {
  title: string;
  category: string;
  quests: number;
  dueIn: string;
  reward: number;
  currency: string;
}

const BountyCard = ({ title, category, quests, dueIn, reward, currency }: BountyCardProps) => {
  return (
    <Card className="group flex flex-col gap-3 rounded-2xl border-white/5 bg-gradient-to-b from-[#0c193c]/80 to-[#050c1f]/80 p-4 text-white shadow-lg transition hover:border-primary/40 hover:shadow-primary/30">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="text-sm font-semibold text-white">{title}</h3>
          <p className="text-xs text-slate-400">{category}</p>
        </div>
        <ArrowUpRight className="h-4 w-4 text-slate-500 opacity-0 transition group-hover:opacity-100" />
      </div>
      <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-300">
        <span className="flex items-center gap-1 font-medium">
          <Users className="h-3 w-3 text-primary" />
          {quests} Quests
        </span>
        <span className="h-1 w-1 rounded-full bg-slate-500" />
        <span>Due in {dueIn}</span>
        <span className="h-1 w-1 rounded-full bg-slate-500" />
        <span className="inline-flex items-center gap-1">
          <span className="text-base leading-none">👥</span>
          <span className="text-base leading-none">🔒</span>
        </span>
      </div>
      <div className="flex items-center justify-between rounded-xl bg-white/5 px-3 py-2 text-xs">
        <span className="text-slate-400">Reward</span>
        <span className="text-sm font-semibold text-[#48d2ff]">
          {reward} {currency}
        </span>
      </div>
    </Card>
  );
};

const defaultProfile: UserProfile = {
  email: "",
  username: "",
  firstName: "",
  lastName: "",
  location: "",
  skills: [],
  socials: "",
  github: "",
  displayName: "",
  bio: "",
  role: "user",
};

const asUserRole = (value: unknown): UserProfile["role"] => {
  if (value === "admin" || value === "partner" || value === "user") {
    return value;
  }
  return undefined;
};

const Profile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { connected: walletConnected } = useWallet();
  const [profile, setProfile] = useState<UserProfile>(defaultProfile);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formState, setFormState] = useState<UserProfile>(defaultProfile);

  const fetchProfile = useCallback(async (email: string) => {
    try {
      const response = await fetch(`${config.authApiBaseUrl}/profile?email=${encodeURIComponent(email)}`);
      if (!response.ok) {
        throw new Error("Failed to fetch profile");
      }
      const data = await response.json();
      const remoteProfile = {
        email,
        username: data?.profile?.username ?? "",
        firstName: data?.profile?.firstName ?? "",
        lastName: data?.profile?.lastName ?? "",
        location: data?.profile?.location ?? "",
        skills: Array.isArray(data?.profile?.skills) ? data.profile.skills : [],
        socials: data?.profile?.socials ?? "",
        github: data?.profile?.github ?? "",
        displayName: data?.profile?.displayName ?? "",
        bio: data?.profile?.bio ?? "",
        updatedAt: data?.profile?.updatedAt,
        role: asUserRole(data?.profile?.role),
      } satisfies UserProfile;
      setProfile(remoteProfile);
      setFormState(remoteProfile);
      storeSessionProfile(remoteProfile);
      if (remoteProfile.role) {
        sessionStorage.setItem("userRole", remoteProfile.role);
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Failed to load profile",
        description: "Không thể tải hồ sơ, vui lòng thử lại sau.",
        variant: "destructive",
      });
    }
  }, [toast]);

  useEffect(() => {
    const email = sessionStorage.getItem("userEmail");
    if (!email) {
      navigate("/login", { replace: true });
      return;
    }

    const stored = loadSessionProfile();
    if (stored) {
      setProfile(stored);
      setFormState(stored);
    }

    void fetchProfile(email);
  }, [fetchProfile, navigate]);


  const handleEditOpen = () => {
    setFormState(profile);
    setIsEditOpen(true);
  };

  const handleFieldChange = <K extends keyof UserProfile>(key: K, value: UserProfile[K]) => {
    setFormState(prev => ({ ...prev, [key]: value }));
  };

  const handleSkillsChange = (value: string) => {
    const parsed = value
      .split(",")
      .map(skill => skill.trim())
      .filter(Boolean);
    handleFieldChange("skills", parsed);
  };

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSaving(true);
    try {
      const { role: _role, ...profilePayload } = formState;
      const payload = {
        ...profilePayload,
        skills: formState.skills,
      };

      const response = await fetch(`${config.authApiBaseUrl}/profile`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok || data?.ok === false) {
        throw new Error(data?.error || "Không thể cập nhật hồ sơ.");
      }

      const updatedProfile = {
        ...formState,
        skills: formState.skills,
        updatedAt: data?.profile?.updatedAt,
        role: asUserRole(data?.profile?.role ?? profile.role),
      } satisfies UserProfile;
      setProfile(updatedProfile);
      storeSessionProfile(updatedProfile);
      if (updatedProfile.role) {
        sessionStorage.setItem("userRole", updatedProfile.role);
      }
      toast({ title: "Profile updated", description: "Hồ sơ của bạn đã được lưu." });
      setIsEditOpen(false);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Có lỗi xảy ra, vui lòng thử lại.";
      toast({ title: "Failed to update", description: message, variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  const initials = useMemo(() => {
    if (profile.displayName) {
      return profile.displayName
        .split(" ")
        .map(part => part[0]?.toUpperCase())
        .join("")
        .slice(0, 2);
    }
    if (profile.email) {
      return profile.email[0]?.toUpperCase() ?? "U";
    }
    return "U";
  }, [profile.displayName, profile.email]);

  const fallbackDisplayName = useMemo(() => {
    if (!profile.email) return "User";
    const [localPart] = profile.email.split("@");
    if (!localPart) return "User";
    return localPart.charAt(0).toUpperCase() + localPart.slice(1);
  }, [profile.email]);

  const resolvedDisplayName = profile?.displayName || fallbackDisplayName;
  const resolvedBio = profile?.bio || "Builder, Content Creator, Researcher";
  const resolvedSkills = profile?.skills?.length ? profile.skills : ["Builder", "Content Creator", "Researcher"];

  // Mock data - replace with dynamic data if available
  const courses = [
    { title: "Sui Move Bootcamp Graduate", status: "In progress", progress: 65, variant: "progress" },
    { title: "Sui Move Bootcamp Graduate", status: "Review", progress: 85, variant: "review" },
    { title: "Sui Move Bootcamp Graduate", status: "Completed", progress: 100, variant: "completed" },
  ];

  const bounties = [
    { title: "Build Permissionless Fee Routing Anchor Program for Sui", category: "Sui", quests: 3, dueIn: "3d", reward: 500, currency: "SUI" },
    { title: "Build Permissionless Fee Routing Anchor Program for Sui", category: "Sui", quests: 3, dueIn: "3d", reward: 500, currency: "SUI" },
    { title: "Build Permissionless Fee Routing Anchor Program for Sui", category: "Sui", quests: 3, dueIn: "3d", reward: 500, currency: "SUI" },
  ];

  const rewards = [
    { title: "Build Permissionless Fee Routing Anchor Program for Sui", category: "Sui", quests: 3, dueIn: "3d", reward: 500, currency: "SUI" },
    { title: "Build Permissionless Fee Routing Anchor Program for Sui", category: "Sui", quests: 3, dueIn: "3d", reward: 500, currency: "SUI" },
    { title: "Build Permissionless Fee Routing Anchor Program for Sui", category: "Sui", quests: 3, dueIn: "3d", reward: 500, currency: "SUI" },
  ];

  const achievements = [
    { name: "Sui Move Bootcamp Graduate", icon: Award },
    { name: "Hackathon Winner", icon: Trophy },
    { name: "Top Content Creator", icon: FileText },
  ];

  const heroStats = [
    { label: "Quest Completed", value: "12" },
    { label: "Bounties Earned", value: "5 · 320 SUI" },
    { label: "Pending Rewards", value: "8 · 1.2k SUI" },
    { label: "XP Level", value: "Lv.5 · 4,750 MP" },
  ];

  const badgeHighlights = [
    { title: "Sui Move Bootcamp Graduate", issuer: "Verified by Sui Foundation" },
    { title: "Hackathon Winner", issuer: "Verified by Sui Foundation" },
  ];

  const connections = [
    { name: "Wallet", type: "wallet" as const, description: "Add onchain data to your profile." },
    { name: "Github", type: "social" as const, connected: !!profile.github },
    { name: "X", type: "social" as const, connected: !!profile.socials },
    { name: "Discord", type: "social" as const, connected: false },
  ];

  const connectionButtonBase =
    "min-w-[128px] rounded-full border px-6 py-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[#020617]";
  const connectionButtonConnected = "border-white/15 bg-white/10 text-white";
  const connectionButtonIdle = "border-sky-500/40 text-sky-300 hover:bg-sky-500/10";

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#020617] text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 right-10 h-72 w-72 rounded-full bg-blue-500/20 blur-[140px]" />
        <div className="absolute bottom-0 left-0 h-96 w-96 rounded-full bg-indigo-700/20 blur-[200px]" />
      </div>
      <NavBar />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-4 pb-16 pt-10 lg:px-0">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.6fr)_minmax(320px,0.8fr)]">
          {/* Main Content */}
          <div className="space-y-8">
            {/* SearchBar */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <Input
                placeholder="Search"
                className="h-12 rounded-full border-white/10 bg-gradient-to-r from-[#0d1a3d] to-[#060b1c] pl-12 text-white shadow-lg placeholder:text-slate-500 focus-visible:ring-2 focus-visible:ring-[#48d2ff]"
              />
            </div>

            {/* CourseProgress */}
            <Card className="space-y-6 rounded-3xl border-white/5 bg-gradient-to-b from-[#0f224c] via-[#0a1533] to-[#050b19] p-6 shadow-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-widest text-slate-400">Courses</p>
                  <h2 className="text-xl font-semibold text-white">Courses in Progress</h2>
                </div>
                <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white">
                  <ArrowUpRight className="h-5 w-5" />
                </Button>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                {courses.map((course, idx) => (
                  <div key={idx} className="rounded-2xl border border-white/5 bg-white/5 p-4 shadow-inner">
                    <p className="mb-3 text-sm font-medium text-white">{course.title}</p>
                    <Progress value={course.progress} className="mb-3 h-2 bg-white/10" />
                    <Badge
                      variant="secondary"
                      className={
                        course.variant === "progress"
                          ? "w-fit rounded-full bg-[#3b82f6]/20 text-[#60a5fa]"
                          : course.variant === "review"
                            ? "w-fit rounded-full bg-[#facc15]/20 text-[#facc15]"
                            : "w-fit rounded-full bg-[#22c55e]/20 text-[#22c55e]"
                      }
                    >
                      {course.status}
                    </Badge>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-center gap-2">
                {courses.map((_, idx) => (
                  <span
                    key={idx}
                    className={`h-1.5 rounded-full transition ${
                      idx === 0 ? "w-8 bg-white" : "w-3 bg-white/30"
                    }`}
                  />
                ))}
              </div>
            </Card>

            {/* Bounties */}
            <Card className="space-y-5 rounded-3xl border-white/5 bg-[#050b1a]/80 p-6 shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-widest text-slate-500">Bounties</p>
                  <h2 className="text-xl font-semibold text-white">Active Bounties</h2>
                </div>
                <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white">
                  <ArrowUpRight className="h-5 w-5" />
                </Button>
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                {bounties.map((bounty, idx) => (
                  <BountyCard key={`bounty-${idx}`} {...bounty} />
                ))}
              </div>
            </Card>

            {/* Rewards */}
            <Card className="space-y-5 rounded-3xl border-white/5 bg-[#050b1a]/80 p-6 shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-widest text-slate-500">Rewards</p>
                  <h2 className="text-xl font-semibold text-white">Pending Rewards</h2>
                </div>
                <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white">
                  <ArrowUpRight className="h-5 w-5" />
                </Button>
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                {rewards.map((reward, idx) => (
                  <BountyCard key={`reward-${idx}`} {...reward} />
                ))}
              </div>
            </Card>

            {/* Achievements */}
            <Card className="space-y-5 rounded-3xl border-white/5 bg-[#050b1a]/80 p-6 shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-widest text-slate-500">Badges</p>
                  <h2 className="text-xl font-semibold text-white">Achievements & Badges</h2>
                </div>
                <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white">
                  <ArrowUpRight className="h-5 w-5" />
                </Button>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                {achievements.map((achievement, idx) => (
                  <Card
                    key={idx}
                    className="flex flex-col items-center gap-3 rounded-2xl border-white/5 bg-gradient-to-b from-[#0f224c] to-[#050b1a] p-6 text-center text-white shadow-lg"
                  >
                    <div className="rounded-full bg-white/10 p-4">
                      <achievement.icon className="h-8 w-8 text-[#48d2ff]" />
                    </div>
                    <p className="text-sm font-medium">{achievement.name}</p>
                  </Card>
                ))}
              </div>
              <div className="flex items-center justify-center gap-2">
                {achievements.map((_, idx) => (
                  <span
                    key={idx}
                    className={`h-1.5 rounded-full transition ${
                      idx === 0 ? "w-8 bg-white" : "w-3 bg-white/30"
                    }`}
                  />
                ))}
              </div>
            </Card>

            {/* Connected Accounts */}
            <Card className="space-y-4 rounded-3xl border-white/5 bg-[#050b1a]/80 p-6 shadow-xl">
              <h2 className="text-xl font-semibold text-white">Connected Accounts</h2>
              <div className="space-y-3">
                {connections.map(connection => (
                  <div
                    key={connection.name}
                    className="flex items-center justify-between rounded-2xl border border-white/5 bg-white/5 px-4 py-3"
                  >
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-white">{connection.name}</span>
                      {connection.description ? (
                        <span className="text-xs text-white/60">{connection.description}</span>
                      ) : null}
                    </div>
                    {connection.type === "wallet" ? (
                    <div
                      className="
                        [&_.wkit-button]:min-w-0
                        [&_.wkit-button]:w-auto
                        [&_.wkit-button]:h-9
                        [&_.wkit-button]:px-4
                        [&_.wkit-button]:py-0
                        [&_.wkit-button]:rounded-full
                        [&_.wkit-button]:inline-flex
                        [&_.wkit-button]:items-center
                        [&_.wkit-button]:justify-center
                        [&_.wkit-button]:text-xs
                        [&_.wkit-button]:leading-none
                        [&_.wkit-button]:border-white/20
                        [&_.wkit-button]:bg-transparent
                        [&_.wkit-button:hover]:bg-white/10
                      "
                    >
                      <CustomConnectWallet
                        variant="compact"
                        className="!px-0 !py-0" // để class ngoài không thêm padding nữa
                      />
                    </div>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      className={`h-9 rounded-full border-white/20 px-4 py-0 text-xs ${
                        walletConnected ? "bg-white/10 text-white" : "bg-transparent text-[#48d2ff]"
                      }`}
                    >
                      {walletConnected ? "Connected" : "Connect"}
                    </Button>
                  )}
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Profile Sidebar */}
          <div className="space-y-6">
            <div className="flex items-center justify-end gap-2">
              <Button size="icon" variant="ghost" className="h-10 w-10 rounded-full bg-white/5 text-white">
                <Bell className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="ghost" className="h-10 w-10 rounded-full bg-white/5 text-white">
                <Settings className="h-4 w-4" />
              </Button>
            </div>

            <Card className="relative overflow-hidden rounded-3xl border-none bg-gradient-to-br from-[#1a2be8] via-[#4b22d2] to-[#05092c] p-8 text-white shadow-2xl">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.15),_transparent_60%)]" />
              <div className="relative space-y-6">
                <div className="flex flex-col items-center gap-4 text-center">
                  <Avatar className="h-24 w-24 border-4 border-white/40 bg-white/10">
                    <AvatarImage alt={resolvedDisplayName} src="" />
                    <AvatarFallback className="text-3xl text-white">{initials}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm uppercase tracking-[0.3em] text-white/60">Jason Liu</p>
                    <h2 className="text-2xl font-bold">{resolvedDisplayName}</h2>
                    <p className="text-sm text-white/70">{resolvedBio}</p>
                  </div>
                  <div className="flex flex-wrap justify-center gap-2">
                    {resolvedSkills.map(skill => (
                      <Badge key={skill} className="rounded-full bg-white/10 text-xs text-white">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="icon" variant="ghost" className="h-10 w-10 rounded-full bg-white/10 text-white hover:bg-white/20">
                      <Github className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-10 w-10 rounded-full bg-white/10 text-white hover:bg-white/20">
                      <Twitter className="h-4 w-4" />
                    </Button>
                    <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="rounded-full border-white/30 bg-white/10 text-white hover:bg-white/20"
                          onClick={handleEditOpen}
                        >
                          <PencilLine className="mr-2 h-4 w-4" />
                          Edit Profile
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl border-white/10 bg-slate-900 text-white">
                        <DialogHeader>
                          <DialogTitle>Update profile</DialogTitle>
                        </DialogHeader>
                        <form className="space-y-4" onSubmit={handleSave}>
                          <div className="grid gap-4 sm:grid-cols-2">
                            <div>
                              <label className="text-xs uppercase tracking-wide text-muted-foreground">Display name</label>
                              <Input
                                value={formState.displayName}
                                onChange={event => handleFieldChange("displayName", event.target.value)}
                                placeholder="Your display name"
                                className="bg-black/30 border-white/10 text-white"
                              />
                            </div>
                            <div>
                              <label className="text-xs uppercase tracking-wide text-muted-foreground">Username</label>
                              <Input
                                value={formState.username}
                                onChange={event => handleFieldChange("username", event.target.value)}
                                placeholder="username"
                                className="bg-black/30 border-white/10 text-white"
                              />
                            </div>
                            <div>
                              <label className="text-xs uppercase tracking-wide text-muted-foreground">First name</label>
                              <Input
                                value={formState.firstName}
                                onChange={event => handleFieldChange("firstName", event.target.value)}
                                placeholder="First name"
                                className="bg-black/30 border-white/10 text-white"
                              />
                            </div>
                            <div>
                              <label className="text-xs uppercase tracking-wide text-muted-foreground">Last name</label>
                              <Input
                                value={formState.lastName}
                                onChange={event => handleFieldChange("lastName", event.target.value)}
                                placeholder="Last name"
                                className="bg-black/30 border-white/10 text-white"
                              />
                            </div>
                            <div>
                              <label className="text-xs uppercase tracking-wide text-muted-foreground">Location</label>
                              <Input
                                value={formState.location}
                                onChange={event => handleFieldChange("location", event.target.value)}
                                placeholder="Where you're based"
                                className="bg-black/30 border-white/10 text-white"
                              />
                            </div>
                            <div>
                              <label className="text-xs uppercase tracking-wide text-muted-foreground">Social link</label>
                              <Input
                                value={formState.socials}
                                onChange={event => handleFieldChange("socials", event.target.value)}
                                placeholder="https://twitter.com/you"
                                className="bg-black/30 border-white/10 text-white"
                              />
                            </div>
                            <div>
                              <label className="text-xs uppercase tracking-wide text-muted-foreground">GitHub</label>
                              <Input
                                value={formState.github}
                                onChange={event => handleFieldChange("github", event.target.value)}
                                placeholder="your-github"
                                className="bg-black/30 border-white/10 text-white"
                              />
                            </div>
                            <div>
                              <label className="text-xs uppercase tracking-wide text-muted-foreground">Skills</label>
                              <Input
                                value={formState.skills.join(", ")}
                                onChange={event => handleSkillsChange(event.target.value)}
                                placeholder="move, react, content"
                                className="bg-black/30 border-white/10 text-white"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="text-xs uppercase tracking-wide text-muted-foreground">Bio</label>
                            <Textarea
                              rows={3}
                              value={formState.bio}
                              onChange={event => handleFieldChange("bio", event.target.value)}
                              placeholder="Share your builder journey"
                              className="bg-black/30 border-white/10 text-white"
                            />
                          </div>
                          <DialogFooter>
                            <Button type="button" variant="ghost" onClick={() => setIsEditOpen(false)}>
                              Cancel
                            </Button>
                            <Button type="submit" disabled={isSaving} className="bg-blue-500 hover:bg-blue-500/80">
                              {isSaving ? "Saving..." : "Save changes"}
                            </Button>
                          </DialogFooter>
                        </form>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>

                <div className="rounded-3xl border border-white/10 bg-white/5 p-4 text-left text-white">
                  <h3 className="text-sm font-semibold text-white/80">Bio & Summary</h3>
                  <p className="mt-2 text-sm text-white/70">{profile.bio || resolvedBio}</p>
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    {heroStats.slice(0, 2).map(stat => (
                      <div key={stat.label} className="rounded-2xl bg-black/30 p-3">
                        <p className="text-[11px] uppercase tracking-wider text-white/60">{stat.label}</p>
                        <p className="text-lg font-semibold">{stat.value}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  {heroStats.slice(2).map(stat => (
                    <div key={stat.label} className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3">
                      <p className="text-xs uppercase tracking-widest text-white/60">{stat.label}</p>
                      <p className="text-lg font-semibold text-white">{stat.value}</p>
                    </div>
                  ))}
                </div>

                <div className="space-y-3 rounded-3xl border border-white/15 bg-white/5 p-5">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold">Badges / NFTs</h3>
                    <span className="text-xs text-white/60">Verified by Sui Foundation</span>
                  </div>
                  {badgeHighlights.map((badge, idx) => (
                    <div
                      key={badge.title}
                      className="flex items-center justify-between rounded-2xl bg-black/30 px-4 py-3"
                    >
                      <div>
                        <p className="text-sm font-semibold text-white">{badge.title}</p>
                        <p className="text-xs text-white/60">{badge.issuer}</p>
                      </div>
                      <div className="flex items-center gap-1 text-sky-200">
                        <span className="text-xs">Verified</span>
                        <div className="h-2 w-2 rounded-full bg-sky-300" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            <Card className="rounded-3xl border-white/10 bg-white/5 p-5 text-white">
              <div className="space-y-4">
                <Button variant="ghost" className="w-full justify-start gap-3 text-white hover:bg-white/10">
                  <HelpCircle className="h-4 w-4" />
                  Help & information
                </Button>
                <Button variant="ghost" className="w-full justify-start gap-3 text-white hover:bg-white/10">
                  <LogOut className="h-4 w-4" />
                  Log out
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
