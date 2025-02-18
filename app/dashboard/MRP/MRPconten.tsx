import React, { useState, FormEvent } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SendHorizontal } from 'lucide-react';
// Updated interfaces
interface TableData {
    [key: string]: string[];
}

interface EntryData {
    namakomponen: string;
    persediaanawal: string;
    pesanan: string;
    biayapesanan: string;
    biayasimpan: string;
    leadtime: string;
    lotsize: string;
}

const MrpTable = () => {
    // State for production planning
    const [namaProduk, setNamaProduk] = useState<string>('');
    const [jumlahperiode, setjumlahperiode] = useState<string>('');
    const [jumlahRencanaProduksi, setjumlahRencanaProduksi] = useState<string>('');

    // State for entry data
    const [namakomponen, setnamakomponen] = useState<string>('');
    const [persediaanawal, setpersediaanawal] = useState<string>('');
    const [pesanan, setpesanan] = useState<string>('');
    const [biayapesanan, setbiayapesanan] = useState<string>('');
    const [biayasimpan, setbiayasimpan] = useState<string>('');
    const [leadtime, setleadtime] = useState<string>('');
    const [lotsize, setlotsize] = useState<string>('LFL');

    // State for tables
    const [tabelData, settabelData] = useState<TableData>({});
    const [entryDataList, setEntryDataList] = useState<EntryData[]>([]);

    const handleTambahDataPerhitungan = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!namaProduk || !jumlahperiode || !jumlahRencanaProduksi) {
            alert('Please fill in all fields');
            return;
        }

        if (parseInt(jumlahperiode) < 1 || parseInt(jumlahperiode) > 24) {
            alert('jumlahperiode must be between 1 and 24');
            return;
        }

        settabelData(prevData => ({
            ...prevData,
            [namaProduk]: prevData[namaProduk] ?
                prevData[namaProduk].map((val: string, idx: number) =>
                    idx === parseInt(jumlahperiode) - 1 ? jumlahRencanaProduksi : val
                ) :
                Array(24).fill('').map((val: string, idx: number) =>
                    idx === parseInt(jumlahperiode) - 1 ? jumlahRencanaProduksi : val
                )
        }));

        setNamaProduk('');
        setjumlahperiode('');
        setjumlahRencanaProduksi('');
    };

    const handledtambahdataentry = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!namakomponen || !biayapesanan || !biayasimpan || !leadtime || !lotsize) {
            alert('Please fill in all required fields');
            return;
        }

        const newEntryData: EntryData = {
            namakomponen,
            persediaanawal,
            pesanan,
            biayapesanan,
            biayasimpan,
            leadtime,
            lotsize
        };

        setEntryDataList(prevList => {
            // Check if component already exists
            const existingIndex = prevList.findIndex(item => item.namakomponen === namakomponen);

            if (existingIndex !== -1) {
                // Update existing entry
                const updatedList = [...prevList];
                updatedList[existingIndex] = newEntryData;
                return updatedList;
            } else {
                // Add new entry
                return [...prevList, newEntryData];
            }
        });

        // Clear form
        setnamakomponen('');
        setpersediaanawal('');
        setpesanan('');
        setbiayapesanan('');
        setbiayasimpan('');
        setleadtime('');
        setlotsize('LFL');
    };

    return (
        <div className="max-w-6xl mx-auto p-4 space-y-6">

            <div className="grid grid-cols-2 gap-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Data Perhitungan : </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <form onSubmit={handleTambahDataPerhitungan}>
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium mb-1">Masukkan nama produk</label>
                                    <input
                                        type="text"
                                        value={namaProduk}
                                        placeholder="Produk X"
                                        onChange={(e) => setNamaProduk(e.target.value)}
                                        className="w-full p-2 border rounded"
                                    />
                                    <label className="block text-sm font-medium mb-1">periode Ke : </label>
                                    <input
                                        type="number"
                                        value={jumlahperiode}
                                        onChange={(e) => setjumlahperiode(e.target.value)}
                                        placeholder="1"
                                        className="w-full p-2 border rounded"
                                    />
                                    <label className="block text-sm font-medium mb-1">Jumlah Rencana Produksi </label>
                                    <input
                                        type="number"
                                        value={jumlahRencanaProduksi}
                                        onChange={(e) => setjumlahRencanaProduksi(e.target.value)}
                                        placeholder="250"
                                        className="w-full p-2 border rounded"
                                    />
                                    <button
                                        type='submit'
                                        className="w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                                    >
                                        Tambah Data
                                    </button>
                                </div>
                            </form>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Data Entry</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handledtambahdataentry}>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Nama Komponen (Part)</label>
                                    <input
                                        value={namakomponen}
                                        onChange={(e) => setnamakomponen(e.target.value)}
                                        type="text"
                                        className="w-full p-2 border rounded"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Initial Inventory (unit)</label>
                                    <input
                                        value={persediaanawal}
                                        onChange={(e) => setpersediaanawal(e.target.value)}
                                        type="number"
                                        className="w-full p-2 border rounded"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">On Order</label>
                                    <input
                                        type="text"
                                        value={pesanan}
                                        onChange={(e) => setpesanan(e.target.value)}
                                        className="w-full p-2 border rounded"
                                        placeholder="e.g., 100 (Bln 3)"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Biaya Pesan (Rp/Unit)</label>
                                    <input
                                        type="number"
                                        value={biayapesanan}
                                        onChange={(e) => setbiayapesanan(e.target.value)}
                                        className="w-full p-2 border rounded"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Biaya Simpan (Rp/Unit)</label>
                                    <input
                                        type="number"
                                        value={biayasimpan}
                                        onChange={(e) => setbiayasimpan(e.target.value)}
                                        className="w-full p-2 border rounded"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Lead Time</label>
                                    <input
                                        onChange={(e) => setleadtime(e.target.value)}
                                        type="number"
                                        value={leadtime}
                                        className="w-full p-2 border rounded"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Lot Size</label>
                                    <select
                                        value={lotsize}
                                        onChange={(e) => setlotsize(e.target.value)}
                                        className="w-full p-2 border rounded"
                                    >
                                        <option value="LFL">LFL</option>
                                        <option value="FOQ">FOQ</option>
                                        <option value="EOQ">EOQ</option>
                                    </select>
                                </div>
                                <button
                                    type="submit"
                                    className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                                >
                                    Add/Update Row Data
                                </button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardContent className="pt-6">
                    {/* Production Planning Table */}
                    <div className="overflow-x-auto">
                        <div className="flex justify-end">
                            <button className="rounded-md bg-green-600 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-green-700 focus:shadow-none active:bg-green-700 hover:bg-green-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none ml-2" type="button">
                                <div className="flex items-center justify-center gap-2">
                                    <SendHorizontal className="w-4 h-4" />
                                    <span>Solve</span>
                                </div>
                            </button>
                        </div>
                        <h3 className="text-lg font-semibold mb-4">Production Planning Data</h3>
                        <table className="w-full border-collapse border border-gray-300">
                            <thead>
                                <tr>
                                    <th rowSpan={2} className="border border-gray-300 p-2">Produk</th>
                                    <th colSpan={24} className="border border-gray-300 p-2">Periode</th>
                                </tr>
                                <tr>
                                    {[...Array(24)].map((_, idx) => (
                                        <th key={idx} className="border border-gray-300 p-2">{idx + 1}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {Object.entries(tabelData).map(([product, values]) => (
                                    <tr key={product}>
                                        <td className="border border-gray-300 p-2">{product}</td>
                                        {values.map((value, index) => (
                                            <td key={index} className="border border-gray-300 p-2">
                                                {value || ''}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Entry Data Table */}
                    <div className="overflow-x-auto mt-8">
                        <h3 className="text-lg font-semibold mb-4">Entry Data</h3>
                        <table className="w-full border-collapse border border-gray-300">
                            <thead>
                                <tr>
                                    <th className="border border-gray-300 p-2">Part</th>
                                    <th className="border border-gray-300 p-2">Initial Inventory (unit)</th>
                                    <th className="border border-gray-300 p-2">On Order</th>
                                    <th className="border border-gray-300 p-2">Biaya Pesan (Rp/Unit)</th>
                                    <th className="border border-gray-300 p-2">Biaya Simpan (Rp/Unit)</th>
                                    <th className="border border-gray-300 p-2">Lead Time</th>
                                    <th className="border border-gray-300 p-2">Lot Size</th>
                                </tr>
                            </thead>
                            <tbody>
                                {entryDataList.map((entry, index) => (
                                    <tr key={index}>
                                        <td className="border border-gray-300 p-2">{entry.namakomponen}</td>
                                        <td className="border border-gray-300 p-2">{entry.persediaanawal}</td>
                                        <td className="border border-gray-300 p-2">{entry.pesanan}</td>
                                        <td className="border border-gray-300 p-2">Rp {entry.biayapesanan}</td>
                                        <td className="border border-gray-300 p-2">Rp {entry.biayasimpan}</td>
                                        <td className="border border-gray-300 p-2">{entry.leadtime}</td>
                                        <td className="border border-gray-300 p-2">{entry.lotsize}</td>
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

export default MrpTable;