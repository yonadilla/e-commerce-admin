"use client"

import { Copy, Server } from "lucide-react";
import toast from "react-hot-toast";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge, BadgeProps } from "./badge";
import { Button } from "@/components/ui/button";

interface ApiAlertProps {
  title: string;
  descriptions: string;
  variants: "public" | "admin";
}

const textMap: Record<ApiAlertProps["variants"], string> = {
  public: "Public",
  admin: "Admin",
};

const variantMap: Record<ApiAlertProps["variants"], BadgeProps["variant"]> = {
  public: "secondary",
  admin: "destructive",
};

export const ApiAlert: React.FC<ApiAlertProps> = ({
  title,
  descriptions,
  variants = "public",
}) => {
  const onCopy = () => {
    navigator.clipboard.writeText(descriptions);
    toast.success("API Route copied to clipboard");
  };

  return (
    <Alert>
      <Server className=" h-4 w-4" />
      <AlertTitle className=" flex items-center gap-x-2">
        {title}
        <Badge variant={variantMap[variants]}>{textMap[variants]}</Badge>
      </AlertTitle>
      <AlertDescription className=" mt-4 flex items-center justify-between">
        <code className=" relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
          {descriptions}
        </code>
        <Button variant={"outline"} size={"icon"} onClick={onCopy}>
          <Copy className=" h- w-4" />
        </Button>
      </AlertDescription>
    </Alert>
  );
};
