import express from "express";

export const logRequest: express.RequestHandler = (req, res, next) => {
  const ipAddress = req.ip;
  const timestamp = new Date().toISOString();

  console.log(`Incoming request from IP ${ipAddress} at ${timestamp}`);

  next();
};
