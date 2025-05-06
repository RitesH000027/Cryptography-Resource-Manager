const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const User = require('./User');

const Event = sequelize.define('Event', {
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
  startDateTime: {
    type: DataTypes.DATE,
    allowNull: false
  },
  endDateTime: {
    type: DataTypes.DATE,
    allowNull: true
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'Online'
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'conference'
  },
  source: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'college'
  },
  organizerName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  organizerImageUrl: {
    type: DataTypes.STRING,
    allowNull: true
  },
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: true
  },
  registrationLink: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      isUrl: true
    }
  },
  isFeatured: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  status: {
    type: DataTypes.ENUM('pending', 'approved', 'rejected'),
    defaultValue: 'pending'
  },
  tags: {
    type: DataTypes.JSON,
    defaultValue: ['cryptography']
  },
  creatorId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: User,
      key: 'id'
    }
  },
  externalId: {
    type: DataTypes.STRING,
    allowNull: true
  },
  maxParticipants: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  currentParticipants: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  timestamps: true,
  indexes: [
    {
      fields: ['startDateTime']
    },
    {
      fields: ['category']
    },
    {
      fields: ['status']
    },
    {
      fields: ['source']
    }
  ]
});

// Define relationships
Event.belongsTo(User, { as: 'creator', foreignKey: 'creatorId' });
User.hasMany(Event, { foreignKey: 'creatorId' });

module.exports = Event;