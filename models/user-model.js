// import mongoose from "mongoose";

// const userSchema = new mongoose.Schema(
//   {
//     name: {
//       type: String,
//       required: true,
//       trim: true
//     },
//     email: {
//       type: String,
//       required: true,
//       unique: true,
//       lowercase: true
//     },
//     password: {
//       type: String,
//       required: true,
//       // minlength: 6
//     },
//     avatar: {
//       type: String,
//       default: "https://i.ibb.co/2kR5zq0/default-avatar.png",
//     },

//     // Social features
//     followers: [
//       {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "User"
//       }
//     ],
//     following: [
//       {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "User"
//       }
//     ],
//     followRequests: [
//       {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "User"
//       }
//     ],
//   },
//   { timestamps: true }
// );


// const userModel = mongoose.model("User", userSchema);
// export default userModel;


import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      default: "https://i.ibb.co/2kR5zq0/default-avatar.png",
    },

    // Social features
    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    ],
    following: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    ],

    // Incoming follow requests (people who want to follow you)
    followRequests: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    ],

    // Outgoing follow requests (people you requested to follow)
    requestedUsers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    ],
  },
  { timestamps: true }
);

const userModel = mongoose.model("User", userSchema);
export default userModel;
