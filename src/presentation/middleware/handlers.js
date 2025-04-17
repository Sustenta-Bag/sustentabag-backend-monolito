import httpStatus from "http-status";

export default (req, res, next) => {
  res.ok = (data) => {
    res.status(httpStatus.OK).json(data);
  };

  res.created = () => {
    res.status(httpStatus.CREATED).send();
  };

  res.no_content = () => {
    res.status(httpStatus.NO_CONTENT).send();
  };

  res.internal_server_error = (err) => {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json(err);
  };

  res.not_found = () => {
    res.status(httpStatus.NOT_FOUND).send("not found...");
  };

  res.payment_required = (err) => {
    res.status(httpStatus.PAYMENT_REQUIRED).json(err);
  };

  res.unauthorized = () => {
    res.status(httpStatus.UNAUTHORIZED).send();
  };

  next();
};
