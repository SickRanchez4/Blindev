// Wraps a route handler so both sync throws and rejected promises reach the error middleware.
const catchAsync = (fn) => (req, res, next) => {
  Promise.resolve()
    .then(() => fn(req, res, next))
    .catch(next);
};

module.exports = catchAsync;
