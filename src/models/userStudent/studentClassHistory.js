module.exports = (sequelize, DataTypes) => {
    const StudentClassHistory = sequelize.define('StudentClassHistory', {
        uuid: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            unique: true,
            primaryKey: true,
        },
        studentUuid: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'Students', // Reference the Student model
                key: 'uuid',
            },
        },
        class: {
            type: DataTypes.STRING,
            allowNull: false, // e.g., "5th Grade", "6th Grade"
        },
        section: {
            type: DataTypes.STRING,
            allowNull: true, // e.g., "A", "B", "C"
        },
        startDate: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
        endDate: {
            type: DataTypes.DATEONLY,
            allowNull: true, // Null if the student is currently in this class
        },
        grade: {
            type: DataTypes.STRING,
            allowNull: true, // e.g., "A+", "B"
        },
    }, {
        paranoid: true, // Enable soft deletes
        timestamps: true, // Add createdAt and updatedAt fields
    });

    StudentClassHistory.associate = (models) => {
        // Associate StudentClassHistory with Student
        StudentClassHistory.belongsTo(models.Student, {
            foreignKey: 'studentUuid',
            as: 'student',
        });
    };

    return StudentClassHistory;
};