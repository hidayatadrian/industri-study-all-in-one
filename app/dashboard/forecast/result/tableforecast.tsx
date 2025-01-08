import React from 'react';
import { Table } from 'lucide-react';
import * as XLSX from 'xlsx';
interface ForecastResult {
    period: number;
    month: string;
    dt: number;           // Penjualan d(t)
    t2: number;          // T²
    tdt: number;         // T * d(t)
    ft: number;          // F(t)
    absEt: number;       // ABS e(t)
    kumAbsEt: number;    // Kumulatif ABS e(t)
    rsfe: number;        // RSFE
    mad: number;         // MAD
    ape: number;         // APE
    ts: number;          // ts
    bka: number;         // BKA
    bkb: number;         // BKB
}

interface ForecastTableProps {
    monthOptions: {
        period: number;
        month: string;
        demand: string;
    }[];
}

interface CalculationTotals {
    dt: number;
    t2: number;
    tdt: number;
    ft: number;
    absEt: number;
    kumAbsEt: number;
    rsfe: number;
    mad: number;
    ape: number;
    ts: number;
    bka: number;
    bkb: number;
}

interface CalculationResult {
    results: ForecastResult[];
    b: number;
    a: number;
    AverageApe: number;
}

const ForecastResultsTable: React.FC<ForecastTableProps> = ({ monthOptions }) => {
    const calculateResults = (): CalculationResult => {
        const totalPeriod = monthOptions.length;

        // Variabel untuk menghitung totals
        let totalTdt = 0; // Σ(t * dt)
        let totalDt = 0;  // Σ(dt)
        let totalT2 = 0;  // Σ(t^2)
        let perhitunganft = 0;
        let perhitungandt = 0;
        // Iterasi untuk menghitung total
        monthOptions.forEach((option, index) => {
            const t = index + 1; // Nilai t (periode)
            const dt = parseFloat(option.demand) || 0; // Penjualan d(t)
            totalTdt += t * dt; // Σ(t * dt)
            totalDt += dt;      // Σ(dt)
            totalT2 += t * t;
            const baseline = 300;
            const b = ((totalPeriod * totalTdt) - baseline * totalDt) / ((totalPeriod * totalT2) - (baseline * baseline));
            const a = (totalDt - (b * baseline)) / totalPeriod;
            const ft = a + (b * t);  // Σ(t^2)
            perhitunganft = ft;
            perhitungandt = dt;
        });

        // Debugging: Log nilai total untuk memverifikasi
        console.log("Total Σ(t * dt):", totalTdt);
        console.log("Total Σ(dt):", totalDt);
        console.log("Total Σ(t^2):", totalT2);

        const baseline = 300; // Konstanta (opsional, jika tidak relevan bisa dihapus)
        const b = ((totalPeriod * totalTdt) - baseline * totalDt) / ((totalPeriod * totalT2) - (baseline * baseline));
        const a = (totalDt - (b * baseline)) / totalPeriod;

        const et = perhitungandt - perhitunganft;
        const absEt = Math.abs(et);
        const ape = perhitungandt !== 0 ? (absEt / perhitungandt) * 100 : 0;
        const AverageApe = ape / totalPeriod;

        // Iterasi untuk menghitung hasil prediksi
        const results: ForecastResult[] = monthOptions.map((option, index) => {
            const t = index + 1; // Nilai periode
            const dt = parseFloat(option.demand) || 0; // Penjualan d(t)
            const t2 = t * t; // Kuadrat dari t
            const tdt = t * dt; // Perkalian t dengan d(t)

            // Menghitung F(t) menggunakan a + (b * t)
            const ft = a + (b * t);

            // Menghitung error dan metrik lainnya

            const et = dt - ft; // Error
            const absEt = Math.abs(et); // Absolute Error
            const ape = dt !== 0 ? (absEt / dt) * 100 : 0; // APE (Avoid divide by zero)
            const rsfe = et; // Cumulative error (RSFE)
            const mad = absEt; // Mean Absolute Deviation (MAD)
            const bka = totalPeriod// Upper control bound
            const bkb = -totalPeriod; // Lower control bound
            const AverageApe = ape / totalPeriod;

            return {
                period: option.period,
                month: option.month,
                dt,
                t2,
                tdt,
                ft,
                absEt,
                kumAbsEt: absEt, // Placeholder for cumulative ABS error
                rsfe,
                mad,
                ape,
                ts: rsfe / (mad || 1), // Tracking signal (Avoid divide by zero)
                bka,
                bkb,
            };
        });

        return { results, b, a, AverageApe };
    };


    const { results, b, a, AverageApe } = calculateResults();

    const totals: CalculationTotals = results.reduce((sum, r) => ({
        dt: sum.dt + r.dt,
        t2: sum.t2 + r.t2,
        tdt: sum.tdt + r.tdt,
        ft: sum.ft + r.ft,
        absEt: sum.absEt + r.absEt,
        kumAbsEt: sum.kumAbsEt + r.kumAbsEt,
        rsfe: sum.rsfe + r.rsfe,
        mad: sum.mad + r.mad,
        ape: sum.ape + r.ape,
        ts: sum.ts + r.ts,
        bka: sum.bka + r.bka,
        bkb: sum.bkb + r.bkb

    }), {
        dt: 0,
        t2: 0,
        tdt: 0,
        ft: 0,
        absEt: 0,
        kumAbsEt: 0,
        rsfe: 0,
        mad: 0,
        ape: 0,
        ts: 0,
        bka: 0,
        bkb: 0
    });
    const handleExport = () => {
        // Membuat worksheet dari data
        const worksheet = XLSX.utils.json_to_sheet(results.map(result => ({
            Period: result.period,
            Month: result.month,
            'Penjualan d(t)': result.dt.toFixed(2),
            'T²': result.t2,
            'T * d(t)': result.tdt.toFixed(2),
            'F(t)': result.ft.toFixed(5),
            'ABS e(t)': result.absEt.toFixed(5),
            'Kumulatif ABS e(t)': result.kumAbsEt.toFixed(5),
            RSFE: result.rsfe.toFixed(5),
            MAD: result.mad.toFixed(5),
            APE: `${result.ape.toFixed(2)}%`,
            ts: result.ts.toFixed(2),
            BKA: result.bka.toFixed(2),
            BKB: result.bkb.toFixed(2)
        })));

        // Membuat workbook dan menambahkan worksheet
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Data Tabel");

        // Menyimpan file Excel
        XLSX.writeFile(workbook, "data_tabel.xlsx");
    };
    return (
        <div className="mt-8">
            <div className=" mb-6">
                <button
                    className="px-4 py-2 text-sm bg-green-400 text-gray-600 rounded-lg hover:bg-green-300 flex "
                    onClick={handleExport}
                >
                    <Table />
                    <div className="ml-3">Export to Spreadsheet</div>
                </button>
            </div>
            <div className="overflow-x-auto rounded-lg shadow">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            {[
                                'Period', 'Month', 'Penjualan d(t)', 'T²', 'T * d(t)', 'F(t)', 'ABS e(t)',
                                'Kumulatif ABS e(t)', 'RSFE', 'MAD', 'APE', 'ts',
                                'BKA', 'BKB'
                            ].map((header, index) => (
                                <th
                                    key={index}
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"
                                >
                                    {header}
                                </th>
                            ))}
                        </tr>
                    </thead>

                    <tbody className="bg-white divide-y divide-gray-200">
                        {results.map((result, rowIndex) => (
                            <tr key={result.period} className={rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{result.period}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{result.month}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{result.dt.toFixed(2)}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{result.t2}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{result.tdt.toFixed(2)}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{result.ft.toFixed(5)}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{result.absEt.toFixed(5)}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{result.kumAbsEt.toFixed(5)}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{result.rsfe.toFixed(5)}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{result.mad.toFixed(5)}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{result.ape.toFixed(2)}%</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{result.ts.toFixed(2)}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{result.bka.toFixed(2)}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{result.bkb.toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>

                    <tfoot className="bg-gray-50">
                        <tr>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">Total</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"></td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">{totals.dt.toFixed(0)}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">{totals.t2}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">{totals.tdt.toFixed(0)}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">{totals.ft.toFixed(2)}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">{totals.absEt.toFixed(3)}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">{totals.kumAbsEt.toFixed(2)}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">{totals.rsfe.toFixed(2)}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">{totals.mad.toFixed(2)}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">{totals.ape.toFixed(2)}%</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">{totals.ts.toFixed(2)}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">{totals.bka.toFixed(2)}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">{totals.bkb.toFixed(2)}</td>
                        </tr>

                    </tfoot>
                </table>

            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-lg shadow">
                    <h3 className="text-sm font-medium text-gray-500">Value of a</h3>
                    <p className="mt-2 text-lg font-semibold text-gray-900">
                        {a.toFixed(6)}
                    </p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                    <h3 className="text-sm font-medium text-gray-500">Value of b</h3>
                    <p className="mt-2 text-lg font-semibold text-gray-900">
                        {b.toFixed(6)}
                    </p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                    <h3 className="text-sm font-medium text-gray-500">Average APE</h3>
                    <p className="mt-2 text-lg font-semibold text-gray-900">
                        {AverageApe}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ForecastResultsTable;