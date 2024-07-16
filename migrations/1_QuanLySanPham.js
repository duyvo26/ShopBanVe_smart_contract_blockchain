const QuanLySanPham = artifacts.require("QuanLySanPham");

module.exports = function (deployer) {
  deployer.deploy(QuanLySanPham);
};
