import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Wallet, ArrowRight, AlertTriangle, CheckCircle } from "lucide-react";

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

  const difference = total - tokenBalance;
  const canPayFull = tokenBalance >= total;

  return (
    <div className="min-h-screen gradient-surface flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-card border border-border mb-4">
            <Wallet className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-foreground">Payment Summary</h2>
          <p className="text-muted-foreground mt-1">Review your balance and payment</p>
        </div>

        <div className="glass-card p-6 space-y-5 mb-6">
          {/* Available Balance */}
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Available Balance</span>
            <span className="text-xl font-bold text-foreground font-mono">${tokenBalance.toFixed(2)}</span>
          </div>

          <div className="h-px bg-border" />

          {/* Total Required */}
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Total Required</span>
            <span className="text-xl font-bold text-foreground font-mono">${total.toFixed(2)}</span>
          </div>

          <div className="h-px bg-border" />

          {/* Difference */}
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">
              {canPayFull ? "Remaining After Payment" : "Recharge Needed"}
            </span>
            <span className={`text-xl font-bold font-mono ${canPayFull ? "text-primary" : "text-warning"}`}>
              ${canPayFull ? (tokenBalance - total).toFixed(2) : difference.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Status */}
        {canPayFull ? (
          <div className="glass-card p-4 mb-6 border-primary/30 glow-border">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-primary shrink-0" />
              <p className="text-sm text-foreground">
                Sufficient balance. Ready to complete payment.
              </p>
            </div>
          </div>
        ) : (
          <div className="glass-card p-4 mb-6 border-warning/30">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-warning shrink-0" />
              <p className="text-sm text-foreground">
                Insufficient balance. Please recharge <span className="font-mono font-bold text-warning">${difference.toFixed(2)}</span> to proceed.
              </p>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="space-y-3">
          {canPayFull ? (
            <Button
              className="w-full gradient-primary text-primary-foreground font-semibold h-12 hover:opacity-90 transition-opacity"
              onClick={() => {
                // In real app, process payment
                alert("Payment successful!");
                sessionStorage.removeItem("topup_data");
                navigate("/topup");
              }}
            >
              Confirm Payment
            </Button>
          ) : (
            <Button
              className="w-full gradient-primary text-primary-foreground font-semibold h-12 hover:opacity-90 transition-opacity"
              onClick={() => navigate("/crypto-payment")}
            >
              Recharge via Crypto <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}

          <Button
            variant="outline"
            className="w-full border-border text-muted-foreground hover:text-foreground h-11"
            onClick={() => navigate("/topup")}
          >
            Back to Top-Up
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Payment;
