module.exports = (sequelize, DataTypes) => {
    const Cars = sequelize.define("Cars", {
      image:{
        type: DataTypes.STRING,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      color: {
        type: DataTypes.STRING,
        allowNull: false,
      },
     amount: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    });
  
    return Cars;
  };