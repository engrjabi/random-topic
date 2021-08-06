module.exports = {
  publicPath:
    process.env.NODE_ENV === "production"
      ? "/" // note the trailing slash
      : "/",
};
