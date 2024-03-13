import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('posts')
class PostEntity {
  @PrimaryGeneratedColumn()
  public id?: number;

  @Column()
  public title: string;

  @Column()
  public content: string;

  @Column({ type: 'jsonb', nullable: true })
  public setting: any;
}

export default PostEntity;
