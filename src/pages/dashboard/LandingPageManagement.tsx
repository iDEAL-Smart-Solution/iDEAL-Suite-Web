import { useEffect, useState, useCallback } from "react";
import {
  Plus,
  Trash2,
  Globe,
  Palette,
  LayoutDashboard,
  Info,
  Phone,
  Star,
  BarChart2,
  Zap,
  BookOpen,
  Save,
  AlertTriangle,
} from "lucide-react";
import PageHeader from "../../components/layout/PageHeader";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import BrandLoader from "../../components/ui/BrandLoader";
import { useLandingPageStore } from "../../stores/useLandingPageStore";
import type {
  LandingPageRequest,
  LandingPageFeatureRequest,
  LandingPageProgramRequest,
  LandingPageStatisticRequest,
  LandingPageCoreValueRequest,
  LandingPageContactRequest,
} from "../../types/landingPage";

// ── helpers ───────────────────────────────────────────────────────────────────

const emptyFeature    = (): LandingPageFeatureRequest   => ({ title: "", description: "", icon: "", displayOrder: 0 });
const emptyProgram    = (): LandingPageProgramRequest   => ({ name:  "", description: "", icon: "", displayOrder: 0 });
const emptyStatistic  = (): LandingPageStatisticRequest => ({ value: "", label: "", displayOrder: 0 });
const emptyCoreValue  = (): LandingPageCoreValueRequest => ({ value: "", displayOrder: 0 });

const defaultForm = (): LandingPageRequest => ({
  logoUrl: "",
  domainName: "",
  themeColor: "#00AEEF",
  secondaryColor: "#1A1A2E",
  accentColor: "#FF6B35",
  backgroundColor: "#FFFFFF",
  textColor: "#333333",
  tagline: "",
  heroTitle: "",
  heroDescription: "",
  about: "",
  mission: "",
  vision: "",
  portalLink: "",
  footerCopyright: "",
  footerCompanyName: "",
  features: [emptyFeature()],
  programs: [emptyProgram()],
  statistics: [emptyStatistic()],
  coreValues: [emptyCoreValue()],
  contact: { email: "", phone: "", address: "", portalUrl: "", description: "" },
});

// ── sub-components ────────────────────────────────────────────────────────────

