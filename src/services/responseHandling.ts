interface ErrorProps {
  executionError: boolean;
  status: number;
  message: string;
}

export const executionError = (status: any, message: any) => {
  return { executionError: true, status, message };
};
