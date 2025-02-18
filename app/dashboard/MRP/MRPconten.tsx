import React, { useState, FormEvent } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";


// Deklarasi Interface berdasarkan penulisan typescript
interface TableData {
    [key: string]: string[];
}

const MrpTable = () => {

    // Persiapkan state untuk inputan yang aka digunakan
    const [namaProduk, setNamaProduk] = useState<string>('');
    const [jumlahperiode, setjumlahperiode] = useState<string>('');
    const [jumlahRencanaProduksi, setjumlahRencanaProduksi] = useState<string>('');


    // Persiapkan state untuk tablenya.
    const [tabelData, settabelData] = useState<TableData>({});

    const handleTambahDataPerhitungan = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Validate inputs
        if (!namaProduk || !jumlahperiode || !jumlahRencanaProduksi) {
            alert('Please fill in all fields');
            return;
        }

        if (parseInt(jumlahperiode) < 1 || parseInt(jumlahperiode) > 24) {
            alert('jumlahperiode must be between 1 and 8');
            return;
        }

        // Update table data
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

        // Clear form
        setNamaProduk('');
        setjumlahperiode('');
        setjumlahRencanaProduksi('');
    };
    return (
        <div className="max-w-6xl mx-auto p-4 space-y-6">
            <div className="grid grid-cols-2 gap-4">
                <Card>
                    <CardHeader>
                        <div className=""

                        >
                            <CardTitle>Data Perhitungan : </CardTitle>
                        </div>
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
                                    <label className="block text-sm font-medium mb-1">periode Ke :  </label>
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
                            <div className="flex flex-wrap gap-2">

                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <div className=""

                        >
                            <CardTitle>Data Entry</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleTambahDataPerhitungan}>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Nama Komponen (Item) </label>
                                    <input
                                        type="text"
                                        className="w-full p-2 border rounded"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Persediaan Awal</label>
                                    <input
                                        type="number"
                                        className="w-full p-2 border rounded"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Pesanan (On Order)</label>
                                    <input
                                        type="number"

                                        className="w-full p-2 border rounded"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Biaya Pesan (Rp / Unit)</label>
                                    <input
                                        type="number"

                                        className="w-full p-2 border rounded"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Lead Time</label>
                                    <input
                                        type="number"

                                        className="w-full p-2 border rounded"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Lost Size</label>
                                    <select
                                        className="w-full p-2 border rounded"
                                    >
                                        <option value="">LFL</option>
                                        <option value="">FOQ</option>
                                        <option value="">EOQ</option>

                                    </select>
                                </div>
                                <button

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
                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="mt-5 w-full border-collapse border border-gray-300">
                            <thead>
                                <tr>
                                    <th rowSpan={2} className="border border-gray-300 p-2">Produk</th>
                                    <th colSpan={24} className="border border-gray-300 p-2">Periode</th>
                                </tr>
                                <tr>
                                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24].map((num) => (
                                        <th key={num} className="border border-gray-300 p-2">{num}</th>
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
                </CardContent>
            </Card>
        </div>
    );
};

export default MrpTable;