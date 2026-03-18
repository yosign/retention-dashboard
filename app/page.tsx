import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RetentionDashboard } from "@/components/dashboard/retention-dashboard";
import { PaybackDashboard } from "@/components/dashboard/payback-dashboard";
import { ForecastDashboard } from "@/components/dashboard/forecast-dashboard";
import { defaultRetentionData, defaultPaybackData, defaultForecastData } from "@/lib/dashboard-data";

export default function Home({
  searchParams,
}: {
  searchParams: { tab?: string };
}) {
  const tab = searchParams?.tab ?? "retention";

  return (
    <main className="min-h-screen bg-background">
      <Tabs defaultValue={tab} className="w-full">
        <div className="border-b border-border">
          <div className="mx-auto max-w-screen-2xl px-6">
            <TabsList className="h-12 rounded-none border-b border-border bg-transparent p-0">
              <TabsTrigger
                value="retention"
                className="h-12 rounded-none border-b-2 border-transparent bg-transparent px-6 font-medium text-muted-foreground shadow-none data-[state=active]:border-foreground data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:shadow-none"
              >
                留存分析
              </TabsTrigger>
              <TabsTrigger
                value="payback"
                className="h-12 rounded-none border-b-2 border-transparent bg-transparent px-6 font-medium text-muted-foreground shadow-none data-[state=active]:border-foreground data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:shadow-none"
              >
                回本分析
              </TabsTrigger>
              <TabsTrigger
                value="forecast"
                className="h-12 rounded-none border-b-2 border-transparent bg-transparent px-6 font-medium text-muted-foreground shadow-none data-[state=active]:border-foreground data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:shadow-none"
              >
                收入预测
              </TabsTrigger>
            </TabsList>
          </div>
        </div>

        <TabsContent value="retention" className="mt-0">
          <RetentionDashboard data={defaultRetentionData} />
        </TabsContent>

        <TabsContent value="payback" className="mt-0">
          <PaybackDashboard data={defaultPaybackData} />
        </TabsContent>

        <TabsContent value="forecast" className="mt-0">
          <ForecastDashboard data={defaultForecastData} />
        </TabsContent>
      </Tabs>
    </main>
  );
}
