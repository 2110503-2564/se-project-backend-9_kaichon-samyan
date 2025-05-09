const User = require("../models/User");
const cloudinary = require("cloudinary").v2;

exports.register = async (req, res) => {
  try {
    const { name, email, password, tel } = req.body;

    if (!name || !email || !password || !tel) {
      return res
        .status(400)
        .json({ success: false, message: "Please provide all field" });
    }

    const existingUserEmail = await User.findOne({ email });
    if (existingUserEmail) {
      return res
        .status(400)
        .json({ success: false, message: "User with email already exist" });
    }

    const existingUserTel = await User.findOne({ tel });
    if (existingUserTel) {
      return res
        .status(400)
        .json({ success: false, message: "User with tel already exist" });
    }

    let user = await User.create({
      name,
      email,
      password,
      tel,
    });

    sendTokenResponse(user, 200, res);
    user = await User.find();
    console.log(user);
  } catch (err) {
    res.status(400).json({ success: false });
    console.log(err.stack);
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ success: false, msg: "Please provide email and password" });
  }

  const user = await User.findOne({
    $or: [{ email: email }, { username: email }]
  }).select("+password");

  if (!user) {
    return res.status(400).json({ success: false, msg: "Invalid credentials" });
  }

  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    return res.status(400).json({ success: false, msg: "Invalid credentials" });
  }

  sendTokenResponse(user, 200, res);
};

exports.logout = (req, res) => {
  res.cookie("jwt", "none", {
    expires: new Date(0), // หมดอายุทันที
    httpOnly: true,
  });

  res.status(200).json({ success: true, message: "Logged out successfully" });
};

exports.updateProfile = async (req, res) => {
  try {
    const { name, tel } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        name,
        tel,
      },
      {
        new: true, //return updated document
        runValidators: true
      }
    );

    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(400).json({ success: false, error });
    console.log(err.stack);
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    const user = await User.findById(req.user.id).select("+password");
    const isPasswordMatch = await user.matchPassword(oldPassword);

    if (!isPasswordMatch) {
      res.status(400).json({ success: false, error: "Password not match" });
      return;
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(400).json({ success: false, error });
    console.log(error);
  }
};

const sendTokenResponse = (user, statusCode, res) => {
  const token = user.getSignedJwtToken();

  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === "production") {
    options.secure = true;
  }

  user.password = undefined;

  res
    .status(statusCode)
    .cookie("jwt", token, options)
    .json({ success: true, token, user });
};

exports.getMe = async (req, res, next) => {
  const user = await User.findById(req.user.id);
  res.status(200).json({ success: true, data: user });
};

exports.uploadProfilePic = async (req, res) => {
  try {
    let { newProfilePic } = req.body;

    const userId = req.user.id;
    const user = await User.findById(userId);

    if (user.profileImg) {
      // ลบรูปเก่า
      await cloudinary.uploader.destroy(
        user.profileImg.split("/").pop().split(".")[0]
      , { invalidate: true });
    }

    const uploadedResponse = await cloudinary.uploader.upload(newProfilePic);
    newProfilePic = uploadedResponse.secure_url;

    const updatedUser =  await User.findByIdAndUpdate(
      userId,
      {
        profileImg: newProfilePic,
      },
      {
        new: true,
      }
    );

    return res.status(200).json({ success: true, user: updatedUser });
  } catch (error) {
    res.status(400).json({ success: false, error });
    console.log(error);
  }
};

//TODO change profile pic, delete profile pic

exports.deleteProfilePic = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (user.profileImg) {
      // ลบรูปเก่า
      await cloudinary.uploader.destroy(
        user.profileImg.split("/").pop().split(".")[0]
      , { invalidate: true });
    }
    else {
      return res.status(400).json({ success: false, error: "User don't have profileImg" });
    }

    // user.profileImg = "";
    // await user.save();

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { profileImg: "" },
      { new: true }
    );

    res.status(200).json({ success: true, user: updatedUser });
  } catch (error) {
    console.log(error);
    res.status(400).json({ success: false, error });
  }
}

exports.addUsername = async (req, res) => {
  try {
    let { newUsername } = req.body;

    if(!newUsername){
      return res.status(400).json({success : false , message : "you told me you want to (add,edit) username but right now you don't provide anything!"})
    }

    const userId = req.user.id;

    const updatedUser =  await User.findByIdAndUpdate(
      userId,
      {
        username: newUsername,
      },
      {
        new: true,
      }
    );

    return res.status(200).json({ success: true, user: updatedUser });
  } catch (error) {
    res.status(400).json({ success: false, error });
    console.log(error);
  }
}

exports.getAllUser = async (req, res) => {
  try {
    const users = await User.find();

    res.status(200).json({ data: users });
  } catch (error) {
    res.status(400).json({ success: false });
  }
}
  
exports.deleteUserPic = async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await User.findById(userId);

    if(!user) {
      return res.status(400).json({ success: false, message: "user not found" });
    }

    if(user.profileImg) {
      await cloudinary.uploader.destroy(
        user.profileImg.split("/").pop().split(".")[0]
      , { invalidate: true });
    }
    else {
      return res.status(400).json({ success: false, message: "user does not have profile img" });
    }

    const updatedUser = await User.findByIdAndUpdate(userId,
      { profileImg: "" },
      { new: true }
    );

    res.status(200).json({ success: true, user: updatedUser });
  } catch (error) {
    console.log(error);
    res.status(400).json({ success: false });
  }
}