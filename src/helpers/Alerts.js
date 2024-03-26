import Swal from "sweetalert2";

const Alerts = async (title, text, icon) => {
  Swal.fire({
    position: "center",
    icon: icon,
    title: title,
    showConfirmButton: false,
    timer: 1500,
  });
};
export default Alerts;
