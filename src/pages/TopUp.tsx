import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, Globe, Link as LinkIcon, DollarSign, LogOut } from "lucide-react";

interface LinkEntry {
  id: string;
  url: string;
  amount: string;
}

const COUNTRIES = [
  "United States", "United Kingdom", "Germany", "France", "Canada",
  "Australia", "India", "Brazil", "Japan", "Nigeria",
  "South Africa", "China", "Russia", "Mexico", "Italy", "Romania",
];

const MAX_AMOUNT = 250;

const TopUp = () => {
  const [country, setCountry] = useState("");
  
  const [links, setLinks] = useState<LinkEntry[]>([
    { id: crypto.randomUUID(), url: "", amount: "" },
  ]);
  const { logout, userEmail } = useAuth();
  const navigate = useNavigate();

  const addLink = () => {
    setLinks((prev) => [...prev, { id: crypto.randomUUID(), url: "", amount: "" }]);
  };

  const removeLink = (id: string) => {
    if (links.length <= 1) return;
    setLinks((prev) => prev.filter((l) => l.id !== id));
  };

  const updateLink = (id: string, field: "url" | "amount", value: string) => {
    setLinks((prev) =>
      prev.map((l) => (l.id === id ? { ...l, [field]: value } : l))
    );
  };

  const total = useMemo(
    () => links.reduce((sum, l) => sum + (parseFloat(l.amount) || 0), 0),
    [links]
  );

  const errors = useMemo(() => {
    const errs: string[] = [];
    if (!country) errs.push("Select a country");
    links.forEach((l, i) => {
      if (!l.url.trim()) errs.push(`Link ${i + 1} is empty`);
      const amt = parseFloat(l.amount);
      if (!l.amount || isNaN(amt) || amt <= 0) errs.push(`Link ${i + 1} has no valid amount`);
      else if (amt > MAX_AMOUNT) errs.push(`Link ${i + 1} exceeds $${MAX_AMOUNT}`);
    });
    return errs;
  }, [country, links]);

  const handleSubmit = () => {
    if (errors.length > 0) return;
    sessionStorage.setItem(
      "topup_data",
      JSON.stringify({ country, links, total })
    );
    navigate("/payment");
  };

  return (
    <div className="min-h-screen gradient-surface">
      {/* Header */}
      <header className="border-b border-border bg-card/60 backdrop-blur-lg sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-foreground">RevTopUp</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground hidden sm:block">{userEmail}</span>
            <Button variant="ghost" size="sm" onClick={() => { logout(); navigate("/"); }} className="text-muted-foreground hover:text-foreground">
              <LogOut className="w-4 h-4 mr-1" /> Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        {/* Balance Card */}
        <div className="glass-card p-6 mb-6 glow-border flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Card Balance</p>
            <p className="text-3xl font-bold text-foreground font-mono">€4,312.00</p>
          </div>
          <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center">
            <DollarSign className="w-6 h-6 text-primary-foreground" />
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-foreground">New Top-Up</h2>
          <p className="text-muted-foreground mt-1">Add your links and specify amounts</p>
        </div>

        {/* Country */}
        <div className="glass-card p-6 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Globe className="w-4 h-4 text-primary" />
            <Label className="text-foreground font-medium">Country</Label>
          </div>
          <Select value={country} onValueChange={setCountry}>
            <SelectTrigger className="bg-input border-border text-foreground">
              <SelectValue placeholder="Select country" />
            </SelectTrigger>
            <SelectContent>
              {COUNTRIES.map((c) => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Links */}
        <div className="glass-card p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <LinkIcon className="w-4 h-4 text-primary" />
              <Label className="text-foreground font-medium">Links</Label>
            </div>
            <Button variant="outline" size="sm" onClick={addLink} className="border-primary/30 text-primary hover:bg-primary/10">
              <Plus className="w-4 h-4 mr-1" /> Add Link
            </Button>
          </div>

          <div className="space-y-4">
            {links.map((link, index) => (
              <div key={link.id} className="flex gap-3 items-start">
                <div className="flex-1 space-y-2">
                  <Input
                    placeholder={`Link ${index + 1} URL`}
                    value={link.url}
                    onChange={(e) => updateLink(link.id, "url", e.target.value)}
                    className="bg-input border-border text-foreground placeholder:text-muted-foreground"
                  />
                </div>
                <div className="w-32">
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      type="number"
                      placeholder="0"
                      min="0"
                      max={MAX_AMOUNT}
                      value={link.amount}
                      onChange={(e) => updateLink(link.id, "amount", e.target.value)}
                      className="bg-input border-border text-foreground pl-8"
                    />
                  </div>
                  {parseFloat(link.amount) > MAX_AMOUNT && (
                    <p className="text-xs text-destructive mt-1">Max ${MAX_AMOUNT}</p>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeLink(link.id)}
                  disabled={links.length <= 1}
                  className="text-muted-foreground hover:text-destructive shrink-0 mt-0.5"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Total & Submit */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-6">
            <span className="text-muted-foreground font-medium">Total Amount</span>
            <span className="text-3xl font-bold text-foreground font-mono">€{total.toFixed(2)}</span>
          </div>

          {errors.length > 0 && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 mb-4">
              <ul className="text-sm text-destructive space-y-1">
                {errors.map((err, i) => (
                  <li key={i}>• {err}</li>
                ))}
              </ul>
            </div>
          )}

          <Button
            onClick={handleSubmit}
            disabled={errors.length > 0}
            className="w-full gradient-primary text-primary-foreground font-semibold h-12 hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            Proceed to Payment
          </Button>
        </div>
      </main>
    </div>
  );
};

export default TopUp;
