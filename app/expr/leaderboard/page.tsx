"use client";

import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';

// Mock Data
const mockUsers = [
  { id: '1', name: 'Alice' },
  { id: '2', name: 'Bob' },
  { id: '3', name: 'Charlie' },
];

const mockRoles = [
  { id: 'buyer', name: 'Buyer' },
  { id: 'banker', name: 'Banker' },
  { id: 'dealer', name: 'Dealer' },
];

const mockScenarios = [
  { id: 'scenario1', name: 'Scenario 1' },
  { id: 'scenario2', name: 'Scenario 2' },
  { id: 'scenario3', name: 'Scenario 3' },
];

interface PerformanceData {
  userId: string;
  role: string;
  scenarioId: string;
  date: string;
  averageScore: number;
  completionRate: number;
  timeSpent: number;
}

const mockPerformanceData: PerformanceData[] = [
  { userId: '1', role: 'buyer', scenarioId: 'scenario1', date: '2024-01-01', averageScore: 75, completionRate: 80, timeSpent: 60 },
  { userId: '1', role: 'banker', scenarioId: 'scenario2', date: '2024-01-01', averageScore: 85, completionRate: 90, timeSpent: 70 },
  { userId: '2', role: 'buyer', scenarioId: 'scenario1', date: '2024-01-01', averageScore: 65, completionRate: 70, timeSpent: 50 },
  { userId: '2', role: 'dealer', scenarioId: 'scenario3', date: '2024-01-01', averageScore: 90, completionRate: 95, timeSpent: 80 },
  { userId: '3', role: 'banker', scenarioId: 'scenario2', date: '2024-01-01', averageScore: 70, completionRate: 75, timeSpent: 55 },
  { userId: '3', role: 'dealer', scenarioId: 'scenario3', date: '2024-01-01', averageScore: 80, completionRate: 85, timeSpent: 65 },
  { userId: '1', role: 'buyer', scenarioId: 'scenario1', date: '2024-01-08', averageScore: 80, completionRate: 85, timeSpent: 65 },
  { userId: '1', role: 'banker', scenarioId: 'scenario2', date: '2024-01-08', averageScore: 90, completionRate: 95, timeSpent: 75 },
  { userId: '2', role: 'buyer', scenarioId: 'scenario1', date: '2024-01-08', averageScore: 70, completionRate: 75, timeSpent: 55 },
  { userId: '2', role: 'dealer', scenarioId: 'scenario3', date: '2024-01-08', averageScore: 95, completionRate: 100, timeSpent: 85 },
  { userId: '3', role: 'banker', scenarioId: 'scenario2', date: '2024-01-08', averageScore: 75, completionRate: 80, timeSpent: 60 },
  { userId: '3', role: 'dealer', scenarioId: 'scenario3', date: '2024-01-08', averageScore: 85, completionRate: 90, timeSpent: 70 },
];

// Fake Performance Data Service
const fakePerformanceDataService = {
  getPerformanceData: (
    userId: string | null,
    role: string | null,
    scenarioId: string | null,
    startDate: Date | null,
    endDate: Date | null
  ): PerformanceData[] => {
    let filteredData = mockPerformanceData;

    if (userId) {
      filteredData = filteredData.filter((item) => item.userId === userId);
    }
    if (role) {
      filteredData = filteredData.filter((item) => item.role === role);
    }
    if (scenarioId) {
      filteredData = filteredData.filter((item) => item.scenarioId === scenarioId);
    }

    if (startDate && endDate) {
      filteredData = filteredData.filter(item => {
        const itemDate = new Date(item.date);
        return itemDate >= startDate && itemDate <= endDate;
      });
    }

    return filteredData;
  },
};

// UI Components
interface DropdownProps {
  label: string;
  options: { id: string; name: string }[];
  value: string | null;
  onChange: (value: string | null) => void;
}

const Dropdown: React.FC<DropdownProps> = ({ label, options, value, onChange }) => {
  return (
    <div className="mb-4">
      <label htmlFor={label} className="block text-gray-700 text-sm font-bold mb-2">
        {label}
      </label>
      <select
        id={label}
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        value={value || ''}
        onChange={(e) => onChange(e.target.value === '' ? null : e.target.value)}
      >
        <option value="">All</option>
        {options.map((option) => (
          <option key={option.id} value={option.id}>
            {option.name}
          </option>
        ))}
      </select>
    </div>
  );
};

interface DateRangePickerProps {
  startDate: Date | null;
  endDate: Date | null;
  onChange: (startDate: Date | null, endDate: Date | null) => void;
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({ startDate, endDate, onChange }) => {
  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value ? new Date(e.target.value) : null, endDate);
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(startDate, e.target.value ? new Date(e.target.value) : null);
  };

  return (
    <div className="mb-4">
      <label className="block text-gray-700 text-sm font-bold mb-2">
        Date Range
      </label>
      <div className="flex items-center">
        <input
          type="date"
          className="shadow appearance-none border rounded w-1/2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mr-2"
          value={startDate ? startDate.toISOString().split('T')[0] : ''}
          onChange={handleStartDateChange}
        />
        <input
          type="date"
          className="shadow appearance-none border rounded w-1/2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          value={endDate ? endDate.toISOString().split('T')[0] : ''}
          onChange={handleEndDateChange}
        />
      </div>
    </div>
  );
};

