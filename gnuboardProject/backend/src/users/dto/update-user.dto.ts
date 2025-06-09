export class UpdateUserDto {
  name?: string;
  email?: string;
  profileImage?: string;
  birth?: string;
  gender?: 'Male' | 'Female';
  phone?: string;
} 