import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import * as XLSX from 'xlsx';

interface SavedDataType {
    columns: { name: string }[];
    costs: {
        biayaHiring: number;
        biayaFiring:number;
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

const AgregateResultPure = () => {
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

    useEffect(() => {
        const rawData = localStorage.getItem("agregatData");
        const data: SavedDataType = rawData ? JSON.parse(rawData) : null;
        let dataagregasi: number[] = [];
        let dataharikerja: number[] = [];

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

                    const perhitunganpersediaan = perhitunganjumlahproduksi.map((jumlahProduksi, index) => {
                        return jumlahProduksi - calculatedRoundups[index];
                    });
                    setPersediaan(perhitunganpersediaan);

                    const kumulatifPersediaanCalc = perhitunganpersediaan.reduce((acc: number[], curr: number, index: number) => {
                        if (index === 0) {
                            return [curr];
                        }
                        return [...acc, acc[index - 1] + curr];
                    }, []);
                    setKumulatifPersediaan(kumulatifPersediaanCalc);

                    const perhitunganjumlahproduksibaru = dataharikerja.map((hariKerja) => {
                        return rumusperhitungantkideal * jamKerja[0] * hariKerja;
                    });
                    setJumlahProduksibaru(perhitunganjumlahproduksibaru);

                    const perhitunganpersediaanbaru = perhitunganjumlahproduksibaru.map((jumlahProduksibaru, index) => {
                        return jumlahProduksibaru - calculatedRoundups[index];
                    });
                    setPersediaanbaru(perhitunganpersediaanbaru);

                    const kumulatifPersediaanbaruCalc = perhitunganpersediaanbaru.reduce((acc: number[], curr: number, index: number) => {
                        if (index === 0) {
                            return [curr];
                        }
                        return [...acc, acc[index - 1] + curr];
                    }, []);
                    setKumulatifPersediaanbaru(kumulatifPersediaanbaruCalc);
                }
            }
        } catch (error) {
            console.error("Error loading data:", error);
        }
    }, []);

    const exportToExcel = () => {
        if (!savedData) return;

        // Create a new workbook
        const wb = XLSX.utils.book_new();

        // Prepare all data with spacing between tables
        const allData = [
            // Title for Data Jam Kerja
            ["DATA JAM KERJA"],
            ["Jam Kerja", "Tenaga Kerja", "Perhitungan Tenaga Kerja Ideal"],
            ...jamKerjaArray.map((jam, index) => [
                jam,
                TenagaKerjaArray[index],
                perhitungantkideal[index]
            ]),
            // Empty rows for spacing
            [],
            [],
            // Title for Skenario 1
            ["SKENARIO 1"],
            ["Bulan", "Kebutuhan Produksi", "Jumlah Produksi", "Persediaan", "Kumulatif Persediaan", "Hiring"],
            ...savedData.tableData.map((row, index) => [
                row.month,
                roundups[index] || 0,
                jumlahProduksi[index] || 0,
                persediaan[index] || 0,
                kumulatifPersediaan[index] || 0,
                persediaan[index] || 0
            ]),
            // Empty rows for spacing
            [],
            [],
            // Title for Skenario 2
            ["SKENARIO 2"],
            ["Bulan", "Kebutuhan Produksi", "Jumlah Produksi", "Persediaan", "Kumulatif Persediaan", "Hiring"],
            ...savedData.tableData.map((row, index) => [
                row.month,
                roundups[index] || 0,
                jumlahProduksibaru[index] || 0,
                persediaanbaru[index] || 0,
                kumulatifPersediaanbaru[index] || 0,
                persediaanbaru[index] || 0
            ]),
            // Empty rows for spacing
            [],
            [],
            // Title for Perhitungan Biaya
            ["PERHITUNGAN BIAYA"],
            ["Bulan", "Biaya TK Reguler", "Biaya Hiring", "Biaya Simpan", "Total Biaya"],
            ...savedData.tableData.map((row, index) => {
                const biayaTKReguler = savedData.costs
                    ? (Math.ceil(savedData.costs.umr / (savedData.datakerja.jamkerja * row.workDays))) * (jumlahProduksibaru[index] || 0)
                    : 0;
                const biayaHiring = savedData.costs.biayaHiring;
                const biayaSimpan = savedData.costs.biayasimpan * (persediaanbaru[index] || 0);
                const totalBiaya = biayaTKReguler + biayaHiring + biayaSimpan;

                return [
                    row.month,
                    biayaTKReguler,
                    biayaHiring,
                    biayaSimpan,
                    totalBiaya
                ];
            })
        ];

        // Create worksheet
        const ws = XLSX.utils.aoa_to_sheet(allData);

        // Set column widths
        const cols = [];
        for (let i = 0; i < 6; i++) {
            cols.push({ wch: 15 }); // Set width to 15 characters for all columns
        }
        ws['!cols'] = cols;

        // Get the range of the worksheet
        const range = XLSX.utils.decode_range(ws['!ref'] || 'A1');

        // Create a new range that includes all our data
        const newRange = {
            s: { r: 0, c: 0 },
            e: { r: range.e.r, c: range.e.c }
        };
        ws['!ref'] = XLSX.utils.encode_range(newRange);

        // Add the worksheet to the workbook
        XLSX.utils.book_append_sheet(wb, ws, "Agregat Planning");

        // Export the workbook
        try {
            XLSX.writeFile(wb, "Agregat_Requirement_Pure_Strategy.xlsx");
        } catch (error) {
            console.error("Error exporting to Excel:", error);
        }
    };


    
    return (
        <div className="max-w-6xl mx-auto p-4 space-y-6">
            {/* Keep the first two cards exactly as they were */}
            <Card className="shadow-lg">
                <Card className="shadow-lg">
                    <CardHeader className="bg-blue-50 border-b border-blue-200 mb-5">
                        <div className="flex justify-between items-center">
                            <CardTitle className="text-blue-800">Kebutuhan Agregat Pure</CardTitle>
                            <button onClick={exportToExcel} className="bg-green-400 hover:bg-green-500 text-white px-4 py-2 rounded">
                                Export to Excel
                            </button>
                        </div>
                    </CardHeader>
                </Card>

                <CardContent>
                    {/* Previous cards remain the same until the scenario cards */}
                    <Card className="shadow-lg">
                        <CardHeader className="bg-blue-50 border-b border-blue-200">
                            <CardTitle className="text-blue-800">Data Jam Kerja</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <table className="w-full border-collapse rounded-lg overflow-hidden shadow-sm mt-5">
                                    <thead className="bg-blue-100">
                                        <tr>
                                            <th className="border border-blue-200 p-3 text-left text-blue-700 font-semibold">
                                                Jam Kerja
                                            </th>
                                            <th className="border border-blue-200 p-3 text-left text-blue-700 font-semibold">
                                                Tenaga Kerja
                                            </th>
                                            <th className="border border-blue-200 p-3 text-left text-blue-700 font-semibold">
                                                Perhitungan Tenaga Kerja Ideal
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {jamKerjaArray.length > 0 ? (
                                            jamKerjaArray.map((jam, index) => (
                                                <tr
                                                    key={index}
                                                    className={`${index % 2 === 0 ? 'bg-white' : 'bg-blue-50'} hover:bg-blue-100 transition-colors`}
                                                >
                                                    <td className="border border-blue-200 p-3">{jam}</td>
                                                    <td className="border border-blue-200 p-3">{TenagaKerjaArray[index]}</td>
                                                    <td className="border border-blue-200 p-3">{perhitungantkideal}</td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td
                                                    colSpan={3}
                                                    className="border border-blue-200 p-3 text-center text-gray-500"
                                                >
                                                    Tidak ada data jam kerja untuk ditampilkan.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                    {/* Scenario 1 Card */}
                    <Card className="shadow-lg">
                        <CardHeader className="bg-blue-50 border-b border-blue-200">
                            <CardTitle className="text-blue-800">Skenario 1 (Tenaga Kerja Awal)</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <table className="w-full border-collapse rounded-lg overflow-hidden shadow-sm mt-5">
                                    <thead className="bg-blue-100">
                                        <tr>
                                            {['Bulan', 'Kebutuhan Produksi', 'Jumlah Produksi', 'Persediaan', 'Kumulatif Persediaan', 'Hiring'].map((header) => (
                                                <th
                                                    key={header}
                                                    className="border border-blue-200 p-3 text-left text-blue-700 font-semibold whitespace-nowrap"
                                                >
                                                    {header}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {savedData?.tableData && savedData.tableData.length > 0 ? (
                                            savedData.tableData.map((row, index) => (
                                                <tr
                                                    key={index}
                                                    className={`${index % 2 === 0 ? 'bg-white' : 'bg-blue-50'} hover:bg-blue-100 transition-colors`}
                                                >
                                                    <td className="border border-blue-200 p-3">{row.month}</td>
                                                    <td className="border border-blue-200 p-3">{roundups[index] || 0}</td>
                                                    <td className="border border-blue-200 p-3 font-bold">
                                                        {jumlahProduksi[index] || 0}
                                                    </td>
                                                    <td className="border border-blue-200 p-3">
                                                        {persediaan[index] || 0}
                                                    </td>
                                                    <td className="border border-blue-200 p-3">
                                                        {kumulatifPersediaan[index] || 0}
                                                    </td>
                                                    <td className="border border-blue-200 p-3">
                                                        {persediaan[index] || 0}
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td
                                                    className="border border-blue-200 p-3 text-center text-gray-500"
                                                    colSpan={6}
                                                >
                                                    Tidak ada data untuk ditampilkan.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Scenario 2 Card */}
                    <Card className="shadow-lg">
                        <CardHeader className="bg-blue-50 border-b border-blue-200">
                            <CardTitle className="text-blue-800">Skenario 2</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <table className="w-full border-collapse rounded-lg overflow-hidden shadow-sm mt-5">
                                    <thead className="bg-blue-100">
                                        <tr>
                                            {['Bulan', 'Kebutuhan Produksi', 'Jumlah Produksi', 'Persediaan', 'Kumulatif Persediaan', 'Hiring'].map((header) => (
                                                <th
                                                    key={header}
                                                    className="border border-blue-200 p-3 text-left text-blue-700 font-semibold whitespace-nowrap"
                                                >
                                                    {header}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {savedData?.tableData && savedData.tableData.length > 0 ? (
                                            savedData.tableData.map((row, index) => (
                                                <tr
                                                    key={index}
                                                    className={`${index % 2 === 0 ? 'bg-white' : 'bg-blue-50'} hover:bg-blue-100 transition-colors`}
                                                >
                                                    <td className="border border-blue-200 p-3">{row.month}</td>
                                                    <td className="border border-blue-200 p-3">{roundups[index] || 0}</td>
                                                    <td className="border border-blue-200 p-3 font-bold">
                                                        {jumlahProduksibaru[index] || 0}
                                                    </td>
                                                    <td className="border border-blue-200 p-3">
                                                        {persediaanbaru[index] || 0}
                                                    </td>
                                                    <td className="border border-blue-200 p-3">
                                                        {kumulatifPersediaanbaru[index] || 0}
                                                    </td>
                                                    <td className="border border-blue-200 p-3">
                                                        {persediaanbaru[index] || 0}
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td
                                                    className="border border-blue-200 p-3 text-center text-gray-500"
                                                    colSpan={6}
                                                >
                                                    Tidak ada data untuk ditampilkan.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                    {/* Card Perhitungan Biaya  */}
                    <Card className="shadow-lg">
                        <CardHeader className="bg-blue-50 border-b border-blue-200">
                            <CardTitle className="text-blue-800">Perhitungan Biaya</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <table className="w-full border-collapse rounded-lg overflow-hidden shadow-sm mt-5">
                                    <thead className="bg-blue-100">
                                        <tr>
                                            {['Bulan', 'Biaya TK Reguler', 'Biaya Hiring', 'Biaya simpan', 'Total Biaya'].map((header) => (
                                                <th
                                                    key={header}
                                                    className="border border-blue-200 p-3 text-left text-blue-700 font-semibold whitespace-nowrap"
                                                >
                                                    {header}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {savedData?.tableData && savedData.tableData.length > 0 ? (
                                            savedData.tableData.map((row, index) => {
                                                // Pastikan costs tersedia sebelum menghitung biaya TK Reguler
                                                const biayaTKReguler = savedData.costs
                                                    ? (Math.ceil(savedData.costs.umr / (savedData.datakerja.jamkerja * row.workDays))) * (jumlahProduksibaru[index] || 0)
                                                    : 0;
                                                const biayahiring = savedData.costs.biayaHiring;
                                                return (
                                                    <tr
                                                        key={index}
                                                        className={`${index % 2 === 0 ? 'bg-white' : 'bg-blue-50'} hover:bg-blue-100 transition-colors`}
                                                    >
                                                        {/* Kolom untuk bulan */}
                                                        <td className="border border-blue-200 p-3">{row.month}</td>

                                                        {/* Kolom biaya TK Reguler */}
                                                        <td className="border border-blue-200 p-3 font-bold text-red-600">
                                                            Rp {biayaTKReguler.toLocaleString()}
                                                        </td>

                                                        {/* Kolom biaya hiring */}
                                                        <td className="border border-blue-200 p-3 font-bold">
                                                            {biayahiring}
                                                        </td>

                                                        {/* Kolom biaya simpan */}
                                                        <td className="border border-blue-200 p-3">
                                                            {persediaan[index] || 0}
                                                        </td>

                                                        {/* Kolom total biaya */}
                                                        <td className="border border-blue-200 p-3">
                                                            {persediaan[index] || 0}
                                                        </td>
                                                    </tr>
                                                );
                                            })
                                        ) : (
                                            <tr>
                                                <td
                                                    className="border border-blue-200 p-3 text-center text-gray-500"
                                                    colSpan={columns.length + 6}
                                                >
                                                    Tidak ada data untuk ditampilkan.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>

                                </table>
                            </div>
                        </CardContent>
                    </Card>
                </CardContent>
            </Card>


        </div>
    );
};

export default AgregateResultPure;