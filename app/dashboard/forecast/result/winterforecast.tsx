import React from "react";
import * as XLSX from "xlsx";

interface WinterForecastResult {
  period: number;
  month: string;
  demand: number | null; // d(t)
  st: number | null; // S(t)
  bt: number | null; // B(t)
  lt: number | null; // L(t)
  forecast: number | null; // Forecast
  et: number | null; // |e(t)|
  ape: number | null; // APE
}

const WinterForecast: React.FC = () => {
  const forecastData = JSON.parse(localStorage.getItem("forecastData") || "{}");
  const monthOptions = forecastData.monthData || [];
  const targetPeriod = forecastData.targetPeriod || 0;
  const a = forecastData.winterParams?.a || 0;
  const b = forecastData.winterParams?.b || 0;
  const y = forecastData.winterParams?.y || 0;
  const l = forecastData.winterParams?.l || 0;

  const calculateWinterForecast = (): {
    results: WinterForecastResult[];
    averageAPE: number;
  } => {
    const results: WinterForecastResult[] = [];

    const lt: number[] = Array(monthOptions.length + targetPeriod).fill(0);
    let sumAPE = 0;
    let apeCount = 0;

    let st: number | null = null;
    let bt: number | null = null;

    for (let i = 0; i < monthOptions.length + targetPeriod; i++) {
      const currentPeriod = i + 1;
      const currentDemand =
        i < monthOptions.length
          ? parseFloat(monthOptions[i]?.demand || "0")
          : null;

      // Ambil nilai sebelumnya
      const previousSt: number | null = st;
      const previousBt: number | null = bt;

      // Hitung S(t) (Level)
      if (i === l - 1) {
        st =
          monthOptions.slice(0, l).reduce((sum: number, option: any) => {
            return sum + parseFloat(option.demand || "0");
          }, 0) / l;
      } else if (i >= l && currentDemand !== null) {
        st = a * (currentDemand / lt[i - l]) + (1 - a) * (previousSt! + previousBt!);
      }

      // Hitung B(t) (Trend)
      if (i === l - 1) {
        bt =
          monthOptions
            .slice(l, l * 2)
            .reduce((sum: number, option: any, idx: number) => {
              return (
                sum +
                (parseFloat(option.demand || "0") -
                  parseFloat(monthOptions[idx].demand || "0"))
              );
            }, 0) /
          (l * l);
      } else if (i >= l && previousSt !== null) {
        bt = y * (st! - previousSt) + (1 - y) * previousBt!;
      }

      // Hitung L(t) (Musiman)
      if (i < l) {
        lt[i] = 0;
      } else if (i === l - 1 && currentDemand !== null) {
        lt[i - (l - 1)] = currentDemand / st!;
      } else if (i >= l && currentDemand !== null) {
        lt[i - (l - 1)] = b * (currentDemand / st!) + (1 - b) * lt[i - l];
      }

      // Hitung Forecast (Prediksi di masa depan)
      let forecast = null;
      if (i >= l && i < monthOptions.length) {
        const ltIndex = (i - (l - 1)) % l;
        forecast = (previousSt! + previousBt!) * lt[ltIndex];
      } else if (i >= monthOptions.length) {
        const ltIndex = (i - (l - 1)) % l;
        forecast = (previousSt! + (i - monthOptions.length + 1) * previousBt!) * lt[ltIndex];
      }

      // Hitung e(t) dan APE
      const et = forecast !== null && currentDemand !== null ? Math.abs(currentDemand - forecast) : null;
      const ape = et !== null && currentDemand ? (et / currentDemand) * 100 : null;

      if (ape !== null && i < monthOptions.length && currentDemand !== null) {
        sumAPE += ape;
        apeCount++;
      }

      // Simpan hasil
      results.push({
        period: currentPeriod,
        month:
          i < monthOptions.length
            ? monthOptions[i]?.month || `Month ${i + 1}`
            : `Forecast ${i - monthOptions.length + 1}`,
        demand: currentDemand,
        st: i < l - 1 || i >= 26 ? null : st,
        bt: i < l - 1 || i >= 26 ? null : bt,
        lt: i < l - 1 || i >= 26 ? null : lt[i - (l - 1)],
        forecast: forecast,
        et: et,
        ape: ape,
      });
    }

    const averageAPE = apeCount > 0 ? sumAPE / apeCount : 0;

    return { results, averageAPE };
  };

  const { results, averageAPE } = calculateWinterForecast();

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Winter Forecasting Results</h1>
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr>
            {["Period", "Month", "d(t)", "S(t)", "B(t)", "L(t)", "Forecast", "|e(t)|", "APE"].map((header) => (
              <th key={header} className="px-4 py-2 text-left">{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {results.map((result) => (
            <tr key={result.period}>
              {Object.values(result).map((value, idx) => (
                <td key={idx} className="px-4 py-2">
                  {typeof value === "number" ? value.toFixed(3) : "-"}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={8} className="px-4 py-2 font-bold">Average APE:</td>
            <td className="px-4 py-2 font-bold">{averageAPE.toFixed(3)}%</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default WinterForecast;
