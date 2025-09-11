import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import userModel from "../models/user-model.js";


export const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.json({ success: false, message: "Details are Missing!" });
    }

    try {
        const existingUser = await userModel.findOne({ email });

        if (existingUser) {
            return res.json({ success: false, message: "User already exists!!!" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new userModel({
            name,
            email,
            password: hashedPassword,
        });

        await user.save();

        // jwt token
        const token = jwt.sign(
            {
                id: user._id,
                name: user.name,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d",
            }
        );


        res.cookie("token", token, {
            httpOnly: true,
            // secure: process.env.NODE_ENV === "production",
            secure: true,
            // sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
            sameSite: "none",
            path: "/",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });




        return res.json({
            success: true,
            token: token,
            message: "User Account created successfully!!!",
        });
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
};




// user login controller
export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.json({
            success: false,
            message: "Email and password are required",
        });
    }

    try {
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.json({ success: false, message: "Invalid Email" });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.json({ success: false, message: "Invalid password" });
        }

        // jwt token
        const token = jwt.sign(
            {
                id: user._id,
                name: user.name,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d",
            }
        );

        // sending user cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
            path: "/",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return res.json({
            success: true,
            token: token,
            message: "user Login Succesfully!!",
        });
    } catch (error) {
        console.log(error);
        return res.json({ success: false, message: error.message });
    }
};



export const logoutUser = async (req, res) => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
        });
        return res.json({
            success: true,
            message: "Logout Successfully!!!",
        });
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
};


// User is authenticated checking controller mostly used for frontend
export const isAuthenticated = async (req, res) => {
    try {
        return res.json({
            success: true,
        });
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
};





export const userData = async (req, res) => {
    const { userId } = req.body;
    // console.log(customerUserId)

    try {
        const user = await userModel.findById(userId);

        if (!user) {
            return res.json({ success: false, message: "Main-Admin User not Found!" });
        }


        res.json(
            {
                success: true,
                user
            }
        );

    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
}




export const userDataForOther = async (req, res) => {
    const { id : userId} = req.params;
    // console.log(customerUserId)

    try {
        const user = await userModel.findById(userId);

        if (!user) {
            return res.json({ success: false, message: "Main-Admin User not Found!" });
        }


        res.json(
            {
                success: true,
                user
            }
        );

    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
}




export const followRequest = async (req, res) => {
  try {
    const { userId: senderId } = req.body; // logged-in user
    const { id: receiverId } = req.params; // target user

    if (senderId === receiverId) {
      return res.json({ success: false, message: "You cannot follow yourself" });
    }

    const sender = await userModel.findById(senderId);
    const receiver = await userModel.findById(receiverId);

    if (!sender || !receiver) {
      return res.json({ success: false, message: "User not found" });
    }

    // Check if already following
    if (receiver.followers.includes(senderId)) {
      return res.json({ success: false, message: "You already follow this user" });
    }

    // Check if request already exists
    if (receiver.followRequests.includes(senderId)) {
      return res.json({ success: false, message: "Request already sent" });
    }

    // Add to receiver's followRequests (incoming)
    receiver.followRequests.push(senderId);

    // Add to sender's requestedUsers (outgoing)
    sender.requestedUsers.push(receiverId);

    await receiver.save();
    await sender.save();

    res.json({ success: true, message: "Follow request sent" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};




export const acceptRequest = async (req, res) => {

    const { userId } = req.body;
    const { id: requesterId } = req.params;

    try {
        const currentUser = await userModel.findById(userId);
        // const requesterId = req.params.id;

        if (!currentUser.followRequests.includes(requesterId)) {
            return res.json({ message: "No such follow request" });
        }

        // Remove from followRequests
        currentUser.followRequests = currentUser.followRequests.filter(
            (id) => id.toString() !== requesterId
        );

        // Add to followers/following
        currentUser.followers.push(requesterId);
        await currentUser.save();

        const requester = await userModel.findById(requesterId);
        requester.following.push(currentUser._id);
        await requester.save();

        res.json({ message: "Follow request accepted" });

    } catch (error) {
        return res.json({ success: false, message: error.message });

    }
}




export const rejectRequest = async (req, res) => {

    const { userId } = req.body;
    const { id: requesterId } = req.params;

    try {
        const currentUser = await userModel.findById(userId);
        // const requesterId = req.params.id;

        if (!currentUser.followRequests.includes(requesterId)) {
            return res.json({ message: "No such follow request" });
        }

        // Remove request
        currentUser.followRequests = currentUser.followRequests.filter(
            (id) => id.toString() !== requesterId
        );
        await currentUser.save();

        res.json({ message: "Follow request rejected" });
    } catch (error) {
        return res.json({ success: false, message: error.message });

    }
}



export const searchUsers = async (req, res) => {
  try {
    const { query } = req.query;

    console.log("request is commming...!")

    if (!query) {
      return res.json({ message: "Query parameter is required" });
    }

    // search in name or email (case-insensitive)
    const users = await userModel.find({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { email: { $regex: query, $options: "i" } }
      ]
    }).select("name email");

    res.json(users);
  } catch (err) {
    res.json({ message: err.message });
  }
};





// Get all follow requests
export const getFollowRequests = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await userModel.findById(userId).populate(
      "followRequests",
      "name email"
    );

    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    res.json({ success: true, requests: user.followRequests });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};