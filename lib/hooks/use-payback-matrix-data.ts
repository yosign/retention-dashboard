import { useMemo } from "react";
import type { PaybackMatrixRow } from "@/src/types/dashboard";

type MatrixDisplay = "absolute" | "relative";
type MatrixHorizon = "6" | "12";

export function usePaybackMatrixData(
  matrixColumns: string[],
  matrixRows: PaybackMatrixRow[],
  horizon: MatrixHorizon,
  matrixDisplay: MatrixDisplay,
) {
  return useMemo(() => {
    const visibleColumns = matrixColumns.slice(
      0,
      horizon === "6" ? 6 : matrixColumns.length,
    );

    const normalizedRows = matrixRows.map((row) => ({
      ...row,
      values: row.values.slice(0, visibleColumns.length).map((value, index) =>
        matrixDisplay === "relative"
          ? Number(
              ((value / row.values[row.values.length - 1]) * 100).toFixed(
                index === 0 ? 0 : 1,
              ),
            )
          : value,
      ),
    }));

    return {
      visibleColumns,
      matrixRows: normalizedRows,
    };
  }, [horizon, matrixColumns, matrixDisplay, matrixRows]);
}
