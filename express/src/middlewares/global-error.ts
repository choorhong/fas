import express from "express";

export const globalErrorHandler: express.ErrorRequestHandler = (
  error,
  _request,
  response,
  _next
) => {
  response.status(500).json({ error: error.name, message: error.message });
};
