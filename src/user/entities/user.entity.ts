import { Entity, Column, ObjectIdColumn } from 'typeorm';

@Entity()
export class User {
  @ObjectIdColumn()
  id: number;

  @Column({ nullable: false })
  email: string;

  @Column()
  userName: string;

  @Column()
  fullName: string;

  @Column()
  address: string;

  @Column()
  phone: string;

  @Column()
  dob: Date;

  @Column({ nullable: false })
  password: string;
}
