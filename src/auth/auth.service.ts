import { ConflictException, ForbiddenException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CreateUserDto, LoginUserDto } from './dto';
import * as bcrypt from 'bcryptjs';  // Replace bcrypt with bcryptjs
import { JwtService } from '@nestjs/jwt';


@Injectable()
export class AuthService {

    constructor(
        private readonly databaseService: DatabaseService,
        private readonly jwtService: JwtService
    ){}


    async signUpLocal(user:CreateUserDto){
        const {
            email,
            password,
            username
        } = user

        const exitingUser = await this.databaseService.user.findFirst({
            where:{
                email
            }
        })

        if(exitingUser) throw new ConflictException('email is already in use')

        const hashedPassword = await this.hashPassword(password)

        try{

            const newUser = await this.databaseService.user.create({
                data: {
                    email,
                    username,
                    password:hashedPassword
                }
            })
            return this.generateToken(newUser)

        }catch(err){
            console.log(err)
            throw new InternalServerErrorException('Registration failed');
        }
    }

    async signInLocal(user:CreateUserDto){
        return this.generateToken(user)
    }

    async getProfile(userId:number){
        const user = await this.databaseService.user.findUnique({
            where:{
                id:userId
            }
        })
        if(!user) throw new ForbiddenException('User Not Found')
        const {password:_,...results} = user
         return results
    }

    async validateUser(email: string, password: string): Promise<any> {
        const user = await this.databaseService.user.findUnique({
            where:{
                email
            }
        });
    
        if (!user || !(await bcrypt.compare(password, user.password))) {
            throw new ForbiddenException('User Not Found')
        }
    
        const { password: _, ...result } = user; // Exclude the password field
        return result;
      }


    async hashPassword(password: string): Promise<string> {
        const saltRounds = 10;
        return bcrypt.hash(password, saltRounds);
      }

      async generateToken(user: any) {
        const payload = {
            id: user.id,
            email: user.email,
            username:user.username
        }
        return {
          access_token: this.jwtService.sign(payload),
          user:{
            ...payload
        }
        };
      }
}
