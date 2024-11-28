export default interface IUser {
    userId: string; // Unique identifier for the user
    name: string; // Display name of the user
    avatar: string; // URL to the user's avatar image
    status: "online" | "offline" | "away"; // Current status of the user
    contacts: { contactId: string }[]; // Array of contacts with unique user IDs
}
