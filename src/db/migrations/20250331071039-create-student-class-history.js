module.exports = (sequelize, DataTypes) => {
    const Student = sequelize.define('Student', {
        uuid: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
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
        admissionDate: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
    }, {
        paranoid: true, // Enable soft deletes
        timestamps: true, // Add createdAt and updatedAt fields
    });

    return Student;
};