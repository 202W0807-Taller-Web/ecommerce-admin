import { Upload, Download } from "lucide-react";

type FileActionProps = {
  text: string;
  variant: "upload" | "download";
  onClick?: () => void;
};

const FileAction = ({ text, variant, onClick }: FileActionProps) => {
  const isUpload = variant === "upload";

  return (
    <button
      type="button"
      aria-label={text}
      onClick={onClick}
      className={
        "cursor-pointer flex items-center text-sm gap-2 text-body-color underline hover:text-secondary-color"
      }
    >
      <span>{text}</span>
      {isUpload ? (
        <Upload className="h-5 w-5" />
      ) : (
        <Download className="h-5 w-5" />
      )}
    </button>
  );
};

export default FileAction;
