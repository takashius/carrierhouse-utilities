import Constants from "expo-constants";

const ENV = {
  dev: {
    apiUrl: "http://192.168.0.108:8080",
    type: "dev",
  },
  prod: {
    apiUrl: "https://insurtech.carrierhouse.us/pharos-api/pharos",
    type: "production",
  },
};

const getEnvVars = (env = Constants.expoConfig) => {
  // if (__DEV__) {
  //   return ENV.dev;
  // } else if (env === 'staging') {
  //   return ENV.staging;
  // } else if (env === 'production') {
  //   return ENV.prod;
  // } else {
  //   return ENV.staging;
  // }
  return ENV.prod;
};

export default getEnvVars;
