import React, { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react'; // Import ikon panah dari Lucide React
import { useRouter } from 'next/navigation';
const FlowShopContent = () => {
    const [method, setMethod] = useState('CDS');
    const [rows, setRows] = useState<Array<{ job: string; operation: string; machine: string; processTime: string; startTime: string; finishTime: string }>>([]);
    const [newRow, setNewRow] = useState({ job: '', operation: '', machine: '', processTime: '', startTime: '', finishTime: '' });
    const router = useRouter();
    // Load data from localStorage on component mount
    useEffect(() => {
        const savedData = localStorage.getItem('flowshopData');
        const savedMethod = localStorage.getItem('flowshopMethod');
        if (savedData) {
            setRows(JSON.parse(savedData));
        }
        if (savedMethod) {
            setMethod(savedMethod);
        }
    }, []);

    // Save data and method to localStorage whenever they change
    useEffect(() => {
        localStorage.setItem('flowshopData', JSON.stringify(rows));
        localStorage.setItem('flowshopMethod', method);
    }, [rows, method]);

    const handleMethodChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setMethod(event.target.value);
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setNewRow(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const addRow = () => {
        if (newRow.job && newRow.operation && newRow.machine && newRow.processTime && newRow.startTime && newRow.finishTime) {
            setRows([...rows, newRow]);
            setNewRow({ job: '', operation: '', machine: '', processTime: '', startTime: '', finishTime: '' }); // Reset form
        } else {
            alert('Please fill all fields');
        }
    };

    const deleteRow = (index: number) => {
        const updatedRows = rows.filter((_, i) => i !== index);
        setRows(updatedRows);
    };

    const handleSolve = () => {
        // Simpan data dan metode ke localStorage sebelum navigasi
        localStorage.setItem('flowshopData', JSON.stringify(rows));
        localStorage.setItem('flowshopMethod', method);
        console.log("Data anda adalah : ", rows);
        console.log("Metode anda adalah : ", method);
        // Navigasi ke halaman result (Anda bisa menggunakan React Router atau metode navigasi lainnya)
        router.push("flowshop/result");
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-4xl">
                <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">Jobshop / Flowshop </h1>
                <div className="space-y-6">
                    {/* Dropdown for Method */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Metode Penyelesaian</label>
                        <select
                            value={method}
                            onChange={handleMethodChange}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="CDS">CDS</option>
                            <option value="NonDelay">Algoritma Non-Delay</option>
                        </select>
                    </div>

                    {/* Dynamic Table */}
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold">Input Data</h2>
                            <button
                                onClick={handleSolve}
                                className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md flex items-center space-x-2"
                            >
                                <span>Solve</span>
                                <ArrowRight className="w-5 h-5" /> {/* Ikon panah dari Lucide React */}
                            </button>
                        </div>
                        <table className="min-w-full bg-white border border-gray-300">
                            <thead>
                                <tr>
                                    <th className="py-2 px-4 border-b">Job</th>
                                    <th className="py-2 px-4 border-b">Urutan Operasi</th>
                                    <th className="py-2 px-4 border-b">Urutan Mesin</th>
                                    <th className="py-2 px-4 border-b">Waktu Proses</th>
                                    <th className="py-2 px-4 border-b">Waktu Mulai</th>
                                    <th className="py-2 px-4 border-b">Waktu Selesai</th>
                                    <th className="py-2 px-4 border-b">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rows.map((row, index) => (
                                    <tr key={index}>
                                        <td className="py-2 px-4 border-b">{row.job}</td>
                                        <td className="py-2 px-4 border-b">{row.operation}</td>
                                        <td className="py-2 px-4 border-b">{row.machine}</td>
                                        <td className="py-2 px-4 border-b">{row.processTime}</td>
                                        <td className="py-2 px-4 border-b">{row.startTime}</td>
                                        <td className="py-2 px-4 border-b">{row.finishTime}</td>
                                        <td className="py-2 px-4 border-b">
                                            <button
                                                onClick={() => deleteRow(index)}
                                                className="text-red-600 hover:text-red-800"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                <tr>
                                    <td className="py-2 px-4 border-b">
                                        <input
                                            type="text"
                                            name="job"
                                            value={newRow.job}
                                            onChange={handleInputChange}
                                            className="w-full p-1 border border-gray-300 rounded-md"
                                            placeholder="Job"
                                        />
                                    </td>
                                    <td className="py-2 px-4 border-b">
                                        <input
                                            type="text"
                                            name="operation"
                                            value={newRow.operation}
                                            onChange={handleInputChange}
                                            className="w-full p-1 border border-gray-300 rounded-md"
                                            placeholder="Operation"
                                        />
                                    </td>
                                    <td className="py-2 px-4 border-b">
                                        <input
                                            type="text"
                                            name="machine"
                                            value={newRow.machine}
                                            onChange={handleInputChange}
                                            className="w-full p-1 border border-gray-300 rounded-md"
                                            placeholder="Machine"
                                        />
                                    </td>
                                    <td className="py-2 px-4 border-b">
                                        <input
                                            type="text"
                                            name="processTime"
                                            value={newRow.processTime}
                                            onChange={handleInputChange}
                                            className="w-full p-1 border border-gray-300 rounded-md"
                                            placeholder="Process Time"
                                        />
                                    </td>
                                    <td className="py-2 px-4 border-b">
                                        <input
                                            type="text"
                                            name="startTime"
                                            value={newRow.startTime}
                                            onChange={handleInputChange}
                                            className="w-full p-1 border border-gray-300 rounded-md"
                                            placeholder="Start Time"
                                        />
                                    </td>
                                    <td className="py-2 px-4 border-b">
                                        <input
                                            type="text"
                                            name="finishTime"
                                            value={newRow.finishTime}
                                            onChange={handleInputChange}
                                            className="w-full p-1 border border-gray-300 rounded-md"
                                            placeholder="Finish Time"
                                        />
                                    </td>
                                    <td className="py-2 px-4 border-b">
                                        <button
                                            onClick={addRow}
                                            className="bg-blue-600 text-white py-1 px-4 rounded-md hover:bg-blue-700"
                                        >
                                            Add
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FlowShopContent;