export type StubAdapterRequest = {
  projectId: string;
  text: string;
};

export type StubAdapterResult = {
  adapter: "stub";
  projectId: string;
  text: string;
  message: string;
};
