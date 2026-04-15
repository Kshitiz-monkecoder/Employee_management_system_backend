const mongoose = require('mongoose');

const payrollSchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee',
      required: [true, 'Employee is required'],
      unique: true,
    },
    basicSalary: {
      type: Number,
      required: [true, 'Basic salary is required'],
      min: [0, 'Salary cannot be negative'],
    },
    bonus: {
      type: Number,
      default: 0,
      min: 0,
    },
    deductions: {
      tax: { type: Number, default: 0 },
      insurance: { type: Number, default: 0 },
      other: { type: Number, default: 0 },
    },
    allowances: {
      housing: { type: Number, default: 0 },
      transport: { type: Number, default: 0 },
      medical: { type: Number, default: 0 },
    },
    netSalary: {
      type: Number,
    },
    currency: {
      type: String,
      default: 'USD',
      uppercase: true,
    },
    paymentHistory: [
      {
        month: Number,
        year: Number,
        amount: Number,
        paidOn: Date,
        status: {
          type: String,
          enum: ['paid', 'pending', 'failed'],
          default: 'pending',
        },
      },
    ],
  },
  { timestamps: true }
);

payrollSchema.pre('save', function (next) {
  const totalAllowances = Object.values(this.allowances).reduce((a, b) => a + b, 0);
  const totalDeductions = Object.values(this.deductions).reduce((a, b) => a + b, 0);
  this.netSalary = this.basicSalary + this.bonus + totalAllowances - totalDeductions;
  next();
});

module.exports = mongoose.model('Payroll', payrollSchema);
