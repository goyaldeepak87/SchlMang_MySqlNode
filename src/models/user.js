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
        },
        contactNumber: {
            type: DataTypes.STRING,
            allowNull: true,  // Set to true by default for other roles
            validate: {
                validator: function (v) {
                    return /^[0-9]{10}$/.test(v);
                },
                message: 'Contact number must be 10 digits',
            },
            // Custom validation based on role
            set(value) {
                if (this.role !== 'superadmin' && !value) {
                    throw new Error('Contact number is required for admin role');
                }
                this.setDataValue('contactNumber', value);
            },
        },
        img: {
            type: DataTypes.STRING,
            allowNull: true,
            get() {
                const profilePicture = this.getDataValue('profile_picture');
                if (profilePicture) {
                    return `${process.env.BACKEND_URL}/profile/${profilePicture}`;
                } else {
                    return null;
                }
            },
        },
        subject: {
            type: DataTypes.STRING,
            allowNull: true, // Set to true by default for other roles
            validate: {
                isSubjectRequired(value) {
                    if (this.role === 'teacher' && !value) {
                        throw new Error('Subject is required for teacher role');
                    }
                },
            },
        },
        role: {
            type: DataTypes.STRING,
            validate: {
                isIn: [['superadmin', 'admin', 'teacher', 'student']],
            },
            allowNull: false,
        },
        creatorRole: {
            type: DataTypes.STRING,
            enum: ['SuperAdmin', 'Admin', 'Teacher'],
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
