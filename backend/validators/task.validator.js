const { body } = require('express-validator');

exports.taskValidator = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high'])
    .withMessage('Priority must be low, medium, or high'),
  body('dueDate').optional({ nullable: true }).isISO8601().toDate(),
];
