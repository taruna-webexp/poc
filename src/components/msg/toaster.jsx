import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";

export function errorMsg(message) {
  toast.error(message, {
    position: "top-right",
  });
}

export function successMsg(message) {
  toast.success(message, {
    position: "top-right",
  });
}
