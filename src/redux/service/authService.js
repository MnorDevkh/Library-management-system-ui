import apiAuth from "./apiAuth";

const signInService = async (credentials) => {
  const data = {
    email: credentials.email,
    password: credentials.password,
  };
  return await apiAuth.post("/v1/auth/signin", data);
};

const signupService = async (credentials) => {
  return await apiAuth.post("/v1/auth/signup", credentials);
};

const AuthService = { signInService, signupService };
export default AuthService;