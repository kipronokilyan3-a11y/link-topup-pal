import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Copy, AlertTriangle, CheckCircle, ArrowLeft } from "lucide-react";

const WALLET_ADDRESS = "TJjHua4gE3LH7qGxbqtLRqwqCrASPjqyMC";

const CryptoPayment = () => {
  const { tokenBalance } = useAuth();
  const navigate = useNavigate();
  const [verified, setVerified] = useState(false);
  const [copied, setCopied] = useState(false);
  const [rechargeAmount, setRechargeAmount] = useState(0);

  useEffect(() => {
    const raw = sessionStorage.getItem("topup_data");
    if (!raw) {
      navigate("/topup");
      return;
    }
    const data = JSON.parse(raw);
    setRechargeAmount(212);
  }, [navigate, tokenBalance]);

  const copyAddress = async () => {
    await navigator.clipboard.writeText(WALLET_ADDRESS);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (verified) {
    return (
      <div className="min-h-screen gradient-surface flex items-center justify-center px-4">
        <div className="w-full max-w-md text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-6 glow-border-strong">
            <CheckCircle className="w-10 h-10 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Payment Verified</h2>
          <p className="text-muted-foreground mb-8">Your balance will be updated shortly after blockchain confirmation.</p>
          <Button
            className="gradient-primary text-primary-foreground font-semibold h-11 px-8 hover:opacity-90"
            onClick={() => {
              sessionStorage.removeItem("topup_data");
              navigate("/topup");
            }}
          >
            Return to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-surface">
      <header className="border-b border-border bg-card/60 backdrop-blur-lg sticky top-0 z-10">
        <div className="max-w-xl mx-auto px-4 py-4 flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate("/payment")} className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-bold text-foreground">Crypto Recharge</h1>
        </div>
      </header>

      <main className="max-w-xl mx-auto px-4 py-8 space-y-6">
        {/* Amount */}
        <div className="glass-card p-6 text-center">
          <p className="text-muted-foreground text-sm mb-1">Amount to Recharge</p>
          <p className="text-4xl font-bold text-foreground font-mono">${rechargeAmount.toFixed(2)}</p>
          <p className="text-sm text-muted-foreground mt-2">Send the exact USDT amount</p>
        </div>

        {/* Warning */}
        <div className="glass-card p-4 border-warning/30">
          <div className="flex gap-3">
            <AlertTriangle className="w-5 h-5 text-warning shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="text-foreground font-semibold mb-1">Important — Read Carefully</p>
              <ul className="text-muted-foreground space-y-1">
                <li>• Network: <span className="text-foreground font-mono font-medium">TRC20 (Tron)</span></li>
                <li>• Send <span className="text-foreground font-semibold">only USDT</span> on TRC20 network</li>
                <li>• Sending other tokens will result in <span className="text-destructive">permanent loss</span></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Wallet Address */}
        <div className="glass-card p-6">
          <Label className="text-muted-foreground text-sm mb-3 block">USDT TRC20 Wallet Address</Label>
          <div className="bg-input rounded-lg p-4 flex items-center gap-3">
            <code className="text-foreground font-mono text-sm flex-1 break-all">{WALLET_ADDRESS}</code>
            <Button
              variant="ghost"
              size="icon"
              onClick={copyAddress}
              className="shrink-0 text-muted-foreground hover:text-primary"
            >
              {copied ? <CheckCircle className="w-4 h-4 text-primary" /> : <Copy className="w-4 h-4" />}
            </Button>
          </div>
          {copied && <p className="text-xs text-primary mt-2">Copied to clipboard!</p>}
        </div>

        {/* Payment Done */}
        <div className="glass-card p-6">
          <Button
            onClick={() => {
              setVerified(true);
            }}
            className="w-full gradient-primary text-primary-foreground font-semibold h-12 hover:opacity-90 transition-opacity"
          >
            Payment Done
          </Button>
        </div>
      </main>
    </div>
  );
};

export default CryptoPayment;
