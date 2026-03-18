import Link from "next/link";
import { ArrowRight, BarChart3, LineChart, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const pages = [
  {
    href: "/retention",
    title: "留存分析",
    description: "查看续订阶段曲线、分段留存和 cohort 数据。",
    icon: TrendingUp,
  },
  {
    href: "/payback",
    title: "回本分析",
    description: "查看 LTV 曲线、回本周期和回本矩阵。",
    icon: BarChart3,
  },
  {
    href: "/forecast",
    title: "收入预测",
    description: "查看 MRR 和订阅数趋势外推与交叉验证结果。",
    icon: LineChart,
  },
];

export default function Home() {
  return (
    <main className="dashboard-shell flex min-h-screen items-center">
      <div className="w-full space-y-8">
        <div className="space-y-3">
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground">
            Dashboard Routes
          </p>
          <h1 className="text-4xl font-semibold tracking-tight text-foreground">
            订阅业务分析面板
          </h1>
          <p className="max-w-2xl text-base text-muted-foreground">
            选择一个页面进入。首页包含到留存、回本和收入预测三个分析视图的入口。
          </p>
        </div>

        <section className="grid gap-4 md:grid-cols-3">
          {pages.map((page) => {
            const Icon = page.icon;

            return (
              <Link key={page.href} href={page.href}>
                <Card className="dashboard-panel h-full transition-transform duration-200 hover:-translate-y-1">
                  <CardHeader className="space-y-4 pb-3">
                    <div className="flex size-12 items-center justify-center rounded-2xl bg-muted text-foreground">
                      <Icon className="size-6" />
                    </div>
                    <CardTitle className="text-2xl font-semibold">{page.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <p className="text-sm leading-6 text-muted-foreground">
                      {page.description}
                    </p>
                    <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                      <span>打开页面</span>
                      <ArrowRight className="size-4" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </section>
      </div>
    </main>
  );
}
