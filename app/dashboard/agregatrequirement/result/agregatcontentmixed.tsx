import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import * as XLSX from 'xlsx';

interface SavedDataType {
    overtime: number;
    columns: { name: string }[];
    costs: {
        biayaHiring: number;
        biayaFiring: number;
        biayaLostsale: number;
        biayaSubkontrak: number;
        biayaTKOvertime: number;
        biayasimpan: number;
        kapasitassubkontrak: number;
        maxlostsale: number;
        umr: number;
    };
    datakerja: {
        jamkerja: number;
        tenagakerja: number;
    };
    tableData: {
        month: string;
        forecasts: Record<string, number>;
        workDays: number;
    }[];
}

const AgregatContentMixed = () => {
    const [savedData, setSavedData] = useState<SavedDataType | null>(null);
    const [columns, setColumns] = useState<string[]>([]);
    const [totals, setTotals] = useState<number[]>([]);
    const [HariKerja, setHariKerja] = useState<number[]>([]);
    const [totalHariKerja, totalsetHariKerja] = useState<number[]>([]);
    const [totalkebutuhanproduksi, settotalkebutuhanproduksi] = useState<number[]>([]);
    const [perhitungantkideal, setperhitungantkideal] = useState<number[]>([]);
    const [roundups, setRoundups] = useState<number[]>([]);
    const [jamKerjaArray, setJamKerjaArray] = useState<number[]>([]);
    const [TenagaKerjaArray, setTenagakerjaArray] = useState<number[]>([]);
    const [jumlahProduksi, setJumlahProduksi] = useState<number[]>([]);
    const [persediaan, setPersediaan] = useState<number[]>([]);
    const [kumulatifPersediaan, setKumulatifPersediaan] = useState<number[]>([]);
    const [jumlahProduksibaru, setJumlahProduksibaru] = useState<number[]>([]);
    const [persediaanbaru, setPersediaanbaru] = useState<number[]>([]);
    const [kumulatifPersediaanbaru, setKumulatifPersediaanbaru] = useState<number[]>([]);
    const [hiringTK, setHiringTK] = useState<number[]>([]);
    const [firingTK, setFiringTK] = useState<number[]>([]);
    const [jumlahproduksireguler, setjumlahproduksireguler] = useState<number[]>([]);
    const [hasilovertimepersen, sethasilovertimepersen] = useState<number[]>([]);
    const [produksiovertime, setproduksiovertime] = useState<number[]>([]);
    const [totalproduksi, settotalproduksi] = useState<number[]>([]);
    const [biayatk, setbiayatk] = useState<number[]>([]);
    const [biayaovertime, setbiayaovertimemixed] = useState<number[]>([]);
    const [biayasimpan, setbiayasimpan] = useState<number[]>([]);

    useEffect(() => {
        const rawData = localStorage.getItem("agregatData");
        const data: SavedDataType = rawData ? JSON.parse(rawData) : null;
        setSavedData(rawData ? JSON.parse(rawData) : null);
        let dataagregasi: number[] = [];
        let dataharikerja: number[] = [];
        console.log("Data agregat anda adalah", data);
        try {
            if (data) {
                setSavedData(data);
                const datakolom = Array.isArray(data.columns)
                    ? data.columns.map((column) => column.name)
                    : [];
                setColumns(datakolom);

                const jamKerja = data.datakerja && data.datakerja.jamkerja ? [data.datakerja.jamkerja] : [];
                setJamKerjaArray(jamKerja);

                const tenagakerja = data.datakerja && data.datakerja.tenagakerja ? [data.datakerja.tenagakerja] : [];
                setTenagakerjaArray(tenagakerja);

                if (Array.isArray(data.tableData)) {
                    const calculatedTotals = data.tableData.map((row) =>
                        Object.values(row.forecasts).reduce((acc, value) => acc + value, 0)
                    );
                    const workDays = data.tableData.map((row) => row.workDays);
                    setTotals(calculatedTotals);
                    setHariKerja(workDays);

                    const totalWorkDays = workDays.reduce((acc, curr) => acc + curr, 0);
                    totalsetHariKerja([totalWorkDays]);

                    const calculatedRoundups = calculatedTotals.map((total) => Math.ceil(total));
                    const totalkebutuhanproduksi = calculatedRoundups.reduce((acc, curr) => acc + curr, 0);
                    settotalkebutuhanproduksi([totalkebutuhanproduksi]);

                    setRoundups(calculatedRoundups);

                    const rumusperhitungantkideal = Math.ceil(totalkebutuhanproduksi / (totalWorkDays * 8));
                    setperhitungantkideal([rumusperhitungantkideal]);

                    dataagregasi = calculatedRoundups;
                    dataharikerja = workDays;

                    const perhitunganjumlahproduksi = dataharikerja.map((hariKerja) => {
                        return tenagakerja[0] * jamKerja[0] * hariKerja;
                    });
                    setJumlahProduksi(perhitunganjumlahproduksi);

                    const perhitunganjumlahproduksibaru = dataharikerja.map((hariKerja) => {
                        return rumusperhitungantkideal * jamKerja[0] * hariKerja;
                    });
                    setJumlahProduksibaru(perhitunganjumlahproduksibaru);

                    const jumlahproduksireguler = dataharikerja.map((workDays) => {
                        console.log("Tenaga kerja pertama adalah :", tenagakerja[0]);
                        console.log("Jam Kerja pertama adalah : ", jamKerja[0]);
                        console.log("Hari Kerja:", workDays);
                        return tenagakerja[0] * jamKerja[0] * workDays;
                    });
                    setjumlahproduksireguler(jumlahproduksireguler);

                    const perhitunganpersediaan = perhitunganjumlahproduksi.map((jumlahproduksireguler, index) => {
                        return calculatedRoundups[index] - jumlahproduksireguler;
                    });
                    setPersediaan(perhitunganpersediaan);

                    const kumulatifPersediaanCalc = perhitunganpersediaan.reduce((acc: number[], curr: number, index: number) => {
                        if (index === 0) {
                            return [curr];
                        }
                        return [...acc, acc[index - 1] + curr];
                    }, []);
                    setKumulatifPersediaan(kumulatifPersediaanCalc);
                    console.log("Kumulatif Persediaan:", kumulatifPersediaanCalc);

                    console.log("Nilai biayasimpan:", data?.costs?.biayasimpan);
                    const biayasimpanmixed = kumulatifPersediaanCalc.map((kumulatifPersediaan, index) => {
                        const biayasimpan = data?.costs?.biayasimpan ?? 0;
                        const persediaan = Number(kumulatifPersediaanCalc[index]);
                        console.log("Kumulatif Persediaan pada index:", kumulatifPersediaanCalc[index]);
                        return biayasimpan * persediaan;

                    });
                    setbiayasimpan(biayasimpanmixed);
                    console.log("Biaya simpan adalah : ", biayasimpanmixed);
                    console.log("Harga biaya simpan anda adalah", savedData?.costs?.biayasimpan ?? 0);

                    const overtimePercentage = data?.overtime || 0;
                    const hasilOvertimePersen = jumlahproduksireguler.map((produksiReguler) => {
                        return Math.ceil(produksiReguler * (overtimePercentage / 100));
                    });
                    sethasilovertimepersen(hasilOvertimePersen);
                    console.log("Hasil overtime persen adalah:", hasilOvertimePersen);

                    const calculateProduksiOvertime = (
                        kebutuhanProduksi: number,
                        jumlahProduksiReguler: number,
                        overtimePercentage: number
                    ): number => {
                        const overtimeCapacity = jumlahProduksiReguler * (overtimePercentage / 100);
                        const remainingProduction = kebutuhanProduksi - jumlahProduksiReguler;

                        return remainingProduction > 0
                            ? Math.min(remainingProduction, overtimeCapacity)
                            : 0;
                    };

                    console.log("calculatedRoundups:", calculatedRoundups);
                    console.log("jumlahproduksireguler:", jumlahproduksireguler);
                    console.log("workDays:", workDays);
                    console.log("data.overtime:", data.overtime);

                    const produksiOvertimeCalc = workDays.map((workDay, index) => {
                        const kebutuhanProduksi = calculatedRoundups[index] || 0;
                        const jumlahProduksiReguler = jumlahproduksireguler[index] || 0;
                        const overtimePercentage = Number(data?.overtime) || 0;

                        console.log(`Index ${index}:`);
                        console.log(`  Kebutuhan Produksi: ${kebutuhanProduksi}`);
                        console.log(`  Jumlah Produksi Reguler: ${jumlahProduksiReguler}`);
                        console.log(`  Overtime Percentage: ${overtimePercentage}`);

                        return calculateProduksiOvertime(kebutuhanProduksi, jumlahProduksiReguler, overtimePercentage);
                    });

                    console.log("Updated produksiOvertimeCalc:", produksiOvertimeCalc);
                    setproduksiovertime(produksiOvertimeCalc);

                    const totalProduksiCalc = jumlahproduksireguler.map((produksiReguler, index) =>
                        produksiReguler + produksiOvertimeCalc[index]
                    );
                    settotalproduksi(totalProduksiCalc);

                    const biayatkmixed = calculatedRoundups.map((total, index) => {
                        const biayaPerTK = Math.ceil(data.costs.umr / (jamKerja[0] * workDays[index]));
                        console.log("Jumlah jam kerja anda adalah", jamKerja);
                        console.log("Jumlah hari kerja anda adalah", workDays);
                        console.log("Umr anda adalah", data.costs.umr);
                        console.log("Jumlah produksi reguler anda", jumlahproduksireguler[index]);
                        console.log("Jumlah biaya TK anda adalah", biayaPerTK);
                        return jumlahproduksireguler[index] * biayaPerTK;
                    });
                    setbiayatk(biayatkmixed);

                    const biayaovertimemixed = workDays.map((workDay, index) => {
                        const overtimeRate = data?.overtime ? Number(data.overtime) / 100 : 0;
                        const hourlyOvertime = data.costs.umr / (jamKerja[0] * workDay);
                        const overtimeProduction = produksiOvertimeCalc[index] || 0;

                        return isNaN(overtimeProduction * overtimeRate * hourlyOvertime)
                            ? 0
                            : overtimeProduction * overtimeRate * hourlyOvertime;
                    });
                    setbiayaovertimemixed(biayaovertimemixed);

                    console.log("Biaya overtime mixednya adalah", biayaovertimemixed);
                    console.log("produksiovertime:", produksiOvertimeCalc);
                    console.log("produksiovertime length:", produksiOvertimeCalc.length);
                }
            }
        } catch (error) {
            console.error("Error loading data:", error);
        }
    }, []);

    const exportToExcel = () => {
        if (!savedData) return;

        const wb = XLSX.utils.book_new();

        // Data for the first table
        const table1Data = [
            ['Bulan', 'Kebutuhan Produksi', 'Jam Kerja', 'Hari Kerja', 'Jumlah Produksi Reguler', 'Persediaan', 'Overtime (Persen)', 'Produksi Overtime', 'Total Produksi', 'Kumulatif Persediaan'],
            ...(savedData.tableData ?? []).map((row, index) => [
                row.month,
                roundups[index] || 0,
                jamKerjaArray[0],
                HariKerja[index],
                jumlahproduksireguler[index],
                persediaan[index] || 0,
                hasilovertimepersen[index],
                produksiovertime[index],
                totalproduksi[index],
                kumulatifPersediaan[index] || 0
            ])
        ];

        // Data for the second table
        const table2Data = [
            ['Bulan', 'Biaya TK', 'Biaya Overtime', 'Biaya Simpan', 'Total Biaya'],
            ...(savedData.tableData ?? []).map((row, index) => [
                row.month,
                biayatk[index] || 0,
                biayaovertime[index] ?? '-',
                biayasimpan[index] || 0,
                HariKerja[index]
            ])
        ];

        // Combine tables with 2 empty rows in between
        const combinedData = [
            ...table1Data,
            [], [], // Two empty rows
            ...table2Data
        ];

        const ws = XLSX.utils.aoa_to_sheet(combinedData);
        XLSX.utils.book_append_sheet(wb, ws, 'Agregat Mixed');

        // Write the file
        XLSX.writeFile(wb, 'Agregat_Mixed.xlsx');
    };

    return (
        <div className="max-w-6xl mx-auto p-2 space-y-6">
            <Card className='shadow-lg'>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardTitle className="text-neutral-800">Kebutuhan Agregat Mixed</CardTitle>
                        <button
                            className="bg-gray-400 hover:bg-gray-500 text-neutral-800 px-4 py-2 rounded"
                            onClick={exportToExcel}
                        >
                            Export to Excel
                        </button>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="w-full overflow-x-auto">
                        <table className='w-full border-collapse rounded-lg overflow-hidden shadow-sm'>
                            <thead className='bg-gray-200'>
                                <tr>
                                    {['Bulan', 'Kebutuhan Produksi', 'Jam Kerja', 'Hari Kerja', 'Jumlah Produksi Reguler', 'Persediaan', 'Overtime (Persen)', 'Produksi Overtime', 'Total Produksi', 'Kumulatif Persediaan'].map((header) => (
                                        <th
                                            key={header}
                                            className="border border-blue-200 p-2 text-center text-blue-700 font-semibold text-xs whitespace-nowrap"
                                        >
                                            {header}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {(savedData?.tableData ?? []).map((row, index) => (
                                    <tr key={index} className="text-xs">
                                        <td className="border border-blue-200 p-2 text-center">{row.month}</td>
                                        <td className="border border-blue-200 p-2 text-center">{roundups[index] || 0}</td>
                                        <td className="border border-blue-200 p-2 text-center">{jamKerjaArray}</td>
                                        <td className="border border-blue-200 p-2 text-center">{HariKerja[index]}</td>
                                        <td className="border border-blue-200 p-2 text-center">{jumlahproduksireguler[index]}</td>
                                        <td className="border border-blue-200 p-2 text-center">{persediaan[index] || 0}</td>
                                        <td className="border border-blue-200 p-2 text-center">{hasilovertimepersen[index]}</td>
                                        <td className="border border-blue-200 p-2 text-center">{produksiovertime[index]}</td>
                                        <td className="border border-blue-200 p-2 text-center">{totalproduksi[index]}</td>
                                        <td className="border border-blue-200 p-2 text-center">{kumulatifPersediaan[index] || 0}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>

                <CardContent>
                    <div className="flex justify-between items-center">
                        <CardTitle className="text-neutral-800 py-5">Perhitungan Biaya Agregat Mixed</CardTitle>
                    </div>
                    <div className="w-full overflow-x-auto">
                        <table className='w-full border-collapse rounded-lg overflow-hidden shadow-sm'>
                            <thead className='bg-gray-200'>
                                <tr>
                                    {['Bulan', 'Biaya TK', 'Biaya Overtime', 'Biaya Simpan', 'Total Biaya'].map((header) => (
                                        <th
                                            key={header}
                                            className="border border-blue-200 p-2 text-center text-blue-700 font-semibold text-xs whitespace-nowrap"
                                        >
                                            {header}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {(savedData?.tableData ?? []).map((row, index) => (
                                    <tr key={index} className="text-xs">
                                        <td className="border border-blue-200 p-2 text-center">{row.month}</td>
                                        <td className="border border-blue-200 p-2 text-center">{biayatk[index] || 0}</td>
                                        <td className="border border-blue-200 p-2 text-center">
                                            {biayaovertime[index] ?? '-'}
                                        </td>
                                        <td className="border border-blue-200 p-2 text-center">{biayasimpan[index] || 0}</td>
                                        <td className="border border-blue-200 p-2 text-center">{HariKerja[index]}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default AgregatContentMixed;