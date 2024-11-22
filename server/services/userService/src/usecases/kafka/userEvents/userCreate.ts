
interface userData {
    userId: string;
    name: string;
    email: string;
    avatar: string;
}

async function userCreateHandler(data: userData) {
    console.log("User creating....");
}

export default userCreateHandler