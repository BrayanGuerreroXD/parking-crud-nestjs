import { BaseRepository } from "src/config/base.repository";
import { UserEntity } from "src/entities/user.entity";

export class UserRepository extends BaseRepository<UserEntity> {
    constructor() {
        super(UserEntity);
    }

    async findByEmail(email: string): Promise<UserEntity | null> {
        return (await this.execRepository)
            .createQueryBuilder('user')
            .addSelect("user.password")
            .where({ email })
            .getOne();
    }
    
    async existEmail(email: string): Promise<boolean> {
        const user = (await this.execRepository)
            .createQueryBuilder('user')
            .where({ email })
            .getOne();
        return await user !== null;
    }
}