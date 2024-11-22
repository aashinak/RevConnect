import { UserRepository } from '../../../repository/userRepository';
import { ApiError } from '../../../utils/ApiError';

interface userData {
    userId: string;
    name: string;
    email: string;
    avatar: string;
}
const userRepo = new UserRepository()
async function userUpdateHandler(data: userData) {
  try {
    // Create the updateData object, conditionally adding fields that are provided
    const updateData: { name?: string; avatar?: string } = {};

    if (data.name) updateData.name = data.name;
    if (data.avatar) updateData.avatar = data.avatar;

    // Check if there's anything to update
    if (Object.keys(updateData).length === 0) {
      throw new ApiError(400, 'No fields to update');
    }

    // Update the user data
    const updatedUser = await userRepo.updateUser(data.userId, updateData)

    // Log or return the updated user
    console.log('User updated successfully:', updatedUser);
    return updatedUser;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
}

export default userUpdateHandler
