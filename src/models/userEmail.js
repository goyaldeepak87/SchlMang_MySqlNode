module.exports = (sequelize, DataTypes) => {
    const UserEmail = sequelize.define('UserEmail', {
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true,
            },
        },
        role: {
            type: DataTypes.STRING,
            validate: {
                isIn: [['superadmin', 'admin', 'teacher', 'student']],
            },
            allowNull: false,
        },
        createdBy: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'Users', // This should match the name of the user model (case-sensitive)
                key: 'uuid',
            },
        },
        // creatorRole: {
        //     type: DataTypes.STRING,
        //     validate: {
        //         isIn: [['superadmin', 'admin', 'teacher']], // Corrected to use double brackets
        //     },
        //     allowNull: false,
        // },
        blacklisted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
    }, {
        paranoid: true, // Enable soft deletes
        timestamps: true, // Add createdAt and updatedAt timestamps
        defaultScope: { 
            attributes: { exclude: ['createdBy'] }, // Exclude createdBy by default
        },
        scopes: {
            withCreatedBy: {
                attributes: { include: ['createdBy'] }, // Include createdBy when needed
            },
        },
    });

    // UserEmail.associate = (models) => {
    //     // Token belongs to User
    //     UserEmail.belongsTo(models.User, {
    //         foreignKey: 'createdBy',
    //         targetKey: 'uuid', // Make sure this matches the `User` table's `uuid` field
    //     });
    // };

    return UserEmail;
};