const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const User = require('./User');
const Resource = require('./Resource');

const Professor = sequelize.define('Professor', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
    references: {
      model: User,
      key: 'id'
    }
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  department: {
    type: DataTypes.STRING,
    allowNull: false
  },
  specialization: {
    type: DataTypes.STRING,
    allowNull: false
  },
  researchInterests: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  officeHours: {
    type: DataTypes.JSON,
    allowNull: true
  },
  contactInfo: {
    type: DataTypes.JSON,
    allowNull: true
  },
  biography: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  publications: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  achievements: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  timestamps: true,
  indexes: [
    {
      fields: ['userId']
    },
    {
      fields: ['department']
    }
  ]
});

// Define relationships
Professor.belongsTo(User);
User.hasOne(Professor);

Professor.hasMany(Resource, {
  foreignKey: 'authorId',
  constraints: false,
  scope: {
    authorType: 'professor'
  }
});

module.exports = Professor;