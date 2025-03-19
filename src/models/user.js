const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        uuid: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            unique: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true,
            },
        }, 
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            required: true,
        },
        role: {
            type: DataTypes.STRING,
            validate: {
                isIn: [['superadmin', 'admin', 'teacher', 'student']]
            },
            allowNull: false,
        },
        status: {
            type: DataTypes.BOOLEAN,
            defaultValue: true, // active by default
        },
        is_verified: {
            type: DataTypes.BOOLEAN,
            defaultValue: false, // not verified by default
        },
        is_blocked: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
    },
        {
            paranoid: true,
            timestamps: true,
            defaultScope: {
                attributes: { exclude: ['password'] },  // Password is excluded here by default
            },
            scopes: {
                withPassword: {
                    attributes: { include: ['password'] }, // Include the password for authentication
                },
            },
        });

    // Method to compare passwords
    User.prototype.isPasswordMatch = async function (password) {
        if (!this.password) {
            throw new Error('Password is not set');
        }
        const isMatch = await bcrypt.compare(password, this.password);
        return isMatch;
    };

    User.hasMany(sequelize.models.Token, {
        foreignKey: 'user_uuid',
        sourceKey: 'uuid',
    });

    return User;
};
