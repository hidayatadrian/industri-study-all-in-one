import React from "react";
import * as XLSX from "xlsx";

interface ForecastResult {
  period: number;
  month: string;
  demand: number;
  alpha: number;
  ft: number;
  et: number;
  ape: number;
}

interface MonthOption {
  period: number;
  month: string;
  demand: string;
}

const TableForecastTimeSeries: React.FC = () => {
  // Ambil data dari localStorage
  const TimeSeries = JSON.parse(localStorage.getItem("forecastData") || "{}");
  const monthOptions: MonthOption[] = TimeSeries.monthData || [];
  const targetPeriod = TimeSeries.targetPeriod || 0;

  const calculateForecast = (): {
    mainResults: ForecastResult[];
    forecastResults: ForecastResult[];
    averageApeByAlpha: { alpha: number; averageApe: number }[];
  } => {
    const mainResults: ForecastResult[] = [];
    const forecastResults: ForecastResult[] = [];
    const averageApeByAlpha: { alpha: number; averageApe: number }[] = [];

    // Iterasi nilai alfa dari 0.1 hingga 1.0
    for (let alpha = 0.1; alpha <= 1.0; alpha += 0.1) {
      let previousFt = parseFloat(monthOptions[0]?.demand || "0"); // F(t) awal = permintaan pertama
      let sumApe = 0; // Untuk menjumlahkan APE per alpha
      let countApe = 0; // Untuk menghitung jumlah APE yang valid per alpha

      // Hitung hasil utama
      monthOptions.forEach((option, index) => {
        const demand = parseFloat(option.demand) || 0;

        // Hitung F(t)
        const ft =
          index === 0
            ? previousFt // Periode pertama: F(t) = permintaan pertama
            : alpha * (parseFloat(monthOptions[index - 1]?.demand || "0")) +
              (1 - alpha) * previousFt;

        // Hitung E(t) dan APE
        const et = Math.abs(demand - ft); // Error absolut
        const ape = demand !== 0 ? (et / demand) * 100 : 0; // Hindari pembagian dengan nol

        if (index >= 1) {
          // Ambil periode mulai dari ke-2
          sumApe += ape;
          countApe++;
        }

        mainResults.push({
          period: option.period,
          month: option.month,
          demand: demand,
          alpha: parseFloat(alpha.toFixed(1)),
          ft: parseFloat(ft.toFixed(3)),
          et: parseFloat(et.toFixed(3)),
          ape: parseFloat(ape.toFixed(2)),
        });

        previousFt = ft; // Update F(t) sebelumnya
      });

      // Tambahkan hasil forecast untuk periode tambahan
      let lastDemand = parseFloat(monthOptions[monthOptions.length - 1]?.demand || "0");
      let forecastFt = previousFt;

      for (let i = 1; i <= targetPeriod; i++) {
        const newFt = alpha * lastDemand + (1 - alpha) * forecastFt;

        forecastResults.push({
          period: monthOptions.length + i,
          month: `Forecast ${i}`,
          demand: 0, // Tidak ada permintaan aktual untuk periode tambahan
          alpha: parseFloat(alpha.toFixed(1)),
          ft: parseFloat(newFt.toFixed(3)),
          et: 0,
          ape: 0,
        });

        // Update nilai F(t) hanya sekali dengan nilai forecast ke-25
        if (i === 1) {
          forecastFt = newFt;
        }
      }

      // Hitung rata-rata APE untuk alpha ini
      const averageApe = countApe > 0 ? sumApe / countApe : 0;
      averageApeByAlpha.push({ alpha: parseFloat(alpha.toFixed(1)), averageApe: averageApe });
    }

    return { mainResults, forecastResults, averageApeByAlpha };
  };

  const { mainResults, forecastResults, averageApeByAlpha } = calculateForecast();

  const handleExport = () => {
    const worksheetMain = XLSX.utils.json_to_sheet(
      mainResults.map((result) => ({
        Period: result.period,
        Month: result.month,
        "Penjualan d(t)": result.demand,
        Alfa: result.alpha,
        "F(t)": result.ft,
        "E(t)": result.et,
        APE: `${result.ape}%`,
      }))
    );

    const worksheetForecast = XLSX.utils.json_to_sheet(
      forecastResults.map((result) => ({
        "Target Period": targetPeriod,
        "Forecast Period": result.period,
        "F(t)": result.ft,
        "Alpha": result.alpha,
      }))
    );

    const worksheetAverageAPE = XLSX.utils.json_to_sheet(
      averageApeByAlpha.map((entry) => ({
        Alpha: entry.alpha,
        "Average APE": `${entry.averageApe.toFixed(2)}%`,
      }))
    );

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheetMain, "Main Results");
    XLSX.utils.book_append_sheet(workbook, worksheetForecast, "Forecast Results");
    XLSX.utils.book_append_sheet(workbook, worksheetAverageAPE, "Average APE");
    XLSX.writeFile(workbook, "Time_Series_Forecast.xlsx");
  };

  return (
    <div className="mt-8">
      <div className="mb-6">
        <button
          className="px-4 py-2 text-sm bg-green-400 text-gray-600 rounded-lg hover:bg-green-300 flex"
          onClick={handleExport}
        >
          Export to Spreadsheet
        </button>
      </div>

      {/* Tabel Hasil Utama */}
      <div className="overflow-x-auto rounded-lg shadow mb-8">
        <h3 className="text-lg font-semibold mb-4">Main Results</h3>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {["Period", "Month", "Penjualan d(t)", "Alfa", "F(t)", "E(t)", "APE"].map((header, index) => (
                <th
                  key={index}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {mainResults.map((result, index) => (
              <tr key={`${result.period}-${result.alpha}`}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{result.period}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{result.month}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{result.demand.toFixed(2)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{result.alpha.toFixed(1)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{result.ft.toFixed(3)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{result.et.toFixed(3)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{result.ape.toFixed(2)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Tabel Average APE */}
      <div className="overflow-x-auto rounded-lg shadow mb-8">
        <h3 className="text-lg font-semibold mb-4">Average APE by Alpha</h3>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {["Alpha", "Average APE"].map((header, index) => (
                <th
                  key={index}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {averageApeByAlpha.map((entry) => (
              <tr key={entry.alpha}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{entry.alpha.toFixed(1)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{entry.averageApe.toFixed(2)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Tabel Forecast Results */}
      <div className="overflow-x-auto rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Forecast Results</h3>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {["Target Period", "Forecast Period", "F(t)", "Alpha"].map((header, index) => (
                <th
                  key={index}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {forecastResults.map((result, index) => (
              <tr key={`${result.period}-${result.alpha}`}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{targetPeriod}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{result.period}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{result.ft.toFixed(3)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{result.alpha.toFixed(1)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TableForecastTimeSeries;
