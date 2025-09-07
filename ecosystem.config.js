module.exports = {
    apps: [
      {
        name: "next-app",
        script: "npm",
        args: "run start -- -p 3010",
        env: {
          NODE_ENV: "production",
          PORT: 3010
        }
      }
    ]
  };
  