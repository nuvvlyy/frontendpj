const PROXY_CONFIG = [
  {
    context: [
      "/api",
    ],
    target: "http://localhost:8000/api",
    secure: false
  }
]
module.exports = PROXY_CONFIG;
