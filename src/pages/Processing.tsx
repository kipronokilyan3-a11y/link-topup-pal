import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, CheckCircle } from "lucide-react";

const STEPS = [
  "Validating links...",
  "Verifying country availability...",
  "Calculating fees...",
  "Preparing payment...",
];

const Processing = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const data = sessionStorage.getItem("topup_data");
    if (!data) {
      navigate("/topup");
      return;
    }

    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= STEPS.length - 1) {
          clearInterval(interval);
          setTimeout(() => navigate("/payment"), 600);
          return prev;
        }
        return prev + 1;
      });
    }, 800);

    return () => clearInterval(interval);
  }, [navigate]);

  return (
    <div className="min-h-screen gradient-surface flex items-center justify-center px-4">
      <div className="w-full max-w-md text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-8 animate-pulse-glow">
          <Loader2 className="w-10 h-10 text-primary animate-spin-slow" />
        </div>

        <h2 className="text-2xl font-bold text-foreground mb-2">Processing Your Request</h2>
        <p className="text-muted-foreground mb-10">Please wait while we verify your top-up</p>

        <div className="glass-card p-6 text-left space-y-4">
          {STEPS.map((step, i) => (
            <div key={i} className="flex items-center gap-3">
              {i < currentStep ? (
                <CheckCircle className="w-5 h-5 text-primary shrink-0" />
              ) : i === currentStep ? (
                <Loader2 className="w-5 h-5 text-primary animate-spin shrink-0" />
              ) : (
                <div className="w-5 h-5 rounded-full border border-border shrink-0" />
              )}
              <span className={i <= currentStep ? "text-foreground" : "text-muted-foreground"}>
                {step}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Processing;
