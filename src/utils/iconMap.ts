import {
    IconHome,
    IconPersonnel,
    IconPayroll,
    IconTimeManagement,
    IconMobileMaster,
    IconMedical,
    IconExportReport,
    IconTransaction,
    IconGear
} from "../components/ui/Icons";

export const iconMap: Record<string, React.ElementType> = {
    Home: IconHome,
    Personnel: IconPersonnel,
    Payroll: IconPayroll,
    TimeManagement: IconTimeManagement,
    MobileMaster: IconMobileMaster,
    Medical: IconMedical,
    ExportReport: IconExportReport,
    Transaction: IconTransaction,
    Settings: IconGear,
};

export const getIconComponent = (iconName: string) => {
    return iconMap[iconName] || IconHome;
};