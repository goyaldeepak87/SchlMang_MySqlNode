const bcrypt = require('bcryptjs');
const validator = require('validator');

module.exports = (sequelize, DataTypes) => {
    const Student = sequelize.define('Student', {
        uuid: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            unique: true,
            primaryKey: true,
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
            // Using a setter to hash the password before saving it
            set(value) {
                const salt = bcrypt.genSaltSync(10);  // Generates a salt with 10 rounds
                const hashPassword = bcrypt.hashSync(value, salt);  // Hash the password synchronously
                this.setDataValue('password', hashPassword);  // Set the hashed password value
            },
        },
        contactNumber: {
            type: DataTypes.STRING,
            allowNull: true,
            validate: {
                isValidContact(value) {
                    if (value && !validator.isNumeric(value)) {
                        throw new Error('Contact number must be numeric');
                    }
                    if (value && !validator.isLength(value, { min: 10, max: 10 })) {
                        throw new Error('Contact number must be 10 digits');
                    }
                },
            },
        },
        dateOfBirth: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
        gender: {
            type: DataTypes.ENUM('male', 'female', 'other'),
            allowNull: false,
        },
        address: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        currentClass: {
            type: DataTypes.STRING,
            allowNull: false, // e.g., "5th Grade", "12th Grade"
        },
        currentSection: {
            type: DataTypes.STRING,
            allowNull: true, // e.g., "A", "B", "C"
        },
        rollNumber: {
            type: DataTypes.STRING,
            unique: {
                name: 'unique_rollNumber', // Custom constraint name
                msg: 'Roll number must be unique', // Custom error message
            },
            allowNull: false,
        },
        admissionDate: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
        guardianName: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        guardianContact: {
            type: DataTypes.STRING,
            allowNull: true,
            validate: {
                isValidContact(value) {
                    if (value && !validator.isNumeric(value)) {
                        throw new Error('Guardian contact number must be numeric');
                    }
                    if (value && !validator.isLength(value, { min: 10, max: 10 })) {
                        throw new Error('Guardian contact number must be 10 digits');
                    }
                },
            },
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
        updatedAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
    }, {
        paranoid: true, // Enable soft deletes
        timestamps: true, // Add createdAt and updatedAt fields
        indexes: [
            { fields: ['email'] }, // Index for faster email lookups
            { fields: ['rollNumber'] }, // Index for roll number
        ],
        defaultScope: {
            attributes: { exclude: ['password'] },  // Password is excluded here by default
        },
        scopes: {
            withPassword: {
                attributes: { include: ['password'] }, // Include the password for authentication
            },
        },
    });

    // Optimize database calls by adding hooks
    Student.beforeCreate(async (student) => {
        // Ensure rollNumber is unique before creating
        const existingStudent = await Student.findOne({ where: { rollNumber: student.rollNumber } });
        if (existingStudent) {
            throw new Error('Roll number must be unique');
        }
    });


    // Method to compare passwords
    Student.prototype.isPasswordMatch = async function (password) {
        console.log("password==>999", password, this.password)
        if (!this.password) {
            throw new Error('Password is not set');
        }
        const isMatch = await bcrypt.compare(password, this.password);
        console.log("isMatch==>", isMatch)
        return isMatch;
    };

    // Student.associate = (models) => {
    //     // Associate Student with StudentClassHistory
    //     Student.hasMany(models.StudentClassHistory, {
    //         foreignKey: 'studentUuid',
    //         as: 'classHistory',
    //     });
    // };

    Student.hasMany(sequelize.models.Token, {
        foreignKey: 'user_uuid',
        constraints: false, // Disable foreign key constraints for polymorphic associations
        scope: {
            user_type: 'Student', // Only associate with Tokens where user_type is 'Student'
        },
    });

    return Student;
};