interface FilterBarProps {
  onFilterChange: (
    userId: string | null,
    role: string | null,
    scenarioId: string | null,
    startDate: Date | null,
    endDate: Date | null
  ) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({ onFilterChange }) => {
  const [userId, setUserId] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [scenarioId, setScenarioId] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const handleFilterChange = () => {
    onFilterChange(userId, role, scenarioId, startDate, endDate);
  };

  return (
    <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <Dropdown label="User" options={mockUsers} value={userId} onChange={(value) => {setUserId(value); handleFilterChange();}}/>
      <Dropdown label="Role" options={mockRoles} value={role} onChange={(value) => {setRole(value); handleFilterChange();}} />
      <Dropdown label="Scenario" options={mockScenarios} value={scenarioId} onChange={(value) => {setScenarioId(value); handleFilterChange();}} />
      <DateRangePicker startDate={startDate} endDate={endDate} onChange={(start, end) => {setStartDate(start); setEndDate(end); handleFilterChange();}} />
    </div>
  );
};

interface ChartProps {
  data: any[];
  dataKey: string;
  title: string;
  type: 'bar' | 'line' | 'pie';
}

const Chart: React.FC<ChartProps> = ({ data, dataKey, title, type }) => {

  if (type === 'bar') {
    return (
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey={dataKey} fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  } else if (type === 'line') {
    return (
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey={dataKey} stroke="#82ca9d" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  } else if (type === 'pie') {
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
    return (
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              dataKey={dataKey}
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              fill="#8884d8"
              label
            >
              {
                data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))
              }
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    );
  }

  return <div>Unsupported chart type.</div>;
};

interface DataTableProps {
  data: PerformanceData[];
}

const DataTable: React.FC<DataTableProps> = ({ data }) => {
  return (
    <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 overflow-x-auto">
      <h2 className="text-xl font-bold mb-4">Detailed Performance Metrics</h2>
      <table className="table-auto w-full">
        <thead>
          <tr>
            <th className="px-4 py-2">User</th>
            <th className="px-4 py-2">Role</th>
            <th className="px-4 py-2">Scenario</th>
            <th className="px-4 py-2">Date</th>
            <th className="px-4 py-2">Avg Score</th>
            <th className="px-4 py-2">Completion Rate</th>
            <th className="px-4 py-2">Time Spent</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={`${item.userId}-${item.role}-${item.scenarioId}-${item.date}`}>
              <td className="border px-4 py-2">{mockUsers.find(u => u.id === item.userId)?.name || 'Unknown'}</td>
              <td className="border px-4 py-2">{mockRoles.find(r => r.id === item.role)?.name || 'Unknown'}</td>
              <td className="border px-4 py-2">{mockScenarios.find(s => s.id === item.scenarioId)?.name || 'Unknown'}</td>
              <td className="border px-4 py-2">{item.date}</td>
              <td className="border px-4 py-2">{item.averageScore}</td>
              <td className="border px-4 py-2">{item.completionRate}</td>
              <td className="border px-4 py-2">{item.timeSpent}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};


// Main Page Component
const PerformanceDashboard: React.FC = () => {
  const [performanceData, setPerformanceData] = useState<PerformanceData[]>(mockPerformanceData);

  const handleFilterChange = (
    userId: string | null,
    role: string | null,
    scenarioId: string | null,
    startDate: Date | null,
    endDate: Date | null
  ) => {
    const filteredData = fakePerformanceDataService.getPerformanceData(userId, role, scenarioId, startDate, endDate);
    setPerformanceData(filteredData);
  };

  // Aggregate data for charts
  const averageScoresData = mockUsers.map(user => ({
    name: user.name,
    score: performanceData
      .filter(item => item.userId === user.id)
      .reduce((sum, item) => sum + item.averageScore, 0) / performanceData.filter(item => item.userId === user.id).length,
  })).filter(item => !isNaN(item.score));

  const completionRatesData = mockScenarios.map(scenario => ({
    name: scenario.name,
    rate: performanceData
      .filter(item => item.scenarioId === scenario.id)
      .reduce((sum, item) => sum + item.completionRate, 0) / performanceData.filter(item => item.scenarioId === scenario.id).length,
  })).filter(item => !isNaN(item.rate));

  const timeSpentData = mockRoles.map(role => ({
    name: role.name,
    time: performanceData
      .filter(item => item.role === role.id)
      .reduce((sum, item) => sum + item.timeSpent, 0) / performanceData.filter(item => item.role === role.id).length,
  })).filter(item => !isNaN(item.time));

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Student Performance Analytics</h1>
      <FilterBar onFilterChange={handleFilterChange} />

      <Chart data={averageScoresData} dataKey="score" title="Average Scores by User" type="bar" />
      <Chart data={completionRatesData} dataKey="rate" title="Completion Rates by Scenario" type="line" />
      <Chart data={timeSpentData} dataKey="time" title="Average Time Spent by Role" type="pie" />

      <DataTable data={performanceData} />
    </div>
  );
};

export default PerformanceDashboard;