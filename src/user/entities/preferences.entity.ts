import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../user/entities/user.entity';

@Entity()
export class Preferences {
    @ApiProperty()
    @PrimaryGeneratedColumn()
    public id!: number;

    @ApiProperty({
        example: true,
        description: 'Indicates whether the employer wants to hide their profile data in job posts',
    })
    @Column({ default: false })
    hideProfileData: boolean; 


    @ApiProperty({ example: true })
    @Column({ default: true })
    notificationsEnabled: boolean;

    @ApiProperty({ example: 'dark' })
    @Column({ nullable: true })
    theme: string;

    @ApiProperty({ example: true })
    @Column({ default: true })
    showEmail: boolean;

    @ApiProperty({ example: true })
    @Column({ default: true })
    showPhoneNumber: boolean;

    @ApiProperty({ example: true })
    @Column({ default: true })
    showLocation: boolean;

    @ApiProperty({ example: true })
    @Column({ default: true })
    contactViaEmail: boolean;

    @ApiProperty({ example: true })
    @Column({ default: true })
    contactViaPhoneNumber: boolean;

    @ApiProperty({ example: true })
    @Column({ default: true })
    contactViaMessage: boolean;

    // One-to-One relationship with User, allows an employer to be associated with a user
    // If the user is deleted, the associated employer profile will also be deleted
    @OneToOne(() => User, (user) => user.userPreferences, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'user_id' })
    user: User;
}
