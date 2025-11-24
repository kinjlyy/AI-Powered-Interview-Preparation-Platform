import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Footer() {
  const handleDownload = () => {
    // Create a link to download the zip file
    const link = document.createElement('a');
    link.href = '/interviewprep-pro.zip';
    link.download = 'interviewprep-pro.zip';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex flex-col items-center justify-between gap-4 py-6 md:h-16 md:flex-row md:py-0">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            Built with ❤️ using React, TypeScript, and Tailwind CSS
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownload}
            className="gap-2"
          >
            <Download className="h-4 w-4" />
            Download & Deploy
          </Button>
        </div>
      </div>
    </footer>
  );
}