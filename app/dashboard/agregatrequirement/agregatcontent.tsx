import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ForecastColumn {
    id: number;
    name: string;
}

interface TableRow {
    month: string;
    forecasts: Record<string, number>;
    workDays: number;
}

const ForecastTable = () => {
    const [columns, setColumns] = useState<ForecastColumn[]>([]);
    const [newColumnName, setNewColumnName] = useState('');
    const [selectedMonth, setSelectedMonth] = useState('');
    const [workDays, setWorkDays] = useState('');
    const [tableData, setTableData] = useState<TableRow[]>([]);
    const [initialStock, setInitialStock] = useState<number>(0);
    const [lot, setLot] = useState<number>(0);
    const [wsHours, setWsHours] = useState<number>(0);
    const [forecastValue, setForecastValue] = useState('');
    const [selectedColumn, setSelectedColumn] = useState('');


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


    const addColumn = () => {
        if (!newColumnName) return;
        setColumns([...columns, { id: Date.now(), name: newColumnName }]);
        setNewColumnName('');
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

    return (
        <div className="max-w-6xl mx-auto p-4 space-y-6">
            <div className="grid grid-cols-2 gap-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Column Management</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex space-x-2">
                                <input
                                    type="text"
                                    value={newColumnName}
                                    onChange={(e) => setNewColumnName(e.target.value)}
                                    placeholder="Enter column name"
                                    className="flex-1 p-2 border rounded"
                                />
                                <button
                                    onClick={addColumn}
                                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
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
                        <CardTitle>Data Entry</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
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
                            <button
                                onClick={addRowData}
                                className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                            >
                                Add/Update Row Data
                            </button>
                        </div>
                    </CardContent>
                </Card>
                {/* ini adalah card initial stock, lot, ws */}
                <Card>
                    <CardHeader>
                        <CardTitle>Additional Settings</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Initial Stock (unit)</label>
                                <input
                                    type="number"
                                    value={initialStock}
                                    onChange={(e) => setInitialStock(Number(e.target.value) || 0)}
                                    className="w-full p-2 border rounded"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Lot (unit/unit)</label>
                                <input
                                    type="number"
                                    value={lot}
                                    onChange={(e) => setLot(Number(e.target.value) || 0)}
                                    className="w-full p-2 border rounded"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Ws (jam/unit)</label>
                                <input
                                    type="number"
                                    value={wsHours}
                                    onChange={(e) => setWsHours(Number(e.target.value) || 0)}
                                    className="w-full p-2 border rounded"
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                {/* ini adalah card biaya                         */}
                <Card>
                    <CardHeader>
                        <CardTitle>Additional Settings</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Biaya SubKontrak (Rp) </label>
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
                                <label className="block text-sm font-medium mb-1">Biaya FIring (Rp)</label>
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
                                <label className="block text-sm font-medium mb-1">Umur daerah (Rp)</label>
                                <input
                                    type="number"
                                    value={umr}
                                    onChange={(e) => setUmr(Number(e.target.value) || 0)}
                                    className="w-full p-2 border rounded"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Kapasitas SubKontrak </label>
                                <input
                                    type="number"
                                    value={kapasitassubkontrak}
                                    onChange={(e) => setkapasitassubkontrak(Number(e.target.value) || 0)}
                                    className="w-full p-2 border rounded"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">max LostSale </label>
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
            </div>

            <Card>
                <CardContent className="pt-6">
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse border border-gray-300">
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
                                    <td colSpan={columns.length + 1} className="border border-gray-300 p-2 text-center">
                                        {initialStock}
                                    </td>
                                </tr>
                                <tr className="bg-yellow-50">
                                    <td className="border border-gray-300 p-2">Lot (unit/unit)</td>
                                    <td colSpan={columns.length + 1} className="border border-gray-300 p-2 text-center">
                                        {lot}
                                    </td>
                                </tr>
                                <tr className="bg-yellow-50">
                                    <td className="border border-gray-300 p-2">Ws (jam/unit)</td>
                                    <td colSpan={columns.length + 1} className="border border-gray-300 p-2 text-center">
                                        {wsHours}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default ForecastTable;