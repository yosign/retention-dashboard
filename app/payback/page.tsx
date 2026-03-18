import { PaybackDashboard } from "@/components/dashboard/payback-dashboard";
import { defaultPaybackData } from "@/lib/dashboard-data";

export default function PaybackPage() {
  return <PaybackDashboard data={defaultPaybackData} />;
}