const SectionCard = ({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) => (
  <div className="bg-surface-800 rounded-xl p-4 md:p-6 space-y-4">
    <div className="flex items-center gap-2 mb-2">
      <span className="text-brand-400">{icon}</span>
      <h2 className="text-base md:text-lg font-semibold text-white">{title}</h2>
    </div>
    {children}
  </div>
);

const Textarea = ({
  label,
  value,
  onChange,
  placeholder,
  rows = 3,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
}) => (
  <div className="space-y-1.5">
    <label className="block text-sm font-medium text-slate-300">{label}</label>
    <textarea
      rows={rows}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full px-3 py-2 rounded-lg bg-surface-800 border border-surface-700 text-white placeholder:text-slate-500 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 resize-none transition-colors duration-200"
    />
  </div>
);

const ColorInput = ({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) => (
  <div className="space-y-1.5">
    <label className="block text-sm font-medium text-slate-300">{label}</label>
    <div className="flex items-center gap-2">
      <input
        type="color"
        value={value || "#000000"}
        onChange={(e) => onChange(e.target.value)}
        className="h-10 w-12 rounded-lg border border-surface-700 bg-surface-800 cursor-pointer p-1"
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="#RRGGBB"
        className="flex-1 h-10 px-3 rounded-lg bg-surface-800 border border-surface-700 text-white placeholder:text-slate-500 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-colors duration-200"
      />
    </div>
  </div>
);

// ── main page ─────────────────────────────────────────────────────────────────

const LandingPageManagement = () => {
  const {
    landingPage,
    isLoading,
    isSaving,
    isDeleting,
    error,
    successMessage,
    fetchLandingPage,
    createLandingPage,
    updateLandingPage,
    deleteLandingPage,
    clearMessages,
  } = useLandingPageStore();

  const [form, setForm] = useState<LandingPageRequest>(defaultForm());
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const isEditMode = !!landingPage;

  // Hydrate form from fetched data
  useEffect(() => {
    fetchLandingPage();
  }, [fetchLandingPage]);

  useEffect(() => {
    if (landingPage) {
      setForm({
        logoUrl:          landingPage.logoUrl          ?? "",
        domainName:       landingPage.domainName       ?? "",
        themeColor:       landingPage.themeColor       ?? "#00AEEF",
        secondaryColor:   landingPage.secondaryColor   ?? "#1A1A2E",
        accentColor:      landingPage.accentColor      ?? "#FF6B35",
        backgroundColor:  landingPage.backgroundColor  ?? "#FFFFFF",
        textColor:        landingPage.textColor        ?? "#333333",
        tagline:          landingPage.tagline          ?? "",
        heroTitle:        landingPage.heroTitle        ?? "",
        heroDescription:  landingPage.heroDescription  ?? "",
        about:            landingPage.about            ?? "",
        mission:          landingPage.mission          ?? "",
        vision:           landingPage.vision           ?? "",
        portalLink:       landingPage.portalLink       ?? "",
        footerCopyright:  landingPage.footerCopyright  ?? "",
        footerCompanyName: landingPage.footerCompanyName ?? "",
        features:   landingPage.features.length   ? landingPage.features.map(f   => ({ title: f.title, description: f.description, icon: f.icon ?? "", displayOrder: f.displayOrder }))  : [emptyFeature()],
        programs:   landingPage.programs.length   ? landingPage.programs.map(p   => ({ name: p.name,   description: p.description, icon: p.icon ?? "", displayOrder: p.displayOrder }))  : [emptyProgram()],
        statistics: landingPage.statistics.length ? landingPage.statistics.map(s => ({ value: s.value, label: s.label, displayOrder: s.displayOrder })) : [emptyStatistic()],
        coreValues: landingPage.coreValues.length ? landingPage.coreValues.map(c => ({ value: c.value, displayOrder: c.displayOrder })) : [emptyCoreValue()],
        contact: landingPage.contact
          ? { email: landingPage.contact.email ?? "", phone: landingPage.contact.phone ?? "", address: landingPage.contact.address ?? "", portalUrl: landingPage.contact.portalUrl ?? "", description: landingPage.contact.description ?? "" }
          : { email: "", phone: "", address: "", portalUrl: "", description: "" },
      });
    }
  }, [landingPage]);

  // Auto-dismiss messages
  useEffect(() => {
    if (successMessage || error) {
      const t = setTimeout(clearMessages, 4000);
      return () => clearTimeout(t);
    }
  }, [successMessage, error, clearMessages]);

  // ── field helpers ──────────────────────────────────────────────────────────

  const setField = useCallback(<K extends keyof LandingPageRequest>(key: K, val: LandingPageRequest[K]) => {
    setForm((f) => ({ ...f, [key]: val }));
  }, []);

  const setContact = useCallback((key: keyof LandingPageContactRequest, val: string) => {
    setForm((f) => ({ ...f, contact: { ...f.contact, [key]: val } }));
  }, []);

  // features
  const addFeature    = () => setField("features",   [...form.features,   emptyFeature()]);
  const removeFeature = (i: number) => setField("features", form.features.filter((_, idx) => idx !== i));
  const setFeature    = (i: number, key: keyof LandingPageFeatureRequest, val: string | number) =>
    setField("features", form.features.map((f, idx) => idx === i ? { ...f, [key]: val } : f));

  // programs
  const addProgram    = () => setField("programs",   [...form.programs,   emptyProgram()]);
  const removeProgram = (i: number) => setField("programs", form.programs.filter((_, idx) => idx !== i));
  const setProgram    = (i: number, key: keyof LandingPageProgramRequest, val: string | number) =>
    setField("programs", form.programs.map((p, idx) => idx === i ? { ...p, [key]: val } : p));

  // statistics
  const addStatistic    = () => setField("statistics", [...form.statistics, emptyStatistic()]);
  const removeStatistic = (i: number) => setField("statistics", form.statistics.filter((_, idx) => idx !== i));
  const setStatistic    = (i: number, key: keyof LandingPageStatisticRequest, val: string | number) =>
    setField("statistics", form.statistics.map((s, idx) => idx === i ? { ...s, [key]: val } : s));

  // core values
  const addCoreValue    = () => setField("coreValues", [...form.coreValues, emptyCoreValue()]);
  const removeCoreValue = (i: number) => setField("coreValues", form.coreValues.filter((_, idx) => idx !== i));
  const setCoreValue    = (i: number, val: string) =>
    setField("coreValues", form.coreValues.map((c, idx) => idx === i ? { ...c, value: val } : c));

  // ── submit ─────────────────────────────────────────────────────────────────

  const validate = (): boolean => {
    if (!form.logoUrl.trim())         { setValidationError("Logo URL is required."); return false; }
    if (!form.domainName.trim())      { setValidationError("Domain name is required."); return false; }
    if (!form.themeColor.trim())      { setValidationError("Theme colour is required."); return false; }
    if (!form.tagline.trim())         { setValidationError("Tagline is required."); return false; }
    if (!form.heroTitle.trim())       { setValidationError("Hero title is required."); return false; }
    if (!form.heroDescription.trim()) { setValidationError("Hero description is required."); return false; }
    if (!form.about.trim())           { setValidationError("About section is required."); return false; }
    setValidationError(null);
    return true;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    try {
      if (isEditMode) {
        await updateLandingPage(form);
      } else {
        await createLandingPage(form);
      }
    } catch {
      // error already set in store
    }
  };

  const handleDelete = async () => {
    setShowDeleteConfirm(false);
    try {
      await deleteLandingPage();
      setForm(defaultForm());
    } catch {
      // error already set in store
    }
  };

  // ── render ─────────────────────────────────────────────────────────────────

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <BrandLoader size="md" />
        <p className="text-slate-400 text-sm">Loading landing page...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Landing Page"
        subtitle={isEditMode ? "Edit your school's public landing page" : "Set up your school's public landing page"}
        action={
          isEditMode ? (
            <Button
              variant="danger"
              size="sm"
              onClick={() => setShowDeleteConfirm(true)}
              disabled={isDeleting}
            >
              <Trash2 size={15} />
              {isDeleting ? "Deleting..." : "Delete Landing Page"}
            </Button>
          ) : undefined
        }
      />

      {/* Alerts */}
      {(error || validationError) && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-red-400 flex justify-between items-start gap-2">
          <span>{error || validationError}</span>
          <button onClick={() => { clearMessages(); setValidationError(null); }} className="text-xl font-bold hover:opacity-70 shrink-0">×</button>
        </div>
      )}
      {successMessage && (
        <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 text-green-400 flex justify-between items-center gap-2">
          <span>{successMessage}</span>
          <button onClick={clearMessages} className="text-xl font-bold hover:opacity-70 shrink-0">×</button>
        </div>
      )}

      {/* ── Branding ─────────────────────────────────────────────────────── */}
      <SectionCard icon={<Palette size={18} />} title="Branding">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <Input
              label="Logo URL"
              value={form.logoUrl}
              onChange={(e) => setField("logoUrl", e.target.value)}
              placeholder="https://example.com/logo.png"
            />
          </div>
          <div className="md:col-span-2">
            <Input
              label="Domain Name"
              value={form.domainName}
              onChange={(e) => setField("domainName", e.target.value)}
              placeholder="myschool"
            />
            <p className="mt-1.5 text-xs text-slate-500">
              This is the unique identifier used in the public URL, e.g.{" "}
              <span className="text-slate-400 font-mono">
                /api/LandingPage/public/<strong>{form.domainName || "myschool"}</strong>
              </span>. Use a short, lowercase, hyphen-separated value — no spaces.
            </p>
          </div>
          <ColorInput label="Theme Colour"      value={form.themeColor}      onChange={(v) => setField("themeColor", v)} />
          <ColorInput label="Secondary Colour"  value={form.secondaryColor}  onChange={(v) => setField("secondaryColor", v)} />
          <ColorInput label="Accent Colour"     value={form.accentColor}     onChange={(v) => setField("accentColor", v)} />
          <ColorInput label="Background Colour" value={form.backgroundColor} onChange={(v) => setField("backgroundColor", v)} />
          <ColorInput label="Text Colour"       value={form.textColor}       onChange={(v) => setField("textColor", v)} />
        </div>
      </SectionCard>

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <SectionCard icon={<LayoutDashboard size={18} />} title="Hero Section">
        <div className="grid grid-cols-1 gap-4">
          <Input
            label="Tagline"
            value={form.tagline}
            onChange={(e) => setField("tagline", e.target.value)}
            placeholder="Empowering Education, One School at a Time"
          />
          <Input
            label="Hero Title"
            value={form.heroTitle}
            onChange={(e) => setField("heroTitle", e.target.value)}
            placeholder="Welcome to Our School"
          />
          <Textarea
            label="Hero Description"
            value={form.heroDescription}
            onChange={(v) => setField("heroDescription", v)}
            placeholder="A brief compelling description shown in the hero section"
            rows={3}
          />
        </div>
      </SectionCard>

      {/* ── About / Mission / Vision ──────────────────────────────────────── */}
      <SectionCard icon={<Info size={18} />} title="About, Mission & Vision">
        <div className="grid grid-cols-1 gap-4">
          <Textarea
            label="About"
            value={form.about}
            onChange={(v) => setField("about", v)}
            placeholder="Tell visitors about your school"
            rows={4}
          />
          <Textarea
            label="Mission (optional)"
            value={form.mission ?? ""}
            onChange={(v) => setField("mission", v)}
            placeholder="Our mission is..."
            rows={3}
          />
          <Textarea
            label="Vision (optional)"
            value={form.vision ?? ""}
            onChange={(v) => setField("vision", v)}
            placeholder="Our vision is..."
            rows={3}
          />
        </div>
      </SectionCard>

      {/* ── Contact ───────────────────────────────────────────────────────── */}
      <SectionCard icon={<Phone size={18} />} title="Contact Information">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Email"       value={form.contact?.email ?? ""}       onChange={(e) => setContact("email",       e.target.value)} placeholder="contact@school.edu" />
          <Input label="Phone"       value={form.contact?.phone ?? ""}       onChange={(e) => setContact("phone",       e.target.value)} placeholder="+234 800 000 0000" />
          <Input label="Portal URL"  value={form.contact?.portalUrl ?? ""}   onChange={(e) => setContact("portalUrl",   e.target.value)} placeholder="https://portal.school.edu" />
          <div className="md:col-span-2">
            <Input label="Address"   value={form.contact?.address ?? ""}     onChange={(e) => setContact("address",     e.target.value)} placeholder="123 School Street, Lagos" />
          </div>
          <div className="md:col-span-2">
            <Textarea label="Contact Description (optional)" value={form.contact?.description ?? ""} onChange={(v) => setContact("description", v)} placeholder="Reach out to us..." rows={2} />
          </div>
        </div>
      </SectionCard>

      {/* ── Core Values ───────────────────────────────────────────────────── */}
      <SectionCard icon={<Star size={18} />} title="Core Values">
        <div className="space-y-3">
          {form.coreValues.map((cv, i) => (
            <div key={i} className="flex items-center gap-3">
              <Input
                className="flex-1"
                value={cv.value}
                onChange={(e) => setCoreValue(i, e.target.value)}
                placeholder={`Core value ${i + 1}`}
              />
              <button
                onClick={() => removeCoreValue(i)}
                disabled={form.coreValues.length === 1}
                className="text-slate-500 hover:text-red-400 transition-colors disabled:opacity-30"
                aria-label="Remove core value"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
          <Button variant="secondary" size="sm" onClick={addCoreValue}>
            <Plus size={14} /> Add Core Value
          </Button>
        </div>
      </SectionCard>

      {/* ── Statistics ────────────────────────────────────────────────────── */}
      <SectionCard icon={<BarChart2 size={18} />} title="Statistics">
        <div className="space-y-3">
          {form.statistics.map((s, i) => (
            <div key={i} className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_auto] gap-3 items-end">
              <Input label={i === 0 ? "Value" : undefined} value={s.value} onChange={(e) => setStatistic(i, "value", e.target.value)} placeholder="500+" />
              <Input label={i === 0 ? "Label" : undefined} value={s.label} onChange={(e) => setStatistic(i, "label", e.target.value)} placeholder="Students Enrolled" />
              <button
                onClick={() => removeStatistic(i)}
                disabled={form.statistics.length === 1}
                className="text-slate-500 hover:text-red-400 transition-colors disabled:opacity-30 mb-0.5"
                aria-label="Remove statistic"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
          <Button variant="secondary" size="sm" onClick={addStatistic}>
            <Plus size={14} /> Add Statistic
          </Button>
        </div>
      </SectionCard>

      {/* ── Features ──────────────────────────────────────────────────────── */}
      <SectionCard icon={<Zap size={18} />} title="Features">
        <div className="space-y-4">
          {form.features.map((f, i) => (
            <div key={i} className="bg-surface-900 rounded-lg p-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-slate-400">Feature {i + 1}</span>
                <button
                  onClick={() => removeFeature(i)}
                  disabled={form.features.length === 1}
                  className="text-slate-500 hover:text-red-400 transition-colors disabled:opacity-30"
                  aria-label="Remove feature"
                >
                  <Trash2 size={15} />
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input label="Title"       value={f.title}       onChange={(e) => setFeature(i, "title",       e.target.value)} placeholder="Smart Attendance" />
                <Input label="Icon"        value={f.icon ?? ""}  onChange={(e) => setFeature(i, "icon",        e.target.value)} placeholder="e.g. clipboard-check" />
              </div>
              <Textarea label="Description" value={f.description} onChange={(v) => setFeature(i, "description", v)} placeholder="Describe this feature" rows={2} />
            </div>
          ))}
          <Button variant="secondary" size="sm" onClick={addFeature}>
            <Plus size={14} /> Add Feature
          </Button>
        </div>
      </SectionCard>

      {/* ── Programs ──────────────────────────────────────────────────────── */}
      <SectionCard icon={<BookOpen size={18} />} title="Programs">
        <div className="space-y-4">
          {form.programs.map((p, i) => (
            <div key={i} className="bg-surface-900 rounded-lg p-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-slate-400">Program {i + 1}</span>
                <button
                  onClick={() => removeProgram(i)}
                  disabled={form.programs.length === 1}
                  className="text-slate-500 hover:text-red-400 transition-colors disabled:opacity-30"
                  aria-label="Remove program"
                >
                  <Trash2 size={15} />
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input label="Name"  value={p.name}       onChange={(e) => setProgram(i, "name",        e.target.value)} placeholder="Science Programme" />
                <Input label="Icon"  value={p.icon ?? ""} onChange={(e) => setProgram(i, "icon",        e.target.value)} placeholder="e.g. flask" />
              </div>
              <Textarea label="Description" value={p.description} onChange={(v) => setProgram(i, "description", v)} placeholder="Describe this program" rows={2} />
            </div>
          ))}
          <Button variant="secondary" size="sm" onClick={addProgram}>
            <Plus size={14} /> Add Program
          </Button>
        </div>
      </SectionCard>

      {/* ── Portal & Footer ───────────────────────────────────────────────── */}
      <SectionCard icon={<Globe size={18} />} title="Portal & Footer">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <Input
              label="Portal Link (optional)"
              value={form.portalLink ?? ""}
              onChange={(e) => setField("portalLink", e.target.value)}
              placeholder="https://portal.yourschool.edu"
            />
          </div>
          <Input
            label="Footer Company Name (optional)"
            value={form.footerCompanyName ?? ""}
            onChange={(e) => setField("footerCompanyName", e.target.value)}
            placeholder="Your School Ltd."
          />
          <Input
            label="Footer Copyright (optional)"
            value={form.footerCopyright ?? ""}
            onChange={(e) => setField("footerCopyright", e.target.value)}
            placeholder={`© ${new Date().getFullYear()} Your School. All rights reserved.`}
          />
        </div>
      </SectionCard>

      {/* ── Save button ────────────────────────────────────────────────────── */}
      <div className="flex justify-end pb-6">
        <Button
          variant="primary"
          size="lg"
          onClick={handleSubmit}
          disabled={isSaving}
          className="w-full sm:w-auto min-w-[180px]"
        >
          <Save size={16} />
          {isSaving
            ? isEditMode ? "Saving..." : "Creating..."
            : isEditMode ? "Save Changes" : "Create Landing Page"}
        </Button>
      </div>

      {/* ── Delete confirmation modal ─────────────────────────────────────── */}
      {showDeleteConfirm && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={() => setShowDeleteConfirm(false)}
        >
          <div
            className="bg-surface-800 rounded-xl shadow-lg w-full max-w-sm mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-4 md:p-6 border-b border-surface-700">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <AlertTriangle size={18} className="text-red-400" />
                Delete Landing Page
              </h2>
              <button
                className="text-slate-400 hover:text-slate-50"
                onClick={() => setShowDeleteConfirm(false)}
              >
                ✕
              </button>
            </div>
            <div className="p-4 md:p-6 space-y-3">
              <p className="text-slate-200">Are you sure you want to delete your landing page?</p>
              <p className="text-slate-400 text-sm">
                This will permanently remove all landing page content including features, programs,
                statistics, core values, and contact information.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 p-4 md:p-6 border-t border-surface-700">
              <Button
                variant="secondary"
                className="flex-1"
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                className="flex-1"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Yes, Delete"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingPageManagement;
