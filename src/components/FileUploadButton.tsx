
import React, { forwardRef } from "react";
import { Button } from "@/components/ui/button";
import { Paperclip, Image as ImageIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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
    const { toast } = useToast();
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (!files || files.length === 0) return;
      
      // Check file size (limit to 10MB)
      const file = files[0];
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please upload a file smaller than 10MB",
          variant: "destructive"
        });
        return;
      }
      
      onChange(e);
    };
    
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
          onChange={handleChange}
          style={{ display: "none" }}
        />
      </>
    );
  }
);

FileUploadButton.displayName = "FileUploadButton";

export default FileUploadButton;
