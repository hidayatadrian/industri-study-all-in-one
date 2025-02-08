import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SendHorizontal, RotateCcw } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface ForecastColumn {
    id: number;
    name: string;
    initialStock: number;
    lot: number;
    wsHours: number;
}

interface TableRow {
    month: string;
    forecasts: Record<string, number>;
    workDays: number;
}

interface TooltipProps {
    text: string;
}

interface datakerja {
    jamkerja: number;
    tenagakerja: number;
}

const AgregateTable = () => {
    const [columns, setColumns] = useState<ForecastColumn[]>([]);
    const [newColumnName, setNewColumnName] = useState('');
    const [selectedMonth, setSelectedMonth] = useState('');
    const [workDays, setWorkDays] = useState('');
    const [overtime, setOvertime] = useState<number>(0);
    const [tableData, setTableData] = useState<TableRow[]>([]);
    const [initialStock, setInitialStock] = useState<number>();
    const [lot, setLot] = useState<number>();
    const [wsHours, setWsHours] = useState<number>();
    const [forecastValue, setForecastValue] = useState('');
    const [selectedColumn, setSelectedColumn] = useState('');

    // Data Pekerja
    const [tenagakerja, settenagakerja] = useState<number>();
    const [jamkerja, setjamkerja] = useState<number>();

    // State for temporary values when adding a new column
    const [newInitialStock, setNewInitialStock] = useState<number>(0);
    const [newLot, setNewLot] = useState<number>(0);
    const [newWsHours, setNewWsHours] = useState<number>(0);

    // variabel biaya
    const [biayaSubkontrak, setbiayaSubkontrak] = useState<number>(0);
    const [biayaLostsale, setbiayaLostsale] = useState<number>(0);
    const [biayaTKOvertime, setbiayaTKovertime] = useState<number>(0);
    const [biayaHiring, setbiayaHiring] = useState<number>(0);
    const [biayaFiring, setbiayaFiring] = useState<number>(0);
    const [biayasimpan, setbiayaSimpan] = useState<number>(0);
    const [umr, setUmr] = useState<number>(0);
    const [kapasitassubkontrak, setkapasitassubkontrak] = useState<number>(0);
    const [maxlostsale, setmaxlostsale] = useState<number>(0);

    //tooltip
    const [tooltipVisible, setTooltipVisible] = useState(false);
    const [tooltipText, setTooltipText] = useState('');
    const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
    const router = useRouter();

    const addColumn = () => {
        if (!newColumnName) return;
        setColumns([...columns, {
            id: Date.now(),
            name: newColumnName,
            initialStock: newInitialStock,
            lot: newLot,
            wsHours: newWsHours
        }]);
        setNewColumnName('');
        setNewInitialStock(0);
        setNewLot(0);
        setNewWsHours(0);
    };

    const removeColumn = (id: number) => {
        setColumns(columns.filter(col => col.id !== id));
        setTableData(tableData.map(row => {
            const { [id.toString()]: removed, ...forecasts } = row.forecasts;
            return { ...row, forecasts };
        }));
    };

    const addRowData = () => {
        if (!selectedMonth || !forecastValue || !workDays || !selectedColumn) return;

        const existingRow = tableData.find(row => row.month === selectedMonth);
        if (existingRow) {
            setTableData(tableData.map(row => {
                if (row.month === selectedMonth) {
                    return {
                        ...row,
                        forecasts: {
                            ...row.forecasts,
                            [selectedColumn]: Number(forecastValue)
                        }
                    };
                }
                return row;
            }));
        } else {
            setTableData([...tableData, {
                month: selectedMonth,
                forecasts: { [selectedColumn]: Number(forecastValue) },
                workDays: Number(workDays)
            }]);
        }
        setForecastValue('');
    };

    const handleMouseEnter = (event: React.MouseEvent<HTMLDivElement>, text: string) => {
        setTooltipText(text);
        setTooltipPosition({
            top: event.clientY + 10, // Position below the cursor
            left: event.clientX + 10,
        });
        setTooltipVisible(true);
    };

    const handleMouseLeave = () => {
        setTooltipVisible(false);
    };

    const pushData = () => {
        const combinedData = {
            columns: columns.map(column => ({
                id: column.id,
                name: column.name,
                initialStock: column.initialStock,
                wsHours: column.wsHours,
                lot: column.lot
            })),

            tableData: tableData.map(row => ({
                month: row.month,
                forecasts: row.forecasts,
                workDays: row.workDays
            })),

            costs: {
                biayaSubkontrak,
                biayaLostsale,
                biayaTKOvertime,
                biayaHiring,
                biayaFiring,
                biayasimpan,
                umr,
                kapasitassubkontrak,
                maxlostsale
            },
            datakerja: {
                tenagakerja,
                jamkerja,
            },
            overtime // Menyimpan nilai overtime
        };

        localStorage.setItem('agregatData', JSON.stringify(combinedData));
        console.log(combinedData);
        router.push('/dashboard/agregatrequirement/result');
    };

    const Tooltip: React.FC<TooltipProps> = ({ text }) => (
        <div className="absolute bg-white border border-gray-300 rounded shadow-lg p-2 z-10">
            {text}
        </div>
    );

    return (
        <div className="max-w-6xl mx-auto p-4 space-y-6">
            <div className="grid grid-cols-2 gap-4">
                <Card>
                    <CardHeader>
                        <div className=""
                            onMouseLeave={handleMouseLeave}
                            onMouseEnter={(e) => handleMouseEnter(e, 'Kolom yang digunakan untuk menentukan jenis peramalan')}
                        >
                            <CardTitle>Column Management</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="block text-sm font-medium mb-1">Masukkan kolom data peramalan</label>
                                <input
                                    type="text"
                                    value={newColumnName}
                                    onChange={(e) => setNewColumnName(e.target.value)}
                                    placeholder="Enter column name"
                                    className="w-full p-2 border rounded"
                                />
                                <label className="block text-sm font-medium mb-1">Persediaan Awal (Unit) </label>
                                <input
                                    type="number"
                                    value={newInitialStock}
                                    onChange={(e) => setNewInitialStock(Number(e.target.value))}
                                    placeholder="Initial Stock"
                                    className="w-full p-2 border rounded"
                                />
                                <label className="block text-sm font-medium mb-1">Ws (jam / unit) </label>
                                <input
                                    type="number"
                                    value={newWsHours}
                                    onChange={(e) => setNewWsHours(Number(e.target.value))}
                                    placeholder="Ws Hours"
                                    className="w-full p-2 border rounded"
                                />
                                <button
                                    onClick={addColumn}
                                    className="w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                                >
                                    Add Column
                                </button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {columns.map(column => (
                                    <div key={column.id} className="flex items-center bg-gray-100 rounded px-2 py-1">
                                        <span>{column.name}</span>
                                        <button
                                            onClick={() => removeColumn(column.id)}
                                            className="ml-2 text-red-500 hover:text-red-700"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <div className=""
                            onMouseLeave={handleMouseLeave}
                            onMouseEnter={(e) => handleMouseEnter(e, 'Data yang digunakan untuk proses perhitungan agregasi')}
                        >
                            <CardTitle>Data Entry</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex justify-end">
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Month</label>
                                <input
                                    type="text"
                                    value={selectedMonth}
                                    onChange={(e) => setSelectedMonth(e.target.value)}
                                    className="w-full p-2 border rounded"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Select Column</label>
                                <select
                                    value={selectedColumn}
                                    onChange={(e) => setSelectedColumn(e.target.value)}
                                    className="w-full p-2 border rounded"
                                >
                                    <option value="">Select a column</option>
                                    {columns.map(col => (
                                        <option key={col.id} value={col.id}>{col.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Forecast Value</label>
                                <input
                                    type="number"
                                    value={forecastValue}
                                    onChange={(e) => setForecastValue(e.target.value)}
                                    className="w-full p-2 border rounded"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Work Days</label>
                                <input
                                    type="number"
                                    value={workDays}
                                    onChange={(e) => setWorkDays(e.target.value)}
                                    className="w-full p-2 border rounded"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Jumlah Overtime (Dalam Persen)</label>
                                <input
                                    type="number"
                                    value={overtime}
                                    onChange={(e) => setOvertime(Number(e.target.value))}
                                    className="w-full p-2 border rounded"
                                />
                            </div>
                            <button
                                onClick={addRowData}
                                className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                            >
                                Add/Update Row Data
                            </button>
                        </div>
                    </CardContent>
                </Card>
                {/* ini adalah card biaya   */}
                <Card className="w-full">
                    <CardHeader>
                        <div
                            className=""
                            onMouseLeave={handleMouseLeave}
                            onMouseEnter={(e) => handleMouseEnter(e, 'Data yang digunakan untuk proses perhitungan biaya')}
                        >
                            <CardTitle>Data Biaya</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent>

                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Biaya SubKontrak (Rp)</label>
                                <input
                                    type="number"
                                    value={biayaSubkontrak}
                                    onChange={(e) => setbiayaSubkontrak(Number(e.target.value) || 0)}
                                    className="w-full p-2 border rounded"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Biaya LostSale (Rp)</label>
                                <input
                                    type="number"
                                    value={biayaLostsale}
                                    onChange={(e) => setbiayaLostsale(Number(e.target.value) || 0)}
                                    className="w-full p-2 border rounded"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Biaya TK Overtime (Rp)</label>
                                <input
                                    type="number"
                                    value={biayaTKOvertime}
                                    onChange={(e) => setbiayaTKovertime(Number(e.target.value) || 0)}
                                    className="w-full p-2 border rounded"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Biaya Hiring (Rp)</label>
                                <input
                                    type="number"
                                    value={biayaHiring}
                                    onChange={(e) => setbiayaHiring(Number(e.target.value) || 0)}
                                    className="w-full p-2 border rounded"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Biaya Firing (Rp)</label>
                                <input
                                    type="number"
                                    value={biayaFiring}
                                    onChange={(e) => setbiayaFiring(Number(e.target.value) || 0)}
                                    className="w-full p-2 border rounded"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Biaya Simpan (Rp)</label>
                                <input
                                    type="number"
                                    value={biayasimpan}
                                    onChange={(e) => setbiayaSimpan(Number(e.target.value) || 0)}
                                    className="w-full p-2 border rounded"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">UMR (Rp)</label>
                                <input
                                    type="number"
                                    value={umr}
                                    onChange={(e) => setUmr(Number(e.target.value) || 0)}
                                    className="w-full p-2 border rounded"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Kapasitas SubKontrak</label>
                                <input
                                    type="number"
                                    value={kapasitassubkontrak}
                                    onChange={(e) => setkapasitassubkontrak(Number(e.target.value) || 0)}
                                    className="w-full p-2 border rounded"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Max LostSale</label>
                                <input
                                    type="number"
                                    value={maxlostsale}
                                    onChange={(e) => setmaxlostsale(Number(e.target.value) || 0)}
                                    className="w-full p-2 border rounded"
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="w-full">
                    <CardHeader>
                        <div
                            className=""
                            onMouseLeave={handleMouseLeave}
                            onMouseEnter={(e) => handleMouseEnter(e, 'Data yang digunakan untuk proses perhitungan biaya')}
                        >
                            <CardTitle>Data Pekerja</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent>

                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Tenaga Kerja Awal</label>
                                <input
                                    type="number"
                                    value={tenagakerja ?? ""}
                                    onChange={(e) => settenagakerja(Number(e.target.value) || 0)}
                                    className="w-full p-2 border rounded"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Jam Kerja</label>
                                <input
                                    type="number"
                                    value={jamkerja ?? ""}
                                    onChange={(e) => setjamkerja(Number(e.target.value) || 0)}
                                    className="w-full p-2 border rounded"
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardContent className="pt-6">
                    <div className="flex justify-end">
                        <button className="rounded-md bg-red-600 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-red-700 focus:shadow-none active:bg-red-700 hover:bg-red-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none ml-2" type="button">
                            <div className="flex items-center justify-center gap-2">
                                <RotateCcw className="w-4 h-4" />
                                <span>Reset</span>
                            </div>
                        </button>
                        <button
                            onClick={pushData}
                            className="rounded-md bg-green-600 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-green-700 focus:shadow-none active:bg-green-700 hover:bg-green-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none ml-2" type="button">
                            <div className="flex items-center justify-center gap-2">
                                <SendHorizontal className="w-4 h-4" />
                                <span>Solve</span>
                            </div>
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="mt-5 w-full border-collapse border border-gray-300">
                            <thead>
                                <tr>
                                    <th className="border border-gray-300 p-2">Bulan</th>
                                    {columns.map(column => (
                                        <th key={column.id} className="border border-gray-300 p-2 bg-green-100">
                                            {column.name}
                                        </th>
                                    ))}
                                    <th className="border border-gray-300 p-2">Jumlah Hari Kerja</th>
                                </tr>
                            </thead>

                            {/* body table */}
                            <tbody>
                                {tableData.map((row, rowIndex) => (
                                    <tr key={rowIndex}>
                                        <td className="border border-gray-300 p-2">{row.month}</td>
                                        {columns.map(column => (
                                            <td key={column.id} className="border border-gray-300 p-2 text-center">
                                                {row.forecasts[column.id] || 0}
                                            </td>
                                        ))}
                                        <td className="border border-gray-300 p-2 text-center">{row.workDays}</td>
                                    </tr>
                                ))}


                                <tr className="bg-yellow-50">
                                    <td className="border border-gray-300 p-2">persediaan awal (unit)</td>
                                    {columns.map(column => (
                                        <td key={column.id} className="border border-gray-300 p-2 text-center">
                                            {column.initialStock}
                                        </td>
                                    ))}
                                    <td className="border border-gray-300 p-2"></td>
                                </tr>

                                <tr className="bg-yellow-50">
                                    <td className="border border-gray-300 p-2">Ws (jam/unit)</td>
                                    {columns.map(column => (
                                        <td key={column.id} className="border border-gray-300 p-2 text-center">
                                            {column.wsHours}
                                        </td>
                                    ))}
                                    <td className="border border-gray-300 p-2"></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default AgregateTable;