import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiKeyType } from 'src/enums/permission.enum';
import { User } from './user.entity';

@Entity()
export class ApiKey {
  @PrimaryGeneratedColumn('uuid')
  id: string; // used as the prefix in the API key that the user can see

  @Column()
  hashedSecret: string; // API secret

  @Column()
  merchantId: string;

  @Column()
  label: string;

  @Column()
  webhookUrl: string;

  // Both payer and payee will have the same internalTransferId
  @ManyToOne(() => User)
  @JoinColumn()
  merchant: User;

  @Column({
    type: 'enum',
    enum: ApiKeyType,
  })
  type: ApiKeyType;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @CreateDateColumn({ type: 'timestamptz' })
  @Index()
  createdAt: Date;
}
