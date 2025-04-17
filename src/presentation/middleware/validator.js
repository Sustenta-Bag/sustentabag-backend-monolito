export default (schema) => (req, res, next) => {
    try {
      schema.validateSync(req.body, {
        abortEarly: false,
        recursive: true,
      });
  
      next();
    } catch(err) {
      res.payment_required({
        message: err.message,
        errors: err.errors,
      });
    }
  }
