import { RetentionDashboard } from "@/components/dashboard/retention-dashboard";
import { defaultRetentionData } from "@/lib/dashboard-data";

export default function RetentionPage() {
  return <RetentionDashboard data={defaultRetentionData} />;
}

