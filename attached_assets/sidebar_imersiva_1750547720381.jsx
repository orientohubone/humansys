import { Home, Users, BarChart, Settings, PhoneCall, LogOut } from 'lucide-react';

export default function Sidebar() {
  return (
    <aside className="h-screen w-20 bg-green-900 text-white flex flex-col items-center py-6 gap-6 rounded-r-3xl shadow-md">
      {/* Logo */}
      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
        <span className="text-green-900 font-bold text-lg">Q</span>
      </div>

      {/* Menu icons */}
      <nav className="flex-1 flex flex-col justify-center items-center gap-6 mt-10">
        <SidebarIcon icon={<Home />} tooltip="Dashboard" />
        <SidebarIcon icon={<PhoneCall />} tooltip="Chamadas" />
        <SidebarIcon icon={<Users />} tooltip="Colaboradores" />
        <SidebarIcon icon={<BarChart />} tooltip="Relatórios" />
        <SidebarIcon icon={<Settings />} tooltip="Configurações" />
      </nav>

      {/* Bottom action */}
      <div className="mt-auto">
        <SidebarIcon icon={<LogOut />} tooltip="Sair" />
      </div>
    </aside>
  );
}

function SidebarIcon({ icon, tooltip }: { icon: React.ReactNode; tooltip: string }) {
  return (
    <div className="group relative cursor-pointer">
      <div className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white text-white hover:text-green-900 transition-all">
        {icon}
      </div>
      <span className="absolute left-14 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
        {tooltip}
      </span>
    </div>
  );
}
