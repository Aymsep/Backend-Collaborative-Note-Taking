import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class UsersService {
    constructor(private readonly databaseService: DatabaseService){}
    
    async getUsers(){
        return await this.databaseService.user.findMany({
            select: {
                id: true,
                username: true,
                email: true,
              },
        })
    }
}
