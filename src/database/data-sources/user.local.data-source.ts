import * as path from 'path';
import { User } from "../../core-data/models/user.model";
import { UserDataSource } from "./data-source";
import { FileSystemUtils } from '../../core-utils/file-system.utils';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserLocalDataSource extends UserDataSource {
  private USER_DATABASE_FILE_PATH = path.join(__dirname, '../../../data/users.json');
  private users: User[] = [];

  constructor() {
    super();
    this.loadUserDatabaseFromFile();
  }

  loadUserDatabaseFromFile() {
    if (!FileSystemUtils.doesPathExists(this.USER_DATABASE_FILE_PATH)) {
      throw new Error('User database file does not exist');
    }

    this.users = [];
    const users = JSON.parse(FileSystemUtils.readFile(this.USER_DATABASE_FILE_PATH).toString());
    for (const user of users) {
      this.users.push(
        new User(
          user.id, 
          user.name, 
          new Date(user.createdAt),
        )
      );
    }
    console.log(`User database loaded, ${this.users.length} users loaded.`);
  }
  
  getOne(id: number): User | undefined {
    return this.users.find(user => user.id === id);
  }
  getAll(): User[] {
    return this.users;
  }
}