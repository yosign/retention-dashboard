import { ForecastDashboard } from "@/components/dashboard/forecast-dashboard";
import { defaultForecastData } from "@/lib/dashboard-data";

export default function ForecastPage() {
  return <ForecastDashboard data={defaultForecastData} />;
}
