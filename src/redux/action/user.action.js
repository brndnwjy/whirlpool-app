import axios from "axios";
import swal from "sweetalert";

export const login = (dataForm, navigate) => async (dispatch) => {
  try {
    dispatch({ type: "LOGIN_PENDING" });
    const result = await axios.post(
      "http://localhost:4000/v1/user/login",
      dataForm
    );
    console.log(result)
    const user = result.data.data;
    swal({
      title: "Logged In",
      text: `Welcome`,
      icon: "success",
    });
    console.log(user);
    // localStorage.setItem("token", user.token);
    // localStorage.setItem("user", JSON.stringify(user.user));
    dispatch({ type: "LOGIN_SUCCESS", payload: user });
    navigate("/");
  } catch (error) {
    swal({
      title: "Invalid",
      text: `E-mail or Password invalid`,
      icon: "error",
    });
    console.log(error);
    dispatch({ type: "LOGIN_ERROR" });
  }
};

export const register = (dataForm, navigate) => async (dispatch) => {
  try {
    dispatch({ type: "REGISTER_PENDING" });
    await axios.post("http://localhost:4000/v1/user/register", dataForm);
    swal({
        title: "Registered",
        text: "Please Login to your account",
        icon: "success",
      });
    dispatch({ type: "REGISTER_SUCCESS" });
    navigate("/login");
  } catch (error) {
    console.log(error);
    dispatch({ type: "REGISTER_ERROR" });
  }
};
