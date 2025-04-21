
import React, { forwardRef } from "react";
import { Button } from "@/components/ui/button";
import { Paperclip, Image as ImageIcon } from "lucide-react";

type FileUploadButtonProps = {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  accept?: string;
  type: "file" | "image";
};

const icons = {
  file: <Paperclip className="h-5 w-5" />,
  image: <ImageIcon className="h-5 w-5" />,
};

const FileUploadButton = forwardRef<HTMLInputElement, FileUploadButtonProps>(
  ({ onChange, accept, type }, ref) => {
    return (
      <>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="text-gray-500 hover:text-gray-700 hover:bg-gray-100"
          onClick={() => {
            (ref as React.RefObject<HTMLInputElement>).current?.click();
          }}
        >
          {icons[type]}
        </Button>
        <input
          type="file"
          accept={accept}
          ref={ref}
          onChange={onChange}
          style={{ display: "none" }}
        />
      </>
    );
  }
);

export default FileUploadButton;
