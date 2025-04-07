import { toast } from "sonner";

type ToastType = "success" | "error" | "info" | "warning";

interface ToastOptions {
  description?: string;
  duration?: number;
}

export const useToast = () => {
  const showToast = (
    type: ToastType,
    message: string,
    options: ToastOptions = {}
  ) => {
    const { description, duration = 3000 } = options;

    switch (type) {
      case "success":
        toast.success(message, {
          description,
          duration,
        });
        break;
      case "error":
        toast.error(message, {
          description,
          duration,
        });
        break;
      case "info":
        toast.info(message, {
          description,
          duration,
        });
        break;
      case "warning":
        toast.warning(message, {
          description,
          duration,
        });
        break;
    }
  };

  return {
    success: (message: string, options?: ToastOptions) =>
      showToast("success", message, options),
    error: (message: string, options?: ToastOptions) =>
      showToast("error", message, options),
    info: (message: string, options?: ToastOptions) =>
      showToast("info", message, options),
    warning: (message: string, options?: ToastOptions) =>
      showToast("warning", message, options),
  };
};
