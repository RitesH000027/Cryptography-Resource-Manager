const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const User = require('./User');
const Resource = require('./Resource');

const Project = sequelize.define('Project', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('planning', 'active', 'completed', 'archived'),
    defaultValue: 'planning'
  },
  startDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  endDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false
  },
  tags: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  leaderId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  },
  teamMembers: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  objectives: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  progress: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      min: 0,
      max: 100
    }
  },
  visibility: {
    type: DataTypes.ENUM('public', 'private', 'team'),
    defaultValue: 'private'
  },
  repository: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      isUrl: true
    }
  },
  publications: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  funding: {
    type: DataTypes.JSON,
    allowNull: true
  }
}, {
  timestamps: true,
  indexes: [
    {
      fields: ['leaderId']
    },
    {
      fields: ['status']
    },
    {
      fields: ['category']
    }
  ]
});

// Define relationships
Project.belongsTo(User, { as: 'leader', foreignKey: 'leaderId' });
User.hasMany(Project, { foreignKey: 'leaderId' });

Project.belongsToMany(Resource, { through: 'ProjectResources' });
Resource.belongsToMany(Project, { through: 'ProjectResources' });

module.exports = Project;