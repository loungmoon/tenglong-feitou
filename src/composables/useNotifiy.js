import { reactive } from "vue";

export const notifyState = reactive({
  show: false,
  text: "",
  color: "success",
  timeout: 2000,
});

export function useNotify() {
  const show = (text, color = "success", timeout = 2000) => {
    notifyState.text = text;
    notifyState.color = color;
    notifyState.timeout = timeout;
    notifyState.show = true;
  };

  return {
    success: (text) => show(text, "success"),
    error: (text) => show(text, "error"),
    warning: (text) => show(text, "warning"),
    info: (text) => show(text, "info"),
  };
}
