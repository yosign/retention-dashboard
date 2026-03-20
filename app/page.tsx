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
            <TabsList className="h-12 w-auto gap-0 rounded-none bg-transparent p-0">
              <TabsTrigger
                value="retention"
                className="relative h-12 rounded-none bg-transparent px-4 text-sm font-medium text-muted-foreground shadow-none transition-colors hover:text-foreground data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:shadow-none data-[state=active]:after:absolute data-[state=active]:after:bottom-0 data-[state=active]:after:left-0 data-[state=active]:after:right-0 data-[state=active]:after:h-px data-[state=active]:after:bg-foreground"
              >
                留存分析
              </TabsTrigger>
              <TabsTrigger
                value="payback"
                className="relative h-12 rounded-none bg-transparent px-4 text-sm font-medium text-muted-foreground shadow-none transition-colors hover:text-foreground data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:shadow-none data-[state=active]:after:absolute data-[state=active]:after:bottom-0 data-[state=active]:after:left-0 data-[state=active]:after:right-0 data-[state=active]:after:h-px data-[state=active]:after:bg-foreground"
              >
                回本分析
              </TabsTrigger>
              <TabsTrigger
                value="forecast"
                className="relative h-12 rounded-none bg-transparent px-4 text-sm font-medium text-muted-foreground shadow-none transition-colors hover:text-foreground data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:shadow-none data-[state=active]:after:absolute data-[state=active]:after:bottom-0 data-[state=active]:after:left-0 data-[state=active]:after:right-0 data-[state=active]:after:h-px data-[state=active]:after:bg-foreground"
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
