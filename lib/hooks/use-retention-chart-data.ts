import { useMemo } from "react";
import type { RetentionCurvePoint } from "@/src/types/dashboard";

type RetentionDisplayMode = "relative" | "absolute" | "both";

export function useRetentionChartData(
  curve: RetentionCurvePoint[],
  displayMode: RetentionDisplayMode,
) {
  return useMemo(() => {
    const chartData = curve.map((point) => {
      if (displayMode === "absolute") {
        return {
          ...point,
          overall: point.overallUsers,
          monthly: point.monthlyUsers,
          yearly: point.yearlyUsers,
          quarterly: point.quarterlyUsers,
        };
      }

      return point;
    });

    const maxAbsoluteValue = Math.max(
      ...curve.flatMap((point) => [
        point.overallUsers,
        point.monthlyUsers,
        point.yearlyUsers,
        point.quarterlyUsers,
      ]),
    );

    return {
      chartData,
      maxAbsoluteValue,
    };
  }, [curve, displayMode]);
}
