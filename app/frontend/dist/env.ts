interface autType {
  AppId: string;
  mockEmail: string;
  production: boolean;
}

const confidential = (): autType => ({
  AppId: "3",
  mockEmail: "xyz@tyyy.com.sa",
  production: false,
});

export const getConfidentialInfo = confidential;
