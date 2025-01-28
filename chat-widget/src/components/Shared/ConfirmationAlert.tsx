import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/shadcn-ui/alert-dialog";
import { ReactElement } from "react";

export interface ConfirmationAlertProps {
  triggerChild: ReactElement;
  title: string;
  body: string;
  onConfirm: () => void;
}

export const ConfirmationAlert: React.FC<ConfirmationAlertProps> = ({
  triggerChild,
  title,
  body,
  onConfirm,
}) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{triggerChild}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{body}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
