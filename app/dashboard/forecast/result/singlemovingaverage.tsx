import React from "react";
import * as XLSX from "xlsx";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, LineElement, PointElement, LinearScale, CategoryScale } from "chart.js";

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale);

interface SMAMovingAverageResult {
  period: number;
  month: string;
  demand: number | null;
  movingAverages: (number | null)[];
  etValues: (number | null)[];
  apeValues: (number | null)[];
}

interface TrackingSignalResult {
  period: number;
  demand: number | null;
  ft: number | null;
  et: number | null;
  rsfe: number | null;
  absEt: number | null;
  sumAbsEt: number | null;
  madt: number | null;
  ts: number | null;
}

const SingleMovingAverage: React.FC = () => {
  const forecastData = JSON.parse(localStorage.getItem("forecastData") || "{}");
  const monthOptions = forecastData.monthData || [];
  const movingAveragePeriod = forecastData.targetPeriod || 3;
  const totalPeriods = monthOptions.length; // **TIDAK menambah forecasting di Tracking Signal**

  // **Perhitungan Tabel 1 (MA, ET, APE)**
  const calculateSMAForecast = (): { results: SMAMovingAverageResult[] } => {
    const results: SMAMovingAverageResult[] = [];

    for (let i = 0; i < totalPeriods + movingAveragePeriod; i++) {
      const currentPeriod = i + 1;
      const isForecasting = i >= monthOptions.length;
      const currentDemand = isForecasting ? null : parseFloat(monthOptions[i]?.demand || "0");

      let movingAverages: (number | null)[] = Array(9).fill(null);
      let etValues: (number | null)[] = Array(9).fill(null);
      let apeValues: (number | null)[] = Array(9).fill(null);

      for (let maIndex = 0; maIndex < 9; maIndex++) {
        const maPeriod = maIndex + 1;
        if (i >= maPeriod) {
          const sum = monthOptions.slice(i - maPeriod, i).reduce(
            (acc: number, cur: { demand: string }) => acc + parseFloat(cur.demand || "0"),
            0
          );
          movingAverages[maIndex] = sum / maPeriod;

          if (i >= 1 && currentDemand !== null) {
            etValues[maIndex] = Math.abs(currentDemand - movingAverages[maIndex]!);
            apeValues[maIndex] = currentDemand !== 0 ? etValues[maIndex]! / currentDemand : null;
          }
        }
      }

      results.push({
        period: currentPeriod,
        month: isForecasting ? `Forecast ${currentPeriod - monthOptions.length}` : monthOptions[i]?.month || `Month ${i + 1}`,
        demand: currentDemand,
        movingAverages,
        etValues,
        apeValues,
      });
    }

    return { results };
  };

  // **Perhitungan Tabel 2 (Tracking Signal)**
  const calculateTrackingSignal = (): TrackingSignalResult[] => {
    const results: TrackingSignalResult[] = [];
    let sumAbsEt = 0; // Σ |et|

    for (let i = 0; i < totalPeriods; i++) {
        const currentPeriod = i + 1;
        const demand = parseFloat(monthOptions[i]?.demand || "0");

        let ft: number | null = null;
        let et: number | null = null;
        let rsfe: number | null = null;
        let absEt: number | null = null;
        let madt: number | null = null;
        let ts: number | null = null;

        // **Hanya mulai menghitung Tracking Signal setelah forecasting selesai**
        if (i >= movingAveragePeriod) {
            // Menghitung Ft sebagai rata-rata periode sebelumnya
            const sum = monthOptions.slice(i - movingAveragePeriod, i).reduce(
                (acc: number, cur: { demand: string }) => acc + parseFloat(cur.demand || "0"),
                0
            );

            ft = sum / movingAveragePeriod;
            et = demand - ft;
            absEt = Math.abs(et);
            rsfe = results.length > 0 ? (results[results.length - 1].rsfe || 0) + et : et;
            sumAbsEt += absEt;

            // ✅ **Perbaikan MADt → Σ |et| dibagi t yang sesuai**
            const tForMADt = currentPeriod - movingAveragePeriod ; // Menggunakan t yang sesuai
            madt = tForMADt > 0 ? sumAbsEt / tForMADt : null; // Menghindari pembagian dengan 0

            // Menghitung Tracking Signal (TS)
            ts = madt !== null && madt !== 0 ? rsfe! / madt : null;
        }

        results.push({
            period: currentPeriod,
            demand,
            ft,
            et,
            rsfe,
            absEt,
            sumAbsEt,
            madt,
            ts,
        });
    }

    return results;
};


  const { results } = calculateSMAForecast();
  const trackingResults = calculateTrackingSignal();

  return (
    <div className="mt-8">
      {/* Tabel 1: MA, ET, APE */}
      <h2 className="text-xl font-semibold mb-4">Single Moving Average Forecast</h2>
      <div className="overflow-x-auto rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {["Period", "Month", "d(t)", ...Array.from({ length: 9 }, (_, i) => `MA${i + 1}`), ...Array.from({ length: 9 }, (_, i) => `ET${i + 1}`), ...Array.from({ length: 9 }, (_, i) => `APE${i + 1}`)].map((header, index) => (
                <th key={index} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{header}</th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {results.map((result) => (
              <tr key={result.period}>
                <td className="px-6 py-4 text-sm text-gray-900">{result.period}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{result.month}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{result.demand !== null ? result.demand.toFixed(3) : ""}</td>
                {result.movingAverages.concat(result.etValues, result.apeValues).map((value, index) => (
                  <td key={index} className="px-6 py-4 text-sm text-gray-900">{value !== null ? value.toFixed(3) : ""}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Tabel 2: Tracking Signal */}
      <h2 className="text-xl font-semibold mt-8 mb-4">Tracking Signal Analysis</h2>
      <div className="overflow-x-auto rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {["t", "d(t)", "F(t)", "e(t)", "RSFE", "|e(t)|", "Σ |e(t)|", "MADt", "TS", "UB", "LB"].map((header, index) => (
                <th key={index} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{header}</th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {trackingResults.map((result) => (
              <tr key={result.period}>
                {Object.values(result).concat(totalPeriods, -totalPeriods).map((value, index) => (
                  <td key={index} className="px-6 py-4 text-sm text-gray-900">{value !== null ? value.toFixed(3) : ""}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Tracking Signal Chart */}
<h2 className="text-xl font-semibold mt-8 mb-4">Tracking Signal Chart</h2>
<div className="w-full h-96">
  <Line
    data={{
      labels: trackingResults.map((result) => `t${result.period}`),
      datasets: [
        {
          label: "Tracking Signal (TS)",
          data: trackingResults.map((result) => result.ts !== null ? result.ts : null),
          borderColor: "blue",
          borderWidth: 2,
          fill: false,
          pointRadius: 4,
          pointBackgroundColor: "blue",
        },
        {
          label: "Upper Bound (UB)",
          data: trackingResults.map(() => totalPeriods),
          borderColor: "red",
          borderWidth: 2,
          borderDash: [5, 5], // Garis putus-putus
          fill: false,
        },
        {
          label: "Lower Bound (LB)",
          data: trackingResults.map(() => -totalPeriods),
          borderColor: "red",
          borderWidth: 2,
          borderDash: [5, 5], // Garis putus-putus
          fill: false,
        },
      ],
    }}
    options={{
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: "top",
        },
      },
      scales: {
        y: {
          beginAtZero: false,
        },
      },
    }}
  />
</div>
    </div>
  );
};

export default SingleMovingAverage;
