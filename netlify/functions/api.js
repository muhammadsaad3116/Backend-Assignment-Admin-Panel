
exports.handler = async (event) => {
  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      message: "Server is Run",
      method: event.httpMethod,
      status: "server is run..."
    })
  };
};
