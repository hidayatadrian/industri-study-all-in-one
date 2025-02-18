import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import * as XLSX from 'xlsx';

interface SavedDataType {
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

const AgregateResultChase = () => {
    const [savedData, setSavedData] = useState<SavedDataType | null>(null);
    const [columns, setColumns] = useState<string[]>([]);
    const [totals, setTotals] = useState<number[]>([]);
    const [HariKerja, setHariKerja] = useState<number[]>([]);
    const [jumlahTK, setjumlahTK] = useState<number[]>([]);
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
    const [biayaTKReguler, setBiayaTKReguler] = useState<number[]>([]);
    const [biayaHiring, setBiayaHiring] = useState<number[]>([]);
    const [biayaFiring, setBiayaFiring] = useState<number[]>([]);
    const [totalBiaya, setTotalBiaya] = useState<number[]>([]);

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

                    // Perhitungan jumlah TK per index
                    const jumlahTKPerIndex = calculatedRoundups.map((roundup, index) => {
                        const result = roundup / (jamKerja[0] * workDays[index]);
                        return Math.ceil(result);
                    });
                    setjumlahTK(jumlahTKPerIndex);

                    // Perhitungan Hiring TK
                    const hiringTK = jumlahTKPerIndex.map((tk, index) => {
                        if (index === 0) {
                            return Math.max(tk - tenagakerja[0], 0);
                        } else {
                            return Math.max(tk - jumlahTKPerIndex[index - 1], 0);
                        }
                    });
                    setHiringTK(hiringTK);

                    // Perhitungan Firing TK
                    const firingTK = jumlahTKPerIndex.map((tk, index) => {
                        if (index === 0) {
                            return Math.max(tenagakerja[0] - tk, 0);
                        } else {
                            return Math.max(jumlahTKPerIndex[index - 1] - tk, 0);
                        }
                    });
                    setFiringTK(firingTK);

                    // Perhitungan Biaya TK Reguler
                    const biayaTKReguler = calculatedRoundups.map((produksi, index) => {
                        const biayaPerTK = Math.ceil(data.costs.umr / (jamKerja[0] * workDays[index]));
                        return produksi * biayaPerTK;
                    });
                    setBiayaTKReguler(biayaTKReguler);

                    // Perhitungan Biaya Hiring
                    const biayaHiring = hiringTK.map(hiring => hiring * data.costs.biayaHiring);
                    setBiayaHiring(biayaHiring);

                    // Perhitungan Biaya Firing
                    const biayaFiring = firingTK.map(firing => firing * data.costs.biayaFiring);
                    setBiayaFiring(biayaFiring);

                    // Perhitungan Total Biaya
                    const totalBiaya = biayaTKReguler.map((biayaRegular, index) =>
                        biayaRegular + biayaHiring[index] + biayaFiring[index]
                    );
                    setTotalBiaya(totalBiaya);
                }
            }
        } catch (error) {
            console.error("Error loading data:", error);
        }
    }, []);

    // Fungsi format ke Rupiah
    const formatToRupiah = (number: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR'
        }).format(number);
    };

    // Fungsi untuk mengekspor ke Excel
    const exportToExcel = () => {
        const wsData = [];

        // Header untuk tabel pertama
        wsData.push(["Bulan", "Kebutuhan Produksi", "Jam Kerja", "Hari Kerja", "Jumlah TK", "Produksi", "Persediaan", "Hiring TK", "Firing TK"]);
        // Data untuk tabel pertama
        (savedData?.tableData ?? []).forEach((row, index) => {
            wsData.push([
                row.month,
                roundups[index] || 0,
                jamKerjaArray[0],
                HariKerja[index],
                jumlahTK[index],
                roundups[index] || 0,
                roundups[index] - roundups[index],
                hiringTK[index],
                firingTK[index]
            ]);
        });

        // Tambahkan 3 baris kosong
        wsData.push([], [], []);

        // Header untuk tabel kedua
        wsData.push(["Bulan", "Biaya TK Reguler", "Biaya Hiring", "Biaya Firing", "Total Biaya"]);
        // Data untuk tabel kedua
        (savedData?.tableData ?? []).forEach((row, index) => {
            wsData.push([
                row.month,
                formatToRupiah(biayaTKReguler[index] || 0),
                formatToRupiah(biayaHiring[index] || 0),
                formatToRupiah(biayaFiring[index] || 0),
                formatToRupiah(totalBiaya[index] || 0)
            ]);
        });

        // Tambahkan 3 baris kosong
        wsData.push([], [], []);

        // Total Biaya
        wsData.push(["Total", formatToRupiah(biayaTKReguler.reduce((acc, curr) => acc + curr, 0)), formatToRupiah(biayaHiring.reduce((acc, curr) => acc + curr, 0)), formatToRupiah(biayaFiring.reduce((acc, curr) => acc + curr, 0)), formatToRupiah(totalBiaya.reduce((acc, curr) => acc + curr, 0))]);

        // Buat worksheet
        const ws = XLSX.utils.aoa_to_sheet(wsData);

        // Buat workbook dan tambahkan worksheet
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Agregat Chase Strategy");

        // Simpan file
        XLSX.writeFile(wb, "agregat_chase_strategy.xlsx");
    };

    return (
        <div className="max-w-6xl mx-auto p-2 space-y-6">
            {/* Data chase  */}
            <Card className='shadow-lg'>
                <CardHeader className="border-b border-blue-200 mb-5 bg-orange-300">
                    <div className="flex justify-between items-center">
                        <CardTitle className="text-neutral-800">Kebutuhan Agregat Chase</CardTitle>
                        <button onClick={exportToExcel} className="bg-green-400 hover:bg-green-500  text-white px-4 py-2 rounded">
                            Export to Excel
                        </button>
                    </div>
                </CardHeader>
                <CardContent>
                    {/* Render the data as needed */}
                    <div className="overflow-x-auto">
                        <table className='w-full border-collapse rounded-lg overflow-hidden shadow-sm mt-5'>
                            <thead className='bg-orange-300'>
                                <tr>
                                    <th className="border border-blue-200 p-3 text-left text-neutral-800 font-semibold">
                                        Bulan
                                    </th>
                                    <th className="border border-blue-200 p-3 text-left text-neutral-800 font-semibold">
                                        Kebutuhan Produksi
                                    </th>
                                    <th className="border border-blue-200 p-3 text-left text-neutral-800 font-semibold">
                                        Jam Kerja
                                    </th>
                                    <th className="border border-blue-200 p-3 text-left text-neutral-800 font-semibold">
                                        Hari Kerja
                                    </th>
                                    <th className="border border-blue-200 p-3 text-left text-neutral-800 font-semibold">
                                        Jumlah TK
                                    </th>
                                    <th className="border border-blue-200 p-3 text-left text-neutral-800 font-semibold">
                                        Produksi
                                    </th>
                                    <th className="border border-blue-200 p-3 text-left text-neutral-800 font-semibold">
                                        Persediaan
                                    </th>
                                    <th className="border border-blue-200 p-3 text-left text-neutral-800 font-semibold">
                                        Hiring TK
                                    </th>
                                    <th className="border border-blue-200 p-3 text-left text-neutral-800 font-semibold">
                                        Firing TK
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {(savedData?.tableData ?? []).map((row, index) => (
                                    <tr key={index}>
                                        <td className="border border-blue-200 p-3">{row.month}</td>
                                        <td className="border border-blue-200 p-3">{roundups[index] || 0}</td>
                                        <td className="border border-blue-200 p-3">{jamKerjaArray}</td>
                                        <td className="border border-blue-200 p-3">{HariKerja[index]}</td>
                                        <td className="border border-blue-200 p-3">{jumlahTK[index]}</td>
                                        <td className="border border-blue-200 p-3">{roundups[index] || 0}</td>
                                        <td className="border border-blue-200 p-3">{roundups[index] - roundups[index]}</td>
                                        <td className="border border-blue-200 p-3">{hiringTK[index]}</td>
                                        <td className="border border-blue-200 p-3">{firingTK[index]}</td>
                                    </tr>
                                ))}

                            </tbody>
                        </table>
                    </div>
                </CardContent>
                {/* Perhitungan biaya chase */}
                <CardHeader className='bg-orange-300'>
                    <CardTitle>Perhitungan Biaya Chase Strategy</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className='w-full border-collapse rounded-lg overflow-hidden shadow-sm mt-5'>
                            <thead className='bg-orange-300'>
                                <tr>
                                    <th className="border border-blue-200 p-3 text-left text-neutral-800 font-semibold">
                                        Bulan
                                    </th>
                                    <th className="border border-blue-200 p-3 text-left text-neutral-800 font-semibold">
                                        Biaya TK reguler
                                    </th>
                                    <th className="border border-blue-200 p-3 text-left text-neutral-800 font-semibold">
                                        Biaya Hiring
                                    </th>
                                    <th className="border border-blue-200 p-3 text-left text-neutral-800 font-semibold">
                                        Biaya Firing
                                    </th>
                                    <th className="border border-blue-200 p-3 text-left text-neutral-800 font-semibold">
                                        Total Biaya
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {(savedData?.tableData ?? []).map((row, index) => (
                                    <tr key={index}>
                                        <td className="border border-blue-200 p-3">{row.month}</td>
                                        <td className="border border-blue-200 p-3">{formatToRupiah(biayaTKReguler[index] || 0)}</td>
                                        <td className="border border-blue-200 p-3">{formatToRupiah(biayaHiring[index] || 0)}</td>
                                        <td className="border border-blue-200 p-3">{formatToRupiah(biayaFiring[index] || 0)}</td>
                                        <td className="border border-blue-200 p-3">{formatToRupiah(totalBiaya[index] || 0)}</td>
                                    </tr>
                                ))}
                                <tr className="bg-gray-100 font-semibold">
                                    <td className="border border-blue-200 p-3">Total</td>
                                    <td className="border border-blue-200 p-3">
                                        {formatToRupiah(biayaTKReguler.reduce((acc, curr) => acc + curr, 0))}
                                    </td>
                                    <td className="border border-blue-200 p-3">
                                        {formatToRupiah(biayaHiring.reduce((acc, curr) => acc + curr, 0))}
                                    </td>
                                    <td className="border border-blue-200 p-3">
                                        {formatToRupiah(biayaFiring.reduce((acc, curr) => acc + curr, 0))}
                                    </td>
                                    <td className="border border-blue-200 p-3">
                                        {formatToRupiah(totalBiaya.reduce((acc, curr) => acc + curr, 0))}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card >
        </div>

    );
};

export default AgregateResultChase;