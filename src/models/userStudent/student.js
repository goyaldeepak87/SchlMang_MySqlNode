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
        },
        contactNumber: {
            type: DataTypes.STRING,
            allowNull: true,
            validate: {
                is: /^[0-9]{10}$/, // Validate 10-digit phone numbers
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
            unique: true,
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
                is: /^[0-9]{10}$/, // Validate 10-digit phone numbers
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
    });

    Student.associate = (models) => {
        // Associate Student with StudentClassHistory
        Student.hasMany(models.StudentClassHistory, {
            foreignKey: 'studentUuid',
            as: 'classHistory',
        });
    };

    return Student;
};