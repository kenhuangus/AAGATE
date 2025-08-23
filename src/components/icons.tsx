import { Bot, GitCompareArrows, LayoutDashboard, FileText, FlaskConical, ShieldAlert, LucideProps } from 'lucide-react';

export const Icons = {
  Logo: (props: LucideProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
    </svg>
  ),
  Dashboard: LayoutDashboard,
  AnomalyDetection: ShieldAlert,
  PolicyManagement: FileText,
  ShadowMonitor: GitCompareArrows,
  ViolationAnalysis: FlaskConical,
  Agents: Bot,
};

export default Icons;
