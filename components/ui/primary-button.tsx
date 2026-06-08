import React from "react";
import { Button } from "@/components/ui/button";

export default function PrimaryButton(props: React.ComponentProps<typeof Button>) {
  return <Button {...props} className={`${props.className ?? ""} btn-primary`} />;
}
