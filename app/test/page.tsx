'use client'
import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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

const ForecastTable = () => {
    const [columns, setColumns] = useState<ForecastColumn[]>([]);
    const [newColumnName, setNewColumnName] = useState('');
    const [selectedMonth, setSelectedMonth] = useState('');
    const [workDays, setWorkDays] = useState('');
    const [tableData, setTableData] = useState<TableRow[]>([]);
    const [forecastValue, setForecastValue] = useState('');
    const [selectedColumn, setSelectedColumn] = useState('');

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
            top: event.clientY + 10,
            left: event.clientX + 10,
        });
        setTooltipVisible(true);
    };

    const handleMouseLeave = () => {
        setTooltipVisible(false);
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
                                <input
                                    type="text"
                                    value={newColumnName}
                                    onChange={(e) => setNewColumnName(e.target.value)}
                                    placeholder="Enter column name"
                                    className="w-full p-2 border rounded"
                                />
                                <input
                                    type="number"
                                    value={newInitialStock}
                                    onChange={(e) => setNewInitialStock(Number(e.target.value))}
                                    placeholder="Initial Stock"
                                    className="w-full p-2 border rounded"
                                />
                                <input
                                    type="number"
                                    value={newLot}
                                    onChange={(e) => setNewLot(Number(e.target.value))}
                                    placeholder="Lot"
                                    className="w-full p-2 border rounded"
                                />
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

                {/* Rest of the cards remain the same until the table */}
                {/* ... other cards ... */}

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
                                        {columns.map(column => (
                                            <td key={column.id} className="border border-gray-300 p-2 text-center">
                                                {column.initialStock}
                                            </td>
                                        ))}
                                        <td className="border border-gray-300 p-2"></td>
                                    </tr>
                                    <tr className="bg-yellow-50">
                                        <td className="border border-gray-300 p-2">Lot (unit/unit)</td>
                                        {columns.map(column => (
                                            <td key={column.id} className="border border-gray-300 p-2 text-center">
                                                {column.lot}
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
        </div>
    );
};

export default ForecastTable;