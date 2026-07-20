import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

// Transformer to safely handle PostgreSQL bigint returned as strings in JS
const parseIntTransformer = {
  to: (value: any) => value,
  from: (value: any) => parseInt(value, 10)
};

@Entity("users")
export class V1User {
  @PrimaryGeneratedColumn() id!: number;
  
  @Column("bigint", { unique: true, transformer: parseIntTransformer }) 
  telegram_id!: number;
  
  @Column("timestamp", { nullable: true }) 
  onboarded_at!: Date | null;
  
  @Column({ nullable: true }) 
  salon_name!: string;
  
  @Column({ default: 'shamsi' }) 
  calendar_type!: string;
  
  @Column({ nullable: true }) 
  work_start_time!: string;
  
  @Column({ nullable: true }) 
  work_end_time!: string;
  
  @Column({ nullable: true }) 
  break_start_time!: string;
  
  @Column({ nullable: true }) 
  break_end_time!: string;
  
  @Column("int", { nullable: true }) 
  deposit_amount!: number | null;
  
  @Column("timestamp", { nullable: true }) 
  subscription_expires_at!: Date | null;
}

@Entity("services")
export class Service {
  @PrimaryGeneratedColumn() id!: number;
  
  @Column("int") 
  user_id!: number;
  
  @Column() 
  name!: string;
  
  @Column("int") 
  duration!: number;
  
  @Column() 
  days!: string;
  
  @Column("int", { nullable: true }) 
  category_id!: number | null;
}

@Entity("appointments")
export class Appointment {
  @PrimaryGeneratedColumn() id!: number;
  
  @Column("int") 
  service_id!: number;
  
  @Column("bigint", { transformer: parseIntTransformer }) 
  customer_telegram_id!: number;
  
  @Column() 
  customer_name!: string;
  
  @Column("date") 
  appointment_date!: string | Date;
  
  @Column("time") 
  appointment_time!: string | Date;
  
  @Column("int", { nullable: true }) 
  staff_id!: number | null;
  
  @Column({ default: 'confirmed' }) 
  status!: string;
  
  @Column({ default: false }) 
  reminded_24h!: boolean;
  
  @Column({ default: false }) 
  reminded_2h!: boolean;
}

@Entity("service_categories")
export class ServiceCategory {
  @PrimaryGeneratedColumn() id!: number;
  
  @Column("int") 
  user_id!: number;
  
  @Column() 
  name!: string;
  
  @CreateDateColumn() 
  created_at!: Date;
}

@Entity("customer_salons")
export class CustomerSalon {
  @PrimaryGeneratedColumn() id!: number;
  
  @Column("bigint", { transformer: parseIntTransformer }) 
  customer_telegram_id!: number;
  
  @Column("int") 
  salon_user_id!: number;
}

@Entity("staff")
export class Staff {
  @PrimaryGeneratedColumn() id!: number;
  
  @Column("int") 
  user_id!: number;
  
  @Column() 
  name!: string;
}

@Entity("transactions")
export class Transaction {
  @PrimaryGeneratedColumn() id!: number;
  
  @Column("int") 
  user_id!: number;
  
  @Column("int") 
  amount!: number;
  
  @Column("int") 
  package_days!: number;
  
  @Column() 
  status!: string;
  
  @Column({ nullable: true }) 
  receipt_photo_id!: string;
  
  @Column({ nullable: true }) 
  authority!: string;
  
  @CreateDateColumn() 
  created_at!: Date;
  
  @UpdateDateColumn() 
  updated_at!: Date;
}

@Entity("inbox_messages")
export class InboxMessage {
  @PrimaryGeneratedColumn() id!: number;
  
  @Column("int") 
  salon_user_id!: number;
  
  @Column("bigint", { transformer: parseIntTransformer }) 
  customer_telegram_id!: number;
  
  @Column() 
  sender_name!: string;
  
  @Column("text") 
  content!: string;
  
  @Column({ default: 'customer' }) 
  sender_type!: string;
  
  @Column({ default: false }) 
  is_read!: boolean;
  
  @CreateDateColumn() 
  created_at!: Date;
}
