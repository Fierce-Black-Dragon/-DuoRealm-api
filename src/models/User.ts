import mongoose, {
  Schema,
  Document,
  InferSchemaType,
  ObjectId,
} from "mongoose";
import bcrypt from "bcrypt";
import jwt, { Secret } from "jsonwebtoken";
interface User {
  _id: ObjectId;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  avatar: string;
  status: string;
  lastActive: Date;
  friends: ObjectId[];
  guilds: ObjectId[];
  verifyPassword(password: string): Promise<boolean>;
  jwtAccessTokenCreation(): string;
  jwtRefreshTokenCreation(): string;
}
const userSchema = new Schema<User>(
  {
    username: {
      type: String,
      required: true,
      maxlength: [30, " max 40 character"],
    },
    firstName: {
      type: String,
      required: [true, "First Name is required"],
    },
    lastName: {
      type: String,
      required: [true, "Last Name is required"],
    },
    avatar: {
      type: String,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      validate: {
        validator: function (email: any) {
          return String(email)
            .toLowerCase()
            .match(
              /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            );
        },
        message: (props: any) => `Email (${props.value}) is invalid!`,
      },
    },
    password: {
      type: String,
      required: [true, "Please enter the password"],
      minlength: [6, "Please enter password greater than or equal to 6 char"],
      select: false,
    },
    friends: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    guilds: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Guild",
      },
    ],
    status: {
      type: String,
      default: "offline",
    },

    // more fields will be added when required
  },
  {
    timestamps: true,
  }
);

//encrypt password before save -- mongoose Hook
userSchema.pre("save", async function (next) {
  //to prevent over-encryption of password
  if (!this.isModified("password")) {
    return next();
  }
  //encrypt
  this.password = await bcrypt.hash(this.password, 10);
});
// Mongoose Methods
//user password validate method
userSchema.methods.verifyPassword = async function (senderPassword: string) {
  console.log(senderPassword, "senderPassword", this.password);
  const isValid = await bcrypt.compare(senderPassword, this.password);

  return isValid;
};

// jwt Access Token  creation
userSchema.methods.jwtAccessTokenCreation = async function () {
  let token = jwt.sign({ id: this._id }, process.env.ACCESS_KEY as Secret, {
    expiresIn: process.env.JWT_ACCESS_EXPIRE,
  });
  return token;
};
// jwt tRefresh Token  creation
userSchema.methods.jwtRefreshTokenCreation = async function () {
  return jwt.sign({ id: this._id }, process.env.REFRESH_KEY as Secret, {
    expiresIn: process.env.JWT_REFRESH_EXPIRE,
  });
};

const User = mongoose.model<User>("User", userSchema);
export default User;
