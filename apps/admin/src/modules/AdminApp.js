import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo, useState } from 'react';
const sections = [
    'Dashboard',
    'Market Leaderboard',
    'Depositors Leaderboard',
    'Time Spent Leaderboard',
    'Withdrawal Leaderboard',
    'Admin Role Management',
    'Marketing (Promo Code)',
    'User Management',
    'Content Management',
    'Reports',
    'Finance',
    'Settings',
    'Payment Management',
    'Manage Games',
    'Assets Upload',
    'Change Password',
    'Branding Modules',
    'Audit Log',
];
const statsSeed = [
    { name: 'Usuários Ativos', value: '0' },
    { name: 'Depósitos Hoje', value: 'R$ 0,00' },
    { name: 'Saques Pendentes', value: '0' },
    { name: 'Receita Mensal', value: 'R$ 0,00' },
];
export function AdminApp() {
    const [currentSection, setCurrentSection] = useState('Dashboard');
    const tableRows = useMemo(() => [
        { id: '1', title: currentSection, status: 'draft', owner: 'system' },
        { id: '2', title: `${currentSection} - item`, status: 'active', owner: 'admin' },
    ], [currentSection]);
    return (_jsxs("div", { className: "layout", children: [_jsxs("aside", { className: "sidebar", children: [_jsx("h2", { children: "CenarioX Admin" }), sections.map((section) => (_jsx("button", { onClick: () => setCurrentSection(section), children: section }, section)))] }), _jsxs("main", { className: "content", children: [_jsxs("div", { className: "card", children: [_jsx("h1", { children: currentSection }), _jsx("p", { children: "M\u00F3dulo inicial pronto para integra\u00E7\u00E3o real com API/RBAC." })] }), _jsx("section", { className: "grid", children: statsSeed.map((stat) => (_jsxs("article", { className: "stat", children: [_jsx("h3", { children: stat.name }), _jsx("strong", { children: stat.value })] }, stat.name))) }), _jsxs("section", { className: "card", children: [_jsx("h2", { children: "Itens" }), _jsxs("table", { children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { children: "ID" }), _jsx("th", { children: "T\u00EDtulo" }), _jsx("th", { children: "Status" }), _jsx("th", { children: "Owner" })] }) }), _jsx("tbody", { children: tableRows.map((row) => (_jsxs("tr", { children: [_jsx("td", { children: row.id }), _jsx("td", { children: row.title }), _jsx("td", { children: row.status }), _jsx("td", { children: row.owner })] }, row.id))) })] })] })] })] }));
}
