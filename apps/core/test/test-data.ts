export const formTestData = {
  allocationAmount: 100_000,
  budgetCode: '31.12',
  amountSpent: 22_000,
  title: 'New request for authorization of expenditure',
  description: `Purpose: SHASTRA is section-8 company of Rashtriya Raksha University. we have required SASTRA’S website as outreach events is going in full pace both physically and digitally, considering that a website is required to be hosted with basic pages and design alignments so that stakeholders can find us easily on the web along with a positive web identity. We have booked domain for this website- SASTRA.NET.IN and we will be processing for a basic website with one time cost with 6 months of changes and support.`,
  serviceCost: 22_000,
  serviceName: 'Test Services',
  sourceOfFunding: 'DIIS: 31.12 Office Expenses\n\nIT',
  otherFields: { Original: 'School Office' },
};

export const formFailMessage = {
  statusCode: 400,
  message: [
    'formData.budgetCode must be shorter than or equal to 255 characters',
    'formData.budgetCode should not be empty',
    'formData.budgetCode must be a string',
    'formData.allocationAmount should not be empty',
    'formData.allocationAmount must be a number conforming to the specified constraints',
    'formData.amountSpent should not be empty',
    'formData.amountSpent must be a number conforming to the specified constraints',
    'formData.title must be shorter than or equal to 255 characters',
    'formData.title should not be empty',
    'formData.title must be a string',
    'formData.serviceName must be shorter than or equal to 255 characters',
    'formData.serviceName should not be empty',
    'formData.serviceName must be a string',
    'formData.serviceCost should not be empty',
    'formData.serviceCost must be a number conforming to the specified constraints',
    'formData.sourceOfFunding must be a string',
    'name should not be empty',
    'name must be a string',
  ],
  error: 'Bad Request',
};
