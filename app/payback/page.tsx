import { PaybackDashboard } from "@/components/payback-dashboard";
import { defaultPaybackData } from "@/lib/dashboard-data";

export default function PaybackPage() {
  return <PaybackDashboard data={defaultPaybackData} />;
}

