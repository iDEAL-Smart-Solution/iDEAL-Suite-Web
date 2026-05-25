import React, { useEffect, useState } from "react";
import Input from "../ui/Input";
import Select from "../ui/Select";
import Button from "../ui/Button";
import api from "../../services/api";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onCreated?: (message?: string) => void;
};

const CreateAdminModal: React.FC<Props> = ({ isOpen, onClose, onCreated }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [schoolId, setSchoolId] = useState("");
  const [schools, setSchools] = useState<Array<{ id: string; name: string; state?: string }>>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    void (async () => {
      try {
        const res = await api.get("/School/all");
        setSchools(res.data.data ?? res.data ?? []);
      } catch {
        setSchools([]);
      }
    })();
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!firstName || !lastName || !email || !schoolId) {
      setError("Please fill in required fields.");
      return;
    }

    try {
      setLoading(true);
      const res = await api.post("/Admin/create", {
        firstName,
        lastName,
        email,
        phoneNumber,
        schoolId,
      });
      onCreated?.(res.data?.message ?? "Admin created");
      onClose();
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to create admin");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="max-w-lg w-full rounded-xl bg-surface-800 border border-surface-700 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Create School Admin</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Input label="First name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
            <Input label="Last name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <Input label="Phone" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
          </div>
          <Select
            label="School"
            value={schoolId}
            onChange={(e) => setSchoolId(e.target.value)}
            options={schools.map((s) => ({ label: `${s.name} (${s.state ?? 'N/A'})`, value: s.id }))}
            placeholder="Select a school"
          />

          {error && <div className="text-sm text-red-400">{error}</div>}

          <div className="flex justify-end gap-2 mt-2">
            <Button type="button" variant="secondary" onClick={onClose} disabled={loading}>Cancel</Button>
            <Button type="submit" disabled={loading}>{loading ? 'Creating...' : 'Create'}</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateAdminModal;
