import { Upload, Download, RefreshCw, type LucideIcon } from "lucide-react";

type FileActionProps = {
  text: string;
  variant: "upload" | "download" | "update" | "other";
  onClick?: () => void;
  icon?: LucideIcon;
};

const FileAction = ({
  text,
  variant,
  onClick,
  icon: Icon,
}: FileActionProps) => {
  const getIcon = () => {
    switch (variant) {
      case "upload":
        return <Upload className="h-5 w-5" />;
      case "download":
        return <Download className="h-5 w-5" />;
      case "update":
        return <RefreshCw className="h-5 w-5" />;
      case "other":
        return Icon ? <Icon className="h-5 w-5" /> : null;
      default:
        return null;
    }
  };

  return (
    <button
      type="button"
      aria-label={text}
      onClick={onClick}
      className="cursor-pointer flex items-center text-sm gap-2 text-body-color underline hover:text-secondary-color"
    >
      <span>{text}</span>
      {getIcon()}
    </button>
  );
};

export default FileAction;
