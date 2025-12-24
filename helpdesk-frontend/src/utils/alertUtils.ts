import Swal from 'sweetalert2';

export const showSuccessAlert = (title: string, message?: string) => {
  return Swal.fire({
    icon: 'success',
    title: title,
    text: message,
    timer: message ? 2000 : 1500,
    showConfirmButton: !!message
  });
};
export const showErrorAlert = (title: string, message?: string) => {
  return Swal.fire('Error', message || title, 'error');
};
export const showInfoAlert = (title: string, message?: string) => {
  return Swal.fire({
    icon: 'info',
    title: title,
    text: message,
    confirmButtonText: 'OK'
  });
};
export const showConfirmDialog = (title: string, message?: string, confirmText: string = 'Yes, continue', onConfirm?: () => void) => {
  return Swal.fire({
    title: title,
    text: message,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#1976d2',
    cancelButtonColor: '#d32f2f',
    confirmButtonText: confirmText,
    cancelButtonText: 'Cancel'
  }).then((result) => {
    if (result.isConfirmed && onConfirm) {
      onConfirm();
    }
  });
};
