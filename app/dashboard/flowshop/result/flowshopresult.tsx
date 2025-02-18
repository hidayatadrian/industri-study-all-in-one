import React, { useState, useEffect } from 'react';

interface FlowshopData {
    stage: number;
    machine: string;
    job: string;
    startTime: number;
    processTime: number;
    finishTime: number;
    operation: number;
}

interface HighlightedData {
    [stage: number]: {
        [index: number]: boolean;
    };
}

const FlowshopResult: React.FC = () => {
    const [data, setData] = useState<FlowshopData[]>([]);
    const [method, setMethod] = useState<string>('');
    const [machines, setMachines] = useState<string[]>([]);
    const [groupedData, setGroupedData] = useState<{ [key: number]: FlowshopData[] }>({});
    const [highlightedData, setHighlightedData] = useState<HighlightedData>({});

    useEffect(() => {
        const savedData = localStorage.getItem('flowshopData');
        const savedMethod = localStorage.getItem('flowshopMethod');

        console.log("Data nya adalah : ", savedData, savedMethod);

        if (savedData) {
            try {
                const parsedData: FlowshopData[] = JSON.parse(savedData).map((item: FlowshopData, index: number) => ({
                    ...item,
                    stage: 1,
                }));

                setData(parsedData);

                const machineNumbers = [...new Set(parsedData.map(item => item.machine))].sort();
                setMachines(machineNumbers);

                const grouped: { [key: number]: FlowshopData[] } = {};
                parsedData.forEach(item => {
                    const stageKey = item.stage;
                    if (!grouped[stageKey]) {
                        grouped[stageKey] = [];
                    }
                    grouped[stageKey].push(item);
                });

                setGroupedData(grouped);

                // Hitung minStartTime dan tentukan baris yang perlu di-highlight
                const highlighted: HighlightedData = {};
                Object.entries(grouped).forEach(([stageKey, rows]) => {
                    const stageNumber = Number(stageKey);
                    const minStartTime = Math.min(...rows.map(row => row.startTime));

                    highlighted[stageNumber] = {};
                    rows.forEach((row, index) => {
                        highlighted[stageNumber][index] = row.startTime === minStartTime;
                    });

                    console.log(`Stage ${stageNumber} - minStartTime: ${minStartTime}`);
                    console.log(`Highlighted rows:`, highlighted[stageNumber]);
                });

                setHighlightedData(highlighted);
            } catch (error) {
                console.error('Error parsing flowshopData:', error);
            }
        }

        if (savedMethod) setMethod(savedMethod);
    }, []);

    return (
        <div className="p-6 bg-gray-100 min-h-screen flex justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-5xl overflow-x-auto">
                <h2 className="text-2xl font-bold text-center mb-4">Hasil Perhitungan Flowshop ({method})</h2>
                <table className="w-full border-collapse border border-gray-300 text-sm text-gray-700">
                    <thead className="bg-gray-200">
                        <tr>
                            <th className="border p-2">Stage</th>
                            {machines.map(machine => (
                                <th key={machine} className="border p-2">{machine}</th>
                            ))}
                            <th className="border p-2">St</th>
                            <th className="border p-2">Waktu Mulai</th>
                            <th className="border p-2">Waktu Proses</th>
                            <th className="border p-2">Waktu Selesai</th>
                            <th className="border p-2">Waktu Mulai Minimal</th>
                            <th className="border p-2">Mesin</th>
                            <th className="border p-2">Proses (Job)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.entries(groupedData).map(([stageKey, rows]) => {
                            const stageNumber = Number(stageKey);
                            const minStartTime = Math.min(...rows.map(row => row.startTime));

                            return rows.map((row, index) => {
                                const isHighlighted = highlightedData[stageNumber]?.[index] || false;

                                return (
                                    <tr 
                                        key={`${stageNumber}-${index}`} 
                                        className={isHighlighted ? 'bg-yellow-200' : index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                                    >
                                        {index === 0 ? (
                                            <td className="border p-2 text-center" rowSpan={rows.length}>{stageNumber}</td>
                                        ) : null}
                                        {machines.map(machine => (
                                            <td key={machine} className="border p-2 text-center">{row.machine === machine ? 1 : 0}</td>
                                        ))}
                                        <td className="border p-2 text-center font-bold">
                                            {`${row.job}${row.operation}${row.machine}`}
                                        </td>
                                        <td className={`border p-2 text-center ${isHighlighted ? 'bg-yellow-200' : ''}`}>
                                            {row.startTime}
                                        </td>
                                        <td className={`border p-2 text-center ${isHighlighted ? 'bg-yellow-200' : ''}`}>
                                            {row.processTime}
                                        </td>
                                        <td className={`border p-2 text-center ${isHighlighted ? 'bg-yellow-200' : ''}`}>
                                            {row.finishTime}
                                        </td>
                                        {index === 0 ? (
                                            <td className="border p-2 text-center" rowSpan={rows.length}>{minStartTime}</td>
                                        ) : null}
                                        <td className="border p-2 text-center">{row.machine}</td>
                                        <td className="border p-2 text-center">{row.job}</td>
                                    </tr>
                                );
                            });
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default FlowshopResult;