import User from "../../domain/models/userModel.js";

export const login = async (req, res, next) => {
  req.user = await User.findOne({
    email: req.body.email,
    password: req.body.password,
  });

  next();
};

export const showUser = async (req, res, next) => {
  try {
    const user = await User.findOne(req.params);

    res.hateoas_item(user);
  } catch (err) {
    next(err);
  }
};

export const listUsers = async (req, res, next) => {
  try {
    const { _page, _size, _order, ...filter } = req.query;
    const page = parseInt(_page) || 1;
    const size = parseInt(_size) || 10;

    const offset = (page - 1) * size;

    const users = await User.find(filter).skip(offset).limit(size).sort(_order);

    const totalData = await User.countDocuments();
    const totalPages = Math.ceil(totalData / size);

    res.hateoas_list(users, totalPages);
  } catch (err) {
    next(err);
  }
};

export const createUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    await new User({
      name,
      email,
      password,
    }).save();

    res.created();
  } catch (err) {
    next(err);
  }
};

export const editUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const user = await User.findOneAndUpdate(
      req.params,
      {
        name,
        email,
        password,
      },
      {
        new: true,
      }
    );

    res.hateoas_item(user);
  } catch (err) {
    next(err);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    await User.findByIdAndDelete(req.params._id);

    res.no_content();
  } catch (err) {
    next(err);
  }
};
