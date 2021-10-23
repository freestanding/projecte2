const logout = () => {
  $.ajax({
    url: "/logout",
    type: "POST",
    success: function () {
      location.reload();
    },
  });
};
