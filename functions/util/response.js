// The request succeeded. The result meaning of "success" depends on the HTTP method
const ok = ({ res, data, message }) => {
  const response = {
    status: 'success',
    message,
    data,
  };
  res.status(200).json(response);
  res.end();
};

// The request succeeded, and a new resource was created as a result.
// This is typically the response sent after POST requests, or some PUT requests
const created = ({ res, data, message }) => {
  const response = {
    status: 'success',
    message,
    data,
  };
  res.status(200).json(response);
  res.end();
};

module.exports = {
  ok,
  created,
};
