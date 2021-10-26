function send() {
  event.preventDefault();

  Swal.fire({
    title: "¿Seguro que quieres comprar el producto?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Si",
    cancelButtonText: "No",
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
  }).then((result) => {
    if (result.value) {
      document.formulario_registro.submit();
    }
    return false;
  });
}
