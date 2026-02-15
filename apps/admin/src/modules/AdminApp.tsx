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
] as const;

const statsSeed = [
  { name: 'Usuários Ativos', value: '0' },
  { name: 'Depósitos Hoje', value: 'R$ 0,00' },
  { name: 'Saques Pendentes', value: '0' },
  { name: 'Receita Mensal', value: 'R$ 0,00' },
];

export function AdminApp() {
  const [currentSection, setCurrentSection] = useState<(typeof sections)[number]>('Dashboard');

  const tableRows = useMemo(
    () => [
      { id: '1', title: currentSection, status: 'draft', owner: 'system' },
      { id: '2', title: `${currentSection} - item`, status: 'active', owner: 'admin' },
    ],
    [currentSection],
  );

  return (
    <div className="layout">
      <aside className="sidebar">
        <h2>CenarioX Admin</h2>
        {sections.map((section) => (
          <button key={section} onClick={() => setCurrentSection(section)}>
            {section}
          </button>
        ))}
      </aside>

      <main className="content">
        <div className="card">
          <h1>{currentSection}</h1>
          <p>Módulo inicial pronto para integração real com API/RBAC.</p>
        </div>

        <section className="grid">
          {statsSeed.map((stat) => (
            <article className="stat" key={stat.name}>
              <h3>{stat.name}</h3>
              <strong>{stat.value}</strong>
            </article>
          ))}
        </section>

        <section className="card">
          <h2>Itens</h2>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Título</th>
                <th>Status</th>
                <th>Owner</th>
              </tr>
            </thead>
            <tbody>
              {tableRows.map((row) => (
                <tr key={row.id}>
                  <td>{row.id}</td>
                  <td>{row.title}</td>
                  <td>{row.status}</td>
                  <td>{row.owner}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
}
