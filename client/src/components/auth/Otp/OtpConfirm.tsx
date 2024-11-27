import { submitOtp } from "@/api/auth/auth";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

interface OtpSubmitProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  email: string
}

export function OtpSubmit({ isOpen, setIsOpen, email }: OtpSubmitProps) {
  const router = useRouter()
  const [otp, setOtp] = useState(""); // State to store OTP
  const [isSubmitting, setIsSubmitting] = useState(false); // Track submitting state
  const [timeLeft, setTimeLeft] = useState(120); // Timer in seconds (e.g., 2 minutes)
  const [canResend, setCanResend] = useState(false); // Track resend button availability

  // Handle OTP input change
  const handleOtpChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setOtp(event.target.value);
  };

  // Handle form submit
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);

    const response = await submitOtp({otp: +otp, email})
    if(response.success === false){
      console.log("failed to submit otp");
    }
    router.push("/chat")
    setTimeout(() => {
      setIsSubmitting(false);
      alert("OTP submitted successfully!");
      setIsOpen(false); // Close the dialog after submission
    }, 2000);
  };

  // Handle resend OTP
  const handleResendOtp = () => {
    alert("OTP has been resent!");
    setTimeLeft(120); // Reset the timer
    setCanResend(false);
  };

  // Timer logic
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true); // Enable "Resend OTP" button when timer reaches 0
    }
  }, [timeLeft]);

  // Format timer in mm:ss
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>OTP Verification</DialogTitle>
          <DialogDescription>
            Enter the OTP sent to your email to verify your account.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Input
              id="otp"
              type="text"
              value={otp}
              onChange={handleOtpChange}
              className="col-span-3"
              placeholder="Enter OTP"
              required
              maxLength={6} // Assuming OTP length is 6 digits
            />
          </div>
          <div className="text-sm text-gray-500">
            Time left: <span className="font-bold">{formatTime(timeLeft)}</span>
          </div>
          <DialogFooter className="flex justify-between">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit OTP"}
            </Button>
            <Button
              type="button"
              variant="outline"
              disabled={!canResend}
              onClick={handleResendOtp}
            >
              Resend OTP
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
