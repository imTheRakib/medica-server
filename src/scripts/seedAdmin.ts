import config from "../config";
import { prisma } from "../lib/prisma";
import { UserRole } from "../types/enums/UserRoles";


const seedAdmin = async () => {
  try {
    //new user
    const newUser = {
      name: "Ashraful",
      email: "ashrafulhaqueatif@gmail.com",
      password: "12345678",
      phone: "01706534595",
      role: UserRole.ADMIN,
    };
    //check user existance
    const isUserExist = await prisma.user.findUnique({
      where: {
        email: newUser.email,
      },
    });

    if (isUserExist) {
      throw new Error("User already exists...");
    }

    console.log("BETTER_AUTH_URL:", config.BETTER_AUTH_URL);
    const createNewUser = await fetch(
      `${config.BETTER_AUTH_URL}/api/auth/sign-up/email`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(newUser),
      },
    );

    console.log(createNewUser);

    //if created then update email verification status
    if (createNewUser.ok) {
      await prisma.user.update({
        where: { email: newUser.email },
        data: { emailVerified: true },
      });
    }
  } catch (error: any) {
    throw new Error(error);
  }
};
seedAdmin();
