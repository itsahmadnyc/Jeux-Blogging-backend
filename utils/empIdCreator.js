// employeeIdGenerator.js

const generateEmployeeId = (fullName, ) => {
  // Jeux prefix
  const joinDate = new Date()
  const prefix = 'JEUX-EMP';

  // Extract initials from name
  const initials = fullName.trim().substring(0, 3).toUpperCase();

  // Format date: YYMMDD
  const datePart = `${joinDate.getFullYear().toString().slice(2)}${String(joinDate.getMonth() + 1).padStart(2, '0')}${String(joinDate.getDate()).padStart(2, '0')}`;

  // Generate 4-digit random number
  const randomPart = Math.floor(1000 + Math.random() * 9000);

  return `${prefix}-${initials}-${datePart}-${randomPart}`;
};

module.exports = generateEmployeeId;