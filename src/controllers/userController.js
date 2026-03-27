const getUsers = (req, res) => {
  res.json({
    message: 'Users fetched successfully',
    data: []
  });
};

module.exports = {
  getUsers
};