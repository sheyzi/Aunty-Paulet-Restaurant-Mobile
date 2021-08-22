import axios from "axios";

const instance = axios.create({
  // .. where we make our configurations
  baseURL: "https://secret-temple-37744.herokuapp.com",
});

export default instance;
