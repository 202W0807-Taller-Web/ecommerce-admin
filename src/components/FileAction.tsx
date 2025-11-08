import { Upload, Download, RefreshCw, Loader2, type LucideIcon } from "lucide-react";
import { useState } from "react";

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
  const [isLoading, setIsLoading] = useState(false);

  const getIcon = () => {
    if (isLoading) { return <Loader2 className="h-5 w-5 animate-spin text-secondary-color" />}

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

  const handleClick = async () => {
    if (!onClick) return;
    try {
      setIsLoading(true);
      await onClick();
    } catch (err) {
      console.error(err);
      alert("Ocurrió un error al ejecutar la acción");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      type="button"
      aria-label={text}
      onClick={handleClick}
      disabled={isLoading}
      className={`cursor-pointer flex items-center text-sm gap-2 underline 
        ${isLoading ? "opacity-60 cursor-not-allowed" : "text-body-color hover:text-secondary-color"}
      `}
    >
       <span>{isLoading ? "Procesando..." : text}</span>
      {getIcon()}
    </button>
  );
};

export default FileAction;
