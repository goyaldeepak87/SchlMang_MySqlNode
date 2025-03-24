'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('UserEmails', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            email: {
                type: Sequelize.STRING,
                allowNull: false,
                unique: true,
                validate: {
                    isEmail: true,
                },
            },
            role: {
                type: Sequelize.STRING,
                allowNull: false,
                validate: {
                    isIn: [['superadmin', 'admin', 'teacher', 'student']],
                },
            },
            createdBy: {
                type: Sequelize.UUID,
                allowNull: false,
            },
            // creatorRole: {
            //     type: Sequelize.STRING,
            //     allowNull: false,
            //     validate: {
            //         isIn: [['SuperAdmin', 'Admin', 'Teacher']],
            //     },
            // },
            blacklisted: {
                type: Sequelize.BOOLEAN,
                defaultValue: false,
            },
            isActive: {
                type: Sequelize.BOOLEAN,
                defaultValue: true,
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.NOW,
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.NOW,
            },
            deletedAt: {
                type: Sequelize.DATE,
            },
        });
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('UserEmails');
    }
};