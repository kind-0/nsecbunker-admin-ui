import { Column, DataSource, PrimaryColumn } from "typeorm";
import { Entity } from "typeorm"

@Entity()
export class User {
    @PrimaryColumn()
    @Column()
    hexpubkey: string

    @Column()
    name: string

    @Column()
    permissions: string[]

    @Column()
    createdAt: Date

    @Column()
    updatedAt: Date
}

export const AppDataSource = new DataSource({
    type: "sqlite",
    database: "nostr",

    synchronize: true,
    logging: true,
    entities: [
        User
    ],
    subscribers: [],
    migrations: [],
})

AppDataSource.initialize()
    .then(() => {
        // here you can start to work with your database
    })
    .catch((error) => console.log(error))