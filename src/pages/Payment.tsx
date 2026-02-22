import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Wallet, ArrowRight } from "lucide-react";

const Payment = () => {
  const { tokenBalance } = useAuth();
  const navigate = useNavigate();
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const raw = sessionStorage.getItem("topup_data");
    if (!raw) {
      navigate("/topup");
      return;
    }
    const data = JSON.parse(raw);
    setTotal(data.total);
  }, [navigate]);

  const difference = 212;

  return (
    <div className="min-h-screen gradient-surface flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-card border border-border mb-4">
            <Wallet className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-foreground">Software Recharge</h2>
          <p className="text-muted-foreground mt-1">Recharge your token balance to proceed</p>
        </div>

        <div className="glass-card p-6 space-y-5 mb-6">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Needed to be Recharged</span>
            <span className="text-xl font-bold text-warning font-mono">${difference.toFixed(2)}</span>
          </div>

          <div className="h-px bg-border" />

          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Available Balance</span>
            <span className="text-xl font-bold text-foreground font-mono">${tokenBalance.toFixed(2)}</span>
          </div>

          <div className="h-px bg-border" />

          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Total Amount to be Loaded</span>
            <span className="text-xl font-bold text-foreground font-mono">${total.toFixed(2)}</span>
          </div>
        </div>

        <Button
          className="w-full gradient-primary text-primary-foreground font-semibold h-12 hover:opacity-90 transition-opacity"
          onClick={() => navigate("/crypto-payment")}
        >
          Recharge Now <ArrowRight className="w-4 h-4 ml-2" />
        </Button>

        <Button
          variant="outline"
          className="w-full border-border text-muted-foreground hover:text-foreground h-11 mt-3"
          onClick={() => navigate("/topup")}
        >
          Back to Top-Up
        </Button>
      </div>
    </div>
  );
};

export default Payment;
