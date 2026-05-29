import { app, configureApp } from "./server/app";

const PORT = Number(process.env.PORT) || 3000;

async function startServer() {
  await configureApp(app);

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

if (process.env.NODE_ENV !== "test") {
  startServer();
}

export { app };
