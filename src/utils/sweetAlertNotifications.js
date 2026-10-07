import Swal from "sweetalert2";

export const showLoginSuccessAlert = (title, message) => {
  return Swal.fire({
    title: `Welcome Back, ${title}`,
    text: message,
    icon: "success",
    timer: 1000,
    timerProgressBar: true,
    showConfirmButton: false,
    allowOutsideClick: false,
    allowEscapeKey: false,
    // Styling applied according to the Warm Stone Editorial design system
    customClass: {
      popup: "rounded-3xl bg-[#ffffff] border border-[#e7e5e4] shadow-2xl p-6",
      title: "font-plus-jakarta text-xl font-semibold text-[#1c1917]",
      htmlContainer: "font-plus-jakarta text-sm text-[#57534E]",
      timerProgressBar: "bg-[#15803D]", // Success / Validated green from design system
    },
    // Custom inline styles for color accents (matching design system tokens)
    background: "#ffffff",
    color: "#1c1917",
    iconColor: "#15803D", // Success color (#15803D)
  });
};

const editorialClasses = {
  popup: "rounded-3xl bg-[#ffffff] border border-[#e7e5e4] shadow-2xl p-6",
  title: "font-plus-jakarta text-xl font-semibold text-[#1c1917]",
  htmlContainer: "font-plus-jakarta text-sm text-[#57534E]",
  timerProgressBar: "bg-[#15803D]",
  actions: "gap-3",
  confirmButton:
    "rounded-xl px-5 py-2.5 text-sm font-semibold text-white bg-[#1c1917] hover:bg-[#292524] transition-colors",
  cancelButton:
    "rounded-xl px-5 py-2.5 text-sm font-semibold text-[#1c1917] bg-transparent border border-[#e7e5e4] hover:bg-[#f5f5f4] transition-colors",
};

export const showSuccessAlert = (title, message) => {
  return Swal.fire({
    title,
    text: message,
    icon: "success",
    timer: 1600,
    timerProgressBar: true,
    showConfirmButton: false,
    customClass: editorialClasses,
    background: "#ffffff",
    color: "#1c1917",
    iconColor: "#15803D",
  });
};

export const showErrorAlert = (title, message) => {
  return Swal.fire({
    title,
    text: message,
    icon: "error",
    confirmButtonText: "Close",
    buttonsStyling: false,
    customClass: editorialClasses,
    background: "#ffffff",
    color: "#1c1917",
    iconColor: "#BA1A1A",
  });
};

// Resolves to true when the user confirms.
export const showConfirmDialog = async ({
  title,
  message,
  html,
  confirmText = "Confirm",
  cancelText = "Cancel",
  danger = false,
}) => {
  const result = await Swal.fire({
    title,
    text: html ? undefined : message,
    html,
    icon: danger ? "warning" : "question",
    showCancelButton: true,
    confirmButtonText: confirmText,
    cancelButtonText: cancelText,
    reverseButtons: true,
    focusCancel: danger,
    buttonsStyling: false,
    customClass: {
      ...editorialClasses,
      confirmButton: danger
        ? "rounded-xl px-5 py-2.5 text-sm font-semibold text-white bg-[#BA1A1A] hover:bg-[#93000a] transition-colors"
        : editorialClasses.confirmButton,
    },
    background: "#ffffff",
    color: "#1c1917",
    iconColor: danger ? "#B45309" : "#1c1917",
  });
  return result.isConfirmed;
};
