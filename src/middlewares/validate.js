const Joi = require('joi');
const AppError = require('../utils/AppError');

const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false, stripUnknown: true });
  if (error) {
    const message = error.details.map((d) => d.message).join('. ');
    return next(new AppError(message, 400));
  }
  next();
};

const schemas = {
  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  }),

  createUser: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    role: Joi.string().valid('admin', 'hr', 'employee').default('employee'),
    employee: Joi.string().optional(),
  }),

  createEmployee: Joi.object({
    name: Joi.string().max(100).required(),
    email: Joi.string().email().required(),
    phone: Joi.string().optional(),
    department: Joi.string().required(),
    position: Joi.string().required(),
    dateOfJoining: Joi.date().optional(),
    dateOfBirth: Joi.date().optional(),
    address: Joi.object({
      street: Joi.string().optional(),
      city: Joi.string().optional(),
      state: Joi.string().optional(),
      country: Joi.string().optional(),
      zipCode: Joi.string().optional(),
    }).optional(),
    status: Joi.string().valid('active', 'inactive', 'terminated').default('active'),
  }),

  updateEmployee: Joi.object({
    name: Joi.string().max(100).optional(),
    phone: Joi.string().optional(),
    department: Joi.string().optional(),
    position: Joi.string().optional(),
    status: Joi.string().valid('active', 'inactive', 'terminated').optional(),
    address: Joi.object({
      street: Joi.string().optional(),
      city: Joi.string().optional(),
      state: Joi.string().optional(),
      country: Joi.string().optional(),
      zipCode: Joi.string().optional(),
    }).optional(),
  }),

  createDepartment: Joi.object({
    name: Joi.string().max(100).required(),
    description: Joi.string().max(500).optional(),
    manager: Joi.string().optional(),
  }),

  markAttendance: Joi.object({
    employee: Joi.string().required(),
    date: Joi.date().required(),
    status: Joi.string().valid('present', 'absent', 'late', 'half-day', 'leave').required(),
    checkIn: Joi.date().optional(),
    checkOut: Joi.date().optional(),
    notes: Joi.string().max(500).optional(),
  }),

  createPayroll: Joi.object({
    employee: Joi.string().required(),
    basicSalary: Joi.number().min(0).required(),
    bonus: Joi.number().min(0).default(0),
    deductions: Joi.object({
      tax: Joi.number().min(0).default(0),
      insurance: Joi.number().min(0).default(0),
      other: Joi.number().min(0).default(0),
    }).optional(),
    allowances: Joi.object({
      housing: Joi.number().min(0).default(0),
      transport: Joi.number().min(0).default(0),
      medical: Joi.number().min(0).default(0),
    }).optional(),
    currency: Joi.string().uppercase().default('USD'),
  }),
};

module.exports = { validate, schemas };
