import type { DataTypes, Sequelize } from "sequelize"


const defineUser = function(sequelize: Sequelize, DataTypes: any) {
    return sequelize.define('User', {
        id:          { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
        hexpubkey:   { type: DataTypes.STRING, allowNull: false },
        conditions:   { type: DataTypes.JSONB, allowNull: false, defaultValue: {} },
        createdAt:   { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW, field: 'created_at' },
        updatedAt:   { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW, field: 'updated_at' },
    },

    {
        sequelize,
        tableName: 'Users',
        timestamps: true,
    })
}

export { defineUser }