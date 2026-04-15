const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
    },
    phone: {
      type: String,
      trim: true,
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Department',
      required: [true, 'Department is required'],
    },
    position: {
      type: String,
      required: [true, 'Position is required'],
      trim: true,
    },
    employeeId: {
      type: String,
      unique: true,
      trim: true,
    },
    dateOfJoining: {
      type: Date,
      default: Date.now,
    },
    dateOfBirth: {
      type: Date,
    },
    address: {
      street: String,
      city: String,
      state: String,
      country: String,
      zipCode: String,
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'terminated'],
      default: 'active',
    },
    avatar: {
      type: String,
    },
  },
  { timestamps: true }
);

employeeSchema.pre('insertMany', async function (next, docs) {
  const count = await mongoose.model('Employee').countDocuments();

  docs.forEach((doc, index) => {
    doc.employeeId = `EMP${String(count + index + 1).padStart(4, '0')}`;
  });

  next();
});
module.exports = mongoose.model('Employee', employeeSchema);
