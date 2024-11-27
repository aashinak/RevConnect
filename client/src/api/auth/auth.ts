import axiosInstance from "@/axios";

export const login = async (formData: { email: string; password: string }) => {
  try {
    const response = await axiosInstance.post("/v1/auth/login", formData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const signup = async (formData: {
  name: string;
  email: string;
  password: string;
  avatar?: File;
}) => {
  try {
    const formDataToSend = new FormData();

    // Append form fields to FormData
    formDataToSend.append("name", formData.name);
    formDataToSend.append("email", formData.email);
    formDataToSend.append("password", formData.password);

    // Append avatar file if available
    if (formData.avatar) {
      formDataToSend.append("avatar", formData.avatar);
    }

    // Send request to the backend
    const response = await axiosInstance.post(
      "/v1/auth/register",
      formDataToSend,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error during signup:", error);
    throw error;
  }
};

export const submitOtp = async (formData: { otp: number; email: string }) => {
  try {
    const response = await axiosInstance.post("/v1/auth/verifyOtp", formData);
    return response.data
  } catch (error) {
    console.error("Error during signup:", error);
    throw error;
  }
};

export const resendVerificationOtp = async (formData: { email: string }) => {
  try {
    const response = await axiosInstance.post("/v1/auth/verifyOtp", formData);
    return response.data
  } catch (error) {
    console.error("Error during signup:", error);
    throw error;
  }
};
